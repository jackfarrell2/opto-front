import React from 'react'
import { Grid, CircularProgress } from '@mui/material'
import { LockedData } from './LockedData';
import { UniquePlayers } from './UniquePlayers';
import { MaxPlayersPerTeam } from './MaxPlayersPerTeam';
import { SalaryField } from './SalaryField';
import config from '../config'
import { UserContext } from './UserProvider'
import { useQuery } from 'react-query'
import { UserSettingsContext } from './SlateInfo';

const apiUrl = `${config.apiUrl}nba/api/user-opto-settings/`

function SimpleSettings() {
    const { user, token } = React.useContext(UserContext)
    const [userSettings, setUserSettings] = React.useContext(UserSettingsContext)

    const { data, isLoading: settingsLoading } = useQuery('settings', async () => {
        if (!user) {
            return
        }
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
    }, {
        staleTime: Infinity
    });

    // React.useEffect(() => {
    //     if (data) {
    //         setUniques(data['uniques']);
    //         setPlayersPerTeam(data['max-players-per-team']);
    //         setMinSalary(data['min-salary']);
    //         setMaxSalary(data['max-salary']);
    //     }
    // }, [data]);



    return (
        <>
            {settingsLoading ? (
                <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
                    <Grid item>
                        <CircularProgress size={70} />
                    </Grid>
                </Grid>
            ) : (
                <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
                    <Grid item><LockedData /></Grid>
                    <Grid item><UniquePlayers userSettings={userSettings} setUserSettings={setUserSettings} /></Grid>
                    <Grid item><MaxPlayersPerTeam userSettings={userSettings} setUserSettings={setUserSettings} /></Grid>
                    <Grid item><SalaryField variant='min' userSettings={userSettings} setUserSettings={setUserSettings} /></Grid>
                    <Grid item><SalaryField variant='max' userSettings={userSettings} setUserSettings={setUserSettings} /></Grid>
                </Grid>
            )}
        </>
    )
}

export { SimpleSettings }