import React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockIcon from '@mui/icons-material/Lock';
import { LockedContext } from '../SlateInfo';

function LockCell({ cell, playerSettings, setPlayerSettings }) {
    const lock = playerSettings['lock']
    const [lockedData, setLockedData] = React.useContext(LockedContext)

    function handleClick() {
        console.log('lockedData', lockedData)
        if (lockedData['count'] === 8 && !lock) {
            return
        }
        if ((lockedData['salary'] + cell.row.original.salary) > 50000 && !lock) {
            return
        }
        setPlayerSettings({ ...playerSettings, 'lock': !lock, 'remove': false, 'exposure': 100 })
        cell.row.original.exposure = 100
        cell.row.original.lock = !lock
        cell.row.original.remove = false
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <input type='hidden' value='true' name={`players[${cell.row.original.id}][lock]`} />
                    <LockIcon color='primary' fontSize='small' />
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <input type='hidden' value='' name={`players[${cell.row.original.id}][lock]`} />
                    <LockOutlinedIcon color='primary' fontSize='small' />
                </div>
            )}
        </td>
    )
}

export { LockCell }