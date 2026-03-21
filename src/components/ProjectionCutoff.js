import React from 'react'
import { Typography, Grid, TextField } from '@mui/material'
import { UserContext } from './UserProvider'
import { updateUserSettings } from '../util/utils'

function ProjectionCutoff({ sport, userSettings, setUserSettings }) {
    const { token } = React.useContext(UserContext)
    const cutoff = userSettings['projection-cutoff']
    const [storedValue, setStoredValue] = React.useState(cutoff)

    const setStoredValueMeta = React.useCallback(async (value) => {
        if (value === storedValue) return
        setStoredValue(value)
        try {
            await updateUserSettings({ ...userSettings, 'projection-cutoff': value }, token, sport)
        } catch (error) {
            console.error('Failed to update user settings', error)
        }
    }, [storedValue, userSettings, token, sport])

    React.useEffect(() => {
        if (!token) return
        const timeoutId = setTimeout(() => setStoredValueMeta(cutoff), 1200)
        return () => clearTimeout(timeoutId)
    }, [setStoredValueMeta, cutoff, token])

    function handleChange(e) {
        const val = e.target.value
        if (val === '') {
            setUserSettings({ ...userSettings, 'projection-cutoff': '' })
            return
        }
        const num = parseFloat(val)
        if (isNaN(num)) return
        setUserSettings({ ...userSettings, 'projection-cutoff': num })
    }

    return (
        <Grid container direction='row' justifyContent='center' alignItems='center' spacing={1}>
            <Grid item>
                <Typography variant='body1'>Projection Cutoff:</Typography>
            </Grid>
            <Grid item>
                <TextField
                    value={cutoff}
                    onChange={handleChange}
                    variant='standard'
                    inputProps={{ style: { textAlign: 'center', width: '4ch' } }}
                    size='small'
                />
            </Grid>
        </Grid>
    )
}

export { ProjectionCutoff }
