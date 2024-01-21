import React from 'react'
import { Select, MenuItem } from '@mui/material'
import { slateSelector, slateSelectorDropdown } from '../styles/classes'

function SlateSelector({slates, slate, handleSlateChange}) {
    return (
        <Select sx={slateSelector} value={slate} onChange={handleSlateChange}> 
            {slates.map((slate, index) => (
                <MenuItem sx={slateSelectorDropdown} key={index} value={slate}>{slate}</MenuItem>
            ))}
        </Select>
    )
}

export { SlateSelector }