import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { page } from '../styles/classes'
import { Navbar } from '../components/Navbar'
import { ContestResultsPanel } from '../components/ContestResultsPanel'

function ContestResults() {
    const location = useLocation()
    const navigate = useNavigate()
    const { results, contestSlate } = location.state || {}

    React.useEffect(() => {
        document.title = 'DFS Opto: Contest Results'
    }, [])

    if (!results) {
        navigate('/mlb')
        return null
    }

    return (
        <Box sx={page}>
            <Box sx={{ px: 2, pt: 2 }}>
                <Button
                    size='small'
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/mlb')}
                >
                    Back to MLB
                </Button>
            </Box>
            <Divider />
            <ContestResultsPanel
                results={results}
                contestSlate={contestSlate}
                onReupload={() => navigate('/mlb')}
            />
        </Box>
    )
}

export default ContestResults
