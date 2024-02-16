import React from 'react'
import { Grid, Typography, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

function ConfirmSignUpForm({ setOpenConfirmModal }) {

    function handleClick() {
        setOpenConfirmModal(false)
    }

    return (
        <>
            <Button onClick={() => setOpenConfirmModal(false)} sx={{ color: 'primary' }}>
                <CloseIcon sx={{ color: 'primary' }} />
            </Button>
            <Grid container style={{ padding: '4.5vh' }} direction="column" justifyContent="center" alignItems="center" spacing={8}>
                <Grid item sx={{ textAlign: 'center' }}>
                    <Typography variant='h6'><span style={{ color: 'red' }}>Warning! </span>None of your optimizations, settings, or projections will save if you do not register / log in!</Typography>
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

export { ConfirmSignUpForm }