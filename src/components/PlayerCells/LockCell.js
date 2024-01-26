import React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockIcon from '@mui/icons-material/Lock';

function LockCell({cell, lock, setExclude, setLock}) {

    function handleClick() {
        setLock(!lock)
        setExclude(false)
    }

    return (
        <td {...cell.getCellProps()} onClick={handleClick}>
            {lock ? (
                <>
                    <input type='hidden' value='true' name={`players[${cell.row.original.id}][lock]`} />
                    <LockIcon color='primary' fontSize='small' />
                </>
            ) : (
                <>
                    <input type='hidden' value='false' name={`players[${cell.row.original.id}][lock]`} />
                    <LockOutlinedIcon color='primary' fontSize='small' />
                </>
            )}
        </td>
    )
}

export { LockCell }