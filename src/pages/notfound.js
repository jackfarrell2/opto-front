import { Box, Grid, Typography, useMediaQuery } from '@mui/material'
import { page } from '../styles/classes'
import basError from '../util/basError.jpg'


function NotFound() {
    console.log('404 page triggered')

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const picWidth = isMobile ? '200px' : '400px';

    return (
        <Box sx={page}>
            <Grid container direction='column' justifyContent='flex-start' alignItems='center' spacing={4}>
                <Grid item>
                    <Typography variant='h4' sx={{ m: 4, p: 2 }}>404 - No Opto's Available</Typography>
                </Grid>
                <Grid item>
                    <img src={basError} width={picWidth} height="auto" alt="nick-green-jacket"></img>
                </Grid>
            </Grid>
        </Box>
    )
}

export default NotFound