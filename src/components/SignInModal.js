import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { SignInForm } from './SignInForm'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { UserContext } from './UserProvider'

function SignInModal({ openModal, handleClose, submit, setOpenModal }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { signIn, signUp } = React.useContext(UserContext);
    const [error, setError] = React.useState('')
    const [passwordError, setPasswordError] = React.useState('')

    const handleSubmit = async (formData) => {
        setError('')
        setPasswordError('')
        if (openModal === 'signup') {
            const result = await signUp(formData);
            if (!result.success) {
                const emailError = result.message.email ? result.message.email[0] : '';
                if (emailError) {
                    setPasswordError(`A ${emailError}`)
                } else {
                    setError('There was an unknown error registering. Please try again.')
                }
            } else {
                setOpenModal('confirm');
            }
        } else if (openModal === 'sign-in') {
            await signIn(formData);
        }
    };


    return (
        <Modal open={openModal !== 'none'}
            onClose={handleClose}
            aria-labelledby='modal-modal-signin'
            aria-describedby='modal-modal-signin or registration form'
        >
            <Box sx={isMobile ? (mobileSignInModal) : (signInModal)}>
                <SignInForm onSubmit={handleSubmit} handleClose={handleClose} openModal={openModal} setOpenModal={setOpenModal} error={error} setError={setError} passwordError={passwordError} setPasswordError={setPasswordError} />
            </Box>
        </Modal>
    )
}

export { SignInModal }