import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid, TextField, Typography, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { SlateSelector } from './SlateSelector';
import { UserContext } from './UserProvider';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function ProjectionForm({ setOpenProjectionModal, handleSubmit, loading, slates, setSelectedFile, selectedFile, setSelectedSlate, selectedSlate }) {
    const { user } = React.useContext(UserContext)
    const theme = useTheme()

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    }

    return (
        <>
            <Button onClick={() => setOpenProjectionModal(false)} sx={{ color: theme.palette.primary.main }}>
                <CloseIcon sx={{ color: theme.palette.primary.main }} />
            </Button>
            <Grid container direction='column' justifyContent='center' alignItems='center' spacing={8}>
                <Grid item>
                    <Typography variant='h5'>Upload Projections</Typography>
                </Grid>
                {loading ? (
                    <Grid item sx={{ mb: 10 }}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    <>
                        <Grid item>
                            <Grid container direction='row' justifyContent='center' alignItems='center' spacing={2}>
                                <Grid item>
                                    <Typography variant='body2'>Select a slate:</Typography>
                                </Grid>
                                <Grid item>
                                    <SlateSelector slates={slates} slate={selectedSlate} handleSlateChange={setSelectedSlate} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction='row' justifyContent='center' alignItems='center' spacing={2}>
                                <Grid item>
                                    <Button sx={{
                                        bgcolor: '#ffc107',
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: '#ffc107',
                                            color: 'primary.main',
                                        },
                                    }} component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                                        Upload CSV
                                        <VisuallyHiddenInput type='file' onChange={handleFileChange} />
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <TextField id="standard-basic" value={selectedFile ? selectedFile.name : ''} variant="standard" />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button disabled={!user} variant='contained' onClick={() => handleSubmit(selectedFile)}>Submit</Button>
                        </Grid>
                    </>
                )
                }
            </Grid>
        </>
    )
}

export { ProjectionForm }