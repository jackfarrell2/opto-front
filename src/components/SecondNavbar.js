import React from "react"
import { AppBar, Toolbar, IconButton, Button, Grid } from "@mui/material"
import { secondaryNav } from "../styles/classes"
import { SlateSelector } from "./SlateSelector";
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { ProjectionModal } from "./ProjectionModal";

function SecondNavbar({ setSlateModal, slate, slates, setSlate, setSlates }) {
    const theme = useTheme()
    const [openProjectionModal, setOpenProjectionModal] = React.useState(false)

    return (
        <AppBar position='static' sx={secondaryNav}>
            <Toolbar>
                <ProjectionModal setOpenProjectionModal={setOpenProjectionModal} openProjectionModal={openProjectionModal} slates={slates} slate={slate} />
                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                    <Grid item>
                        <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
                            <Grid item>
                                <SlateSelector slates={slates} slate={slate} handleSlateChange={(newSlate) => setSlate(newSlate)} />
                            </Grid>
                            <Grid item>
                                <IconButton sx={{ color: theme.palette.primary.main }} onClick={() => setSlateModal(true)}><AddIcon /></IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => setOpenProjectionModal(!openProjectionModal)} variant='outlined' color='primary'>Upload Projections</Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export { SecondNavbar }