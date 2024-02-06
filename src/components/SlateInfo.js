import React from 'react'
import { useQuery } from 'react-query'
import config from '../config'
import { PlayerTable } from './PlayerTable';
import { Grid, CircularProgress, Box, Container } from '@mui/material';
import { SettingsPanel } from './SettingsPanel';
import { UserContext } from './UserProvider';
import { useMutation } from 'react-query'

export const LockedContext = React.createContext()
export const UserSettingsContext = React.createContext()

function SlateInfo({ slate, setOptimizedLineup, optimizedLineup }) {
    const { token, user } = React.useContext(UserContext)
    const userId = user ? user.id : null
    const optoApiUrl = userId ? `${config.apiUrl}nba/api/authenticated-optimize/` : `${config.apiUrl}nba/api/unauthenticated-optimize/`
    const apiUrl = token ? `${config.apiUrl}nba/api/authenticated-slate-info/${slate.id}` : `${config.apiUrl}nba/api/unauthenticated-slate-info/${slate.id}`
    const [lockedData, setLockedData] = React.useState({ 'count': 0, 'salary': 0 })
    const [userSettings, setUserSettings] = React.useState({ 'uniques': 3, 'min-salary': 45000, 'max-salary': 50000, 'max-players-per-team': 5, 'num-lineups': 20 })

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
        return data
    },
        {
            staleTime: Infinity
        });


    // Submit form / optimize players
    const optimizeMutation = useMutation(async (requestData) => {
        const response = await fetch(optoApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error('Failed to optimize players');
        }

        return response.json();
    },
        {
            onSuccess: (data) => {
                setOptimizedLineup(data['lineups'][0])
            },
        });

    const handleOptimize = React.useMemo(() => {
        return (formData) => {
            const formDataObj = formData
            const optoSettings = {
                'uniques': userSettings['uniques'],
                'maxTeamPlayers': userSettings['max-players-per-team'],
                'minSalary': userSettings['min-salary'],
                'maxSalary': userSettings['max-salary'],
                'numLineups': userSettings['num-lineups']
            }
            const requestData = {
                'slate-id': slate.id,
                'user-id': userId,
                'players': formDataObj,
                'opto-settings': optoSettings,
            }
            optimizeMutation.mutate(requestData)
        }
    }, [slate.id, userId, userSettings, optimizeMutation]);

    React.useEffect(() => {
        if (data?.['user-locks'] !== undefined) {
            setLockedData(data?.['user-locks'])
        }
    }, [data])

    const playerData = React.useMemo(() => data?.players, [data])

    const memoizedPlayerTable = React.useMemo(
        () => (
            <PlayerTable data={playerData} handleOptimize={handleOptimize} setOptimizedLineup={setOptimizedLineup} optimizedLineup={optimizedLineup} slateId={slate.id} />
        ),
        [playerData, handleOptimize, setOptimizedLineup, optimizedLineup, slate.id]
    );


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
                    <UserSettingsContext.Provider value={[userSettings, setUserSettings]}>
                        <Grid container direction='row' justifyContent='center' alignItems='center'>
                            <Grid item xs={8}>
                                <Container sx={{ maxHeight: '75vh', overflow: 'auto', mt: '2vh' }}>
                                    {memoizedPlayerTable}
                                </Container>
                            </Grid>
                            <Grid item xs={4}>
                                <SettingsPanel />
                            </Grid>
                        </Grid>
                    </UserSettingsContext.Provider>
                </LockedContext.Provider>
            )}
        </Box>
    )
}

export { SlateInfo }