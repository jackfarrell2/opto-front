import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';


function HomeBody() {
    return (
        <Box>
            <Grid container direction='row' justifyContent='center' alignItems='center' spacing={5} sx={{ p: 6 }}>
                <Grid item xs={12}>
                    <Typography style={{ fontFamily: 'Lexend Deca' }} align='center' variant='h3' component={'h1'}>Welcome to DFS Opto!</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography align='center' variant='body1' paragraph>We’re so excited you’ve joined our community. Here, you can easily generate optimal DraftKings lineups in bulk—absolutely free—and export them at no extra charge. Ready to play? Choose your favorite sport below and let’s get started!</Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <Grid container direction='row' justifyContent='center' alignItems='center' spacing={0}>
                        <Grid item xs={4}>
                            <Link to='/nfl'>
                                <Button variant='contained'>NFL<SportsFootballIcon sx={{ ml: 1 }} /></Button>
                            </Link>
                        </Grid>
                        <Grid item xs={4}>
                            <Link to='/nba'>
                                <Button variant='contained'>NBA<SportsBasketballIcon sx={{ ml: 1 }} /></Button>
                            </Link>
                        </Grid>
                        <Grid item xs={4}>
                            <Link to='mlb'>
                                <Button variant='contained'>MLB<SportsBaseballIcon sx={{ ml: 1 }} /></Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export { HomeBody }