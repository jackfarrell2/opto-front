import React from 'react';
import { LineupsDashHeader } from "./LineupsDashHeader";
import { LineupsDashBody } from "./LineupsDashBody";
import { Grid } from '@mui/material';

function LineupsDash({ sport, optimizedLineups, selectedOpto, setSelectedOpto, slate, setOptimizedLineups, setExposures }) {
    const optoCount = optimizedLineups['count'] || 0;

    return (
        <Grid container direction='row' justifyContent='center' alignItems='center' spacing={0}>
            <Grid item xs={12} style={{ width: '100%', backgroundColor: '#92a3b8', marginTop: '2vh' }}>
                <LineupsDashHeader sport={sport} selectedLineups={optimizedLineups[selectedOpto]} setExposures={setExposures} setOptimizedLineups={setOptimizedLineups} optoCount={optoCount} selectedOpto={selectedOpto} setSelectedOpto={setSelectedOpto} slate={slate} />
            </Grid>
            <Grid item xs={12} style={{ width: '100%', marginBottom: '5vh' }}>
                <LineupsDashBody optimizedLineups={optimizedLineups} selectedOpto={selectedOpto} />
            </Grid>
        </Grid >
    );
}

export { LineupsDash };
