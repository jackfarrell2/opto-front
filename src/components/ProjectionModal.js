import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { useMutation } from 'react-query'
import config from '../config'
import { ProjectionForm } from './ProjectionForm'
import { UserContext } from './UserProvider'

function ProjectionModal({ openProjectionModal, setOpenProjectionModal, slate, slates }) {
    const { token } = React.useContext(UserContext)
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const apiUrl = `${config.apiUrl}`;
    const [selectedFile, setSelectedFile] = React.useState(null)
    const [selectedSlate, setSelectedSlate] = React.useState(slate)

    const mutation = useMutation(
        async (file) => {

            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch(`${apiUrl}nba/api/upload-projections/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload projections');
            }

            return response.json();
        },
        {
            onSuccess: () => {
                // setSlateModal(false)
                // window.location.reload(true);
                console.log('Success')
            },
        }
    );

    const handleSubmit = async (file) => {
        try {
            await mutation.mutateAsync(file);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Modal open={openProjectionModal}
            onClose={() => setOpenProjectionModal(false)}
            aria-labelledby='modal-modal-upload'
            aria-describedby='modal-modal-upload-slate-form'
        >
            <Box sx={isMobile ? (mobileSignInModal) : (signInModal)}>
                <ProjectionForm setOpenProjectionModal={setOpenProjectionModal} handleSubmit={handleSubmit} slates={slates} slate={slate} selectedFile={selectedFile} selectedSlate={selectedSlate} setSelectedFile={setSelectedFile} setSelectedSlate={setSelectedSlate} />
            </Box>
        </Modal>
    )
}

export { ProjectionModal }