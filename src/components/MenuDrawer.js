import React, { useState } from 'react'
import { Drawer, List, ListItem, ListItemText, Divider, IconButton, } from '@mui/material'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { drawerItem } from '../styles/classes'
import { UserContext } from './UserProvider'


function MenuDrawer({ handleOpen }) {
    const { user, signOut } = React.useContext(UserContext);
    const [openDrawer, setOpenDrawer] = useState(false)
    function openLoginForm() {
        handleOpen();
        setOpenDrawer(false)
    }
    function handleSignOut() {
        signOut();
        setOpenDrawer(false)
    }
    return (
        <>
            <Drawer open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <List>
                    <ListItem onClick={() => setOpenDrawer(false)}>
                        <ListItemText>
                            <Link to='/' style={drawerItem}>Home</Link>
                        </ListItemText>
                    </ListItem>
                    <Divider />
                    {/* <ListItem onClick={() => setOpenDrawer(false)}>
                        <ListItemText>
                            <Link to='/mlb' style={drawerItem}>MLB</Link>
                        </ListItemText>
                    </ListItem>
                    <Divider /> */}
                    <ListItem onClick={() => setOpenDrawer(false)}>
                        <ListItemText>
                            <Link to='/nba' style={drawerItem}>NBA</Link>
                        </ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText>
                            {user ? (<Link to='/' onClick={handleSignOut} style={drawerItem}>Log Out</Link>) : (<Link to='/' onClick={openLoginForm} style={drawerItem}>Log In</Link>)}
                        </ListItemText>
                    </ListItem>
                    <Divider />
                </List>
            </Drawer>
            <IconButton sx={{ color: 'white' }} onClick={() => setOpenDrawer(!openDrawer)}>
                <MenuIcon />
            </IconButton>
        </>
    )
}

export { MenuDrawer }