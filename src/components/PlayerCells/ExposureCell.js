import React from 'react';
import '../../styles/PlayerTable.css';
import { useMediaQuery } from '@mui/material';

function ExposureCell({cell, exposure}) {
    const [exposureInput, setExposure] = React.useState(exposure)
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    function handleChange(e) {
        // Validate input
        const inputValue = e.target.value;
        let dotTrails = false
        if (inputValue === '') {
        setExposure('0');
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
        cell.row.original.exposure = roundedValue
        const cleanValue = dotTrails ? roundedValue.toString() + '.' : roundedValue.toString()
        cell.row.original.exposure = cleanValue
        setExposure(cleanValue)

    }

    return (
        <td {...cell.getCellProps()} className='ownership-cell'>
            <input type='text' name={`players[${cell.row.original.id}][exposure]`} value={exposureInput} onChange={handleChange} className='ownership-input'></input>
            {!isMobile && <span style={{ paddingLeft: '5px' }}>%</span>}
        </td>
    )
}

export { ExposureCell }