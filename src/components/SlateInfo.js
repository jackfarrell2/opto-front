import React from 'react'
import { useQuery } from 'react-query'
import config from '../config'
import { PlayerTable } from './PlayerTable';
import { Grid, CircularProgress, Box, Container, Divider } from '@mui/material';
import { SettingsPanel } from './SettingsPanel';
import { UserContext } from './UserProvider';
import { useMutation, useQueryClient } from 'react-query'

export const LockedContext = React.createContext()
export const UserSettingsContext = React.createContext()

function SlateInfo({ slate, setOptimizedLineups, exposures, setExposures, optimizedLineups, setSelectedOpto, selectedOpto }) {
    const queryClient = useQueryClient()
    const { token, user } = React.useContext(UserContext)
    const userId = user ? user.id : null
    const optoApiUrl = userId ? `${config.apiUrl}nba/api/authenticated-optimize/` : `${config.apiUrl}nba/api/unauthenticated-optimize/`
    const apiUrl = token ? `${config.apiUrl}nba/api/authenticated-slate-info/${slate.id}` : `${config.apiUrl}nba/api/unauthenticated-slate-info/${slate.id}`
    const cancelApiUrl = `${config.apiUrl}nba/api/cancel-optimization/`
    const [lockedData, setLockedData] = React.useState({ 'count': 0, 'salary': 0 })
    const [tab, setTab] = React.useState(0)
    const [userSettings, setUserSettings] = React.useState({ 'uniques': 3, 'min-salary': 45000, 'max-salary': 50000, 'max-players-per-team': 5, 'num-lineups': 5 })
    const optoCount = optimizedLineups['count']
    const [buttonLoading, setButtonLoading] = React.useState(false)

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
        return data
    },
        {
            staleTime: Infinity
        });

    // Submit form / optimize players
    const optimizeMutation = useMutation(
        async (requestData) => {
            setButtonLoading(true);
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
                if (data['ignore'] !== true) {
                    setOptimizedLineups({ ...optimizedLineups, [`${optoCount + 1}`]: data['lineups'], 'count': optoCount + 1 })
                    setSelectedOpto(optoCount + 1)
                    setExposures({ ...exposures, [`${optoCount + 1}`]: data['exposures'] })
                    setTab(1)
                    setButtonLoading(false);
                }
            }
        }
    );

    const handleOptimize = React.useCallback((formData) => {
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
            'cancelId': Math.random().toString(36).substring(7)
        }
        queryClient.cancelMutations('optimizeMutation')
        optimizeMutation.mutate(requestData)
    }, [slate.id, userId, userSettings, optimizeMutation, queryClient]);

    const handleCancelOptimize = async () => {
        const cancelId = optimizeMutation.variables.cancelId;
        try {
            const response = await fetch(cancelApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ 'cancel-id': cancelId, 'slate-id': slate.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel optimization');
            }
            setButtonLoading(false);
        } catch (error) {
            console.error('Error cancelling optimization:', error);
        }
    };


    React.useEffect(() => {
        if (data?.['slate-info']?.['user-locks'] !== undefined) {
            setLockedData(data?.['slate-info']?.['user-locks'])
        }
    }, [data])


    const playerData = React.useMemo(() => data?.['slate-info'].players, [data])

    const memoizedPlayerTable = React.useMemo(
        () => (
            <PlayerTable data={playerData} handleOptimize={handleOptimize} slateId={slate.id} />
        ),
        [playerData, handleOptimize, slate.id]
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
                                <Container disableGutters sx={{ maxHeight: '75vh', overflow: 'auto', pt: '2vh', pl: '2vh' }}>
                                    {memoizedPlayerTable}
                                </Container>
                                <Divider />
                            </Grid>
                            <Grid item xs={4}>
                                <SettingsPanel handleCancelOptimize={handleCancelOptimize} buttonLoading={buttonLoading} tab={tab} setTab={setTab} exposures={exposures} selectedOpto={selectedOpto} />
                            </Grid>
                        </Grid>
                    </UserSettingsContext.Provider>
                </LockedContext.Provider>
            )}
        </Box>
    )
}

export { SlateInfo }