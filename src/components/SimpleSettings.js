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
import { HittersVsPitcher } from './HittersVsPitcher';

function SimpleSettings({ sport }) {
    const apiUrl = `${config.apiUrl}${sport}/api/user-opto-settings/`
    const { user, token } = React.useContext(UserContext)
    const [userSettings, setUserSettings] = React.useContext(UserSettingsContext)

    const { data } = useQuery('settings', async () => {
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
        setUserSettings({ ...data })
        return data
    },
        {
            staleTime: Infinity
        }
    );

    return (
        <>
            {(!data && user) ? (
                <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
                    <Grid item>
                        <CircularProgress size={70} />
                    </Grid>
                </Grid>
            ) : (
                <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
                    <Grid item><LockedData /></Grid>
                    <Grid item><UniquePlayers sport={sport} userSettings={userSettings} setUserSettings={setUserSettings} /></Grid>
                    <Grid item><MaxPlayersPerTeam sport={sport} userSettings={userSettings} setUserSettings={setUserSettings} /></Grid>
                    {sport === 'mlb' && <Grid item><HittersVsPitcher userSettings={userSettings} setUserSettings={setUserSettings} /></Grid>}
                    <Grid item><SalaryField sport={sport} variant='min' userSettings={userSettings} setUserSettings={setUserSettings} /></Grid>
                    <Grid item><SalaryField sport={sport} variant='max' userSettings={userSettings} setUserSettings={setUserSettings} /></Grid>
                </Grid>
            )}
        </>
    )
}

export { SimpleSettings }