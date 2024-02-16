import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import { useMediaQuery, Grid } from '@mui/material'
import { logo, navLinks, buttonLink, topBar, logoLink, } from '../styles/classes'
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuDrawer } from './MenuDrawer'
import { UserContext } from './UserProvider'
import SportsFootballOutlinedIcon from '@mui/icons-material/SportsFootballOutlined';
import { secondary } from '../styles/colors'


function Navbar({ handleOpen }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { user, signOut } = React.useContext(UserContext);

    return (
        <AppBar position='static'>
            <Toolbar sx={topBar}>
                <Box sx={logo}>
                    <Link to='/' style={{ textDecoration: 'none' }}>
                        {isMobile ? (
                            <Typography sx={logoLink} variant='h5'>DFS Opto</Typography>
                        ) : (
                            <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
                                <SportsFootballOutlinedIcon fontSize='large' sx={{ color: secondary, marginRight: '1vh' }} />
                                <Typography sx={logoLink} variant='h5'>DFS Opto</Typography>
                            </Grid>
                        )}
                    </Link>
                </Box>
                {isMobile ? (
                    <MenuDrawer handleOpen={handleOpen}></MenuDrawer>
                ) : (
                    <Box sx={navLinks}>
                        <Link to='/nba'>
                            <Button sx={buttonLink}>NBA</Button>
                        </Link>
                        <Link to='/mlb'>
                            <Button sx={buttonLink}>MLB</Button>
                        </Link>
                        {user ? (<Button onClick={() => signOut()} sx={buttonLink}>Log Out</Button>) : (<Button onClick={handleOpen} sx={buttonLink}>Sign In</Button>)}
                    </Box>
                )}
            </Toolbar>
        </AppBar>

    )
}

export { Navbar }
