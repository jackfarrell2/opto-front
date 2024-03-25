import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { useMutation } from 'react-query'
import { ConfirmForm } from './ConfirmForm'
import config from '../config'
import { UserContext } from './UserProvider'

function ConfirmModal({ sport, openConfirmModal, setOpenConfirmModal, slate }) {
    const { token } = React.useContext(UserContext)
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const apiUrl = `${config.apiUrl}${sport}/api/remove-projections/`;
    const removeProjectionsMutation = useMutation(
        async () => {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ 'slate-id': slate })
            })

            if (!response.ok) {
                throw new Error('Failed to remove projections')
            }

            return response.json()
        },
        {
            onSuccess: () => {
                setOpenConfirmModal(false)
                window.location.reload(true);
            },
        }
    )

    const handleSubmit = async () => {
        try {
            await removeProjectionsMutation.mutateAsync()
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Modal open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            aria-labelledby='modal-modal-upload'
            aria-describedby='modal-modal-upload-slate-form'
        >
            <Box sx={isMobile ? (mobileSignInModal) : (signInModal)}>
                <ConfirmForm isLoading={removeProjectionsMutation.isLoading} handleSubmit={handleSubmit} setOpenConfirmModal={setOpenConfirmModal}></ConfirmForm>
            </Box>
        </Modal>
    )
}

export { ConfirmModal }