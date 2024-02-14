import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { useMutation } from 'react-query'
import { ConfirmOptoForm } from './ConfirmOptoForm'
import config from '../config'
import { UserContext } from './UserProvider'

function ConfirmOptoModal({ openConfirmModal, setOpenConfirmModal, slate, setOptimizedLineups, setExposures }) {
    const { token, user } = React.useContext(UserContext)
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const apiUrl = `${config.apiUrl}nba/api/remove-optimizations/`;
    const removeOptimizationsMutation = useMutation(
        async () => {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ 'slate-id': slate })
            })

            if (!response.ok) {
                throw new Error('Failed to remove optimizations')
            }

            return response.json()
        },
        {
            onSuccess: () => {
                setOptimizedLineups({ 'count': 0 })
                setExposures({})
                setOpenConfirmModal(false)
            },
        }
    )

    const handleSubmit = async () => {
        if (user) {
            try {
                await removeOptimizationsMutation.mutateAsync()
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            setOptimizedLineups({ 'count': 0 })
            setExposures({})
            setOpenConfirmModal(false)
        }
    }

    return (
        <Modal open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            aria-labelledby='modal-modal-upload'
            aria-describedby='modal-modal-upload-slate-form'
        >
            <Box sx={isMobile ? (mobileSignInModal) : (signInModal)}>
                <ConfirmOptoForm handleSubmit={handleSubmit} setOpenConfirmModal={setOpenConfirmModal} slate={slate} />
            </Box>
        </Modal>
    )
}

export { ConfirmOptoModal }