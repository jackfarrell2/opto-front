import { Grid, Typography } from "@mui/material"
import { accent } from "../styles/colors"

function LineupCardHeader({ number, projection, salary }) {
    let salString = salary.toString();
    salString = '$' + salString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
        <Grid container style={{ color: 'white', backgroundColor: accent, height: '6vh', paddingLeft: '2vh', paddingRight: '2vh' }} direction='row' alignItems='center' justifyContent='space-between'>
            <Grid item xs={4}>
                <Typography sx={{ fontWeight: 'bold' }} variant='body1'>Lineup #{number} ({projection})</Typography>
            </Grid>
            <Grid item>
                <Typography sx={{ fontWeight: 'bold', color: '#90EE90' }} variant='body1'>{salString}</Typography>
            </Grid>
        </Grid>
    )
}

export { LineupCardHeader }