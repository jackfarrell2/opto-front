import React from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography } from '@mui/material'
import { mlbTeamColors } from '../styles/colors'

function StackRankPanel({ stackRankResults }) {
    if (!stackRankResults || stackRankResults.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', pt: 2 }}>
                <Typography variant='body2' color='text.secondary'>No results yet.</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>
                Avg of 10 random 5-hitter combos per team (proj ≥ 1). Sorted by value (pts/$1k).
            </Typography>
            <TableContainer component={Paper}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', py: 0.5 }}>Team</TableCell>
                            <TableCell align='right' sx={{ fontWeight: 'bold', py: 0.5 }}>Avg Proj</TableCell>
                            <TableCell align='right' sx={{ fontWeight: 'bold', py: 0.5 }}>Avg Sal</TableCell>
                            <TableCell align='right' sx={{ fontWeight: 'bold', py: 0.5 }}>Pts/$1k</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stackRankResults.map((row, idx) => {
                            const bgColor = mlbTeamColors[row.team] || '#666'
                            return (
                                <TableRow key={row.team} sx={{ backgroundColor: idx === 0 ? `${bgColor}18` : 'inherit' }}>
                                    <TableCell sx={{ py: 0.5 }}>
                                        <Chip
                                            label={`${idx + 1}. ${row.team}`}
                                            size='small'
                                            sx={{ backgroundColor: bgColor, color: '#fff', fontWeight: 'bold', fontSize: '0.72rem' }}
                                        />
                                    </TableCell>
                                    <TableCell align='right' sx={{ py: 0.5, fontSize: '0.8rem' }}>
                                        {row.avgProj.toFixed(1)}
                                    </TableCell>
                                    <TableCell align='right' sx={{ py: 0.5, fontSize: '0.8rem' }}>
                                        ${Math.round(row.avgSal / 1000).toFixed(1)}k
                                    </TableCell>
                                    <TableCell align='right' sx={{ py: 0.5, fontSize: '0.8rem', fontWeight: idx < 3 ? 'bold' : 'normal', color: idx < 3 ? 'success.main' : 'inherit' }}>
                                        {row.avgValue.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export { StackRankPanel }
