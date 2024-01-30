import React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockIcon from '@mui/icons-material/Lock';
import { LockedContext } from '../SlateInfo';

function LockCell({ cell, lock, setExclude, setLock }) {
    const [lockedData, setLockedData] = React.useContext(LockedContext)

    function handleClick() {
        if (lockedData['count'] === 8 && !lock) {
            return
        }
        if (lockedData['salary'] >= 50000 && !lock) {
            return
        }
        setLock(!lock)
        setExclude(false)
        const lockedDataBuffer = { ...lockedData }
        if (!lock) {
            lockedDataBuffer['count'] += 1
            lockedDataBuffer['salary'] += cell.row.original.salary
        }
        else {
            lockedDataBuffer['count'] -= 1
            lockedDataBuffer['salary'] -= cell.row.original.salary
        }
        setLockedData(lockedDataBuffer)
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
                    <input type='hidden' value='' name={`players[${cell.row.original.id}][lock]`} />
                    <LockOutlinedIcon color='primary' fontSize='small' />
                </>
            )}
        </td>
    )
}

export { LockCell }