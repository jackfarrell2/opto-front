import React from 'react'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Grid, Typography, Chip } from '@mui/material'
import { mlbTeamColors } from '../styles/colors'

function StackSummaryPanel({ stackSummary }) {
    const grouped = React.useMemo(() => {
        if (!stackSummary || stackSummary.length === 0) return {}
        const map = {}
        stackSummary.forEach(({ primaryTeam, secondaryTeam }) => {
            if (!map[primaryTeam]) {
                map[primaryTeam] = { count: 0, secondaries: {} }
            }
            map[primaryTeam].count++
            if (!map[primaryTeam].secondaries[secondaryTeam]) {
                map[primaryTeam].secondaries[secondaryTeam] = 0
            }
            map[primaryTeam].secondaries[secondaryTeam]++
        })
        return map
    }, [stackSummary])

    const teams = Object.keys(grouped)

    if (teams.length === 0) {
        return (
            <Grid container direction='row' justifyContent='center' alignItems='center'>
                <Grid item>
                    <Typography>You haven't optimized any lineups!</Typography>
                </Grid>
            </Grid>
        )
    }

    return (
        <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
            {teams.map(primary => {
                const bgColor = mlbTeamColors[primary] || '#666'
                const secondaries = grouped[primary].secondaries
                const secondaryEntries = Object.entries(secondaries).sort((a, b) => b[1] - a[1])
                return (
                    <TableContainer key={primary} component={Paper} sx={{ mb: 1.5 }}>
                        <Table size='small'>
                            <TableBody>
                                <TableRow style={{ backgroundColor: bgColor }}>
                                    <TableCell colSpan={2} style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                        {primary} — {grouped[primary].count} lineup{grouped[primary].count !== 1 ? 's' : ''}
                                    </TableCell>
                                </TableRow>
                                {secondaryEntries.map(([sec, count]) => {
                                    const secColor = mlbTeamColors[sec] || '#666'
                                    return (
                                        <TableRow key={sec}>
                                            <TableCell sx={{ py: 0.5 }}>
                                                <Chip
                                                    label={sec}
                                                    size='small'
                                                    sx={{
                                                        backgroundColor: secColor,
                                                        color: '#fff',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align='right' sx={{ py: 0.5 }}>
                                                x{count}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            })}
        </Box>
    )
}

export { StackSummaryPanel }
