import React from 'react'
import { Grid, Typography, Button, Chip, Box, Slider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { mlbTeamColors } from '../styles/colors'

function JackOptoForm({ teams, onConfirm, setOpenJackOptoModal }) {
    const [rankedTeams, setRankedTeams] = React.useState([])
    const [variance, setVariance] = React.useState(20)

    function handleTeamClick(teamAbbrev) {
        if (rankedTeams.includes(teamAbbrev)) {
            setRankedTeams(rankedTeams.filter(t => t !== teamAbbrev))
        } else {
            setRankedTeams([...rankedTeams, teamAbbrev])
        }
    }

    function handleClear() {
        setRankedTeams([])
    }

    function handleConfirm() {
        onConfirm(rankedTeams, variance)
        setOpenJackOptoModal(false)
    }

    const rankOf = (abbrev) => {
        const idx = rankedTeams.indexOf(abbrev)
        return idx === -1 ? null : idx + 1
    }

    return (
        <>
            <Button onClick={() => setOpenJackOptoModal(false)} sx={{ color: 'primary' }}>
                <CloseIcon sx={{ color: 'primary' }} />
            </Button>
            <Grid container sx={{ p: 2 }} direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item sx={{ textAlign: 'center' }}>
                    <Typography variant='h6'>Select & Rank Teams for 5-Hitter Stacks</Typography>
                    <Typography variant='body2' sx={{ mt: 1, color: 'text.secondary' }}>
                        Click teams in the order you want to rank them. Higher rank = more lineups.
                    </Typography>
                </Grid>
                <Grid item>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', maxWidth: 460 }}>
                        {teams.map(team => {
                            const abbrev = team.abbrev
                            const rank = rankOf(abbrev)
                            const isSelected = rank !== null
                            const bgColor = mlbTeamColors[abbrev] || '#666'
                            return (
                                <Chip
                                    key={abbrev}
                                    label={isSelected ? `${rank}. ${abbrev}` : abbrev}
                                    onClick={() => handleTeamClick(abbrev)}
                                    sx={{
                                        backgroundColor: isSelected ? bgColor : 'transparent',
                                        color: isSelected ? '#fff' : bgColor,
                                        border: `2px solid ${bgColor}`,
                                        fontWeight: isSelected ? 'bold' : 'normal',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: isSelected ? bgColor : `${bgColor}22`,
                                        }
                                    }}
                                />
                            )
                        })}
                    </Box>
                </Grid>
                <Grid item sx={{ width: '80%', textAlign: 'center' }}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Stack Variance: {variance}%
                    </Typography>
                    <Slider
                        value={variance}
                        onChange={(e, val) => setVariance(val)}
                        min={0}
                        max={75}
                        step={5}
                        valueLabelDisplay='auto'
                        valueLabelFormat={v => `${v}%`}
                        marks={[{ value: 0, label: '0%' }, { value: 20, label: '20%' }, { value: 75, label: '75%' }]}
                        size='small'
                    />
                </Grid>
                <Grid item>
                    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                        <Grid item>
                            <Button onClick={handleClear} variant='outlined' color='error'>Clear</Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={handleConfirm} variant='contained' color='primary' disabled={rankedTeams.length === 0}>Confirm</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export { JackOptoForm }
