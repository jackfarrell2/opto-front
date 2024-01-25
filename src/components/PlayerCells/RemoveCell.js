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
                <RemoveCircleIcon color='error' fontSize='small' />
            ) : (
                <RemoveCircleOutlineIcon color='error' fontSize='small' />
            )}
        </td>
    )
}

export { RemoveCell }