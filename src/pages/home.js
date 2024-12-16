import React from 'react'
import courtsHoriz from '../util/courtsHoriz.jpg'
import { page } from '../styles/classes'
import { Box, Grid, useMediaQuery } from '@mui/material'
import { HomeBody } from '../components/HomeBody'
import { HomeBodyHelper } from '../components/HomeBodyHelper'

function Home() {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('xl'));
    return (
        <Box sx={page}>
            <Grid style={{ height: '100vh' }} container direction='row' justifyContent='center' alignItems='stretch' spacing={10}>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                    <Grid style={{ height: '100%' }} container direction='row' justifyContent='center' alignItems='flex-start'>
                        <Grid item xs={12}>
                            <HomeBody />
                        </Grid>
                        <Grid item xs={12}>
                            <HomeBodyHelper />
                        </Grid>
                    </Grid>
                </Grid>
                {!isMobile && (
                    <Grid item lg={6}>
                        <Box component='img' src={courtsHoriz} alt='basketball-courts' sx={{ width: '100%', height: '100%', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}

export default Home