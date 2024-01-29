import { Grid,Typography, IconButton, TextField } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

function SimpleSettings() {
    return(
        <Grid container direction='column' justifyContent='center' alignItems='center'>
            <Grid item>
                <TextField id="min-salary" label="Number of Lineups" variant="filled" />
            </Grid>
            <Grid item>
                <Grid container direction='row' justifyContent='center' alignItems='center'>
                    <Typography variant='body1'>Unique Players Per Lineup: </Typography>
                    <IconButton><RemoveIcon /></IconButton>
                    <Typography variant='body1'>3</Typography>
                    <IconButton><AddIcon /></IconButton>
                </Grid>
            </Grid>
            <Grid container direction='row' justifyContent='center' alignItems='center'>
                <Typography variant='body1'>Maximum Players Per Team: </Typography>
                <IconButton><RemoveIcon /></IconButton>
                <Typography variant='body1'>6</Typography>
                <IconButton><AddIcon /></IconButton>
            </Grid>
            <Grid item>
                <TextField id="min-salary" label="Minimum Salary" variant="filled" />
            </Grid>
            <Grid item>
                <TextField id="max-salary" label="Maximum Salary" variant="filled" />
            </Grid>
        </Grid>
    )
}

export { SimpleSettings }