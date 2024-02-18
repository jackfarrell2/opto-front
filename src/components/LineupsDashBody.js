import React from 'react'
import { Grid, Typography } from '@mui/material'
import { LineupCard } from './LineupCard'

function LineupsDashBody({ optimizedLineups, selectedOpto }) {

    const stringOpto = selectedOpto.toString()

    const memoizedLineups = React.useMemo(() => optimizedLineups[stringOpto] || [], [optimizedLineups, stringOpto]);

    return (
        <>
            {(memoizedLineups.length > 0) ? (
                <Grid container direction='row' justifyContent='flex-start' alignItems='flex-start' spacing={0} style={{ backgroundColor: '#e5e9ed', paddingLeft: '2.5vh', paddingRight: '2.5vh', paddingTop: '1.25vh', paddingBottom: '2vh' }}>
                    {memoizedLineups.map((lineup, index) => (
                        <Grid item style={{ padding: 0 }} key={index} xs={12} sm={12} md={6} lg={4}>
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