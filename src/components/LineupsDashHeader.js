import React from 'react'
import { Grid, Typography, Button } from '@mui/material';
import { ScrollableOptoTabs } from './ScrollableOptoTabs';
import { ConfirmOptoModal } from './ConfirmOptoModal'

function LineupsDashHeader({ optoCount, setSelectedOpto, selectedOpto, slate, setOptimizedLineups, setExposures }) {
    const [openConfirmModal, setOpenConfirmModal] = React.useState(false)

    return (
        <>
            <ConfirmOptoModal setOptimizedLineups={setOptimizedLineups} setExposures={setExposures} openConfirmModal={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal} slate={slate} />
            <Grid container style={{ backgroundColor: '#92a3b8' }} direction='row' justifyContent='space-between' alignItems='center'>
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
                    <Grid container justifyContent='flex-end' alignItems='center' spacing={2}>
                        <Grid item>
                            <Button size='small' onClick={() => setOpenConfirmModal(true)} variant='contained' color='error'>Clear Lineups</Button>
                        </Grid>
                        <Grid item style={{ marginRight: '2.5vh' }}>
                            <Button size='small' variant='contained' color='success'>Export Lineups</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export { LineupsDashHeader }