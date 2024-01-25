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
                <LockIcon color='primary' fontSize='small' />
            ) : (
                <LockOutlinedIcon color='primary' fontSize='small' />
            )}
        </td>
    )
}

export { LockCell }