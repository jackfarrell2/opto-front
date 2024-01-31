import React from 'react'
import { useQuery } from 'react-query'
import config from '../config'
import { PlayerTable } from './PlayerTable';
import { Grid, CircularProgress, Box, Container } from '@mui/material';
import { SettingsPanel } from './SettingsPanel';
import { UserContext } from './UserProvider';

export const LockedContext = React.createContext()

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_UNIQUES':
            return { ...state, uniques: action.payload }
        case 'UPDATE_NUM_LINEUPS':
            return { ...state, numLineups: action.payload }
        case 'UPDATE_MAX_PLAYERS':
            return { ...state, maxTeamPlayers: action.payload }
        case 'UPDATE_MIN_SALARY':
            return { ...state, minSalary: action.payload }
        case 'UPDATE_MAX_SALARY':
            return { ...state, maxSalary: action.payload }
        default:
            return state
    }

}


function SlateInfo({ slate, setOptimizedLineup, optimizedLineup }) {
    const { token } = React.useContext(UserContext)
    const apiUrl = token ? `${config.apiUrl}nba/api/authenticated-slate-info/${slate.id}` : `${config.apiUrl}nba/api/unauthenticated-slate-info/${slate.id}`
    const [lockedData, setLockedData] = React.useState({ 'count': 0, 'salary': 0 })
    const initualUserSettings = { 'uniques': 3, 'numLineups': 20, 'maxTeamPlayers': 6, 'minSalary': 45000, 'maxSalary': 50000 }
    const [userSettings, dispatchSettings] = React.useReducer(reducer, initualUserSettings)

    const { data: players, isLoading: playersLoading } = useQuery(['players', slate.id], async () => {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Token ${token}`,
            }
        })
        if (!response.ok) {
            throw new Error('Failed to fetch players')
        }
        const data = await response.json()
        return data
    });

    const playerData = React.useMemo(() => players?.players, [players])

    return (
        <Box>
            {playersLoading ? (
                <Grid container sx={{ height: '75vh' }} direction='column' justifyContent='center' alignItems='center'>
                    <Grid item>
                        <CircularProgress size={120} />
                    </Grid>
                </Grid>
            ) : (
                <LockedContext.Provider value={[lockedData, setLockedData]}>
                    <Grid container direction='row' justifyContent='center' alignItems='center'>
                        <Grid item xs={8}>
                            <Container sx={{ maxHeight: '75vh', overflow: 'auto', mt: '2vh' }}>
                                <PlayerTable data={playerData} setOptimizedLineup={setOptimizedLineup} optimizedLineup={optimizedLineup} slateId={slate.id} userSettings={userSettings} />
                            </Container>
                        </Grid>
                        <Grid item xs={4}>
                            <SettingsPanel userSettings={userSettings} dispatchSettings={dispatchSettings} />
                        </Grid>
                    </Grid>
                </LockedContext.Provider>
            )}
        </Box>
    )
}

export { SlateInfo }