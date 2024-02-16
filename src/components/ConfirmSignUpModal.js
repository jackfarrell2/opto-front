import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { ConfirmSignUpForm } from './ConfirmSignUpForm'

function ConfirmSignUpModal({ openConfirmModal, setOpenConfirmModal }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));


    return (
        <Modal open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            aria-labelledby='modal-modal-upload'
            aria-describedby='modal-modal-upload-slate-form'
        >
            <Box sx={isMobile ? (mobileSignInModal) : (signInModal)}>
                <ConfirmSignUpForm setOpenConfirmModal={setOpenConfirmModal}></ConfirmSignUpForm>
            </Box>
        </Modal>
    )
}

export { ConfirmSignUpModal }