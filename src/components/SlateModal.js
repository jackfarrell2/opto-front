import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { SlateForm } from './SlateForm'
import { useMutation, useQueryClient } from 'react-query'
import config from '../config'
import { UserContext } from './UserProvider'

function SlateModal({ openModal, setSlateModal, slates, slate }) {
    const { token } = React.useContext(UserContext)
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const apiUrl = `${config.apiUrl}`;
    const queryClient = useQueryClient();
    const [onlyProjections, setOnlyProjections] = React.useState(false)
    const mutation = useMutation(
        async (files) => {
            const formData = new FormData();
            if (!onlyProjections) {
                formData.append('file-one', files[0]);
                formData.append('projections-only', false)
            } else {
                formData.append('projections-only', true)
                formData.append('slate', slate.id)
            }
            formData.append('file-two', files[1]);


            const response = await fetch(`${apiUrl}nba/add-slate/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
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

    const handleSubmit = async (fileOne, fileTwo) => {
        try {
            const files = [fileOne, fileTwo]
            await mutation.mutateAsync(files);
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
                <SlateForm slate={slate} setSlateModal={setSlateModal} slates={slates} handleSubmit={handleSubmit} loading={mutation.isLoading} onlyProjections={onlyProjections} setOnlyProjections={setOnlyProjections} />
            </Box>
        </Modal>
    )
}

export { SlateModal }