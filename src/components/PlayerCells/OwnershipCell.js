import React from 'react';
import '../../styles/PlayerTable.css';
import { useMediaQuery } from '@mui/material';

function OwnershipCell({ cell, playerSettings, setPlayerSettings }) {
    const ownership = playerSettings['ownership']
    const setOwnership = (value) => setPlayerSettings({ ...playerSettings, 'ownership': value })
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    function handleChange(e) {
        // Validate input
        const inputValue = e.target.value;
        let dotTrails = false
        if (inputValue === '') {
            setOwnership('0');
            cell.row.original.ownership = '0';
            return;
        }
        if (isNaN(inputValue)) {
            return;
        }
        if (inputValue.endsWith('.')) {
            dotTrails = true
        }
        if (inputValue > 100 || inputValue < 0) {
            return;
        }
        const parsedValue = parseFloat(inputValue);
        const roundedValue = Math.round((parsedValue + Number.EPSILON) * 100) / 100
        const cleanValue = dotTrails ? roundedValue.toString() + '.' : roundedValue.toString()
        cell.row.original.ownership = cleanValue
        setOwnership(cleanValue)
        cell.row.original.ownership = cleanValue
    }

    return (
        <td {...cell.getCellProps()} className='ownership-cell'>
            <input type='text' value={ownership} onChange={handleChange} className='ownership-input' name={`players[${cell.row.original.id}][ownership]`}></input>
            {!isMobile && <span style={{ paddingLeft: '5px' }}>%</span>}
        </td>
    )
}

export { OwnershipCell }