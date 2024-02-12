import React from 'react'
import { Box, Grid, Typography, Button } from '@mui/material';
import { ScrollableOptoTabs } from './ScrollableOptoTabs';
import { ConfirmOptoModal } from './ConfirmOptoModal'

function LineupsDashHeader({ optoCount, setSelectedOpto, selectedOpto }) {
    const [openConfirmModal, setOpenConfirmModal] = React.useState(false)

    return (
        <>
            <ConfirmOptoModal openConfirmModal={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal} />
            <Box sx={{ height: '7.5vh', backgroundColor: '#92a3b8', mt: 5 }}>
                <Grid style={{ height: '100%' }} container direction='row' justifyContent='space-between' alignItems='center'>
                    <Grid item xs={2}>
                        <Grid container justifyContent='flex-start' alignItems='center'>
                            <Grid item>
                                <Typography sx={{ ml: '3vh', color: '#352311' }}>Lineup Dashboard</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={7}>
                        <ScrollableOptoTabs optoCount={optoCount} setSelectedOpto={setSelectedOpto} selectedOpto={selectedOpto} />
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container style={{ paddingRight: '2vh' }} justifyContent='flex-end' alignItems='center' spacing={2}>
                            <Grid item>
                                <Button onClick={() => setOpenConfirmModal(true)} variant='contained' color='error'>Clear Lineups</Button>
                            </Grid>
                            <Grid item>
                                <Button variant='contained' color='success'>Export Lineups</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box >
        </>
    )
}

export { LineupsDashHeader }