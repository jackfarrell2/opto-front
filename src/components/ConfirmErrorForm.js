import React from 'react'
import { Grid, Typography, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

function ConfirmErrorForm({ setOpenConfirmModal, successfullLineupCount, setFailedSuccessLineups }) {

    function handleClick() {
        setOpenConfirmModal(false)
        setFailedSuccessLineups(0)
    }

    return (
        <>
            <Button onClick={() => setOpenConfirmModal(false)} sx={{ color: 'primary' }}>
                <CloseIcon sx={{ color: 'primary' }} />
            </Button>
            <Grid container sx={{ p: 2 }} direction="column" justifyContent="center" alignItems="center" spacing={8}>
                <Grid item sx={{ textAlign: 'center' }}>
                    {successfullLineupCount > 0 ? (<Typography variant='h6'>We were able to build only {successfullLineupCount} lineup{(successfullLineupCount === 1) ? '' : <span>s</span>} with the given constraints!</Typography>) :
                        (<Typography variant='h6'><span style={{ color: 'red' }}>Warning! </span>It was impossible to build any lineups with the given constraints!</Typography>)}
                </Grid>
                <Grid item>
                    <Typography variant='body1'>Please adjust your constraints.</Typography>
                </Grid>
                <Grid item>
                    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                            <Button onClick={handleClick} variant='contained'>Got it!</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export { ConfirmErrorForm }