import React from 'react'
import { Grid, Typography, CircularProgress, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { UserContext } from './UserProvider'

function ConfirmForm({ isLoading, handleSubmit, setOpenConfirmModal }) {
    const { user } = React.useContext(UserContext)
    return (
        <>
            <Button onClick={() => setOpenConfirmModal(false)} sx={{ color: 'primary' }}>
                <CloseIcon sx={{ color: 'primary' }} />
            </Button>
            <Grid container sx={{ p: 2 }} direction="column" justifyContent="center" alignItems="center" spacing={8}>
                <Grid item sx={{ textAlign: 'center' }}>
                    {!isLoading && (<Typography variant='h6'>Are you sure you want to remove projections?</Typography>)}
                    {isLoading && (<Typography variant='h5'>Removing Projections</Typography>)}
                </Grid>
                {isLoading ? (
                    <Grid item sx={{ mb: 10 }}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    <Grid item>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            <Grid item xs={6}>
                                <Button onClick={() => setOpenConfirmModal(false)} variant='contained' color='error'>No</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button disabled={!user} onClick={handleSubmit} variant='contained' color='primary'>Yes</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </>
    )
}

export { ConfirmForm }