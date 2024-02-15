import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { ConfirmErrorForm } from './ConfirmErrorForm'

function ConfirmErrorModal({ openConfirmModal, setOpenConfirmModal, setFailedSuccessLineups, successfulLineupCount }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));


    return (
        <Modal open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            aria-labelledby='modal-modal-upload'
            aria-describedby='modal-modal-upload-slate-form'
        >
            <Box sx={isMobile ? (mobileSignInModal) : (signInModal)}>
                <ConfirmErrorForm setFailedSuccessLineups={setFailedSuccessLineups} setOpenConfirmModal={setOpenConfirmModal} successfullLineupCount={successfulLineupCount}></ConfirmErrorForm>
            </Box>
        </Modal>
    )
}

export { ConfirmErrorModal }