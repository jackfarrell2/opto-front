import React from 'react'
import { Grid, Button, Tabs, Tab, Box, Typography, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { SimpleSettings } from './SimpleSettings';
import { UserSettingsContext } from './SlateInfo'
import { ExposurePanel } from './ExposurePanel';

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

function SettingsPanel({ tab, setTab, exposures, selectedOpto }) {
    const [userSettings, setUserSettings] = React.useContext(UserSettingsContext)
    const lineupCount = userSettings['num-lineups']
    const minSalary = userSettings['min-salary']
    const maxSalary = userSettings['max-salary']
    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const ready = (lineupCount > 0 && lineupCount <= 150 && minSalary >= 40000 && minSalary <= 50000 && maxSalary >= 40000 && maxSalary <= 50000) ? true : false

    function handleTotalLineupsChange(e) {
        const inputValue = e.target.value;
        if (inputValue === '') {
            setUserSettings({ ...userSettings, 'num-lineups': '' });
            return;
        }
        const newValue = parseInt(inputValue, 10);

        if (isNaN(newValue)) {
            console.error('Invalid input for total lineups. Please enter a number between 1 and 150.');
            return;
        }

        if (newValue >= 150) {
            setUserSettings({ ...userSettings, 'num-lineups': 150 });
        } else {
            setUserSettings({ ...userSettings, 'num-lineups': newValue });
        }
    }


    return (
        <Grid style={{ height: '75vh' }} container direction='row' justifyContent='center' alignItems='space-between' spacing={0}>
            <Grid item xs={12}>
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
                                <SimpleSettings />
                            </CustomTabPanel>
                            <CustomTabPanel sx={{ width: '100%' }} value={tab} index={1}>
                                <ExposurePanel exposures={exposures} selectedOpto={selectedOpto} />
                            </CustomTabPanel>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
                    <Grid item xs={6}>
                        {userSettings['num-lineups'] && (<TextField sx={{ width: '10vh', textAlign: 'center' }} onChange={handleTotalLineupsChange} id="lineup-count" label="Lineups" value={userSettings['num-lineups']} variant="standard" inputProps={{ style: { textAlign: 'center' } }} />)}
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