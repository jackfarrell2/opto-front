import React from 'react'
import { Grid, CircularProgress } from '@mui/material'
import { LockedData } from './LockedData';
import { UniquePlayers } from './UniquePlayers';
import { MaxPlayersPerTeam } from './MaxPlayersPerTeam';
import { SalaryField } from './SalaryField';
import config from '../config'
import { UserContext } from './UserProvider'
import { useQuery } from 'react-query'

const apiUrl = `${config.apiUrl}nba/api/user-opto-settings/`

function SimpleSettings() {
    const { user, token } = React.useContext(UserContext)

    const [uniques, setUniques] = React.useState(3)
    const [playersPerTeam, setPlayersPerTeam] = React.useState(5)
    const [minSalary, setMinSalary] = React.useState(45000)
    const [maxSalary, setMaxSalary] = React.useState(50000)

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
    });

    React.useEffect(() => {
        if (data) {
            setUniques(data['uniques']);
            setPlayersPerTeam(data['max-players-per-team']);
            setMinSalary(data['min-salary']);
            setMaxSalary(data['max-salary']);
        }
    }, [data]);



    return (
        <>
            {user ? (
                <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
                    <Grid item>
                        <CircularProgress size={70} />
                    </Grid>
                </Grid>
            ) : (
                <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
                    <Grid item><LockedData /></Grid>
                    <Grid item><UniquePlayers uniques={uniques} setUniques={setUniques} /></Grid>
                    <Grid item><MaxPlayersPerTeam playersPerTeam={playersPerTeam} setPlayersPerTeam={setPlayersPerTeam} /></Grid>
                    <Grid item><SalaryField variant='min' salary={minSalary} setSalary={setMinSalary} /></Grid>
                    <Grid item><SalaryField variant='max' salary={maxSalary} setSalary={setMaxSalary} /></Grid>
                </Grid>
            )}
        </>
    )
}

export { SimpleSettings }