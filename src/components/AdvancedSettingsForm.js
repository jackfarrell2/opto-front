import { Button, Grid, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { MaxStack } from "./MaxStack"



function AdvancedSettingsForm({ setOpenAdvancedSettingsModal, setStackData, stackData }) {
    return (
        <>
            <Button onClick={() => setOpenAdvancedSettingsModal(false)} sx={{ color: 'primary' }}>
                <CloseIcon sx={{ color: 'primary' }} />
            </Button>
            <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2} sx={{ pb: 3 }}>
                <Grid item>
                    <Typography>Stack QB with at least:</Typography>
                </Grid>
                <Grid item>
                    <MaxStack team='same' pos='WR' setStackData={setStackData} stackData={stackData} />
                </Grid>
                <Grid item>
                    <MaxStack team='same' pos='TE' setStackData={setStackData} stackData={stackData} />
                </Grid>
                <Grid item>
                    <MaxStack team='opp' pos='WR' setStackData={setStackData} stackData={stackData} />
                </Grid>
                <Grid item>
                    <MaxStack team='opp' pos='TE' setStackData={setStackData} stackData={stackData} />
                </Grid>
            </Grid>
        </>
    )
}

export { AdvancedSettingsForm }