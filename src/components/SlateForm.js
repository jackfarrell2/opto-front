import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid, TextField, Typography, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { SlateSelector } from './SlateSelector'

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

function SlateForm({ setSlateModal, handleSubmit, loading, onlyProjections, setOnlyProjections, slates, slate }) {
    const theme = useTheme()
    const [firstSelectedFile, setFirstSelectedFile] = React.useState(null)
    const [secondSelectedFile, setSecondSelectedFile] = React.useState(null)
    const [selectedSlate, setSelectedSlate] = React.useState(slate)

    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        if (index === 0) {
            setFirstSelectedFile(file);
        } else if (index === 1) {
            setSecondSelectedFile(file);
        }
    }
    return (
        <>
            <Button onClick={() => setSlateModal(false)} sx={{ color: theme.palette.primary.main }}>
                <CloseIcon sx={{ color: theme.palette.primary.main }} />
            </Button>
            <Grid container direction='column' justifyContent='center' alignItems='center' spacing={8}>
                <Grid item>
                    <Typography variant='h5'>Add a Slate</Typography>
                </Grid>
                {loading ? (
                    <Grid item sx={{ mb: 10 }}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    <>
                        {!onlyProjections ? (
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
                                            Upload Lines
                                            <VisuallyHiddenInput type='file' onChange={(e) => handleFileChange(e, 0)} />
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <TextField id="standard-basic" value={firstSelectedFile ? firstSelectedFile.name : ''} variant="standard" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid item>
                                <SlateSelector slates={slates} slate={selectedSlate} handleSlateChange={setSelectedSlate} />
                            </Grid>
                        )}
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
                                        Upload Projections
                                        <VisuallyHiddenInput type='file' onChange={(e) => handleFileChange(e, 1)} />
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <TextField id="standard-basic" value={secondSelectedFile ? secondSelectedFile.name : ''} variant="standard" />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button disabled={!onlyProjections ? (!firstSelectedFile) : (!secondSelectedFile)} variant='contained' onClick={() => handleSubmit(firstSelectedFile, secondSelectedFile)}>Submit</Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => setOnlyProjections(!onlyProjections)} variant='text' size='small' sx={{ textDecoration: 'underline' }}>Want to only update default projections?</Button>
                        </Grid>
                    </>
                )
                }
            </Grid>
        </>
    )
}

export { SlateForm }