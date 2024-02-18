import { Grid, Typography, Button, Divider } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

function ProjectionResponse({ data, setUploaded, setOpenProjectionModal }) {
    const assumedPlayers = data['assumed-players']
    const assumedPlayersCount = Object.keys(assumedPlayers).length
    const unfoundPlayers = data['unfound-players']
    const unfoundPlayersCount = unfoundPlayers.length
    const assumedPlayersList = []

    if (assumedPlayersCount === 0 && unfoundPlayersCount === 0) {
        setUploaded(null)
        setOpenProjectionModal(false)
    }

    function handleConfirm() {
        setUploaded(null)
        setOpenProjectionModal(false)
        window.location.reload()
    }


    for (const player in assumedPlayers) {
        const assumedPlayer = assumedPlayers[player]
        assumedPlayersList.push(
            <Grid item key={assumedPlayer} xs={12} sm={6} md={4}>
                <Grid container direction='row' justifyContent='center' alignItems='center' spacing={1}>
                    <Grid item>
                        <Typography sx={{ fontSize: '2vh' }}>{player}</Typography>
                    </Grid>
                    <Grid item>
                        <ArrowForwardIcon fontSize="small" />
                    </Grid>
                    <Grid item>
                        <Typography sx={{ fontSize: '2vh' }}>{assumedPlayer}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
    return (
        <Grid container direction='column' justifyContent='flex-start' alignItems='center' spacing={2}>
            <Grid item>
                <Grid container direction='row' justifyContent='center' alignItems='center' spacing={1}>
                    <Grid item alignItems='center'>
                        <Typography variant='h6'>Projections Uploaded</Typography>
                    </Grid>
                    <Grid item alignItems='center'>
                        <CheckIcon color='success' />
                    </Grid>
                </Grid>
            </Grid>
            {(assumedPlayersCount > 0) && (
                <>
                    <Grid item style={{ overflow: 'auto' }}>
                        <Typography sx={{ fontSize: '2vh' }}><span style={{ color: 'red' }}>Warning!</span> The following name mappings have been assumed.</Typography>
                    </Grid>
                    <Grid item style={{ overflow: 'auto', maxHeight: '25vh' }}>
                        <Grid container direction='column' justifyContent='flex-start' alignItems='center' spacing={1} style={{
                            maxHeight: '25vh', // Set a maximum height for the div
                            overflowY: 'auto',  // Add a vertical scrollbar when content overflows
                            border: '1px solid #ccc', // Optional: Add border for visibility
                        }}>
                            {assumedPlayersList}
                        </Grid>
                    </Grid>
                </>
            )}
            <Grid item>
                <Divider />
            </Grid>
            {(unfoundPlayersCount > 0) && (
                <>
                    <Grid item>
                        <Typography sx={{ fontSize: '2vh' }}><span style={{ color: 'red' }}>Warning!</span> The following players were not found.</Typography>
                    </Grid>
                    <Grid item>
                        <Grid container direction='column' justifyContent='flex-start' alignItems='center' spacing={1} style={{
                            overflowY: 'auto',  // Add a vertical scrollbar when content overflows
                            border: '1px solid #ccc',
                            overflowX: 'auto',
                            maxHeight: '25vh'
                        }}>
                            {unfoundPlayers.map((player) => (
                                <Grid key={player} item xs={12} sm={6} md={4}>
                                    <Typography sx={{ fontSize: '2vh' }}>{player}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </>
            )}
            <Grid item>
                <Button variant='contained' onClick={handleConfirm}>Got it!</Button>
            </Grid>
        </Grid>
    )
}

export { ProjectionResponse }