import React from 'react'
import { Grid, Button, Tabs, Tab, Box, Typography } from '@mui/material'
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
            <Typography>{children}</Typography>
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

function SettingsPanel() {
    const [tab, setTab] = React.useState(0)
    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };
    return (
        <Grid sx={{height: '75vh'}} container direction='column' justifyContent='space-between' alignItems='center' spacing={0}>
            <Grid item xs={8}>
                <Grid container direction='row' justifyContent='center' alignItems='flex-start' spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={{width: '100%'}}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tab} onChange={handleTabChange} textColor='primary' indicatorColor='primary'>
                                    <Tab label='Settings' {...a11yProps(0)} >
                                    </Tab>
                                    <Tab label='Exposures' {...a11yProps(1)}>
                                    </Tab>
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={tab} index={0}>
                                <SimpleSettings />
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={1}>
                                <div>
                                    exposures
                                </div>
                            </CustomTabPanel>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }} xs={4}>
                <Button variant='contained' color='primary'>Optimize</Button>
            </Grid>
        </Grid>
    )
}
export { SettingsPanel }