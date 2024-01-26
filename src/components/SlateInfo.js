import React from 'react'
import { useQuery } from 'react-query'
import config from '../config'
import { PlayerTable } from './PlayerTable';
import { Grid, CircularProgress, Box, Container, Button } from '@mui/material';


function SlateInfo({slate}) {

    const apiUrl = `${config.apiUrl}nba/get-slate/${slate.id}`

    const { data: players, isLoading: playersLoading } = useQuery(['players', slate.id], async () => {
        const response = await fetch(apiUrl)
        if (!response.ok) {
            throw new Error('Failed to fetch players')
        }
        const data = await response.json()
        return data
    });


    const playerData = React.useMemo(() => players?.players, [players]) 

    return (
        <Box>
            {playersLoading ? (
                <Grid container sx={{ height: '75vh' }} direction='column' justifyContent='center' alignItems='center'>
                    <Grid item>
                        <CircularProgress size={120} />
                    </Grid>
                </Grid>
            ) : (
                <Grid container direction='row' justifyContent='center' alignItems='center'>
                    <Grid item xs={9}>
                        <Container sx={{ maxHeight: '75vh', overflow: 'auto', mt: '2vh'}}>
                            <PlayerTable data={playerData} />
                        </Container>
                        <Button variant='contained' form='PlayerTableForm' type='submit'>Optomize</Button>
                    </Grid>
                    <Grid item xs={3}>
                    </Grid>
                </Grid>

            )}
        </Box>
    )
}

export { SlateInfo }