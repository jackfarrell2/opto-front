import React from 'react'
import { Grid, Box, Tab, Tabs, Typography } from "@mui/material"
import { LineupCard } from "./LineupCard"

function LineupsDash({ optimizedLineups }) {
    const [tab, setTab] = React.useState(0)
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    return (
        <>
            <Box sx={{ height: '7.5vh', backgroundColor: '#92a3b8', mt: 5 }}>
                <Grid style={{ height: '100%' }} container direction='row' justifyContent='center' alignItems='center'>
                    <Grid item xs={10}>
                        <Tabs value={tab} onChange={handleChange} variant='scrollable' scrollButtons='auto' aria-label="optimization-tabs">
                            <Tab sx={{ color: 'white' }} label="Opto One" value="0" />
                        </Tabs>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container justifyContent='flex-end' alignItems='center'>
                            <Grid item>
                                <Typography sx={{ mr: '3vh' }}>Export Lineups</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Grid container direction='row' justifyContent='flex-start' alignItems='flex-start' spacing={3}>
                {optimizedLineups.map((lineup, index) => (
                    <Grid key={index} item xs={4}>
                        <LineupCard lineup={lineup} index={index} />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export { LineupsDash }