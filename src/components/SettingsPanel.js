import React from 'react'
import { Grid, Button, Tabs, Tab, Box, Typography, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { SimpleSettings } from './SimpleSettings';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component={'span'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_UNIQUES':
            return { ...state, uniques: action.payload }
        case 'UPDATE_NUM_LINEUPS':
            return { ...state, numLineups: action.payload }
        case 'UPDATE_MAX_PLAYERS':
            return { ...state, maxTeamPlayers: action.payload }
        case 'UPDATE_MIN_SALARY':
            return { ...state, minSalary: action.payload }
        case 'UPDATE_MAX_SALARY':
            return { ...state, maxSalary: action.payload }
        default:
            return state
    }

}


function SettingsPanel() {
    const [tab, setTab] = React.useState(0)
    const initualUserSettings = { 'uniques': 3, 'numLineups': 20, 'maxTeamPlayers': 6, 'minSalary': 45000, 'maxSalary': 50000 }
    const [userSettings, dispatchSettings] = React.useReducer(reducer, initualUserSettings)
    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const ready = (userSettings['numLineups'] > 0 && userSettings['numLineups'] <= 150 && userSettings['minSalary'] >= 40000 && userSettings['minSalary'] <= 50000 && userSettings['maxSalary'] >= 40000 && userSettings['maxSalary'] <= 50000) ? true : false


    function handleTotalLineupsChange(e) {
        const inputValue = e.target.value;
        if (inputValue === '') {
            dispatchSettings({ type: 'UPDATE_NUM_LINEUPS', payload: inputValue });
            return;
        }
        const newValue = parseInt(inputValue, 10);

        if (isNaN(newValue)) {
            console.error('Invalid input for total lineups. Please enter a number between 1 and 150.');
            return;
        }

        if (newValue >= 150) {
            dispatchSettings({ type: 'UPDATE_NUM_LINEUPS', payload: 150 });
        } else {
            dispatchSettings({ type: 'UPDATE_NUM_LINEUPS', payload: newValue });
        }
    }


    return (
        <Grid style={{ height: '75vh' }} container direction='column' justifyContent='space-between' alignItems='stretch' spacing={0}>
            <Grid item xs={8}>
                <Grid container direction='row' justifyContent='center' alignItems='flex-start'>
                    <Grid item xs={12}>
                        <Box>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', textColor: 'secondary' }}>
                                <Tabs value={tab} onChange={handleTabChange} textColor='inherit' indicatorColor='inherit'>
                                    <Tab sx={{ width: '50%', color: 'white', backgroundColor: 'primary.main' }} label='Settings' {...a11yProps(0)} />
                                    <Tab sx={{ width: '50%', color: 'white', backgroundColor: 'primary.main' }} label='Exposures' {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel sx={{ width: '100%' }} value={tab} index={0}>
                                <SimpleSettings userSettings={userSettings} dispatchSettings={dispatchSettings} />
                            </CustomTabPanel>
                            <CustomTabPanel sx={{ width: '100%' }} value={tab} index={1}>
                            </CustomTabPanel>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }} xs={4}>
                <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
                    <Grid item xs={6}>
                        {userSettings && (<TextField sx={{ width: '10vh', textAlign: 'center' }} onChange={handleTotalLineupsChange} id="min-salary" label="Lineups" value={userSettings['numLineups']} variant="standard" inputProps={{ style: { textAlign: 'center' } }} />)}
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant='contained' form='PlayerTableForm' color='primary' disabled={!ready} type='submit'>Optimize</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
export { SettingsPanel }