import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { JackOptoForm } from './JackOptoForm'

function JackOptoModal({ openJackOptoModal, setOpenJackOptoModal, teams, onConfirm }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <Modal open={openJackOptoModal}
            onClose={() => setOpenJackOptoModal(false)}
            aria-labelledby='modal-modal-jack-opto'
            aria-describedby='modal-modal-jack-opto-form'
        >
            <Box sx={isMobile ? mobileSignInModal : signInModal}>
                <JackOptoForm teams={teams} onConfirm={onConfirm} setOpenJackOptoModal={setOpenJackOptoModal} />
            </Box>
        </Modal>
    )
}

export { JackOptoModal }
