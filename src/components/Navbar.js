import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import { useMediaQuery } from '@mui/material'
import { logo, navLinks, buttonLink, topBar, logoLink, } from '../styles/classes'
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuDrawer } from './MenuDrawer'
import { UserContext } from './UserProvider'


function Navbar({handleOpen}) {  
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
                            <Typography sx={logoLink} variant='h5'>DFS Optomizer</Typography>
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

export {Navbar}
