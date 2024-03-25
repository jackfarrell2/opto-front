import React from "react"
import { AppBar, Toolbar, IconButton, Button, Grid, useMediaQuery } from "@mui/material"
import { secondaryNav } from "../styles/classes"
import { SlateSelector } from "./SlateSelector";
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { ProjectionModal } from "./ProjectionModal";
import { UserContext } from "./UserProvider"
import { ConfirmModal } from "./ConfirmModal";

function SecondNavbar({ sport, setSlateModal, slate, slates, setSlate }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const isXtraSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [openConfirmModal, setOpenConfirmModal] = React.useState(false)
    const { user } = React.useContext(UserContext)
    let userStaff = false
    if (user) {
        userStaff = user.isStaff
    }
    const theme = useTheme()
    const [openProjectionModal, setOpenProjectionModal] = React.useState(false)
    return (
        <>
            <ConfirmModal sport={sport} openConfirmModal={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal} slate={slate.id} />
            <AppBar position='static' sx={secondaryNav}>
                <Toolbar style={{ padding: 0 }}>
                    <ProjectionModal sport={sport} setOpenProjectionModal={setOpenProjectionModal} openProjectionModal={openProjectionModal} slates={slates} slate={slate} />
                    <Grid container direction='row' justifyContent='flex-start' alignItems='center' spacing={1.5}>
                        <Grid item style={{ marginLeft: isMobile ? '1vh' : '2vh' }}>
                            <Grid container direction='row' justifyContent='flex-start' alignItems='center'>
                                <Grid item>
                                    <SlateSelector slates={slates} slate={slate} handleSlateChange={(newSlate) => setSlate(newSlate)} />
                                </Grid>
                                <Grid item>
                                    {userStaff && (<IconButton sx={{ color: theme.palette.primary.main }} onClick={() => setSlateModal(true)}><AddIcon /></IconButton>)}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button size='small' onClick={() => setOpenProjectionModal(!openProjectionModal)} variant='outlined' color='success'>{isXtraSmall ? 'Upload' : 'Upload Projections'}</Button>
                        </Grid>
                        <Grid item>
                            <Button size='small' onClick={() => setOpenConfirmModal(true)} variant='outlined' color='error'>{isXtraSmall ? 'Remove' : 'Remove Projections'}</Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </>
    )
}

export { SecondNavbar }