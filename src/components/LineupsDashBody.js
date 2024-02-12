import { Grid, Typography } from '@mui/material'
import { LineupCard } from './LineupCard'

function LineupsDashBody({ optimizedLineups, selectedOpto }) {

    const stringOpto = selectedOpto.toString()

    return (
        <>
            {(optimizedLineups['count'] > 0) ? (
                <Grid container direction='row' justifyContent='flex-start' alignItems='flex-start' spacing={3}>
                    {optimizedLineups[stringOpto].map((lineup, index) => (
                        <Grid key={index} item xs={4}>
                            <LineupCard lineup={lineup} index={index} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container direction='row' justifyContent='center' alignItems='center' style={{ backgroundColor: '#e5e9ed', height: '50vh', marginBottom: '4vh' }}>
                    <Grid item>
                        <Typography>You haven't optimized any lineups!</Typography>
                    </Grid>
                </Grid>
            )}
        </>
    )
}

export { LineupsDashBody }