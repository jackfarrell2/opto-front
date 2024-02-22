import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { SignInForm } from './SignInForm'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { UserContext } from './UserProvider'
import config from '../config'

function SignInModal({ openModal, handleClose, submit, setOpenModal }) {
    const apiUrl = `${config.apiUrl}`
    const userUrl = `${apiUrl}users/`
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { signIn, signUp, resetPass, confirmResetPass, resetPassword, setUser, setToken } = React.useContext(UserContext);
    const [error, setError] = React.useState('')
    const [passwordError, setPasswordError] = React.useState('')
    const [buttonLoading, setButtonLoading] = React.useState(false)

    const handleSubmit = async (formData) => {
        setButtonLoading(true)
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
                setButtonLoading(false)
            } else {
                setOpenModal('confirm');
                setButtonLoading(false)
            }
        } else if (openModal === 'sign-in') {
            const result = await signIn(formData);
            if (!result.success) {
                setPasswordError(result.message)
                setButtonLoading(false)
            }
            setButtonLoading(false)
        } else if (openModal === 'forgot') {
            setOpenModal('sent-reset')
            resetPass(formData)
            setButtonLoading(false)
        } else if (openModal === 'sent-reset') {
            const result = await confirmResetPass(formData)
            if (!result.success) {
                setPasswordError(result.message)
                setButtonLoading(false)
            } else {
                setButtonLoading(false)
                setUser(result.user);
                setToken(result.token);
                setOpenModal('none');
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('token', result.token);
                setOpenModal('reset-password-form')
            }
            setButtonLoading(false)
        } else if (openModal === 'reset-password-form') {
            const result = await resetPassword(formData)
            if (!result.success) {
                setPasswordError(result.message)
                setButtonLoading(false)
            } else {
                setButtonLoading(false)
                setOpenModal('none')
                window.location.reload()
            }
        }
        setButtonLoading(false)
    };

    const resendCodeEmail = async (confirmedEmail) => {
        try {
            const response = await fetch(`${userUrl}resend-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: confirmedEmail }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error resending email:', error);
        }
    }

    const resendEmail = async (confirmedEmail) => {
        try {
            const response = await fetch(`${userUrl}resend-confirmation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: confirmedEmail }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error resending email:', error);
        }
    };

    function handleClear() {
        setError('')
        setPasswordError('')
        handleClose()
    }

    return (
        <Modal open={openModal !== 'none'}
            onClose={handleClear}
            aria-labelledby='modal-modal-signin'
            aria-describedby='modal-modal-signin or registration form'
        >
            <Box sx={isMobile ? (mobileSignInModal) : (signInModal)}>
                <SignInForm onSubmit={handleSubmit} handleClose={handleClose} openModal={openModal} setOpenModal={setOpenModal} error={error} setError={setError} passwordError={passwordError} setPasswordError={setPasswordError} buttonLoading={buttonLoading} resendEmail={resendEmail} resendCodeEmail={resendCodeEmail} />
            </Box>
        </Modal>
    )
}

export { SignInModal }