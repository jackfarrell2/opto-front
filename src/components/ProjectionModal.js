import React from 'react'
import { Modal, Box, useMediaQuery } from '@mui/material'
import { signInModal, mobileSignInModal } from '../styles/classes'
import { useMutation } from 'react-query'
import config from '../config'
import { ProjectionForm } from './ProjectionForm'
import { UserContext } from './UserProvider'
import { ProjectionResponse } from './ProjectionResponse'

function ProjectionModal({ openProjectionModal, setOpenProjectionModal, slate, slates }) {
    const { token } = React.useContext(UserContext)
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const apiUrl = `${config.apiUrl}`;
    const [selectedFile, setSelectedFile] = React.useState(null)
    const [selectedSlate, setSelectedSlate] = React.useState(slate)
    const [uploaded, setUploaded] = React.useState(false)
    const [responseData, setResponseData] = React.useState(null)
    const [error, setError] = React.useState(null)
    const [fileMethod, setSelectedFileMethod] = React.useState(false)

    function handleClose() {
        if (uploaded) {
            setUploaded(false)
            setError(null)
            setOpenProjectionModal(false)
            window.location.reload()

        } else {
            setUploaded(false)
            setError(null)
            setOpenProjectionModal(false)

        }
    }

    function handleMethodChange() {
        setSelectedFileMethod(!fileMethod)
    }

    const mutation = useMutation(
        async (file) => {

            const formData = new FormData();
            formData.append('file', file);
            formData.append('slate', selectedSlate.id);
            formData.append('method', 'file');
            const response = await fetch(`${apiUrl}nba/api/upload-projections/`, {
                method: 'POST',
                headers: {
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
            onSuccess: (data) => {
                setUploaded(true)
                setResponseData(data)
            },
        }
    );

    const handleSubmit = async (file) => {
        setError(null)
        try {
            await mutation.mutateAsync(file);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to upload projections. Check your selected slate, the file format, and the column names.')
        }
    }

    const pasteMutation = useMutation(
        async (projections) => {
            const formData = new FormData();
            const pasteProjections = {}
            projections.forEach((projection) => {
                if (projection[0].value && projection[1].value)
                    pasteProjections[projection[0].value] = projection[1].value
            })
            formData.append('paste-projections', JSON.stringify(pasteProjections));
            formData.append('slate', selectedSlate.id);
            formData.append('method', 'paste');
            const response = await fetch(`${apiUrl}nba/api/upload-projections/`, {
                method: 'POST',
                headers: {
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
            onSuccess: (data) => {
                setUploaded(true)
                setResponseData(data)
            },
        }
    );

    const handlePasteSubmit = async (projections) => {
        setError(null)
        try {
            await pasteMutation.mutateAsync(projections);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to upload projections.')
        }
    }

    return (
        <Modal open={openProjectionModal}
            onClose={handleClose}
            aria-labelledby='modal-modal-upload'
            aria-describedby='modal-modal-upload-slate-form'
        >
            <Box sx={isMobile ? (mobileSignInModal) : (signInModal)} style={{ maxHeight: isMobile ? '75vh' : null, overflow: 'auto' }}>
                {(uploaded && responseData) ? (
                    <ProjectionResponse data={responseData} setUploaded={setUploaded} setOpenProjectionModal={setOpenProjectionModal} />
                ) : (
                    <ProjectionForm handlePasteSubmit={handlePasteSubmit} handleMethodChange={handleMethodChange} fileMethod={fileMethod} error={error} loading={mutation.isLoading || pasteMutation.isLoading} setOpenProjectionModal={setOpenProjectionModal} handleSubmit={handleSubmit} slates={slates} slate={slate} selectedFile={selectedFile} selectedSlate={selectedSlate} setSelectedFile={setSelectedFile} setSelectedSlate={setSelectedSlate} />
                )
                }

            </Box>
        </Modal>
    )
}

export { ProjectionModal }