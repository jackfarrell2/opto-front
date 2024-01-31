import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { SlateForm } from './SlateForm'
import { useMutation, useQueryClient } from 'react-query'
import config from '../config'

function SlateModal({openModal, setSlateModal, slates}) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const apiUrl = `${config.apiUrl}`;
    const queryClient = useQueryClient();

    const mutation = useMutation(
        async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${apiUrl}nba/add-slate/`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add slate');
            }

            return response.json();
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('slates');
                setSlateModal(false)
                window.location.reload(true);
            },
        }
    );

    const handleSubmit = async(file) => {
        try {
            await mutation.mutateAsync(file);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Modal open={openModal}
            onClose={() => setSlateModal(false)}
            aria-labelledby='modal-modal-upload'
            aria-describedby='modal-modal-upload-slate-form'
        >
        <Box sx={isMobile ? (mobileSignInModal) : (signInModal)}>
            <SlateForm setSlateModal={setSlateModal} slates={slates} handleSubmit={handleSubmit} loading={mutation.isLoading} />
        </Box>
        </Modal>
    )
}

export {SlateModal}