import React from "react"
import { AppBar, Toolbar, } from "@mui/material"
import { secondaryNav } from "../styles/classes"
import { SlateSelector } from "./SlateSelector";
import config from "../config";

function SecondNavbar() {
    const apiUrl = `${config.apiUrl}` 
    const [slates, setSlates] = React.useState([])
    const [slate, setSlate] = React.useState('')

    React.useEffect(() => {
        fetch(`${apiUrl}nba/slates`)
            .then((response) => response.json())
            .then((data) => {
                const dirtySlates = data
                const cleanSlates = dirtySlates.map(obj => obj.name); 
                setSlates(cleanSlates)
                setSlate(cleanSlates[0])
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [apiUrl]) 

    return (
        <AppBar position='static' sx={secondaryNav}>
            <Toolbar>
                <SlateSelector slates={slates} slate={slate} handleSlateChange={(event) => setSlate(event.target.value)} />
            </Toolbar>
        </AppBar>
    )
}

export { SecondNavbar }