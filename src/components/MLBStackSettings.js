import React from 'react'
import { Box, Button, Divider, FormControl, IconButton, MenuItem, Select, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { MLBStackContext } from './SlateInfo'

function MLBStackSettings() {
    const { mlbStackRules, setMlbStackRules, mlbTeams } = React.useContext(MLBStackContext)

    const addRule = () => {
        setMlbStackRules(prev => [...prev, { count: 4, team: 'ANY' }])
    }

    const removeRule = (index) => {
        setMlbStackRules(prev => prev.filter((_, i) => i !== index))
    }

    const updateCount = (index, value) => {
        setMlbStackRules(prev => prev.map((rule, i) => i === index ? { ...rule, count: value } : rule))
    }

    const updateTeam = (index, value) => {
        setMlbStackRules(prev => prev.map((rule, i) => i === index ? { ...rule, team: value } : rule))
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant='body1' sx={{ mb: 1, textAlign: 'center' }}>Stack Rules</Typography>
            {mlbStackRules.map((rule, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'center' }}>
                    <FormControl size='small' sx={{ minWidth: 55 }}>
                        <Select
                            value={rule.count}
                            onChange={e => updateCount(i, e.target.value)}
                        >
                            {[2, 3, 4, 5].map(n => (
                                <MenuItem key={n} value={n}>{n}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography variant='body2'>from</Typography>
                    <FormControl size='small' sx={{ minWidth: 80 }}>
                        <Select
                            value={rule.team}
                            onChange={e => updateTeam(i, e.target.value)}
                        >
                            <MenuItem value='ANY'>Any</MenuItem>
                            {mlbTeams.map(t => (
                                <MenuItem key={t.abbrev} value={t.abbrev}>{t.abbrev}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <IconButton size='small' onClick={() => removeRule(i)}>
                        <DeleteIcon fontSize='small' />
                    </IconButton>
                </Box>
            ))}
            <Box sx={{ textAlign: 'center' }}>
                <Button size='small' startIcon={<AddIcon />} onClick={addRule}>
                    Add Stack
                </Button>
            </Box>
        </Box>
    )
}

export { MLBStackSettings }
