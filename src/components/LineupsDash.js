import { Grid } from "@mui/material"
import { LineupCard } from "./LineupCard"

function LineupsDash({ optimizedLineups }) {
    console.log('lineups in dash', optimizedLineups)
    return (
        <Grid container direction='row' justifyContent='flex-start' alignItems='flex-start' spacing={2}>
            {optimizedLineups.map((lineup, index) => (
                <Grid key={index} item xs={4}>
                    <LineupCard lineup={lineup} />
                </Grid>
            ))}
        </Grid>
    )
}

export { LineupsDash }