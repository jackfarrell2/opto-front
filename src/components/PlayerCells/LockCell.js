import React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockIcon from '@mui/icons-material/Lock';

function LockCell({lock}) {
    const [lockPlayer, setLockPlayer] = React.useState(lock)
    return (
        <td onClick={() => setLockPlayer(!lockPlayer)}>
            {lockPlayer ? (
                <LockIcon color='primary' fontSize='small' />
            ) : (
                <LockOutlinedIcon color='primary' fontSize='small' />
            )}
        </td>
    )
}

export { LockCell }