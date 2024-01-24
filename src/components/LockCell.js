import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockIcon from '@mui/icons-material/Lock';

function LockCell({player, lockedPlayers, removedPlayers, handleLockChange}) {

    function handleClicked() {
        if (removedPlayers.includes(player)) {
            return
        }
        if (lockedPlayers.includes(player)) {
            handleLockChange('unlock', player)
        } else {
            handleLockChange('lock', player)
        }
    }

    return (
        <>
            {lockedPlayers.includes(player) ? (
                <LockIcon color='primary' fontSize='small' onClick={handleClicked} />
            ) : (
                <LockOutlinedIcon color='primary' fontSize='small' onClick={handleClicked} />
            )}
        </>
    )
}

export { LockCell }