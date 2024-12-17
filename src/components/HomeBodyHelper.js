import React from 'react';
import { Grid, Typography, useMediaQuery } from '@mui/material'
import DFSOptoTutorial from '../util/DFSOptoTutorial.mp4';
import Poster from '../util/poster.png';

function HomeBodyHelper() {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' spacing={4}>
            <Grid item sx={{ marginLeft: 5, marginRight: 5 }}>
                <Typography>Need some help getting started? Check out the tutorial below!</Typography>
            </Grid>
            <Grid item>
                <video src={DFSOptoTutorial} width={isMobile ? '250' : '600'} controls poster={Poster}>
                    Your browser does not support the video tag.
                </video>
            </Grid>
        </Grid>
    )
}

export { HomeBodyHelper }