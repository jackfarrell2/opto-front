import React from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


function RemoveCell({cell, exclude, setExclude, setLock}) {
    
    function handleClick() {
        setExclude(!exclude)
        setLock(false)
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