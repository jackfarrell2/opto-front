import React from 'react'
import { Typography, Grid, useMediaQuery } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from './UserProvider';
import { updateUserSettings } from '../util/utils';

function OffenseVsDefense({ userSettings, setUserSettings }) {
    const isMedium = useMediaQuery((theme) => theme.breakpoints.down('xl'));
    const { token } = React.useContext(UserContext)
    const { offenseVsDefense } = userSettings
    const setOffenseVsDefense = (value) => setUserSettings({ ...userSettings, 'offenseVsDefense': value })
    const [storedValue, setStoredValue] = React.useState(offenseVsDefense)

    const setStoredValueMeta = React.useCallback(async (value) => {
        if (value === storedValue) return
        setStoredValue(value)
        try {
            await updateUserSettings({ ...userSettings, 'offenseVsDefense': value }, token, 'nfl');
        } catch (error) {
            console.error('Failed to update user settings', error)
        }
    }, [storedValue, userSettings, token])

    React.useEffect(() => {
        if (!token) return
        const timeoutId = setTimeout(() => setStoredValueMeta(offenseVsDefense), 1200);
        return () => clearTimeout(timeoutId);
    }, [setStoredValueMeta, offenseVsDefense, token]);

    function handleChange(change) {
        if (change === 'add') {
            if (offenseVsDefense + 1 > 8) return console.log('Max players is 8')
            setOffenseVsDefense(offenseVsDefense + 1)
        }
        if (change === 'subtract') {
            if (offenseVsDefense - 1 < 0) return console.log('Min uniques is 0')
            setOffenseVsDefense(offenseVsDefense - 1)
        }
    }

    return (
        <Grid container direction='row' justifyContent='center' alignItems='center'>
            <Grid item>
                <Typography variant='body1'>{isMedium ? 'Max Offense vs. DST: ' : 'Max Offensive Players vs. Defense: '}</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleChange('subtract')}><RemoveIcon /></IconButton>
            </Grid>
            <Grid item>
                <Typography variant='body1'>{offenseVsDefense}</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleChange('add')}><AddIcon /></IconButton>
            </Grid>
        </Grid>
    )
}

export { OffenseVsDefense }