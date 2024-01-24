import React from 'react';
import '../../styles/PlayerTable.css';

function OwnershipCell({ownership}) {
    const [ownershipInput, setOwnership] = React.useState(ownership)

    function handleChange(e) {
        // Validate input
        const inputValue = e.target.value;
        let dotTrails = false
        if (inputValue === '') {
        setOwnership('0');
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
        console.log(parsedValue)
        const roundedValue = Math.round((parsedValue + Number.EPSILON) * 100) / 100
        setOwnership(dotTrails ? roundedValue.toString() + '.' : roundedValue.toString())
    }

    return (
        <td className='ownership-cell'>
            <input type='text' name='ownership' value={ownershipInput} onChange={handleChange} className='ownership-input'></input>
            <span style={{ paddingLeft: '5px' }}>%</span>
        </td>
    )
}

export { OwnershipCell }