import React from 'react'
import { Box, Divider } from '@mui/material'
import { page } from '../styles/classes'
import { SecondNavbar } from '../components/SecondNavbar'

function Nba() {

    return (
        <Box sx={page}>
            <Divider /> 
            <SecondNavbar></SecondNavbar>
            <Divider /> 
        </Box>
    )
}

export default Nba