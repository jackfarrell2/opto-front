import React from 'react'
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Grid, TableSortLabel,
    Button, Chip, Divider, Autocomplete, TextField
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1
    if (b[orderBy] > a[orderBy]) return 1
    return 0
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

function SortableHeader({ label, field, orderBy, order, onSort }) {
    return (
        <TableCell sortDirection={orderBy === field ? order : false} sx={{ fontWeight: 700, py: 1 }}>
            <TableSortLabel
                active={orderBy === field}
                direction={orderBy === field ? order : 'asc'}
                onClick={() => onSort(field)}
            >
                {label}
            </TableSortLabel>
        </TableCell>
    )
}

function OwnershipTable({ players }) {
    const [order, setOrder] = React.useState('desc')
    const [orderBy, setOrderBy] = React.useState('pct_drafted')

    const handleSort = (field) => {
        if (orderBy === field) {
            setOrder(order === 'asc' ? 'desc' : 'asc')
        } else {
            setOrderBy(field)
            setOrder('desc')
        }
    }

    const sorted = [...players].sort(getComparator(order, orderBy))

    return (
        <TableContainer component={Paper} variant='outlined' sx={{ maxHeight: 400 }}>
            <Table size='small' stickyHeader>
                <TableHead>
                    <TableRow>
                        <SortableHeader label='Player' field='name' orderBy={orderBy} order={order} onSort={handleSort} />
                        <SortableHeader label='Pos' field='position' orderBy={orderBy} order={order} onSort={handleSort} />
                        <SortableHeader label='% Owned' field='pct_drafted' orderBy={orderBy} order={order} onSort={handleSort} />
                        <SortableHeader label='FPTS' field='fpts' orderBy={orderBy} order={order} onSort={handleSort} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sorted.map((p, i) => (
                        <TableRow key={i} hover>
                            <TableCell sx={{ py: 0.5 }}>{p.name}</TableCell>
                            <TableCell sx={{ py: 0.5 }}>{p.position}</TableCell>
                            <TableCell sx={{ py: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box
                                        sx={{
                                            width: `${Math.min(p.pct_drafted, 100)}%`,
                                            maxWidth: 80,
                                            height: 6,
                                            bgcolor: 'primary.main',
                                            borderRadius: 1,
                                            opacity: 0.6
                                        }}
                                    />
                                    {p.pct_drafted.toFixed(2)}%
                                </Box>
                            </TableCell>
                            <TableCell sx={{ py: 0.5 }}>{p.fpts.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function PlayerLookupPanel({ lineupDetails, playerOwnership }) {
    const [selectedUser, setSelectedUser] = React.useState(null)

    const ownershipMap = React.useMemo(() => {
        const m = {}
        playerOwnership.forEach(p => { m[p.name.toLowerCase()] = p })
        return m
    }, [playerOwnership])

    const allUsers = React.useMemo(() => {
        const names = new Set()
        lineupDetails.forEach(l => {
            if (l.entry_name) {
                const base = l.entry_name.replace(/\s*\(\d+\/\d+\)\s*$/, '').trim()
                names.add(base)
            }
        })
        return Array.from(names).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    }, [lineupDetails])

    const userLineups = React.useMemo(() => {
        if (!selectedUser) return []
        const lower = selectedUser.toLowerCase()
        return lineupDetails.filter(l => {
            const base = (l.entry_name || '').replace(/\s*\(\d+\/\d+\)\s*$/, '').trim().toLowerCase()
            return base === lower
        })
    }, [lineupDetails, selectedUser])

    const stats = React.useMemo(() => {
        if (!userLineups.length) return null
        const ranks = userLineups.map(l => parseInt(l.rank)).filter(r => !isNaN(r))
        const pts = userLineups.map(l => parseFloat(l.points)).filter(p => p > 0)
        return {
            count: userLineups.length,
            bestRank: ranks.length ? Math.min(...ranks).toLocaleString() : '—',
            avgPts: pts.length ? (pts.reduce((a, b) => a + b, 0) / pts.length).toFixed(2) : '—',
        }
    }, [userLineups])

    const playerExposure = React.useMemo(() => {
        const freq = {}
        userLineups.forEach(l => {
            l.players.forEach(p => {
                const k = p.name.toLowerCase()
                if (!freq[k]) freq[k] = { name: p.name, position: p.position, count: 0 }
                freq[k].count++
            })
        })
        return Object.values(freq).sort((a, b) => b.count - a.count)
    }, [userLineups])

    return (
        <Box>
            <Divider sx={{ my: 3 }} />
            <Typography variant='h6' fontWeight={700} sx={{ mb: 1.5 }}>Player Lookup</Typography>
            <Autocomplete
                options={allUsers}
                value={selectedUser}
                onChange={(_, v) => setSelectedUser(v)}
                renderInput={(params) => (
                    <TextField {...params} label='Search by DK username' size='small' />
                )}
                sx={{ maxWidth: 400, mb: 2 }}
            />

            {selectedUser && stats && (
                <>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={`${stats.count} lineup${stats.count !== 1 ? 's' : ''}`} size='small' />
                        <Chip label={`Best rank: ${stats.bestRank}`} size='small' />
                        <Chip label={`Avg score: ${stats.avgPts}`} size='small' />
                    </Box>

                    <Typography variant='subtitle2' fontWeight={700} gutterBottom>Player Exposure</Typography>
                    <TableContainer component={Paper} variant='outlined' sx={{ maxHeight: 320, mb: 3 }}>
                        <Table size='small' stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Pos</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Player</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>%</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Own%</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {playerExposure.map((p, i) => {
                                    const pct = userLineups.length ? (p.count / userLineups.length * 100) : 0
                                    const own = ownershipMap[p.name.toLowerCase()]
                                    return (
                                        <TableRow key={i} hover>
                                            <TableCell sx={{ py: 0.5 }}>{p.position}</TableCell>
                                            <TableCell sx={{ py: 0.5 }}>{p.name}</TableCell>
                                            <TableCell sx={{ py: 0.5 }}>{p.count}</TableCell>
                                            <TableCell sx={{ py: 0.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{
                                                        width: `${Math.min(pct, 100)}%`,
                                                        maxWidth: 50,
                                                        height: 5,
                                                        bgcolor: 'primary.main',
                                                        borderRadius: 1,
                                                        opacity: 0.6,
                                                    }} />
                                                    {pct.toFixed(1)}%
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ py: 0.5 }}>{own ? `${own.pct_drafted.toFixed(1)}%` : '—'}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>Lineups</Typography>
                    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        {userLineups.map((lineup, i) => (
                            <Box
                                key={i}
                                sx={{
                                    py: 0.75, px: 1,
                                    borderBottom: i < userLineups.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    '&:hover': { bgcolor: '#fafafa' }
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
                                    <Chip label={`Rank ${lineup.rank}`} size='small' variant='outlined' sx={{ fontSize: 11 }} />
                                    {parseFloat(lineup.points) > 0 && (
                                        <Chip label={`${lineup.points} pts`} size='small' variant='outlined' sx={{ fontSize: 11 }} />
                                    )}
                                    {lineup.entry_name && (
                                        <Chip label={lineup.entry_name} size='small' variant='outlined' sx={{ fontSize: 11 }} />
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {lineup.players.map((p, j) => {
                                        const own = ownershipMap[p.name.toLowerCase()]
                                        return (
                                            <Box
                                                key={j}
                                                sx={{
                                                    px: 0.75, py: 0.25, borderRadius: 0.75,
                                                    bgcolor: 'grey.100',
                                                    color: 'text.secondary',
                                                    border: '1px solid',
                                                    borderColor: 'grey.300',
                                                    fontSize: 11,
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                <Box component='span' sx={{ opacity: 0.75, mr: 0.5, fontSize: 10 }}>{p.position}</Box>
                                                {p.name}
                                                {own && (
                                                    <Box component='span' sx={{ ml: 0.5, opacity: 0.6, fontSize: 10 }}>
                                                        {own.pct_drafted.toFixed(1)}%
                                                    </Box>
                                                )}
                                            </Box>
                                        )
                                    })}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </>
            )}
        </Box>
    )
}

function NbaContestResultsPanel({ results, onReupload, contestSlate }) {
    return (
        <Box sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant='h6'>Contest Results</Typography>
                    {contestSlate && (
                        <Chip label={contestSlate.name} size='small' variant='outlined' />
                    )}
                    {results && (
                        <Chip label={`${results.total_entries.toLocaleString()} entries`} size='small' color='primary' variant='outlined' />
                    )}
                </Box>
                <Button
                    size='small'
                    variant='outlined'
                    startIcon={<UploadFileIcon />}
                    onClick={onReupload}
                >
                    Re-upload
                </Button>
            </Box>

            {results ? (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant='subtitle1' fontWeight={700} gutterBottom>
                                Player Ownership
                            </Typography>
                            <OwnershipTable players={results.player_ownership} />
                        </Grid>
                    </Grid>

                    {results.lineup_details?.length > 0 && (
                        <PlayerLookupPanel
                            lineupDetails={results.lineup_details}
                            playerOwnership={results.player_ownership}
                        />
                    )}
                </>
            ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant='body1' color='text.secondary'>
                        Upload a DraftKings contest results CSV to see player ownership.
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export { NbaContestResultsPanel }
