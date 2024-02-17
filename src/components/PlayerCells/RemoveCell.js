import React from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { LockedContext } from '../SlateInfo';


function RemoveCell({ cell, playerSettings, setPlayerSettings }) {
    const exclude = playerSettings['remove']
    const [lockedData, setLockedData] = React.useContext(LockedContext)

    function handleClick() {
        setPlayerSettings({ ...playerSettings, 'remove': !exclude, 'lock': false })
        cell.row.original.remove = !exclude
        cell.row.original.lock = false
        if (playerSettings['lock']) {
            const lockedDataBuffer = { ...lockedData }
            lockedDataBuffer['count'] -= 1
            lockedDataBuffer['salary'] -= cell.row.original.salary
            setLockedData(lockedDataBuffer)
        }
    }

    return (
        <td {...cell.getCellProps()} onClick={handleClick}>
            {exclude ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <input type='hidden' value='true' name={`players[${cell.row.original.id}][remove]`} />
                    <RemoveCircleIcon color='error' fontSize='small' />
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <input type='hidden' value='' name={`players[${cell.row.original.id}][remove]`} />
                    <RemoveCircleOutlineIcon color='error' fontSize='small' />
                </div>
            )}
        </td>
    )
}

export { RemoveCell }