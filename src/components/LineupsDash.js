import React from 'react';
import { LineupsDashHeader } from "./LineupsDashHeader";
import { LineupsDashBody } from "./LineupsDashBody";
import { Grid } from '@mui/material';

function LineupsDash({ optimizedLineups, selectedOpto, setSelectedOpto, slate }) {
    const optoCount = optimizedLineups['count'] || 0;

    return (
        <Grid container direction='row' justifyContent='center' alignItems='center' spacing={0} style={{ marginTop: '5vh', marginBottom: '5vh' }}>
            <Grid item xs={12} style={{ width: '100%', backgroundColor: '#92a3b8' }}>
                <LineupsDashHeader optoCount={optoCount} selectedOpto={selectedOpto} setSelectedOpto={setSelectedOpto} slate={slate} />
            </Grid>
            <Grid item xs={12} style={{ width: '100%' }}>
                <LineupsDashBody optimizedLineups={optimizedLineups} selectedOpto={selectedOpto} />
            </Grid>
        </Grid >
    );
}

export { LineupsDash };
