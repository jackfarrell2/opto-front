import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';


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

function SlateForm({setSlateModal, handleSubmit}) {
    const theme = useTheme()
    const [selectedFile, setSelectedFile] = React.useState(null)

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
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
                <Grid item>
                    <Grid container direction='row' justifyContent='center' alignItems='center' spacing={2}>
                        <Grid item>
                            <Button sx={{
                            bgcolor: '#ffc107',
                            color: 'primary.main',
                            '&:hover': {
                            bgcolor: '#ffc107', 
                            color: 'primary.main', 
                            }, }} component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                                Upload CSV
                                <VisuallyHiddenInput type='file' onChange={handleFileChange} />
                                {/* <input type='file' id='formFile' name='slate-csv' accept='.csv'></input> */}
                            </Button>
                        </Grid>
                        <Grid item>
                            <TextField id="standard-basic" value={selectedFile ? selectedFile.name : ''} variant="standard" />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button variant='contained' onClick={() => handleSubmit(selectedFile)}>Submit</Button>
                </Grid>
                <Grid item>
                    <Button variant='text' size='small' sx={{ textDecoration: 'underline' }}>Want to delete a slate?</Button>
                </Grid>
            </Grid>
        </>
    )
}

export {SlateForm}