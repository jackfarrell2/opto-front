import React from 'react'
import { Box, Divider } from '@mui/material'
import { page } from '../styles/classes'
import { SecondNavbar } from '../components/SecondNavbar'
import { SlateModal } from '../components/SlateModal'
import config from '../config'

function Nba() {
    const [slateModal, setSlateModal] = React.useState(false)
    const [slates, setSlates] = React.useState([])
    const [slate, setSlate] = React.useState('')

    const apiUrl = `${config.apiUrl}` 

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
        <Box sx={page}>
            <SlateModal openModal={slateModal} setSlateModal={setSlateModal} slates={slates} />
            <Divider /> 
            <SecondNavbar setSlateModal={setSlateModal} slate={slate} slates={slates} setSlate={setSlate} setSlates={setSlates}></SecondNavbar>
            <Divider /> 
        </Box>
    )
}

export default Nba