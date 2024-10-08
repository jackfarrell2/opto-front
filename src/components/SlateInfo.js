import React from 'react'
import { useQuery } from 'react-query'
import config from '../config'
import { PlayerTable } from './PlayerTable';
import { Grid, CircularProgress, Box, Container, Divider, useMediaQuery } from '@mui/material';
import { SettingsPanel } from './SettingsPanel';
import { UserContext } from './UserProvider';
import { useMutation } from 'react-query'
import { ConfirmErrorModal } from './ConfirmErrorModal';
import GLPK from 'glpk.js'
export const LockedContext = React.createContext()
export const UserSettingsContext = React.createContext()

function SlateInfo({ sport, slate, setOptimizedLineups, exposures, setExposures, optimizedLineups, setSelectedOpto, selectedOpto }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const totalPlayers = (sport === 'nba') ? 8 : (sport === 'nfl') ? 9 : 10;
    const { token, user } = React.useContext(UserContext)
    const optoApiUrl = `${config.apiUrl}${sport}/api/authenticated-optimize/`;
    const apiUrl = token ? `${config.apiUrl}${sport}/api/authenticated-slate-info/${slate.id}` : `${config.apiUrl}${sport}/api/unauthenticated-slate-info/${slate.id}`
    const [lockedData, setLockedData] = React.useState({ 'count': 0, 'salary': 0 })
    const [stackData, setStackData] = React.useState({ 'WR-same': 0, 'TE-same': 0, 'WR-opp': 0, 'TE-opp': 0 })
    const [tab, setTab] = React.useState(0)
    const [userSettings, setUserSettings] = React.useState({ 'uniques': 3, 'min-salary': 45000, 'max-salary': 50000, 'max-players-per-team': 5, 'num-lineups': 20, 'hittersVsPitcher': 0, 'offenseVsDefense': 0 })
    const optoCount = optimizedLineups['count']
    const [buttonLoading, setButtonLoading] = React.useState(false)
    const [failedOptimizeModalOpen, setFailedOptimizeModalOpen] = React.useState(false)
    const [failedSuccessLineups, setFailedSuccessLineups] = React.useState(0)
    const [onlyUseMine, setOnlyUseMine] = React.useState(false)
    const cancelledRef = React.useRef(false)

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
        const glpk = await GLPK()
        players.forEach(player => {
            if (onlyUseMine === false || player.projection.custom === true) {
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
            <Box>
                {playersLoading ? (
                    <Grid container sx={{ minHeight: '75vh' }} direction='column' justifyContent='center' alignItems='center'>
                        <Grid item>
                            <CircularProgress size={120} />
                        </Grid>
                    </Grid>
                ) : (
                    <LockedContext.Provider value={[lockedData, setLockedData]}>
                        <UserSettingsContext.Provider value={[userSettings, setUserSettings]}>
                            <Grid container direction='row' justifyContent='stretch' alignItems='flex-start'>
                                <Grid item lg={9} md={7.9} xs={12} style={{ maxHeight: isMobile ? '57.5vh' : '82.5vh', overflow: 'auto', width: '100%' }}>
                                    <Container disableGutters maxWidth={false} sx={{ overflow: 'auto', pt: '2vh', pl: isMobile ? '1.2vh' : '2vh', pr: '2vh' }}>
                                        {memoizedPlayerTable}
                                    </Container>
                                    <Divider />
                                </Grid>
                                <Grid item lg={3} md={4.1} xs={12}>
                                    <SettingsPanel sport={sport} handleOptimization={handleOptimize} optoLen={optimizedLineups[selectedOpto] ? optimizedLineups[selectedOpto].length : null} clearedSearch={clearedSearch} handleCancelOptimize={handleCancelOptimize} buttonLoading={buttonLoading} tab={tab} setTab={setTab} exposures={exposures} selectedOpto={selectedOpto} />
                                </Grid>
                            </Grid>
                        </UserSettingsContext.Provider>
                    </LockedContext.Provider>
                )}
            </Box>
        </>
    )
}

export { SlateInfo }