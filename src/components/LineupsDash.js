import { Grid } from "@mui/material"
import { LineupCard } from "./LineupCard"

function LineupsDash(lineup) {
    return (
        <Grid container direction='row' justifyContent='flex-start' alignItems='flex-start' spacing={2}>
            <Grid item xs={4}>
                <LineupCard lineup={lineup['lineup']} />
            </Grid>
        </Grid>
    )
}

export { LineupsDash }