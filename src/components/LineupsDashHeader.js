import React from 'react'
import { Grid, Typography, Button } from '@mui/material';
import { ScrollableOptoTabs } from './ScrollableOptoTabs';
import { ConfirmOptoModal } from './ConfirmOptoModal'

function LineupsDashHeader({ optoCount, setSelectedOpto, selectedOpto, slate, setOptimizedLineups, setExposures, selectedLineups }) {
    const [openConfirmModal, setOpenConfirmModal] = React.useState(false)

    const handleExport = () => {
        const headers = ["PG", "SG", "SF", "PF", "C", "G", "F", "UTIL"]
        let csvContent = headers.join(",") + "\n"
        selectedLineups.forEach(lineup => {
            const lineupValues = headers.map(position => {
                const player = lineup[position]
                return `${player.name} (${player['dk-id']})`
            });
            csvContent += lineupValues.join(",") + "\n"
        })

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'lineups.csv';
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

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
                            <Button onClick={handleExport} disabled={!selectedLineups} size='small' variant='contained' color='success'>Export Lineups</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export { LineupsDashHeader }