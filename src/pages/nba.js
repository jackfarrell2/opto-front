import React from 'react'
import { Box, Divider, Grid, CircularProgress } from '@mui/material'
import { page } from '../styles/classes'
import { SecondNavbar } from '../components/SecondNavbar'
import { SlateModal } from '../components/SlateModal'
import { SlateInfo } from '../components/SlateInfo'
import config from '../config'
import { useQuery } from 'react-query'
import { LineupsDash } from '../components/LineupsDash'

function Nba() {
    const [slateModal, setSlateModal] = React.useState(false)
    const [slate, setSlate] = React.useState('')
    const [optimizedLineup, setOptimizedLineup] = React.useState('')
    const apiUrl = `${config.apiUrl}` 

    const { data: slates, isLoading: slatesLoading } = useQuery('slates', async () => {
        const response = await fetch(`${apiUrl}nba/slates`)
        if (!response.ok) {
            throw new Error('Failed to fetch slates')
        }
        const data = await response.json()
        if (data.length > 0) {
            setSlate(data[0])
        }
        return data
    });

    // const testLineup = {
    //     "PG": {
    //         "name": "Ja Morant",
    //         "salary": 3000,
    //         "projection": 46.67,
    //         "ownership": 0,
    //         "team": "MEM",
    //         "opponent": "CHI"
    //     },
    //     "SG": {
    //         "name": "Marcus Smart",
    //         "salary": 3000,
    //         "projection": 28.31,
    //         "ownership": 0,
    //         "team": "MEM",
    //         "opponent": "CHI"
    //     },
    //     "SF": {
    //         "name": "Scottie Barnes",
    //         "salary": 8300,
    //         "projection": 45.56,
    //         "ownership": 0,
    //         "team": "TOR",
    //         "opponent": "NYK"
    //     },
    //     "PF": {
    //         "name": "Victor Wembanyama",
    //         "salary": 8700,
    //         "projection": 45.34,
    //         "ownership": 0,
    //         "team": "SAS",
    //         "opponent": "WAS"
    //     },
    //     "C": {
    //         "name": "Mitchell Robinson",
    //         "salary": 3000,
    //         "projection": 25.38,
    //         "ownership": 0,
    //         "team": "NYK",
    //         "opponent": "TOR"
    //     },
    //     "G": {
    //         "name": "Desmond Bane",
    //         "salary": 3000,
    //         "projection": 41.63,
    //         "ownership": 0,
    //         "team": "MEM",
    //         "opponent": "CHI"
    //     },
    //     "F": {
    //         "name": "Julius Randle",
    //         "salary": 8700,
    //         "projection": 44.21,
    //         "ownership": 0,
    //         "team": "NYK",
    //         "opponent": "TOR"
    //     },
    //     "UTIL": {
    //         "name": "Joel Embiid",
    //         "salary": 11500,
    //         "projection": 64.57,
    //         "ownership": 0,
    //         "team": "PHI",
    //         "opponent": "CHA"
    //     },
    //     "total_salary": 49200,
    //     "total_projection": 341.67
    // }

    return (
        <Box sx={page}>
            <SlateModal openModal={slateModal} setSlateModal={setSlateModal} slates={slates} />
            <Divider /> 
            {(slatesLoading || !slate) ? (
                <Grid container justifyContent="center" alignItems="center" sx={{ height: '75vh' }}>
                    <Grid item>
                        <CircularProgress size={150} />
                    </Grid>
                </Grid>
            ) : (
                <>
                    <SecondNavbar setSlateModal={setSlateModal} slate={slate} slates={slates || []} setSlate={setSlate}></SecondNavbar>
                    <Divider /> 
                    {slate && <SlateInfo slate={slate} setOptimizedLineup={setOptimizedLineup} optimizedLineup={optimizedLineup} />}
                    {optimizedLineup && (
                        <LineupsDash lineup={optimizedLineup} />
                    )}        
                </>
            )}
        </Box>
    )
}

export default Nba