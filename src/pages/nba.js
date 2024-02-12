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
    const [optimizedLineups, setOptimizedLineups] = React.useState({ 'count': 0 })
    const [exposures, setExposures] = React.useState({})
    const [selectedOpto, setSelectedOpto] = React.useState(1)
    const apiUrl = `${config.apiUrl}`

    // Fetch slates
    const { data: slates, isLoading: slatesLoading } = useQuery('slates', async () => {
        const response = await fetch(`${apiUrl}nba/slates`)
        if (!response.ok) {
            throw new Error('Failed to fetch slates')
        }
        const data = await response.json()
        if (data.length > 0) {
            const lastSlate = localStorage.getItem('lastSlate');
            if (lastSlate) {
                const slate = data.find(slate => slate.id === lastSlate)
                if (slate) {
                    setSlate(slate)
                } else {
                    setSlate(data[0])
                }
            } else {
                setSlate(data[0])
            }
        }
        return data
    },
        {
            // Fetch once
            staleTime: Infinity
        });

    return (
        <Box sx={page}>
            {slate && (<SlateModal slate={slate} openModal={slateModal} setSlateModal={setSlateModal} slates={slates} />)}
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
                    {slate && <SlateInfo key={slate.id} setSelectedOpto={setSelectedOpto} selectedOpto={selectedOpto} slate={slate} exposures={exposures} optimizedLineups={optimizedLineups} setOptimizedLineups={setOptimizedLineups} setExposures={setExposures} />}
                    {slate && <LineupsDash optimizedLineups={optimizedLineups} selectedOpto={selectedOpto} setSelectedOpto={setSelectedOpto} />}
                </>
            )}
        </Box>
    )
}

export default Nba