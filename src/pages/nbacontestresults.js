import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { page } from '../styles/classes'
import { Navbar } from '../components/Navbar'
import { NbaContestResultsPanel } from '../components/NbaContestResultsPanel'

function NbaContestResults() {
    const location = useLocation()
    const navigate = useNavigate()
    const { results, contestSlate } = location.state || {}

    React.useEffect(() => {
        document.title = 'DFS Opto: NBA Contest Results'
    }, [])

    if (!results) {
        navigate('/nba')
        return null
    }

    return (
        <Box sx={page}>
            <Box sx={{ px: 2, pt: 2 }}>
                <Button
                    size='small'
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/nba')}
                >
                    Back to NBA
                </Button>
            </Box>
            <Divider />
            <NbaContestResultsPanel
                results={results}
                contestSlate={contestSlate}
                onReupload={() => navigate('/nba')}
            />
        </Box>
    )
}

export default NbaContestResults
