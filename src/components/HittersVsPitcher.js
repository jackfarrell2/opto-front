import React from 'react'
import { Typography, Grid, useMediaQuery } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from './UserProvider';
import { updateUserSettings } from '../util/utils';

function HittersVsPitcher({ userSettings, setUserSettings }) {
    const isMedium = useMediaQuery((theme) => theme.breakpoints.down('xl'));
    const { token } = React.useContext(UserContext)
    const { hittersVsPitcher } = userSettings
    const setHittersVsPitcher = (value) => setUserSettings({ ...userSettings, 'hittersVsPitcher': value })
    const [storedValue, setStoredValue] = React.useState(hittersVsPitcher)

    const setStoredValueMeta = React.useCallback(async (value) => {
        if (value === storedValue) return
        setStoredValue(value)
        try {
            await updateUserSettings({ ...userSettings, 'hittersVsPitcher': value }, token, 'mlb');
        } catch (error) {
            console.error('Failed to update user settings', error)
        }
    }, [storedValue, userSettings, token])

    React.useEffect(() => {
        if (!token) return
        const timeoutId = setTimeout(() => setStoredValueMeta(hittersVsPitcher), 1200);
        return () => clearTimeout(timeoutId);
    }, [setStoredValueMeta, hittersVsPitcher, token]);

    function handleChange(change) {
        if (change === 'add') {
            if (hittersVsPitcher + 1 > 5) return console.log('Max hitters is 5')
            setHittersVsPitcher(hittersVsPitcher + 1)
        }
        if (change === 'subtract') {
            if (hittersVsPitcher - 1 < 0) return console.log('Min uniques is 0')
            setHittersVsPitcher(hittersVsPitcher - 1)
        }
    }

    return (
        <Grid container direction='row' justifyContent='center' alignItems='center'>
            <Grid item>
                <Typography variant='body1'>{isMedium ? 'Max Hitters vs. Pitcher: ' : 'Maximum Hitters vs. Pitcher: '}</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleChange('subtract')}><RemoveIcon /></IconButton>
            </Grid>
            <Grid item>
                <Typography variant='body1'>{hittersVsPitcher}</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleChange('add')}><AddIcon /></IconButton>
            </Grid>
        </Grid>
    )
}

export { HittersVsPitcher }