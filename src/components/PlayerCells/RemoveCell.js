import React from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


function RemoveCell({exclude}) {
    const [excludePlayer, setExcludePlayer] = React.useState(exclude)
    return (
        <td onClick={() => setExcludePlayer(!excludePlayer)}>
            {excludePlayer ? (
                <RemoveCircleIcon color='error' fontSize='small' />
            ) : (
                <RemoveCircleOutlineIcon color='error' fontSize='small' />
            )}
        </td>
    )
}

export { RemoveCell }