import React from 'react'
import { useQuery } from 'react-query'
import config from '../config'
import { PlayerTable } from './PlayerTable';
import { Grid, CircularProgress, Box, Container, Divider, useMediaQuery } from '@mui/material';
import { SettingsPanel } from './SettingsPanel';
import { UserContext } from './UserProvider';
import { useMutation } from 'react-query'
import { ConfirmErrorModal } from './ConfirmErrorModal';
import { JackOptoModal } from './JackOptoModal';
import GLPK from 'glpk.js'
export const LockedContext = React.createContext()
export const UserSettingsContext = React.createContext()
export const MLBStackContext = React.createContext()

function SlateInfo({ sport, slate, setOptimizedLineups, exposures, setExposures, optimizedLineups, setSelectedOpto, selectedOpto }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const totalPlayers = (sport === 'nba') ? 8 : (sport === 'nfl') ? 9 : 10;
    const { token, user } = React.useContext(UserContext)
    const optoApiUrl = `${config.apiUrl}${sport}/api/authenticated-optimize/`;
    const apiUrl = token ? `${config.apiUrl}${sport}/api/authenticated-slate-info/${slate.id}` : `${config.apiUrl}${sport}/api/unauthenticated-slate-info/${slate.id}`
    const [lockedData, setLockedData] = React.useState({ 'count': 0, 'salary': 0 })
    const [stackData, setStackData] = React.useState({ 'WR-same': 0, 'TE-same': 0, 'WR-opp': 0, 'TE-opp': 0 })
    const [tab, setTab] = React.useState(0)
    const [userSettings, setUserSettings] = React.useState({ 'uniques': 3, 'min-salary': 45000, 'max-salary': 50000, 'max-players-per-team': 5, 'num-lineups': 20, 'hittersVsPitcher': 0, 'offenseVsDefense': 0, 'projection-cutoff': 0 })
    const optoCount = optimizedLineups['count']
    const [buttonLoading, setButtonLoading] = React.useState(false)
    const [failedOptimizeModalOpen, setFailedOptimizeModalOpen] = React.useState(false)
    const [failedSuccessLineups, setFailedSuccessLineups] = React.useState(0)
    const [onlyUseMine, setOnlyUseMine] = React.useState(false)
    const cancelledRef = React.useRef(false)
    const [jackOptoModalOpen, setJackOptoModalOpen] = React.useState(false)
    const [jackStackSummary, setJackStackSummary] = React.useState([])
    const [mlbStackRules, setMlbStackRules] = React.useState([])
    const [useJackOpto, setUseJackOpto] = React.useState(true)
    const [stackRankResults, setStackRankResults] = React.useState([])
    const isFirstRender = React.useRef(true)

    React.useEffect(() => {
        if (user?.isJack) {
            setUserSettings(prev => ({ ...prev, 'projection-cutoff': 1 }))
        }
    }, [user?.isJack])

    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        setTab(1)
    }, [selectedOpto])

    // Fetch slate information
    const { data, isLoading: playersLoading } = useQuery(['players', slate.id], async () => {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Token ${token}`,
            }
        })
        if (!response.ok) {
            throw new Error('Failed to fetch players')
        }
        const data = await response.json()
        if (user) {
            const optimizations = Object.keys(data['optimizations'])
            const optimizationLength = optimizations.length
            const userOptimizations = { 'count': optimizationLength }
            const userExposures = {}
            for (let i = 0; i < optimizationLength; i++) {
                userOptimizations[`${i + 1}`] = data['optimizations'][i]['lineups']
                userExposures[`${i + 1}`] = data['optimizations'][i]['exposures']
            }
            setOptimizedLineups(userOptimizations)
            setSelectedOpto(userOptimizations.count)
            setExposures(userExposures)
        }
        return data
    }, {
        refetchOnWindowFocus: false

    });

    // Add optimization on backend
    const optimizeMutation = useMutation(
        async (optimizationData) => {
            const response = await fetch(optoApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(optimizationData),
            });

            if (!response.ok) {
                throw new Error('Failed to add optimization');
            }
            return response.json();
        },
    );

    const [clearedSearch, setClearedSearch] = React.useState(true)

    const handleOptimize = async () => {
        cancelledRef.current = false
        let positionLists = {}
        let ofList = []
        let pList = []
        let rbList = []
        let wrList = []
        setButtonLoading(true);
        const teams = data['slate-info'].teams
        const qbStackLists = teams.reduce((acc, team) => {
            acc[team.abbrev] = {
                sameTeamWr: [],
                sameTeamTe: [],
                oppWr: [],
                oppTe: []
            };
            return acc;
        }, {});
        const qbTeams = teams.reduce((acc, team) => {
            acc[team.abbrev] = [];
            return acc;
        }, {});
        const players = data['slate-info'].players
        // Separate each player into each position they are eligible for 
        if (sport === 'nba') {
            positionLists = {
                'PG': [],
                'SG': [],
                'SF': [],
                'PF': [],
                'C': [],
                'G': [],
                'F': [],
                'UTIL': []
            }
        } else if (sport === 'mlb') {
            positionLists = {
                'C': [],
                'FB': [],
                'SB': [],
                'TB': [],
                'SS': [],
            }
        } else if (sport === 'nfl') {
            positionLists = {
                'QB': [],
                'TE': [],
                'DST': [],
                'FLEX': []
            }
        }
        const team_lists = {}
        // Prepare optimization
        const objVars = []
        const playerVars = []
        const salaryVars = []
        const playerTotalVars = []
        const individualPlayerVars = []
        const gameLists = {}
        const hitterTeamLists = {}
        const glpk = await GLPK()
        const projCutoff = userSettings['projection-cutoff'] || 0
        players.forEach(player => {
            if ((onlyUseMine === false || player.projection.custom === true) && player.projection.projection >= projCutoff) {
                const thisPlayerVars = []
                for (let i = 0; i < player.eligiblePositions.length; i++) {
                    const playerVar = player.id + '-' + player.eligiblePositions[i]
                    playerVars.push(playerVar)
                    const team = player.team
                    const opp = player.opponent
                    let game = ''
                    if (team.localeCompare(opp) < 0) {
                        game = `${team}:${opp}`
                    } else {
                        game = `${opp}:${team}`
                    }
                    if (gameLists[game]) {
                        gameLists[game].push({ 'name': player.id + '-' + player.eligiblePositions[i], 'coef': 1 })
                    } else {
                        gameLists[game] = [{ 'name': player.id + '-' + player.eligiblePositions[i], 'coef': 1 }]
                    }
                    if (sport === 'mlb') {
                        if (player.eligiblePositions[i] === 'OF') {
                            ofList.push({ 'name': playerVar, 'coef': 1 })
                        } else if (player.eligiblePositions[i] === 'P') {
                            pList.push({ 'name': playerVar, 'coef': 1 })
                        } else {
                            positionLists[player.eligiblePositions[i]].push({ 'name': playerVar, 'coef': 1 })
                        }
                    } else if (sport === 'nfl') {
                        if (player.eligiblePositions[i] === 'RB') {
                            rbList.push({ 'name': playerVar, 'coef': 1 })
                        } else if (player.eligiblePositions[i] === 'WR') {
                            wrList.push({ 'name': playerVar, 'coef': 1 })
                            for (let teamStack in qbStackLists) {
                                if (teamStack === team) {
                                    qbStackLists[teamStack].sameTeamWr.push({ 'name': player.id + '-WR', 'coef': 1 })
                                    qbStackLists[teamStack].sameTeamWr.push({ 'name': player.id + '-FLEX', 'coef': 1 })
                                } else if (teamStack === opp) {
                                    qbStackLists[teamStack].oppWr.push({ 'name': player.id + '-WR', 'coef': 1 })
                                    qbStackLists[teamStack].oppWr.push({ 'name': player.id + '-FLEX', 'coef': 1 })
                                }
                            }
                        } else if (player.eligiblePositions[i] === 'TE') {
                            positionLists[player.eligiblePositions[i]].push({ 'name': playerVar, 'coef': 1 })
                            for (let teamStack in qbStackLists) {
                                if (teamStack === team) {
                                    qbStackLists[teamStack].sameTeamTe.push({ 'name': player.id + '-TE', 'coef': 1 })
                                    qbStackLists[teamStack].sameTeamTe.push({ 'name': player.id + '-FLEX', 'coef': 1 })
                                } else if (teamStack === opp) {
                                    qbStackLists[teamStack].oppTe.push({ 'name': player.id + '-TE', 'coef': 1 })
                                    qbStackLists[teamStack].oppTe.push({ 'name': player.id + '-FLEX', 'coef': 1 })
                                }
                            }
                        } else if (player.eligiblePositions[i] === 'QB') {
                            positionLists[player.eligiblePositions[i]].push({ 'name': playerVar, 'coef': 1 })
                            qbTeams[player.team].push(player)
                        } else {
                            positionLists[player.eligiblePositions[i]].push({ 'name': playerVar, 'coef': 1 })
                        }
                    } else {
                        positionLists[player.eligiblePositions[i]].push({ 'name': playerVar, 'coef': 1 })
                    }
                    playerTotalVars.push({ 'name': playerVar, 'coef': 1 })
                    objVars.push({ 'name': playerVar, 'coef': player.projection.projection })
                    salaryVars.push({ 'name': playerVar, 'coef': player.salary })
                    thisPlayerVars.push({ 'name': playerVar, 'coef': 1 })
                    if (player.eligiblePositions[i] === 'P') {
                        if (team_lists[player.opponent]) {
                            team_lists[player.opponent].push({ 'name': playerVar, 'coef': (5 - userSettings['hittersVsPitcher']) })
                        } else {
                            team_lists[player.opponent] = [{ 'name': playerVar, 'coef': (5 - userSettings['hittersVsPitcher']) }]

                        }
                    } else if (player.eligiblePositions[i] === 'DST') {
                        if (team_lists[player.opponent]) {
                            team_lists[player.opponent].push({ 'name': playerVar, 'coef': (userSettings['max-players-per-team'] - userSettings['offenseVsDefense']) })
                        } else {
                            team_lists[player.opponent] = [{ 'name': playerVar, 'coef': (userSettings['max-players-per-team'] - userSettings['offenseVsDefense']) }]
                        }
                    } else {
                        if (team_lists[player.team]) {
                            team_lists[player.team].push({ 'name': playerVar, 'coef': 1 })
                        } else {
                            team_lists[player.team] = [{ 'name': playerVar, 'coef': 1 }]
                        }
                        if (sport === 'mlb') {
                            if (!hitterTeamLists[player.team]) hitterTeamLists[player.team] = []
                            hitterTeamLists[player.team].push({ 'name': playerVar, 'coef': 1 })
                        }
                    }
                }
                // Add locks and removes
                if (player.lock === true) {
                    individualPlayerVars.push({ 'name': player.id, 'vars': thisPlayerVars, 'bnds': { type: glpk.GLP_FX, ub: 1, lb: 1 } })
                } else if (player.remove === true) {
                    individualPlayerVars.push({ 'name': player.id, 'vars': thisPlayerVars, 'bnds': { type: glpk.GLP_FX, ub: 0, lb: 0 } })
                } else {
                    individualPlayerVars.push({ 'name': player.id, 'vars': thisPlayerVars, 'bnds': { type: glpk.GLP_UP, ub: 1, lb: 0 } })
                }
            }
        })
        const options = {
            presol: true,
            tmlim: 1.5,
        };
        const subjectToConstraints = [
            {
                name: 'max_salary',
                vars: salaryVars,
                bnds: { type: glpk.GLP_DB, ub: userSettings['max-salary'], lb: userSettings['min-salary'] }
            },
            {
                name: 'total_players',
                vars: playerTotalVars,
                bnds: { type: glpk.GLP_FX, ub: totalPlayers, lb: totalPlayers }
            },
            ...Object.keys(positionLists).map(position => ({
                name: `max_${position.toLowerCase()}s`,
                vars: positionLists[position],
                bnds: { type: glpk.GLP_FX, ub: 1, lb: 1 }
            })),
            ...Object.keys(team_lists).map(team => ({
                name: `${team.toLowerCase()} max`,
                vars: team_lists[team],
                bnds: { type: glpk.GLP_UP, ub: userSettings['max-players-per-team'], lb: 0 }
            })),
            ...Object.keys(gameLists).map(game => ({
                name: `${game} max`,
                vars: gameLists[game],
                bnds: { type: glpk.GLP_UP, ub: totalPlayers - 1, lb: 0 }
            })),
            ...individualPlayerVars
        ];
        if (sport === 'nfl') {
            for (let qbTeam in qbTeams) {
                if (qbTeams.hasOwnProperty(qbTeam)) {
                    const qbsTeam = qbTeams[qbTeam]
                    // Same Team Wr's
                    const wrSameTeamVars = qbStackLists[qbTeam]['sameTeamWr']
                    for (let i = 0; i < qbsTeam.length; i++) {
                        wrSameTeamVars.push({ 'name': `${qbsTeam[i].id}-QB`, 'coef': (-1 * stackData['WR-same']) })
                    }
                    subjectToConstraints.push({
                        name: `${qbTeam}-WR-Same-Team-Stack`,
                        vars: wrSameTeamVars,
                        bnds: { type: glpk.GLP_LO, ub: 999, lb: 0 }

                    })
                    // Same Team TE's
                    const teSameTeamVars = qbStackLists[qbTeam]['sameTeamTe']
                    for (let i = 0; i < qbsTeam.length; i++) {
                        teSameTeamVars.push({ 'name': `${qbsTeam[i].id}-QB`, 'coef': (-1 * stackData['TE-same']) })
                    }
                    subjectToConstraints.push({
                        name: `${qbTeam}-TE-Same-Team-Stack`,
                        vars: teSameTeamVars,
                        bnds: { type: glpk.GLP_LO, ub: 999, lb: 0 }

                    })
                    // Opp Team WR's
                    const oppWrTeamVars = qbStackLists[qbTeam]['oppWr']
                    for (let i = 0; i < qbsTeam.length; i++) {
                        oppWrTeamVars.push({ 'name': `${qbsTeam[i].id}-QB`, 'coef': (-1 * stackData['WR-opp']) })
                    }
                    subjectToConstraints.push({
                        name: `${qbTeam}-WR-Opp-Team-Stack`,
                        vars: oppWrTeamVars,
                        bnds: { type: glpk.GLP_LO, ub: 999, lb: 0 }

                    })
                    // Opp Team TE's
                    const oppTeTeamVars = qbStackLists[qbTeam]['oppTe']
                    for (let i = 0; i < qbsTeam.length; i++) {
                        oppTeTeamVars.push({ 'name': `${qbsTeam[i].id}-QB`, 'coef': (-1 * stackData['TE-opp']) })
                    }
                    subjectToConstraints.push({
                        name: `${qbTeam}-TE-Opp-Team-Stack`,
                        vars: oppTeTeamVars,
                        bnds: { type: glpk.GLP_LO, ub: 999, lb: 0 }

                    })

                }
            }
        }

        if (sport === 'mlb') {
            subjectToConstraints.push({
                name: 'max_ofs',
                vars: ofList,
                bnds: { type: glpk.GLP_FX, ub: 3, lb: 3 }
            })
            subjectToConstraints.push({
                name: 'max_pitchers',
                vars: pList,
                bnds: { type: glpk.GLP_FX, ub: 2, lb: 2 }
            })
            if (mlbStackRules.length > 0) {
                let anyRuleIdx = 0
                // Collect teams already pinned by specific-team rules so ANY rules exclude them
                const pinnedTeams = new Set(
                    mlbStackRules.filter(r => r.team !== 'ANY').map(r => r.team)
                )
                // Track z-var names per team across all ANY rules, for cross-rule uniqueness constraints
                const zVarsByTeam = {}
                for (const rule of mlbStackRules) {
                    if (rule.team !== 'ANY') {
                        const teamHitters = hitterTeamLists[rule.team] || []
                        if (teamHitters.length > 0) {
                            subjectToConstraints.push({
                                name: `stack_hitters_${rule.team.toLowerCase()}`,
                                vars: teamHitters,
                                bnds: { type: glpk.GLP_LO, ub: 999, lb: rule.count }
                            })
                            // Relax the team's max constraint so the stack isn't blocked
                            for (const c of subjectToConstraints) {
                                if (c.name === `${rule.team.toLowerCase()} max`) {
                                    c.bnds.ub = totalPlayers
                                }
                            }
                        }
                    } else {
                        // "Any team" — exclude teams already covered by a specific-team rule
                        const anyTeams = Object.keys(hitterTeamLists).filter(t => !pinnedTeams.has(t))
                        if (anyTeams.length > 0) {
                            const zVarNames = anyTeams.map(t => `z_r${anyRuleIdx}_${t}`)
                            // At least one team must be selected
                            subjectToConstraints.push({
                                name: `any_stack_select_${anyRuleIdx}`,
                                vars: zVarNames.map(v => ({ name: v, coef: 1 })),
                                bnds: { type: glpk.GLP_LO, ub: 999, lb: 1 }
                            })
                            // For each team T: sum(hitters_T) - count * z_T >= 0
                            for (let ti = 0; ti < anyTeams.length; ti++) {
                                const team = anyTeams[ti]
                                subjectToConstraints.push({
                                    name: `any_stack_r${anyRuleIdx}_${team.toLowerCase()}`,
                                    vars: [
                                        ...(hitterTeamLists[team] || []),
                                        { name: zVarNames[ti], coef: -rule.count }
                                    ],
                                    bnds: { type: glpk.GLP_LO, ub: 999, lb: 0 }
                                })
                                // Accumulate z-vars per team for cross-rule uniqueness
                                if (!zVarsByTeam[team]) zVarsByTeam[team] = []
                                zVarsByTeam[team].push(zVarNames[ti])
                            }
                            playerVars.push(...zVarNames)
                            anyRuleIdx++
                        }
                    }
                }
                // Ensure no team is selected as the stack team for more than one ANY rule
                if (anyRuleIdx > 1) {
                    for (const team of Object.keys(zVarsByTeam)) {
                        if (zVarsByTeam[team].length > 1) {
                            subjectToConstraints.push({
                                name: `any_stack_unique_${team.toLowerCase()}`,
                                vars: zVarsByTeam[team].map(v => ({ name: v, coef: 1 })),
                                bnds: { type: glpk.GLP_UP, ub: 1, lb: 0 }
                            })
                        }
                    }
                }
            }
        } else if (sport === 'nfl') {
            subjectToConstraints.push({
                name: 'max_rbs',
                vars: rbList,
                bnds: { type: glpk.GLP_FX, ub: 2, lb: 2 }
            })
            subjectToConstraints.push({
                name: 'max_wrs',
                vars: wrList,
                bnds: { type: glpk.GLP_FX, ub: 3, lb: 3 }
            })
        }
        const additionalConstraints = []
        async function optimizeLineup(i, additionalConstraints, exposureConstraints, removeExposureConstraints) {
            try {
                if (removeExposureConstraints.length > 0) {
                    for (let i = 0; i < removeExposureConstraints.length; i++) {
                        for (let j = subjectToConstraints.length - 1; j >= 0; j--) {
                            if (subjectToConstraints[j].name === removeExposureConstraints[i]) {
                                subjectToConstraints.splice(j, 1)
                            }
                        }
                    }
                }
                if (additionalConstraints.length > 0) {
                    subjectToConstraints.push(additionalConstraints[additionalConstraints.length - 1])
                }
                subjectToConstraints.push(...exposureConstraints)
                const res = await glpk.solve({
                    name: `Optimize_Lineups_${i}`,
                    objective: {
                        direction: glpk.GLP_MAX,
                        name: 'obj',
                        vars: objVars
                    },
                    subjectTo: subjectToConstraints,
                    binaries: playerVars
                }, options)
                if (res.result.status !== 2 && res.result.status !== 5) {
                    console.error('Failed to optimize lineup:', res.result.status);
                    return null
                }
                const selectedPlayerPositions = Object.keys(res.result.vars).filter(key => res.result.vars[key] === 1)
                const selectedPlayerIds = Object.keys(res.result.vars).filter(key => res.result.vars[key] === 1).map(key => key.split('-')[0])
                const selectedPlayers = players.filter(player => selectedPlayerIds.includes(player.id))
                let updatedLineup = {}
                if (sport === 'nba') {
                    updatedLineup = { 'PG': {}, "SG": {}, "SF": {}, "PF": {}, "C": {}, "G": {}, "F": {}, "UTIL": {}, 'total_salary': 0, 'total_projection': 0 }
                } else if (sport === 'mlb') {
                    updatedLineup = { 'P': [], "C": {}, "FB": {}, "SB": {}, "TB": {}, "SS": {}, "OF": [], 'total_salary': 0, 'total_projection': 0 }
                } else if (sport === 'nfl') {
                    updatedLineup = { 'QB': {}, "RB": [], "WR": [], "TE": {}, "DST": {}, "FLEX": {}, 'total_salary': 0, 'total_projection': 0 }
                }
                let lineupSal = 0
                let lineupProj = 0
                for (let i = 0; i < selectedPlayers.length; i++) {
                    const player = selectedPlayers[i]
                    lineupSal += parseInt(player.salary)
                    lineupProj += parseFloat(player.projection.projection)
                    for (let j = 0; j < selectedPlayerPositions.length; j++) {
                        if (selectedPlayerPositions[j].split('-')[0] === player.id) {
                            if (selectedPlayerPositions[j].split('-')[1] === 'OF') {
                                updatedLineup['OF'].push({ 'playerId': selectedPlayerPositions[j].split('-')[0], 'dk-id': player.dk_id, 'name': player.name, 'salary': player.salary, 'projection': player.projection.projection, 'ownership': player.ownership, 'team': player.team, 'opponent': player.opponent, 'exposureCap': player.exposure })
                            } else if (selectedPlayerPositions[j].split('-')[1] === 'P') {
                                updatedLineup['P'].push({ 'playerId': selectedPlayerPositions[j].split('-')[0], 'dk-id': player.dk_id, 'name': player.name, 'salary': player.salary, 'projection': player.projection.projection, 'ownership': player.ownership, 'team': player.team, 'opponent': player.opponent, 'exposureCap': player.exposure })
                            } else if (selectedPlayerPositions[j].split('-')[1] === 'RB') {
                                updatedLineup['RB'].push({ 'playerId': selectedPlayerPositions[j].split('-')[0], 'dk-id': player.dk_id, 'name': player.name, 'salary': player.salary, 'projection': player.projection.projection, 'ownership': player.ownership, 'team': player.team, 'opponent': player.opponent, 'exposureCap': player.exposure })
                            } else if (selectedPlayerPositions[j].split('-')[1] === 'WR') {
                                updatedLineup['WR'].push({ 'playerId': selectedPlayerPositions[j].split('-')[0], 'dk-id': player.dk_id, 'name': player.name, 'salary': player.salary, 'projection': player.projection.projection, 'ownership': player.ownership, 'team': player.team, 'opponent': player.opponent, 'exposureCap': player.exposure })
                            } else {
                                updatedLineup[selectedPlayerPositions[j].split('-')[1]] = { 'playerId': selectedPlayerPositions[j].split('-')[0], 'dk-id': player.dk_id, 'name': player.name, 'salary': player.salary, 'projection': player.projection.projection, 'ownership': player.ownership, 'team': player.team, 'opponent': player.opponent, 'exposureCap': player.exposure }
                            }
                        }
                    }
                    updatedLineup['total_salary'] = lineupSal
                    const roundedProj = parseFloat(lineupProj.toFixed(2))
                    updatedLineup['total_projection'] = roundedProj
                }
                const result = players.filter(player => selectedPlayerIds.includes(player.id))
                const restrictionVars = []
                for (let j = 0; j < result.length; j++) {
                    for (let k = 0; k < result[j].eligiblePositions.length; k++) {
                        const playerName = result[j].id + '-' + result[j].eligiblePositions[k]
                        const playerVar = { 'name': playerName, 'coef': 1 }
                        restrictionVars.push(playerVar)
                    }
                }
                additionalConstraints.push({
                    name: `lineup_${i}_unique`,
                    vars: restrictionVars,
                    bnds: { type: glpk.GLP_UP, ub: (totalPlayers - userSettings['uniques']), lb: 0 }
                })
                return updatedLineup
            } catch (error) {
                console.error('Error optimizing lineup:', error);
            }
        }

        // Handle Optimization
        const lineups = []
        const thisOpto = optoCount + 1
        const overexposedPlayers = []
        const optoExposures = {}
        const stackSummaryEntries = []
        if (sport === 'mlb' && user?.isJack) setJackStackSummary([])
        for (let i = 0; i < userSettings['num-lineups']; i++) {
            const exposureConstraints = []
            const removeExposureConstraints = []
            for (const player in overexposedPlayers) {
                const exposureCap = overexposedPlayers[player].exposureCap
                const currentExposure = Math.trunc((overexposedPlayers[player].count / (i + 1)) * 100)
                if (currentExposure < exposureCap) {
                    removeExposureConstraints.push('exposure_' + overexposedPlayers[player].genericId)
                    overexposedPlayers.splice(player, 1)
                }
                else {
                    const playerVars = overexposedPlayers[player].thisPlayerConstraints
                    exposureConstraints.push({ 'name': `exposure_${overexposedPlayers[player].genericId}`, 'vars': playerVars, 'bnds': { type: glpk.GLP_UP, ub: 0, lb: 0 } })
                }
            }
            // Optimize each lineup
            if (cancelledRef.current) {
                if (lineups.length > 0 && user) {
                    optimizeMutation.mutate({ 'lineups': lineups, 'slate': slate.id, 'exposures': optoExposures });
                }
                setButtonLoading(false)
                return
            }
            let lineup = await optimizeLineup(i, additionalConstraints, exposureConstraints, removeExposureConstraints)
            if (lineup === null) {
                setFailedOptimizeModalOpen(true)
                setButtonLoading(false)
                setFailedSuccessLineups(i)
                setButtonLoading(false)
                if (lineups.length > 0) {
                    optimizeMutation.mutate({ 'lineups': lineups, 'slate': slate.id, 'exposures': optoExposures });
                }
                return
            }
            // Update lineups
            if (sport === 'mlb') {
                const cleanedMlbLineup = { 'P1': {}, 'P2': {}, 'C': {}, 'FB': {}, 'SB': {}, 'TB': {}, 'SS': {}, 'OF1': {}, 'OF2': {}, 'OF3': {}, 'total_salary': lineup.total_salary, 'total_projection': lineup.total_projection }
                cleanedMlbLineup['P1'] = lineup['P'][0]
                cleanedMlbLineup['P2'] = lineup['P'][1]
                cleanedMlbLineup['C'] = lineup['C']
                cleanedMlbLineup['FB'] = lineup['FB']
                cleanedMlbLineup['SB'] = lineup['SB']
                cleanedMlbLineup['TB'] = lineup['TB']
                cleanedMlbLineup['SS'] = lineup['SS']
                cleanedMlbLineup['OF1'] = lineup['OF'][0]
                cleanedMlbLineup['OF2'] = lineup['OF'][1]
                cleanedMlbLineup['OF3'] = lineup['OF'][2]
                cleanedMlbLineup['total_salary'] = lineup.total_salary
                cleanedMlbLineup['total_projection'] = lineup.total_projection
                lineups.push(cleanedMlbLineup)
                if (user?.isJack) {
                    const hitters = [lineup['C'], lineup['FB'], lineup['SB'], lineup['TB'], lineup['SS'], ...lineup['OF']]
                    const teamCounts = {}
                    hitters.forEach(h => { if (h?.team) teamCounts[h.team] = (teamCounts[h.team] || 0) + 1 })
                    const sorted = Object.entries(teamCounts).sort((a, b) => b[1] - a[1])
                    if (sorted.length >= 1) {
                        stackSummaryEntries.push({ primaryTeam: sorted[0][0], secondaryTeam: sorted.length >= 2 ? sorted[1][0] : sorted[0][0] })
                        setJackStackSummary([...stackSummaryEntries])
                    }
                }
            } else if (sport === 'nfl') {
                const cleanedNflLineup = { 'QB': {}, 'RB1': {}, 'RB2': {}, 'WR1': {}, 'WR2': {}, 'WR3': {}, 'TE': {}, 'DST': {}, 'FLEX': {}, 'total_salary': lineup.total_salary, 'total_projection': lineup.total_projection }
                cleanedNflLineup['QB'] = lineup['QB']
                cleanedNflLineup['RB1'] = lineup['RB'][0]
                cleanedNflLineup['RB2'] = lineup['RB'][1]
                cleanedNflLineup['WR1'] = lineup['WR'][0]
                cleanedNflLineup['WR2'] = lineup['WR'][1]
                cleanedNflLineup['WR3'] = lineup['WR'][2]
                cleanedNflLineup['TE'] = lineup['TE']
                cleanedNflLineup['DST'] = lineup['DST']
                cleanedNflLineup['FLEX'] = lineup['FLEX']
                cleanedNflLineup['total_salary'] = lineup.total_salary
                cleanedNflLineup['total_projection'] = lineup.total_projection
                lineups.push(cleanedNflLineup)

            } else {
                lineups.push(lineup)
            }
            setOptimizedLineups({ ...optimizedLineups, [`${thisOpto.toString()}`]: lineups, 'count': thisOpto })
            // Update exposures
            const cleanedLineup = {}
            for (const pos in lineup) {
                if (pos !== 'total_salary' && pos !== 'total_projection') {
                    if (pos === 'P' || pos === 'OF' || pos === 'RB' || pos === 'WR') {
                        for (let i = 0; i < lineup[pos].length; i++) {
                            cleanedLineup[`${pos}${i}`] = lineup[pos][i]
                        }
                    } else {
                        cleanedLineup[pos] = lineup[pos]
                    }
                }
            }
            lineup = cleanedLineup
            for (const pos in lineup) {
                if (lineup.hasOwnProperty(pos)) {
                    if (pos !== 'total_salary' && pos !== 'total_projection') {
                        // Update exposures and lineups
                        const exposurePlayer = lineup[pos]
                        if (optoExposures[exposurePlayer['dk-id']] !== undefined) {
                            const currentExposure = optoExposures[exposurePlayer['dk-id']]
                            const currentCount = currentExposure.count
                            const newCount = currentCount + 1
                            const newExposure = (newCount / (i + 1)) * 100
                            const roundedExposure = parseFloat(newExposure.toFixed(0))
                            const updatedExposure = { ...currentExposure, 'exposure': roundedExposure, 'count': newCount }
                            optoExposures[exposurePlayer['dk-id']] = updatedExposure
                            if (roundedExposure > exposurePlayer.exposureCap) {
                                const metaPlayer = players.filter(player => player.id === exposurePlayer['playerId'])[0]
                                const thisPlayerConstraints = []
                                for (const position in metaPlayer.eligiblePositions) {
                                    const playerVar = metaPlayer.id + '-' + metaPlayer.eligiblePositions[position]
                                    const positionVar = { 'name': playerVar, 'coef': 1 }
                                    thisPlayerConstraints.push(positionVar)
                                }
                                overexposedPlayers.push({ 'playerId': exposurePlayer['dk-id'], 'exposureCap': exposurePlayer.exposureCap, 'count': newCount, 'genericId': exposurePlayer['playerId'], 'thisPlayerConstraints': thisPlayerConstraints })
                            }
                        } else {
                            const newExposure = (1 / (i + 1)) * 100
                            const roundedExposure = parseFloat(newExposure.toFixed(0))
                            optoExposures[exposurePlayer['dk-id']] = { 'exposure': roundedExposure, 'player-name': lineup[pos].name, 'team': lineup[pos].team, 'count': 1 }
                            if (roundedExposure > exposurePlayer.exposureCap) {
                                const metaPlayer = players.filter(player => player.id === exposurePlayer['playerId'])[0]
                                const thisPlayerConstraints = []
                                for (const position in metaPlayer.eligiblePositions) {
                                    const playerVar = metaPlayer.id + '-' + metaPlayer.eligiblePositions[position]
                                    const positionVar = { 'name': playerVar, 'coef': 1 }
                                    thisPlayerConstraints.push(positionVar)
                                }
                                overexposedPlayers.push({ 'playerId': exposurePlayer['dk-id'], 'exposureCap': exposurePlayer.exposureCap, 'count': 1, 'genericId': exposurePlayer['playerId'], 'thisPlayerConstraints': thisPlayerConstraints })
                            }
                        }
                    }
                }
            }
            setExposures({ ...exposures, [`${thisOpto.toString()}`]: optoExposures })
            setSelectedOpto(thisOpto)

            if (i === 0) {
                setTab(1)
            }
        }

        setButtonLoading(false);
        if (user) {
            optimizeMutation.mutate({ 'lineups': lineups, 'slate': slate.id, 'exposures': optoExposures });
        }
    }

    const handleCancelOptimize = () => {
        setButtonLoading(false)
        cancelledRef.current = true
    };

    const handleStackRank = () => {
        const players = data['slate-info'].players
        const teams = data['slate-info'].teams
        const numCombos = 10
        const minProj = 1
        const results = []
        teams.forEach(team => {
            const hitters = players.filter(p =>
                p.team === team.abbrev &&
                p.eligiblePositions.some(pos => pos !== 'P') &&
                p.projection.projection >= minProj
            )
            if (hitters.length < 5) return

            let totalValue = 0
            let totalProj = 0
            let totalSal = 0
            let validCombos = 0

            for (let c = 0; c < numCombos; c++) {
                const shuffled = [...hitters].sort(() => Math.random() - 0.5)
                const combo = shuffled.slice(0, 5)
                const proj = combo.reduce((sum, p) => sum + p.projection.projection, 0)
                const sal = combo.reduce((sum, p) => sum + parseInt(p.salary), 0)
                if (sal > 0) {
                    totalValue += proj / (sal / 1000)
                    totalProj += proj
                    totalSal += sal
                    validCombos++
                }
            }

            if (validCombos > 0) {
                results.push({
                    team: team.abbrev,
                    avgValue: totalValue / validCombos,
                    avgProj: totalProj / validCombos,
                    avgSal: totalSal / validCombos,
                    hitterCount: hitters.length
                })
            }
        })

        results.sort((a, b) => b.avgValue - a.avgValue)
        if (results.length > 0) {
            setStackRankResults(results)
            setTab(jackStackSummary.length > 0 ? 3 : 2)
        }
    }

    function distributeLineups(rankedTeams, numLineups) {
        const n = rankedTeams.length
        const base = Math.floor(numLineups / n)
        const remainder = numLineups % n
        return rankedTeams.map((_, i) => base + (i < remainder ? 1 : 0))
    }

    function buildJackAssignments(rankedTeams, numLineups) {
        const FIRST_BATCH = 20
        const firstCount = Math.min(FIRST_BATCH, numLineups)
        const secondCount = numLineups - firstCount
        const firstDist = distributeLineups(rankedTeams, firstCount)
        const secondDist = secondCount > 0 ? distributeLineups(rankedTeams, secondCount) : rankedTeams.map(() => 0)
        const assignments = []
        for (let i = 0; i < rankedTeams.length; i++) {
            for (let j = 0; j < firstDist[i]; j++) assignments.push(rankedTeams[i])
        }
        for (let i = 0; i < rankedTeams.length; i++) {
            for (let j = 0; j < secondDist[i]; j++) assignments.push(rankedTeams[i])
        }
        return assignments
    }

    const handleJackOptimize = async (rankedTeams, variance) => {
        cancelledRef.current = false
        let positionLists = {}
        let ofList = []
        let pList = []
        setButtonLoading(true)
        setJackStackSummary([])
        const stackSummaryAccumulator = []
        const teams = data['slate-info'].teams
        const players = data['slate-info'].players

        // Build hitter-only team lists (excludes pitchers)
        const hitterTeamLists = {}

        const team_lists = {}
        const objVars = []
        const playerVars = []
        const salaryVars = []
        const playerTotalVars = []
        const individualPlayerVars = []
        const gameLists = {}
        const glpk = await GLPK()

        positionLists = {
            'C': [],
            'FB': [],
            'SB': [],
            'TB': [],
            'SS': [],
        }

        const projCutoffJack = userSettings['projection-cutoff'] || 0
        players.forEach(player => {
            if ((onlyUseMine === false || player.projection.custom === true) && player.projection.projection >= projCutoffJack) {
                const thisPlayerVars = []
                for (let i = 0; i < player.eligiblePositions.length; i++) {
                    const playerVar = player.id + '-' + player.eligiblePositions[i]
                    playerVars.push(playerVar)
                    const team = player.team
                    const opp = player.opponent
                    let game = ''
                    if (team.localeCompare(opp) < 0) {
                        game = `${team}:${opp}`
                    } else {
                        game = `${opp}:${team}`
                    }
                    if (gameLists[game]) {
                        gameLists[game].push({ 'name': player.id + '-' + player.eligiblePositions[i], 'coef': 1 })
                    } else {
                        gameLists[game] = [{ 'name': player.id + '-' + player.eligiblePositions[i], 'coef': 1 }]
                    }
                    if (player.eligiblePositions[i] === 'OF') {
                        ofList.push({ 'name': playerVar, 'coef': 1 })
                    } else if (player.eligiblePositions[i] === 'P') {
                        pList.push({ 'name': playerVar, 'coef': 1 })
                    } else {
                        positionLists[player.eligiblePositions[i]].push({ 'name': playerVar, 'coef': 1 })
                    }
                    playerTotalVars.push({ 'name': playerVar, 'coef': 1 })
                    objVars.push({ 'name': playerVar, 'coef': player.projection.projection })
                    salaryVars.push({ 'name': playerVar, 'coef': player.salary })
                    thisPlayerVars.push({ 'name': playerVar, 'coef': 1 })

                    // Build team_lists (pitchers count against opponent team)
                    if (player.eligiblePositions[i] === 'P') {
                        if (team_lists[player.opponent]) {
                            team_lists[player.opponent].push({ 'name': playerVar, 'coef': (5 - userSettings['hittersVsPitcher']) })
                        } else {
                            team_lists[player.opponent] = [{ 'name': playerVar, 'coef': (5 - userSettings['hittersVsPitcher']) }]
                        }
                    } else {
                        if (team_lists[player.team]) {
                            team_lists[player.team].push({ 'name': playerVar, 'coef': 1 })
                        } else {
                            team_lists[player.team] = [{ 'name': playerVar, 'coef': 1 }]
                        }
                        // Build hitter team lists (non-pitcher positions only)
                        if (!hitterTeamLists[player.team]) {
                            hitterTeamLists[player.team] = []
                        }
                        hitterTeamLists[player.team].push({ 'name': playerVar, 'coef': 1 })
                    }
                }
                if (player.lock === true) {
                    individualPlayerVars.push({ 'name': player.id, 'vars': thisPlayerVars, 'bnds': { type: glpk.GLP_FX, ub: 1, lb: 1 } })
                } else if (player.remove === true) {
                    individualPlayerVars.push({ 'name': player.id, 'vars': thisPlayerVars, 'bnds': { type: glpk.GLP_FX, ub: 0, lb: 0 } })
                } else {
                    individualPlayerVars.push({ 'name': player.id, 'vars': thisPlayerVars, 'bnds': { type: glpk.GLP_UP, ub: 1, lb: 0 } })
                }
            }
        })

        const options = {
            presol: true,
            tmlim: 1.5,
        }

        // Override max-players-per-team to at least 5 for the 5-stack
        const maxPerTeam = Math.max(userSettings['max-players-per-team'], 5)

        const baseConstraints = [
            {
                name: 'max_salary',
                vars: salaryVars,
                bnds: { type: glpk.GLP_DB, ub: userSettings['max-salary'], lb: userSettings['min-salary'] }
            },
            {
                name: 'total_players',
                vars: playerTotalVars,
                bnds: { type: glpk.GLP_FX, ub: totalPlayers, lb: totalPlayers }
            },
            ...Object.keys(positionLists).map(position => ({
                name: `max_${position.toLowerCase()}s`,
                vars: positionLists[position],
                bnds: { type: glpk.GLP_FX, ub: 1, lb: 1 }
            })),
            ...Object.keys(team_lists).map(team => ({
                name: `${team.toLowerCase()} max`,
                vars: team_lists[team],
                bnds: { type: glpk.GLP_UP, ub: maxPerTeam, lb: 0 }
            })),
            ...Object.keys(gameLists).map(game => ({
                name: `${game} max`,
                vars: gameLists[game],
                bnds: { type: glpk.GLP_UP, ub: totalPlayers - 1, lb: 0 }
            })),
            {
                name: 'max_ofs',
                vars: ofList,
                bnds: { type: glpk.GLP_FX, ub: 3, lb: 3 }
            },
            {
                name: 'max_pitchers',
                vars: pList,
                bnds: { type: glpk.GLP_FX, ub: 2, lb: 2 }
            },
            ...individualPlayerVars
        ]

        // Build assignment list: first 20 evenly distributed, then remainder fills in
        const assignments = buildJackAssignments(rankedTeams, userSettings['num-lineups'])

        // Get all unique team abbrevs from slate
        const allTeamAbbrevs = teams.map(t => t.abbrev)

        const additionalConstraints = []
        const lineups = []
        const thisOpto = optoCount + 1
        const overexposedPlayers = []
        const optoExposures = {}

        // Track used secondary teams per primary to maximize diversity
        const usedSecondaryByPrimary = {}
        const secondaryDiversityThreshold = Math.floor(allTeamAbbrevs.length / 2)

        for (let i = 0; i < assignments.length; i++) {
            if (cancelledRef.current) {
                if (lineups.length > 0 && user) {
                    optimizeMutation.mutate({ 'lineups': lineups, 'slate': slate.id, 'exposures': optoExposures })
                }
                setButtonLoading(false)
                return
            }

            const primaryTeam = assignments[i]

            // Build exposure constraints for this lineup
            const exposureConstraints = []
            const removeExposureConstraints = []
            for (const player in overexposedPlayers) {
                const exposureCap = overexposedPlayers[player].exposureCap
                const currentExposure = Math.trunc((overexposedPlayers[player].count / (i + 1)) * 100)
                if (currentExposure < exposureCap) {
                    removeExposureConstraints.push('exposure_' + overexposedPlayers[player].genericId)
                    overexposedPlayers.splice(player, 1)
                } else {
                    const playerVarsExp = overexposedPlayers[player].thisPlayerConstraints
                    exposureConstraints.push({ 'name': `exposure_${overexposedPlayers[player].genericId}`, 'vars': playerVarsExp, 'bnds': { type: glpk.GLP_UP, ub: 0, lb: 0 } })
                }
            }

            // === PHASE 1: Randomly pick 5 hitters from the primary team ===
            const primaryHitters = players.filter(p => {
                if (p.team !== primaryTeam) return false
                if (p.remove === true) return false
                if (onlyUseMine && !p.projection.custom) return false
                if (p.projection.projection < projCutoffJack) return false
                if (overexposedPlayers.some(op => op.genericId === p.id)) return false
                return p.eligiblePositions.some(pos => pos !== 'P')
            })

            const lockedHitters = primaryHitters.filter(p => p.lock === true)
            const unlockedHitters = primaryHitters.filter(p => p.lock !== true)

            // Skip this team if there aren't enough eligible hitters
            if (lockedHitters.length + unlockedHitters.length < 5) {
                console.warn(`Skipping ${primaryTeam}: not enough eligible hitters (need 5)`)
                continue
            }

            // Retry loop: if a random combo doesn't work in Phase 2, pick a new one
            const maxRetries = 30
            let bestLineup = null
            let bestProjection = -Infinity
            let bestSecondaryTeam = null
            let phase1SelectedIds = []

            if (!usedSecondaryByPrimary[primaryTeam]) {
                usedSecondaryByPrimary[primaryTeam] = new Set()
            }
            if (usedSecondaryByPrimary[primaryTeam].size >= secondaryDiversityThreshold) {
                usedSecondaryByPrimary[primaryTeam] = new Set()
            }

            const allCandidates = allTeamAbbrevs.filter(t => t !== primaryTeam && hitterTeamLists[t] && hitterTeamLists[t].length >= 2)
            let candidateSecondaryTeams = allCandidates.filter(t => !usedSecondaryByPrimary[primaryTeam].has(t))
            if (candidateSecondaryTeams.length === 0) {
                candidateSecondaryTeams = allCandidates
            }

            for (let attempt = 0; attempt < maxRetries; attempt++) {
                if (cancelledRef.current) break

                // Randomly pick 5: start with locked players, fill rest randomly
                // Variance slider controls projection influence on the random sort
                const spotsToFill = 5 - lockedHitters.length
                const shuffled = unlockedHitters
                    .map(p => ({ player: p, sortKey: Math.random() + p.projection.projection * (1 - variance / 100) * 0.01 }))
                    .sort((a, b) => b.sortKey - a.sortKey)
                const picked = [...lockedHitters, ...shuffled.slice(0, spotsToFill).map(s => s.player)]
                phase1SelectedIds = picked.map(p => p.id)

                // Build lock constraints for these 5 hitters
                const phase1LockConstraints = phase1SelectedIds.map(playerId => {
                    const player = players.find(p => p.id === playerId)
                    const lockVars = player.eligiblePositions
                        .filter(pos => pos !== 'P')
                        .map(pos => ({ name: `${playerId}-${pos}`, coef: 1 }))
                    return {
                        name: `phase1_lock_${playerId}`,
                        vars: lockVars,
                        bnds: { type: glpk.GLP_FX, ub: 1, lb: 1 }
                    }
                })

                // === PHASE 2: Try to fill optimally around this combo ===
                for (let s = 0; s < candidateSecondaryTeams.length; s++) {
                    if (cancelledRef.current) break

                    const secondaryTeam = candidateSecondaryTeams[s]

                    const solveConstraints = [...baseConstraints]

                    for (let u = 0; u < additionalConstraints.length; u++) {
                        solveConstraints.push(additionalConstraints[u])
                    }

                    const filteredConstraints = solveConstraints.filter(c => !removeExposureConstraints.includes(c.name))
                    filteredConstraints.push(...exposureConstraints)

                    // Relax the primary team's max constraint to exactly 5 (the stack size)
                    const primaryConstraintName = `${primaryTeam.toLowerCase()} max`
                    for (let c = 0; c < filteredConstraints.length; c++) {
                        if (filteredConstraints[c].name === primaryConstraintName) {
                            filteredConstraints[c] = { ...filteredConstraints[c], bnds: { type: glpk.GLP_UP, ub: 5, lb: 0 } }
                            break
                        }
                    }

                    // Lock the 5 Phase 1 hitters into the lineup
                    filteredConstraints.push(...phase1LockConstraints)

                    // Secondary stack: at least 2 hitters from secondary team
                    filteredConstraints.push({
                        name: `secondary_stack_${secondaryTeam}`,
                        vars: hitterTeamLists[secondaryTeam],
                        bnds: { type: glpk.GLP_LO, ub: 3, lb: 2 }
                    })

                    try {
                        const res = await glpk.solve({
                            name: `JackOptimize_${i}_${attempt}_${secondaryTeam}`,
                            objective: {
                                direction: glpk.GLP_MAX,
                                name: 'obj',
                                vars: objVars
                            },
                            subjectTo: filteredConstraints,
                            binaries: playerVars
                        }, options)

                        if (res.result.status === 2 || res.result.status === 5) {
                            const proj = res.result.z
                            if (proj > bestProjection) {
                                bestProjection = proj
                                bestLineup = res
                                bestSecondaryTeam = secondaryTeam
                            }
                        }
                    } catch (error) {
                        continue
                    }
                }

                // If Phase 2 found a valid lineup, stop retrying
                if (bestLineup !== null) break
            }

            // Record the chosen secondary team for diversity tracking and UI summary
            if (bestSecondaryTeam) {
                usedSecondaryByPrimary[primaryTeam].add(bestSecondaryTeam)
                stackSummaryAccumulator.push({ primaryTeam, secondaryTeam: bestSecondaryTeam })
                setJackStackSummary([...stackSummaryAccumulator])
            }

            if (bestLineup === null) {
                console.warn(`Skipping ${primaryTeam} lineup ${i}: no valid combo found after ${maxRetries} attempts`)
                continue
            }

            // Process the best lineup
            const selectedPlayerPositions = Object.keys(bestLineup.result.vars).filter(key => bestLineup.result.vars[key] === 1)
            const selectedPlayerIds = selectedPlayerPositions.map(key => key.split('-')[0])
            const selectedPlayers = players.filter(player => selectedPlayerIds.includes(player.id))
            let updatedLineup = { 'P': [], "C": {}, "FB": {}, "SB": {}, "TB": {}, "SS": {}, "OF": [], 'total_salary': 0, 'total_projection': 0 }
            let lineupSal = 0
            let lineupProj = 0
            for (let j = 0; j < selectedPlayers.length; j++) {
                const player = selectedPlayers[j]
                lineupSal += parseInt(player.salary)
                lineupProj += parseFloat(player.projection.projection)
                for (let k = 0; k < selectedPlayerPositions.length; k++) {
                    if (selectedPlayerPositions[k].split('-')[0] === player.id) {
                        if (selectedPlayerPositions[k].split('-')[1] === 'OF') {
                            updatedLineup['OF'].push({ 'playerId': selectedPlayerPositions[k].split('-')[0], 'dk-id': player.dk_id, 'name': player.name, 'salary': player.salary, 'projection': player.projection.projection, 'ownership': player.ownership, 'team': player.team, 'opponent': player.opponent, 'exposureCap': player.exposure })
                        } else if (selectedPlayerPositions[k].split('-')[1] === 'P') {
                            updatedLineup['P'].push({ 'playerId': selectedPlayerPositions[k].split('-')[0], 'dk-id': player.dk_id, 'name': player.name, 'salary': player.salary, 'projection': player.projection.projection, 'ownership': player.ownership, 'team': player.team, 'opponent': player.opponent, 'exposureCap': player.exposure })
                        } else {
                            updatedLineup[selectedPlayerPositions[k].split('-')[1]] = { 'playerId': selectedPlayerPositions[k].split('-')[0], 'dk-id': player.dk_id, 'name': player.name, 'salary': player.salary, 'projection': player.projection.projection, 'ownership': player.ownership, 'team': player.team, 'opponent': player.opponent, 'exposureCap': player.exposure }
                        }
                    }
                }
                updatedLineup['total_salary'] = lineupSal
                updatedLineup['total_projection'] = parseFloat(lineupProj.toFixed(2))
            }

            // Add uniqueness constraint for this lineup — only count non-primary-stack players
            // so the intentionally-repeated 5-stack doesn't eat up uniqueness slots
            const fillPlayers = players.filter(player => selectedPlayerIds.includes(player.id) && !phase1SelectedIds.includes(player.id))
            const restrictionVars = []
            for (let j = 0; j < fillPlayers.length; j++) {
                for (let k = 0; k < fillPlayers[j].eligiblePositions.length; k++) {
                    const playerName = fillPlayers[j].id + '-' + fillPlayers[j].eligiblePositions[k]
                    const playerVar = { 'name': playerName, 'coef': 1 }
                    restrictionVars.push(playerVar)
                }
            }
            const fillSlots = totalPlayers - 5
            const maxOverlap = Math.max(0, fillSlots - userSettings['uniques'])
            additionalConstraints.push({
                name: `lineup_${i}_unique`,
                vars: restrictionVars,
                bnds: { type: glpk.GLP_UP, ub: maxOverlap, lb: 0 }
            })

            // Clean MLB lineup format
            const cleanedMlbLineup = { 'P1': {}, 'P2': {}, 'C': {}, 'FB': {}, 'SB': {}, 'TB': {}, 'SS': {}, 'OF1': {}, 'OF2': {}, 'OF3': {}, 'total_salary': updatedLineup.total_salary, 'total_projection': updatedLineup.total_projection }
            cleanedMlbLineup['P1'] = updatedLineup['P'][0]
            cleanedMlbLineup['P2'] = updatedLineup['P'][1]
            cleanedMlbLineup['C'] = updatedLineup['C']
            cleanedMlbLineup['FB'] = updatedLineup['FB']
            cleanedMlbLineup['SB'] = updatedLineup['SB']
            cleanedMlbLineup['TB'] = updatedLineup['TB']
            cleanedMlbLineup['SS'] = updatedLineup['SS']
            cleanedMlbLineup['OF1'] = updatedLineup['OF'][0]
            cleanedMlbLineup['OF2'] = updatedLineup['OF'][1]
            cleanedMlbLineup['OF3'] = updatedLineup['OF'][2]
            lineups.push(cleanedMlbLineup)

            setOptimizedLineups({ ...optimizedLineups, [`${thisOpto.toString()}`]: lineups, 'count': thisOpto })

            // Update exposures
            const cleanedLineup = {}
            for (const pos in updatedLineup) {
                if (pos !== 'total_salary' && pos !== 'total_projection') {
                    if (pos === 'P' || pos === 'OF') {
                        for (let x = 0; x < updatedLineup[pos].length; x++) {
                            cleanedLineup[`${pos}${x}`] = updatedLineup[pos][x]
                        }
                    } else {
                        cleanedLineup[pos] = updatedLineup[pos]
                    }
                }
            }
            for (const pos in cleanedLineup) {
                if (cleanedLineup.hasOwnProperty(pos)) {
                    const exposurePlayer = cleanedLineup[pos]
                    if (optoExposures[exposurePlayer['dk-id']] !== undefined) {
                        const currentExposure = optoExposures[exposurePlayer['dk-id']]
                        const currentCount = currentExposure.count
                        const newCount = currentCount + 1
                        const newExposure = (newCount / (i + 1)) * 100
                        const roundedExposure = parseFloat(newExposure.toFixed(0))
                        const updatedExposure = { ...currentExposure, 'exposure': roundedExposure, 'count': newCount }
                        optoExposures[exposurePlayer['dk-id']] = updatedExposure
                        if (roundedExposure > exposurePlayer.exposureCap) {
                            const metaPlayer = players.filter(player => player.id === exposurePlayer['playerId'])[0]
                            const thisPlayerConstraints = []
                            for (const position in metaPlayer.eligiblePositions) {
                                const pVar = metaPlayer.id + '-' + metaPlayer.eligiblePositions[position]
                                const positionVar = { 'name': pVar, 'coef': 1 }
                                thisPlayerConstraints.push(positionVar)
                            }
                            overexposedPlayers.push({ 'playerId': exposurePlayer['dk-id'], 'exposureCap': exposurePlayer.exposureCap, 'count': newCount, 'genericId': exposurePlayer['playerId'], 'thisPlayerConstraints': thisPlayerConstraints })
                        }
                    } else {
                        const newExposure = (1 / (i + 1)) * 100
                        const roundedExposure = parseFloat(newExposure.toFixed(0))
                        optoExposures[exposurePlayer['dk-id']] = { 'exposure': roundedExposure, 'player-name': cleanedLineup[pos].name, 'team': cleanedLineup[pos].team, 'count': 1 }
                        if (roundedExposure > exposurePlayer.exposureCap) {
                            const metaPlayer = players.filter(player => player.id === exposurePlayer['playerId'])[0]
                            const thisPlayerConstraints = []
                            for (const position in metaPlayer.eligiblePositions) {
                                const pVar = metaPlayer.id + '-' + metaPlayer.eligiblePositions[position]
                                const positionVar = { 'name': pVar, 'coef': 1 }
                                thisPlayerConstraints.push(positionVar)
                            }
                            overexposedPlayers.push({ 'playerId': exposurePlayer['dk-id'], 'exposureCap': exposurePlayer.exposureCap, 'count': 1, 'genericId': exposurePlayer['playerId'], 'thisPlayerConstraints': thisPlayerConstraints })
                        }
                    }
                }
            }
            setExposures({ ...exposures, [`${thisOpto.toString()}`]: optoExposures })
            setSelectedOpto(thisOpto)

            if (i === 0) {
                setTab(1)
            }
        }

        setButtonLoading(false)
        if (lineups.length < assignments.length && lineups.length > 0) {
            setFailedOptimizeModalOpen(true)
            setFailedSuccessLineups(lineups.length)
        }
        if (lineups.length > 0 && user) {
            optimizeMutation.mutate({ 'lineups': lineups, 'slate': slate.id, 'exposures': optoExposures })
        }
    }

    React.useEffect(() => {
        if (data?.['slate-info']?.['user-locks'] !== undefined) {
            setLockedData(data?.['slate-info']?.['user-locks'])
        }
    }, [data])

    const playerData = React.useMemo(() => data?.['slate-info'].players, [data])

    const memoizedPlayerTable = React.useMemo(
        () => (
            <PlayerTable sport={sport} setOnlyUseMine={setOnlyUseMine} setClearedSearch={setClearedSearch} setStackData={setStackData} stackData={stackData} data={playerData} slateId={slate.id} />
        ),
        [playerData, slate.id, setOnlyUseMine, sport, setStackData, stackData]
    );

    return (
        <>
            <ConfirmErrorModal openConfirmModal={failedOptimizeModalOpen} setOpenConfirmModal={setFailedOptimizeModalOpen} successfulLineupCount={failedSuccessLineups} setFailedSuccessLineups={setFailedSuccessLineups} />
            {sport === 'mlb' && data?.['slate-info']?.teams && (
                <JackOptoModal openJackOptoModal={jackOptoModalOpen} setOpenJackOptoModal={setJackOptoModalOpen} teams={data['slate-info'].teams} onConfirm={handleJackOptimize} />
            )}
            <Box>
                {playersLoading ? (
                    <Grid container sx={{ minHeight: '75vh' }} direction='column' justifyContent='center' alignItems='center'>
                        <Grid item>
                            <CircularProgress size={120} />
                        </Grid>
                    </Grid>
                ) : (
                    <LockedContext.Provider value={[lockedData, setLockedData]}>
                        <MLBStackContext.Provider value={{ mlbStackRules, setMlbStackRules, mlbTeams: data?.['slate-info']?.teams || [] }}>
                        <UserSettingsContext.Provider value={[userSettings, setUserSettings]}>
                            <Grid container direction='row' justifyContent='stretch' alignItems='flex-start'>
                                <Grid item lg={9} md={7.9} xs={12} style={{ maxHeight: isMobile ? '57.5vh' : '82.5vh', overflow: 'auto', width: '100%' }}>
                                    <Container disableGutters maxWidth={false} sx={{ overflow: 'auto', pt: '2vh', pl: isMobile ? '1.2vh' : '2vh', pr: '2vh' }}>
                                        {memoizedPlayerTable}
                                    </Container>
                                    <Divider />
                                </Grid>
                                <Grid item lg={3} md={4.1} xs={12}>
                                    <SettingsPanel sport={sport} handleOptimization={(sport === 'mlb' && user?.isJack && useJackOpto) ? () => setJackOptoModalOpen(true) : handleOptimize} optoLen={optimizedLineups[selectedOpto] ? optimizedLineups[selectedOpto].length : null} clearedSearch={clearedSearch} handleCancelOptimize={handleCancelOptimize} buttonLoading={buttonLoading} tab={tab} setTab={setTab} exposures={exposures} selectedOpto={selectedOpto} jackStackSummary={jackStackSummary} useJackOpto={useJackOpto} setUseJackOpto={setUseJackOpto} stackRankResults={stackRankResults} handleStackRank={handleStackRank} />
                                </Grid>
                            </Grid>
                        </UserSettingsContext.Provider>
                        </MLBStackContext.Provider>
                    </LockedContext.Provider>
                )}
            </Box>
        </>
    )
}

export { SlateInfo }