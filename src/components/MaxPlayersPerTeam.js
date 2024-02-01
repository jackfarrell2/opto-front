import React from 'react'
import { Typography, Grid } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

function MaxPlayersPerTeam({ playersPerTeam, setPlayersPerTeam }) {


    // React.useEffect(() => {
    //     localStorage.setItem('maxPlayersPerTeam', players.toString())
    // }, [players])


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
                <Typography variant='body1'>Maximum Players Per Team: </Typography>
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