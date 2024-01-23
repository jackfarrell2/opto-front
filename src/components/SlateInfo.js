import React from 'react'
import { useQuery } from 'react-query'
import config from '../config'
import { PlayerTable } from './PlayerTable';
import { Grid, CircularProgress } from '@mui/material';


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
            Header: 'Player',
            accessor: 'name'
        },
        {
            Header: 'Position',
            accessor: 'position'
        },
        {
            Header: 'Salary',
            accessor: 'salary'
        },
        {
            Header: 'Projection',
            accessor: 'projection'
        },
        {
            Header: 'Team',
            accessor: 'team'
        },
        {
            Header: 'Opponent',
            accessor: 'opponent'
        },
    ]

    return (
        <>
            {playersLoading ? (
                <Grid container sx={{ height: '75vh' }} direction='column' justifyContent='center' alignItems='center'>
                    <Grid item>
                        <CircularProgress size={120} />
                    </Grid>
                </Grid>
            ) : (
                <Grid container direction='row' justifyContent='center'>
                    <Grid item>
                        <PlayerTable columns={columns} data={players.players} />
                    </Grid>
                </Grid>
            )}
        </>
    )
}

export { SlateInfo }