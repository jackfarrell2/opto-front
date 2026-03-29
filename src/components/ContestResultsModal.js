import React from 'react'
import {
    Modal, Box, Button, Typography, CircularProgress,
    useMediaQuery, MenuItem, Select, FormControl, InputLabel
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { signInModal, mobileSignInModal } from '../styles/classes'
import config from '../config'
import { UserContext } from './UserProvider'

function ContestResultsModal({ open, onClose, onResultsLoaded, sport = 'mlb' }) {
    const { token } = React.useContext(UserContext)
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'))
    const [recentSlates, setRecentSlates] = React.useState([])
    const [selectedSlateId, setSelectedSlateId] = React.useState('')
    const [file, setFile] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [slatesLoading, setSlatesLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const fileInputRef = React.useRef()

    // Fetch slates from last 3 days whenever modal opens
    React.useEffect(() => {
        if (!open) return
        setSlatesLoading(true)
        setError(null)
        fetch(`${config.apiUrl}${sport}/slates?days_back=3`)
            .then(res => res.json())
            .then(data => {
                setRecentSlates(data || [])
                if (data && data.length > 0) setSelectedSlateId(data[0].id)
            })
            .catch(() => setError('Failed to load slates'))
            .finally(() => setSlatesLoading(false))
    }, [open])

    const handleClose = () => {
        setFile(null)
        setError(null)
        setSelectedSlateId('')
        setRecentSlates([])
        onClose()
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setError(null)
    }

    const handleSubmit = async () => {
        if (!file) { setError('Please select a file.'); return }
        if (!selectedSlateId) { setError('Please select a slate.'); return }
        setLoading(true)
        setError(null)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('slate', selectedSlateId)
            const headers = {}
            if (token) headers['Authorization'] = `Token ${token}`
            const response = await fetch(`${config.apiUrl}${sport}/api/upload-contest-results/`, {
                method: 'POST',
                headers,
                body: formData,
            })
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Upload failed')
            }
            const data = await response.json()
            const slate = recentSlates.find(s => s.id === selectedSlateId)
            onResultsLoaded(data, slate)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={isMobile ? mobileSignInModal : { ...signInModal, width: 460 }}>
                <Typography variant='h6' sx={{ mb: 2 }}>Upload Contest Results</Typography>

                {slatesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress size={28} />
                    </Box>
                ) : (
                    <>
                        <FormControl fullWidth size='small' sx={{ mb: 2 }}>
                            <InputLabel>Slate</InputLabel>
                            <Select
                                value={selectedSlateId}
                                label='Slate'
                                onChange={(e) => setSelectedSlateId(e.target.value)}
                            >
                                {recentSlates.map(s => (
                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography variant='body2' color='text.secondary' sx={{ mb: 1.5 }}>
                            Upload the DraftKings contest results CSV for the selected slate.
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Button
                                variant='outlined'
                                startIcon={<UploadFileIcon />}
                                onClick={() => fileInputRef.current.click()}
                                size='small'
                            >
                                {file ? file.name : 'Choose CSV'}
                            </Button>
                            <input
                                ref={fileInputRef}
                                type='file'
                                accept='.csv'
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </Box>

                        {error && (
                            <Typography variant='body2' color='error' sx={{ mb: 1 }}>{error}</Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button size='small' onClick={handleClose} disabled={loading}>Cancel</Button>
                            <Button
                                size='small'
                                variant='contained'
                                onClick={handleSubmit}
                                disabled={loading || !file || !selectedSlateId}
                            >
                                {loading ? <CircularProgress size={18} /> : 'Upload'}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    )
}

export { ContestResultsModal }
