import React from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


function RemoveCell({ cell, playerSettings, setPlayerSettings }) {
    const exclude = playerSettings['remove']

    function handleClick() {
        setPlayerSettings({ ...playerSettings, 'remove': !exclude, 'lock': false })
        cell.row.original.remove = !exclude
    }

    return (
        <td {...cell.getCellProps()} onClick={handleClick}>
            {exclude ? (
                <>
                    <input type='hidden' value='true' name={`players[${cell.row.original.id}][remove]`} />
                    <RemoveCircleIcon color='error' fontSize='small' />
                </>
            ) : (
                <>
                    <input type='hidden' value='' name={`players[${cell.row.original.id}][remove]`} />
                    <RemoveCircleOutlineIcon color='error' fontSize='small' />
                </>
            )}
        </td>
    )
}

export { RemoveCell }