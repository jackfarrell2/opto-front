import { AppBar, Toolbar, Box, Button } from '@mui/material'
import { useMediaQuery, Grid } from '@mui/material'
import { logo, navLinks, buttonLink, topBar, } from '../styles/classes'
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuDrawer } from './MenuDrawer'
import { UserContext } from './UserProvider'
import horizontal from '../util/horizontal.png'


function Navbar({ handleOpen }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { user, signOut } = React.useContext(UserContext);

    return (
        <AppBar position='static'>
            <Toolbar sx={topBar}>
                <Box sx={logo}>
                    <Link to='/nba' style={{ textDecoration: 'none' }}>
                        <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
                            <img src={horizontal} alt='logo' width='200vh'></img>
                        </Grid>
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
                        <Link to='/nfl'>
                            <Button sx={buttonLink}>NFL</Button>
                        </Link>
                        {user ? (<Button onClick={() => signOut()} sx={buttonLink}>Sign Out</Button>) : (<Button onClick={handleOpen} sx={buttonLink}>Sign In</Button>)}
                    </Box>
                )}
            </Toolbar>
        </AppBar>

    )
}

export { Navbar }
