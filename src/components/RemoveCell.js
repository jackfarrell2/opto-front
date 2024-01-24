import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


function RemoveCell({player, removedPlayers, lockedPlayers, handleRemovePlayer}) {

    function handleClicked() {
        if (lockedPlayers.includes(player)) {
            return
        }
        if (removedPlayers.includes(player)) {
            handleRemovePlayer('remove', player)
        } else {
            handleRemovePlayer('add', player)
        }
    }

    return (
        <>
            {removedPlayers.includes(player) ? (
                <RemoveCircleIcon color='error' fontSize='small' onClick={handleClicked} />
            ) : (
                <RemoveCircleOutlineIcon color='error' fontSize='small' onClick={handleClicked} />
            )}
        </>
    )
}

export { RemoveCell }