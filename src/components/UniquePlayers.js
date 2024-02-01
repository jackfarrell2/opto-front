import React from 'react'
import { Typography, Grid } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

function UniquePlayers({ uniques, setUniques }) {
    const initialRender = React.useRef(true)
    localStorage.setItem('uniquePlayers', uniques)
    const [storedValue, setStoredValue] = React.useState(uniques)

    React.useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false
            return
        }

        const timeOutId = setTimeout(() => setStoredValue(parseInt(uniques)), 1500);
        return () => clearTimeout(timeOutId);
    }, [uniques])

    React.useEffect(() => {
        if (initialRender.current) {
            return;
        }
        localStorage.setItem('uniquePlayers', storedValue.toString())
        console.log('storing', storedValue)
        console.log('putting')
    }, [storedValue])


    // React.useEffect(() => {
    //     const timeOutId = setTimeout(() => setStoredValue(parseInt(uniques)), 1500);
    //     return () => clearTimeout(timeOutId);
    // }, [uniques])

    // React.useEffect(() => {
    //     localStorage.setItem('uniquePlayers', storedValue.toString())
    //     console.log('storing', storedValue)
    //     console.log('putting')
    // }, [storedValue])

    function handleChange(change) {
        if (change === 'add') {
            if (uniques + 1 > 8) return console.log('Max uniques is 8')
            setUniques(uniques + 1)
            // const timeoutId = setTimeout(() => setStoredValue(parseInt(uniques + 1)), 1500);
            // return () => clearTimeout(timeoutId);
        }
        if (change === 'subtract') {
            if (uniques - 1 < 1) return console.log('Min uniques is 1')
            setUniques(uniques - 1)
            // const timeoutId = setTimeout(() => setStoredValue(parseInt(uniques - 1)), 1500);
            // return () => clearTimeout(timeoutId);
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