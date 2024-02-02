import React from 'react'
import { Typography, Grid } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from './UserProvider';
import { updateUserSettings } from '../util/nbaUtils';

function UniquePlayers({ userSettings, setUserSettings }) {
    const { token } = React.useContext(UserContext)
    const { uniques } = userSettings
    const setUniques = (value) => setUserSettings({ ...userSettings, 'uniques': value })
    const [storedValue, setStoredValue] = React.useState(uniques)

    const setStoredValueMeta = React.useCallback(async (value) => {
        if (value === storedValue) return
        setStoredValue(value)
        try {
            await updateUserSettings({ ...userSettings, 'uniques': value }, token);
        } catch (error) {
            console.error('Failed to update user settings', error)
        }
    }, [storedValue, userSettings, token])

    React.useEffect(() => {
        if (!token) return
        const timeoutId = setTimeout(() => setStoredValueMeta(uniques), 1200);
        return () => clearTimeout(timeoutId);
    }, [setStoredValueMeta, uniques, token]);

    function handleChange(change) {
        if (change === 'add') {
            if (uniques + 1 > 8) return console.log('Max uniques is 8')
            setUniques(uniques + 1)
        }
        if (change === 'subtract') {
            if (uniques - 1 < 1) return console.log('Min uniques is 1')
            setUniques(uniques - 1)
        }
    }

    return (
        <Grid container direction='row' justifyContent='center' alignItems='center'>
            <Grid item>
                <Typography variant='body1'>Unique Players Per Lineup: </Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleChange('subtract')}><RemoveIcon /></IconButton>
            </Grid>
            <Grid item>
                <Typography variant='body1'>{uniques}</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleChange('add')}><AddIcon /></IconButton>
            </Grid>
        </Grid>
    )
}

export { UniquePlayers }