import React from 'react'
import { useQuery } from 'react-query'
import config from '../config'
import { PlayerTable } from './PlayerTable';
import { Grid, CircularProgress, Box, Container } from '@mui/material';
import { SettingsPanel } from './SettingsPanel';
import { UserContext } from './UserProvider';

export const LockedContext = React.createContext()

function SlateInfo({ slate, setOptimizedLineup, optimizedLineup }) {
    const { token } = React.useContext(UserContext)
    const apiUrl = token ? `${config.apiUrl}nba/api/authenticated-slate-info/${slate.id}` : `${config.apiUrl}nba/api/unauthenticated-slate-info/${slate.id}`
    const [lockedData, setLockedData] = React.useState({ 'count': 0, 'salary': 0 })

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
                                <PlayerTable data={playerData} setOptimizedLineup={setOptimizedLineup} optimizedLineup={optimizedLineup} slateId={slate.id} />
                            </Container>
                        </Grid>
                        <Grid item xs={4}>
                            <SettingsPanel />
                        </Grid>
                    </Grid>
                </LockedContext.Provider>
            )}
        </Box>
    )
}

export { SlateInfo }