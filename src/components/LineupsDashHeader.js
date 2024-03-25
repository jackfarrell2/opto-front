import React from 'react'
import { Grid, Typography, Button, useMediaQuery } from '@mui/material';
import { ScrollableOptoTabs } from './ScrollableOptoTabs';
import { ConfirmOptoModal } from './ConfirmOptoModal'

function LineupsDashHeader({ sport, optoCount, setSelectedOpto, selectedOpto, slate, setOptimizedLineups, setExposures, selectedLineups }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const isXtraSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [openConfirmModal, setOpenConfirmModal] = React.useState(false)
    const mlbMappings = { 'P1': 'P', 'P2': 'P', 'C': 'C', 'FB': '1B', 'SB': '2B', 'TB': '3B', 'SS': 'SS', 'OF1': 'OF', 'OF2': 'OF', 'OF3': 'OF' }

    const handleExport = () => {
        let headers = ["PG", "SG", "SF", "PF", "C", "G", "F", "UTIL"]
        let newHeaders = ["PG", "SG", "SF", "PF", "C", "G", "F", "UTIL"]
        if (sport === 'mlb') {
            headers = ["P1", "P2", "C", "FB", "SB", "TB", "SS", "OF1", "OF2", "OF3"]
            newHeaders = headers.map(header => mlbMappings[header])
        }
        let csvContent = newHeaders.join(",") + "\n"
        selectedLineups.forEach(lineup => {
            const lineupValues = headers.map(position => {
                const player = lineup[position];
                return `${player.name} (${player['dk-id']})`;
            });
            csvContent += lineupValues.join(",") + "\n";
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
            <ConfirmOptoModal sport={sport} setOptimizedLineups={setOptimizedLineups} setExposures={setExposures} openConfirmModal={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal} slate={slate} />
            <Grid container style={{ backgroundColor: '#92a3b8' }} direction='row' justifyContent='flex-start' alignItems='center'>
                {!isXtraSmall && (
                    <Grid item sm={2} md={2.5} lg={2} xl={2}>
                        <Grid container justifyContent='flex-start' alignItems='center'>
                            <Grid item>
                                <Typography sx={{ ml: '3vh', color: '#352311' }}>{isMobile ? 'Lineups' : 'Lineup Dashboard'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
                <Grid item xs={6} sm={6} md={6} lg={7} xl={8}>
                    <ScrollableOptoTabs optoCount={optoCount} setSelectedOpto={setSelectedOpto} selectedOpto={selectedOpto} />
                </Grid>
                <Grid item xs={6} sm={4} md={3.5} lg={3} xl={2}>
                    <Grid container justifyContent='flex-end' alignItems='center' spacing={2}>
                        <Grid item>
                            <Button size='small' onClick={() => setOpenConfirmModal(true)} variant='contained' color='error'>{isMobile ? 'Clear' : 'Clear Lineups'}</Button>
                        </Grid>
                        <Grid item style={{ marginRight: '2.5vh' }}>
                            <Button onClick={handleExport} disabled={!selectedLineups} size='small' variant='contained' color='success'>{isMobile ? 'Export' : 'Export Lineups'}</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export { LineupsDashHeader }