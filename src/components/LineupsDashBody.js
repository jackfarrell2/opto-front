import React from 'react'
import { Grid, Typography } from '@mui/material'
import { LineupCard } from './LineupCard'

function LineupsDashBody({ optimizedLineups, selectedOpto }) {

    const stringOpto = selectedOpto.toString()

    const memoizedLineups = React.useMemo(() => optimizedLineups[stringOpto] || [], [optimizedLineups, stringOpto]);

    return (
        <>
            {(memoizedLineups.length > 0) ? (
                <Grid container direction='row' justifyContent='flex-start' alignItems='flex-start' spacing={0} style={{ backgroundColor: '#e5e9ed' }}>
                    {memoizedLineups.map((lineup, index) => (
                        <Grid item key={index} xs={4}>
                            <LineupCard lineup={lineup} index={index} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container direction='row' justifyContent='center' alignItems='center' style={{ backgroundColor: '#e5e9ed', minHeight: '50vh' }}>
                    <Grid item>
                        <Typography>You haven't optimized any lineups!</Typography>
                    </Grid>
                </Grid>
            )}
        </>
    )
}

export { LineupsDashBody }