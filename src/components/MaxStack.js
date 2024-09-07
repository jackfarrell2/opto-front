import React from 'react'
import { Typography, Grid, useMediaQuery } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

function MaxStack({ team, pos, setStackData, stackData }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const posType = `${pos}-${team}`
    function setGlobalMinPlayers(value) {
        setStackData({ ...stackData, [posType]: value })
    }
    let maxPlayers = 5
    if (team === 'same') {
        if (pos === 'WR') {
            maxPlayers = 3
        } else if (pos === 'TE') {
            maxPlayers = 2
        }
    } else if (team === 'opp') {
        if (pos === 'WR') {
            maxPlayers = 2
        } else if (pos === 'TE') {
            maxPlayers = 1
        }
    }

    function handleChange(change) {
        const selectedMinPlayers = stackData[posType]
        if (change === 'add') {
            if (selectedMinPlayers + 1 > maxPlayers) return console.log(`Max ${pos}'s from same team is 3`)
            setGlobalMinPlayers(selectedMinPlayers + 1)
        }
        if (change === 'subtract') {
            if (selectedMinPlayers - 1 < 0) return console.log(`Min ${pos}'s from same team is 0`)
            setGlobalMinPlayers(selectedMinPlayers - 1)
        }
    }

    return (
        <Grid container direction='row' justifyContent='center' alignItems='center'>
            {(team === 'same') && (
                <Grid item>
                    {isMobile ? (<Typography variant='body1'>{`${pos}'s (same team):`}</Typography>) : (<Typography variant='body1'>{`${pos}'s from the same team:`}</Typography>)}
                </Grid>
            )}
            {(team === 'opp') && (
                <Grid item>
                    {isMobile ? (<Typography variant='body1'>{`${pos}'s (same team):`}</Typography>) : (<Typography variant='body1'>{`${pos}'s from the same team:`}</Typography>)}
                </Grid>
            )}
            <Grid item>
                <IconButton onClick={() => handleChange('subtract')}><RemoveIcon /></IconButton>
            </Grid>
            <Grid item>
                <Typography variant='body1'>{stackData[posType]}</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleChange('add')}><AddIcon /></IconButton>
            </Grid>
        </Grid>
    )
}

export { MaxStack }