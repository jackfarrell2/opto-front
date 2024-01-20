import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { SignInForm } from './SignInForm'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { UserContext } from './UserProvider'

function SignInModal({openModal, handleClose, submit, setOpenModal}) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { signIn, signUp } = React.useContext(UserContext);
    const handleSubmit = async (formData) => {
        if (openModal === 'sign-in') {
            await signIn(formData);
        } else if (openModal === 'signup') {
            await signUp(formData);
        }
    }

    return (
        <Modal open={openModal !== 'none'}
            onClose={handleClose}
            aria-labelledby='modal-modal-signin'
            aria-describedby='modal-modal-signin or registration form'
        >
        <Box sx={isMobile ? (mobileSignInModal) : (signInModal)}>
            <SignInForm onSubmit={handleSubmit} handleClose={handleClose} openModal={openModal} setOpenModal={setOpenModal} />
        </Box>
        </Modal>
    )
}

export {SignInModal}