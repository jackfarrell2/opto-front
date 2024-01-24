import React from 'react'
import { Box, Divider, Grid, CircularProgress } from '@mui/material'
import { page } from '../styles/classes'
import { SecondNavbar } from '../components/SecondNavbar'
import { SlateModal } from '../components/SlateModal'
import { SlateInfo } from '../components/SlateInfo'
import config from '../config'
import { useQuery } from 'react-query'
import { PlayerRow } from '../components/PlayerRow'

function Nba() {
    const [slateModal, setSlateModal] = React.useState(false)
    const [slate, setSlate] = React.useState('')
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
                    {slate && <SlateInfo slate={slate} />}
                    {/* <table>
                        <thead>
                            <tr>
                                <th>blah</th>
                            </tr>
                        </thead>
                        <tbody>
                            <PlayerRow />
                        </tbody>
                    </table> */}
                </>
            )}
        </Box>
    )
}

export default Nba