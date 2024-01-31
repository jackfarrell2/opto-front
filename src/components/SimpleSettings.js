import React from 'react'
import { Grid, Typography, IconButton, TextField } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { LockedData } from './LockedData';

function SimpleSettings({ userSettings, dispatchSettings }) {

    function handleUniquesChange(change) {
        if (change === 'add') {
            if (userSettings['uniques'] + 1 > 8) return console.log('Max uniques is 8')
            dispatchSettings({ type: 'UPDATE_UNIQUES', payload: userSettings['uniques'] + 1 })
        } else if (change === 'subtract') {
            if (userSettings['uniques'] - 1 < 1) return console.log('Min uniques is 1')
            dispatchSettings({ type: 'UPDATE_UNIQUES', payload: userSettings['uniques'] - 1 })
        }
    }

    function handleMaxPlayersChange(change) {
        if (change === 'add') {
            if (userSettings['maxTeamPlayers'] + 1 > 8) return console.log('Max players per team is 8')
            dispatchSettings({ type: 'UPDATE_MAX_PLAYERS', payload: userSettings['maxTeamPlayers'] + 1 })
        } else if (change === 'subtract') {
            if (userSettings['maxTeamPlayers'] - 1 < 1) return console.log('Min players per team is 1')
            dispatchSettings({ type: 'UPDATE_MAX_PLAYERS', payload: userSettings['maxTeamPlayers'] - 1 })
        }
    }

    function handleSalaryChange(event, change) {
        if (isNaN(event.target.value)) return console.log('Salary must be a number')
        if (event.target.value > 50000) {
            if (change === 'min') {
                dispatchSettings({ type: 'UPDATE_MIN_SALARY', payload: 50000 })
                return console.log('Min salary is 50000')
            } else if (change === 'max') {
                dispatchSettings({ type: 'UPDATE_MAX_SALARY', payload: 50000 })
                return console.log('Max salary is 50000')
            }
        }
        if (change === 'min') {
            dispatchSettings({ type: 'UPDATE_MIN_SALARY', payload: event.target.value })
        } else if (change === 'max') {
            dispatchSettings({ type: 'UPDATE_MAX_SALARY', payload: event.target.value })
        }
    }

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
            <Grid item>
                <LockedData />
            </Grid>
            <Grid item>
                <Grid container direction='row' justifyContent='center' alignItems='center'>
                    <Grid item>
                        <Typography variant='body1'>Unique Players Per Lineup: </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => handleUniquesChange('subtract')}><RemoveIcon /></IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1'>{userSettings['uniques']}</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => handleUniquesChange('add')}><AddIcon /></IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container direction='row' justifyContent='center' alignItems='center'>
                    <Grid item>
                        <Typography variant='body1'>Maximum Players Per Team: </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => handleMaxPlayersChange('subtract')}><RemoveIcon /></IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant='body1'>{userSettings['maxTeamPlayers']}</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => handleMaxPlayersChange('add')}><AddIcon /></IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                {userSettings && <TextField id="min-salary" value={userSettings['minSalary']} onChange={(e) => handleSalaryChange(e, 'min')} label="Minimum Salary" variant="filled" />}
            </Grid>
            <Grid item>
                {userSettings && <TextField id="max-salary" value={userSettings['maxSalary']} onChange={(e) => handleSalaryChange(e, 'max')} label="Maximum Salary" variant="filled" />}
            </Grid>
        </Grid>
    )
}

export { SimpleSettings }