import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { AdvancedSettingsForm } from './AdvancedSettingsForm';

function AdvancedSettingsModal({ openAdvancedSettingsModal, setOpenAdvancedSettingsModal, setStackData, stackData }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <Modal open={openAdvancedSettingsModal}
            onClose={() => setOpenAdvancedSettingsModal(false)}
            aria-labelledby='modal-modal-advanced-settings'
            aria-describedby='modal-modal-advanced-settings'
        >
            <Box sx={isMobile ? (mobileSignInModal) : (signInModal)}>
                <AdvancedSettingsForm setOpenAdvancedSettingsModal={setOpenAdvancedSettingsModal} setStackData={setStackData} stackData={stackData} />
            </Box>
        </Modal>
    )
}

export { AdvancedSettingsModal }