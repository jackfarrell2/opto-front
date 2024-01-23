import React from "react"
import { AppBar, Toolbar, IconButton } from "@mui/material"
import { secondaryNav } from "../styles/classes"
import { SlateSelector } from "./SlateSelector";
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

function SecondNavbar({setSlateModal, slate, slates, setSlate, setSlates}) {
    const theme = useTheme()
    
    return (
        <AppBar position='static' sx={secondaryNav}>
            <Toolbar>
                <SlateSelector slates={slates} slate={slate} handleSlateChange={(newSlate) => setSlate(newSlate)} />
                <IconButton sx={{ color: theme.palette.primary.main }} onClick={() => setSlateModal(true)}><AddIcon /></IconButton>
            </Toolbar>
        </AppBar>
    )
}

export { SecondNavbar }