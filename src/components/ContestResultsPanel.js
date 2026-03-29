import React from 'react'
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Grid, TableSortLabel,
    Button, Chip, IconButton, Divider, ToggleButton, ToggleButtonGroup,
    Autocomplete, TextField
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CloseIcon from '@mui/icons-material/Close'

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

function StacksTable({ stacks, selectedTeam, onSelectTeam }) {
    const [order, setOrder] = React.useState('desc')
    const [orderBy, setOrderBy] = React.useState('stack4_count')

    const handleSort = (field) => {
        if (orderBy === field) {
            setOrder(order === 'asc' ? 'desc' : 'asc')
        } else {
            setOrderBy(field)
            setOrder('desc')
        }
    }

    const sorted = [...stacks].sort(getComparator(order, orderBy))

    return (
        <TableContainer component={Paper} variant='outlined' sx={{ maxHeight: 400 }}>
            <Table size='small' stickyHeader>
                <TableHead>
                    <TableRow>
                        <SortableHeader label='Team' field='team' orderBy={orderBy} order={order} onSort={handleSort} />
                        <SortableHeader label='4+ #' field='stack4_count' orderBy={orderBy} order={order} onSort={handleSort} />
                        <SortableHeader label='4+ %' field='stack4_pct' orderBy={orderBy} order={order} onSort={handleSort} />
                        <SortableHeader label='5+ #' field='stack5_count' orderBy={orderBy} order={order} onSort={handleSort} />
                        <SortableHeader label='5+ %' field='stack5_pct' orderBy={orderBy} order={order} onSort={handleSort} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sorted.map((s, i) => (
                        <TableRow
                            key={i}
                            hover
                            selected={s.team === selectedTeam}
                            onClick={() => onSelectTeam(s.team === selectedTeam ? null : s.team)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell sx={{ py: 0.5, fontWeight: 700 }}>{s.team}</TableCell>
                            <TableCell sx={{ py: 0.5 }}>{s.stack4_count.toLocaleString()}</TableCell>
                            <TableCell sx={{ py: 0.5 }}>{s.stack4_pct}%</TableCell>
                            <TableCell sx={{ py: 0.5 }}>{s.stack5_count.toLocaleString()}</TableCell>
                            <TableCell sx={{ py: 0.5 }}>{s.stack5_pct}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function StackAnalysisPanel({ team, stackLevel, lineupDetails, playerOwnership, onClose }) {
    const stackLineups = React.useMemo(
        () => lineupDetails.filter(l => (l.stacked_teams?.[team] ?? 0) >= stackLevel),
        [lineupDetails, team, stackLevel]
    )

    const ownershipMap = React.useMemo(() => {
        const m = {}
        playerOwnership.forEach(p => { m[p.name.toLowerCase()] = p })
        return m
    }, [playerOwnership])

    // All 4-player subsets of team hitters across stacks
    const playerCombos = React.useMemo(() => {
        const comboMap = {}
        const choose4 = (arr) => {
            const results = []
            for (let a = 0; a < arr.length - 3; a++)
                for (let b = a + 1; b < arr.length - 2; b++)
                    for (let c = b + 1; c < arr.length - 1; c++)
                        for (let d = c + 1; d < arr.length; d++)
                            results.push([arr[a], arr[b], arr[c], arr[d]])
            return results
        }
        stackLineups.forEach(lineup => {
            const teamHitters = lineup.players
                .filter(p => p.team === team && p.position !== 'P')
                .map(p => p.name)
                .sort()
            choose4(teamHitters).forEach(combo => {
                const key = combo.join('|')
                if (!comboMap[key]) comboMap[key] = { players: combo, count: 0 }
                comboMap[key].count++
            })
        })
        return Object.values(comboMap).sort((a, b) => b.count - a.count)
    }, [stackLineups, team])

    // How often each team player appears in these stacks
    const playerFreq = React.useMemo(() => {
        const freq = {}
        stackLineups.forEach(lineup => {
            lineup.players.forEach(p => {
                if (p.team === team && p.position !== 'P') {
                    const k = p.name.toLowerCase()
                    if (!freq[k]) freq[k] = { name: p.name, position: p.position, count: 0 }
                    freq[k].count++
                }
            })
        })
        return Object.values(freq).sort((a, b) => b.count - a.count)
    }, [stackLineups, team])

    return (
        <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant='h6' fontWeight={700}>
                    {team} {stackLevel}+ Stacks
                    <Chip label={`${stackLineups.length} lineups`} size='small' color='primary' variant='outlined' sx={{ ml: 1 }} />
                </Typography>
                <IconButton size='small' onClick={onClose}><CloseIcon fontSize='small' /></IconButton>
            </Box>

            {/* Player frequency breakdown */}
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 0.5 }}>
                {team} Player Usage Within These Stacks
            </Typography>
            <TableContainer component={Paper} variant='outlined' sx={{ mb: 2.5 }}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Pos</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Player</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>In Stacks</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>% of Stacks</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Contest Own%</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {playerFreq.map((p, i) => {
                            const pct = (p.count / stackLineups.length) * 100
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
                                                maxWidth: 60,
                                                height: 5,
                                                bgcolor: pct < 30 ? 'success.main' : pct < 70 ? 'warning.main' : 'error.main',
                                                borderRadius: 1,
                                                opacity: 0.7,
                                            }} />
                                            {pct.toFixed(1)}%
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 0.5 }}>{own ? `${own.pct_drafted.toFixed(2)}%` : '—'}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Player combo breakdown */}
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 0.5 }}>
                Hitter Combinations
            </Typography>
            <TableContainer component={Paper} variant='outlined' sx={{ mb: 2.5, maxHeight: 320 }}>
                <Table size='small' stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Players</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 60 }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 80 }}>%</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {playerCombos.map((combo, i) => {
                            const pct = (combo.count / stackLineups.length) * 100
                            return (
                                <TableRow key={i} hover>
                                    <TableCell sx={{ py: 0.5 }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {combo.players.map((name, j) => (
                                                <Chip key={j} label={name} size='small' variant='outlined' sx={{ fontSize: 11, height: 20 }} />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 0.5 }}>{combo.count}</TableCell>
                                    <TableCell sx={{ py: 0.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Box sx={{
                                                width: `${Math.min(pct, 100)}%`,
                                                maxWidth: 40,
                                                height: 5,
                                                bgcolor: pct < 5 ? 'success.main' : pct < 20 ? 'warning.main' : 'error.main',
                                                borderRadius: 1,
                                                opacity: 0.7,
                                            }} />
                                            {pct.toFixed(1)}%
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Lineup list */}
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>
                All {stackLineups.length} Lineups
                <Typography component='span' variant='caption' color='text.secondary' sx={{ ml: 1 }}>
                    — {team} players highlighted
                </Typography>
            </Typography>
            <Box sx={{ maxHeight: 500, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                {stackLineups.map((lineup, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: 'flex', flexWrap: 'wrap', gap: 0.5,
                            py: 0.75, px: 1,
                            borderBottom: i < stackLineups.length - 1 ? '1px solid #f0f0f0' : 'none',
                            '&:hover': { bgcolor: '#fafafa' }
                        }}
                    >
                        {lineup.players.map((p, j) => {
                            const isTeam = p.team === team
                            const own = ownershipMap[p.name.toLowerCase()]
                            return (
                                <Box
                                    key={j}
                                    sx={{
                                        display: 'inline-flex', alignItems: 'center',
                                        px: 0.75, py: 0.25, borderRadius: 0.75,
                                        bgcolor: isTeam ? 'primary.main' : 'grey.100',
                                        color: isTeam ? 'white' : 'text.secondary',
                                        fontSize: 11,
                                        fontWeight: isTeam ? 700 : 400,
                                        border: '1px solid',
                                        borderColor: isTeam ? 'primary.main' : 'grey.300',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Box component='span' sx={{ opacity: 0.75, mr: 0.5, fontSize: 10 }}>{p.position}</Box>
                                    {p.name}
                                    {own && (
                                        <Box component='span' sx={{ ml: 0.5, opacity: isTeam ? 0.8 : 0.6, fontSize: 10 }}>
                                            {own.pct_drafted.toFixed(1)}%
                                        </Box>
                                    )}
                                </Box>
                            )
                        })}
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

function PlayerLookupPanel({ lineupDetails, playerOwnership }) {
    const [selectedUser, setSelectedUser] = React.useState(null)

    const ownershipMap = React.useMemo(() => {
        const m = {}
        playerOwnership.forEach(p => { m[p.name.toLowerCase()] = p })
        return m
    }, [playerOwnership])

    // Deduplicated base usernames (strip multi-entry suffix like "(1/5)")
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

    // How many times this user stacked each team + %
    const userStackBreakdown = React.useMemo(() => {
        const counts = {}
        userLineups.forEach(l => {
            Object.keys(l.stacked_teams || {}).forEach(team => {
                counts[team] = (counts[team] || 0) + 1
            })
        })
        return Object.entries(counts)
            .map(([team, count]) => ({ team, count, pct: userLineups.length ? (count / userLineups.length * 100) : 0 }))
            .sort((a, b) => b.count - a.count)
    }, [userLineups])

    // Player exposure across all of this user's lineups
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
                    {/* Summary stats */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={`${stats.count} lineup${stats.count !== 1 ? 's' : ''}`} size='small' />
                        <Chip label={`Best rank: ${stats.bestRank}`} size='small' />
                        <Chip label={`Avg score: ${stats.avgPts}`} size='small' />
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 2 }}>
                        {/* Player exposure */}
                        <Grid item xs={12} md={6}>
                            <Typography variant='subtitle2' fontWeight={700} gutterBottom>Player Exposure</Typography>
                            <TableContainer component={Paper} variant='outlined' sx={{ maxHeight: 320 }}>
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
                        </Grid>

                        {/* Stack exposure */}
                        <Grid item xs={12} md={6}>
                            <Typography variant='subtitle2' fontWeight={700} gutterBottom>Stack Exposure (4+)</Typography>
                            {userStackBreakdown.length === 0 ? (
                                <Typography variant='body2' color='text.secondary'>No 4+ stacks found.</Typography>
                            ) : (
                                <TableContainer component={Paper} variant='outlined'>
                                    <Table size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>%</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {userStackBreakdown.map(({ team, count, pct }) => (
                                                <TableRow key={team} hover>
                                                    <TableCell sx={{ py: 0.5, fontWeight: 700 }}>{team}</TableCell>
                                                    <TableCell sx={{ py: 0.5 }}>{count}</TableCell>
                                                    <TableCell sx={{ py: 0.5 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Box sx={{
                                                                width: `${Math.min(pct, 100)}%`,
                                                                maxWidth: 60,
                                                                height: 5,
                                                                bgcolor: 'primary.main',
                                                                borderRadius: 1,
                                                                opacity: 0.6,
                                                            }} />
                                                            {pct.toFixed(1)}%
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Grid>
                    </Grid>

                    {/* Lineups */}
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
                                {/* Lineup metadata row */}
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
                                    <Chip label={`Rank ${lineup.rank}`} size='small' variant='outlined' sx={{ fontSize: 11 }} />
                                    {parseFloat(lineup.points) > 0 && (
                                        <Chip label={`${lineup.points} pts`} size='small' variant='outlined' sx={{ fontSize: 11 }} />
                                    )}
                                    {lineup.total_salary > 0 && (
                                        <Chip label={`$${lineup.total_salary.toLocaleString()}`} size='small' variant='outlined' sx={{ fontSize: 11, color: '#90EE90', borderColor: '#90EE90' }} />
                                    )}
                                    {lineup.entry_name && (
                                        <Chip label={lineup.entry_name} size='small' variant='outlined' sx={{ fontSize: 11 }} />
                                    )}
                                    {Object.entries(lineup.stacked_teams || {}).map(([team, count]) => (
                                        <Chip key={team} label={`${team} ${count}+`} size='small' color='primary' sx={{ fontSize: 11 }} />
                                    ))}
                                </Box>
                                {/* Players */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {lineup.players.map((p, j) => {
                                        const own = ownershipMap[p.name.toLowerCase()]
                                        const isStacked = p.position !== 'P' && Object.keys(lineup.stacked_teams || {}).includes(p.team)
                                        return (
                                            <Box
                                                key={j}
                                                sx={{
                                                    px: 0.75, py: 0.25, borderRadius: 0.75,
                                                    bgcolor: isStacked ? 'primary.main' : 'grey.100',
                                                    color: isStacked ? 'white' : 'text.secondary',
                                                    border: '1px solid',
                                                    borderColor: isStacked ? 'primary.main' : 'grey.300',
                                                    fontSize: 11,
                                                    fontWeight: isStacked ? 700 : 400,
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                <Box component='span' sx={{ opacity: 0.75, mr: 0.5, fontSize: 10 }}>{p.position}</Box>
                                                {p.name}
                                                {own && (
                                                    <Box component='span' sx={{ ml: 0.5, opacity: isStacked ? 0.8 : 0.6, fontSize: 10 }}>
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

function ContestResultsPanel({ results, onReupload, contestSlate }) {
    const [selectedTeam, setSelectedTeam] = React.useState(null)
    const [stackLevel, setStackLevel] = React.useState(4)

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selectedTeam && (
                        <ToggleButtonGroup
                            value={stackLevel}
                            exclusive
                            onChange={(_, v) => { if (v !== null) setStackLevel(v) }}
                            size='small'
                        >
                            <ToggleButton value={4} sx={{ py: 0.25, px: 1, fontSize: 12 }}>4+</ToggleButton>
                            <ToggleButton value={5} sx={{ py: 0.25, px: 1, fontSize: 12 }}>5+</ToggleButton>
                        </ToggleButtonGroup>
                    )}
                    <Button
                        size='small'
                        variant='outlined'
                        startIcon={<UploadFileIcon />}
                        onClick={onReupload}
                    >
                        Re-upload
                    </Button>
                </Box>
            </Box>

            {results ? (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <Typography variant='subtitle1' fontWeight={700} gutterBottom>
                                Player Ownership
                            </Typography>
                            <OwnershipTable players={results.player_ownership} />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Typography variant='subtitle1' fontWeight={700} gutterBottom>
                                Team Stacks
                                {selectedTeam
                                    ? <Typography component='span' variant='caption' color='text.secondary' sx={{ ml: 1 }}>click row to deselect</Typography>
                                    : <Typography component='span' variant='caption' color='text.secondary' sx={{ ml: 1 }}>click a row to analyze</Typography>
                                }
                            </Typography>
                            <StacksTable
                                stacks={results.stacks}
                                selectedTeam={selectedTeam}
                                onSelectTeam={setSelectedTeam}
                            />
                        </Grid>
                    </Grid>

                    {selectedTeam && results.lineup_details?.length > 0 && (
                        <StackAnalysisPanel
                            team={selectedTeam}
                            stackLevel={stackLevel}
                            lineupDetails={results.lineup_details}
                            playerOwnership={results.player_ownership}
                            onClose={() => setSelectedTeam(null)}
                        />
                    )}

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
                        Upload a DraftKings contest results CSV to see player ownership and team stacks.
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export { ContestResultsPanel }
