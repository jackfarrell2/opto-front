import React from 'react'
import { Typography, Grid, useMediaQuery } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from './UserProvider';
import { updateUserSettings } from '../util/nbaUtils';

function MaxPlayersPerTeam({ userSettings, setUserSettings }) {
    const isMedium = useMediaQuery((theme) => theme.breakpoints.down('xl'));

    const { token } = React.useContext(UserContext)
    const playersPerTeam = userSettings['max-players-per-team']
    const setPlayersPerTeam = (value) => setUserSettings({ ...userSettings, 'max-players-per-team': value })
    const [storedValue, setStoredValue] = React.useState(playersPerTeam)

    const setStoredValueMeta = React.useCallback(async (value) => {
        if (value === storedValue) return
        setStoredValue(value)
        try {
            await updateUserSettings({ ...userSettings, 'max-players-per-team': value }, token);
        } catch (error) {
            console.error('Failed to update user settings', error)
        }
    }, [storedValue, userSettings, token])

    React.useEffect(() => {
        if (!token) return
        const timeoutId = setTimeout(() => setStoredValueMeta(playersPerTeam), 1200);
        return () => clearTimeout(timeoutId);
    }, [setStoredValueMeta, playersPerTeam, token]);

    function handleChange(change) {
        if (change === 'add') {
            if (playersPerTeam + 1 > 8) return console.log('Max players is 8')
            setPlayersPerTeam(playersPerTeam + 1)
        }
        if (change === 'subtract') {
            if (playersPerTeam - 1 < 1) return console.log('Min players is 1')
            setPlayersPerTeam(playersPerTeam - 1)
        }
    }

    return (
        <Grid container direction='row' justifyContent='center' alignItems='center'>
            <Grid item>
                <Typography variant='body1'>{isMedium ? 'Max' : 'Maximum'} Players Per Team: </Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleChange('subtract')}><RemoveIcon /></IconButton>
            </Grid>
            <Grid item>
                <Typography variant='body1'>{playersPerTeam}</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleChange('add')}><AddIcon /></IconButton>
            </Grid>
        </Grid>
    )
}

export { MaxPlayersPerTeam }