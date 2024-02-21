import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid, TextField, Typography, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { SlateSelector } from './SlateSelector';
import { SpreadsheetInput } from './SpreadsheetInput';
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

function ProjectionForm({ handlePasteSubmit, fileMethod, handleMethodChange, error, setOpenProjectionModal, handleSubmit, loading, slates, setSelectedFile, selectedFile, setSelectedSlate, selectedSlate }) {
    const theme = useTheme()
    const { user } = React.useContext(UserContext)

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    }

    const [projections, setProjections] = React.useState([
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
    ]);

    return (
        <>
            <Button onClick={() => setOpenProjectionModal(false)} sx={{ color: theme.palette.primary.main }}>
                <CloseIcon sx={{ color: theme.palette.primary.main }} />
            </Button>
            <Grid container direction='column' justifyContent='center' alignItems='center' spacing={5}>
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
                        {fileMethod && (
                            <>
                                <Grid item>
                                    <Typography sx={{ fontSize: '1.75vh', margin: '1vh' }}>Upload a CSV or XLSX with 2 columns titled "Player" and "Projection". {!user && <strong>Only users</strong>} can upload projections!</Typography>
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
                                                Upload CSV / XLSX
                                                <VisuallyHiddenInput type='file' onChange={handleFileChange} />
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <TextField id="standard-basic" value={selectedFile ? selectedFile.name : ''} variant="standard" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
                                        <Grid item>
                                            <Button variant='contained' onClick={() => handleSubmit(selectedFile)}>Submit</Button>
                                        </Grid>
                                        {error && (
                                            <Grid item>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2vh' }}>
                                                    <Typography sx={{ color: 'red', fontSize: '1.75vh' }}>{error}</Typography>
                                                </div>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Button onClick={handleMethodChange} variant='text' size='small' sx={{ textDecoration: 'underline' }}>Want to copy and paste data instead?</Button>
                                </Grid>
                            </>
                        )}
                        {!fileMethod && (
                            <>
                                <Grid item>
                                    <Typography sx={{ fontSize: '1.75vh', margin: '1vh' }}>Copy and paste your data in the table below. The table will grow accordingly. {!user && <strong>Only users</strong>} can upload projections!</Typography>
                                </Grid>
                                <Grid item >
                                    <SpreadsheetInput projections={projections} setProjections={setProjections} />
                                </Grid>
                                <Grid item>
                                    <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
                                        <Grid item>
                                            <Button variant='contained' onClick={() => handlePasteSubmit(projections)}>Submit</Button>
                                        </Grid>
                                        {error && (
                                            <Grid item>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2vh' }}>
                                                    <Typography sx={{ color: 'red', fontSize: '1.75vh' }}>{error}</Typography>
                                                </div>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Button onClick={handleMethodChange} variant='text' size='small' sx={{ textDecoration: 'underline' }}>Want to upload a file instead?</Button>
                                </Grid>
                            </>

                        )}
                    </>
                )
                }
            </Grid>
        </>
    )
}

export { ProjectionForm }