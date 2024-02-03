import React from 'react'
import { Select, MenuItem } from '@mui/material'
import { slateSelector, slateSelectorDropdown } from '../styles/classes'

function SlateSelector({ slates, slate, handleSlateChange }) {


    console.log('slates are', slates)

    function handleChange(event) {
        const selectedSlateName = event.target.value
        const selectedSlate = slates.find(slate => slate.name === selectedSlateName)
        localStorage.setItem('lastSlate', selectedSlate.id)

        if (selectedSlate) {
            const updatedSlate = {
                id: selectedSlate.id,
                name: selectedSlate.name
            };
            handleSlateChange(updatedSlate)
        }
    }

    return (
        <Select sx={slateSelector} value={slate ? slate.name : ''} onChange={handleChange}>
            {slates.map((slate, index) => (
                <MenuItem sx={slateSelectorDropdown} key={slate.id} value={slate.name}>{slate.name}</MenuItem>
            ))}
        </Select>
    )
}

export { SlateSelector }