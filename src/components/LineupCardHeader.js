import { Grid, Typography } from "@mui/material"

function LineupCardHeader({number, projection, salary}) {
    return (
        <Grid container direction='row' alignItems='center' justifyContent='space-between'>
            <Grid item xs={4}>
                <Typography variant='body1'>Lineup #{number} ({projection})</Typography>
            </Grid>
            <Grid item>
                <Typography variant='body1'>${salary}</Typography>
            </Grid>
        </Grid>
    )
}

export { LineupCardHeader }