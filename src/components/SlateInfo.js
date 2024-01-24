import React from 'react'
import { useQuery } from 'react-query'
import config from '../config'
import { PlayerTable } from './PlayerTable';
import { Grid, CircularProgress, Box, Container } from '@mui/material';


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



    const columns = [
        {
            Header: '',
            accessor: 'select',
        },
        {
            Header: '',
            accessor: 'lock',
        },
        {
            Header: 'Player',
            accessor: 'name'
        },
        {
            Header: 'Pos',
            accessor: 'position'
        },
        {
            Header: 'Salary',
            accessor: 'salary'
        },
        {
            Header: 'Team',
            accessor: 'team'
        },
        {
            Header: 'Opp',
            accessor: 'opponent'
        },
        {
            Header: 'Own',
            accessor: 'ownership'
        },
        {
            Header: 'Proj',
            accessor: 'projection'
        },
        {
            Header: 'Value',
            accessor: 'value'
        },
    ]

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
                        <Container sx={{ maxHeight: '75vh', overflow: 'auto'}}>
                            <PlayerTable columns={columns} data={players.players} />
                        </Container>
                    </Grid>
                    <Grid item xs={3}>
                    </Grid>
                </Grid>
            )}
        </Box>
    )
}

export { SlateInfo }