import { Box, Typography } from '@mui/material'
import { page } from '../styles/classes'
import React from 'react'

function Home() {

    React.useEffect(() => {
        document.title = "DFS Opto: Home";
    }, []);

    return (
        <Box sx={page}>
            <Typography>This will be the home page.</Typography>
        </Box>
    )
}

export default Home