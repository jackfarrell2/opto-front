import React from 'react'
import { Grid, Tabs, Tab, Box, Typography, TextField, IconButton, useMediaQuery } from '@mui/material'
import PropTypes from 'prop-types'
import { SimpleSettings } from './SimpleSettings';
import { UserSettingsContext } from './SlateInfo'
import { ExposurePanel } from './ExposurePanel';
import { LoadingButton } from '@mui/lab';
import { UserContext } from './UserProvider';
import { ConfirmSignUpModal } from './ConfirmSignUpModal';
import CalculateIcon from '@mui/icons-material/Calculate';
import CancelIcon from '@mui/icons-material/Cancel';

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

function SettingsPanel({ sport, tab, setTab, exposures, selectedOpto, buttonLoading, handleCancelOptimize, handleOptimization, optoLen }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { user } = React.useContext(UserContext)
    const [openConfirmModal, setOpenConfirmModal] = React.useState(false)
    const [showedWarning, setShowedWarning] = React.useState(false)
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

    function handleOptimizeClick() {
        handleOptimization()
        if (!user && !showedWarning) {
            setOpenConfirmModal(true)
            setShowedWarning(true)
        }
    }

    return (
        <>
            <ConfirmSignUpModal openConfirmModal={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal}></ConfirmSignUpModal>
            <Grid container direction='column' justifyContent='space-between' alignItems='stretch' spacing={0} style={{ minHeight: isMobile ? '50vh' : '70vh' }}>
                <Grid item>
                    <Grid style={{ height: '100%' }} container direction='column' justifyContent='flex-start' alignItems='stretch'>
                        <Grid item>
                            <Box>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider', textColor: 'secondary' }}>
                                    <Tabs value={tab} onChange={handleTabChange} textColor='inherit' indicatorColor='inherit' variant='fullWidth'>
                                        <Tab sx={{ width: '50%', color: 'white', backgroundColor: 'primary.main' }} label='Settings' {...a11yProps(0)} />
                                        <Tab sx={{ width: '50%', color: 'white', backgroundColor: 'primary.main' }} label='Exposures' {...a11yProps(1)} />
                                    </Tabs>
                                </Box>
                                <CustomTabPanel sx={{ width: '100%' }} value={tab} index={0}>
                                    <SimpleSettings sport={sport} />
                                </CustomTabPanel>
                                <CustomTabPanel sx={{ width: '100%' }} value={tab} index={1}>
                                    <ExposurePanel sport={sport} optoLen={optoLen} exposures={exposures} selectedOpto={selectedOpto} />
                                </CustomTabPanel>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid container direction='row' justifyContent='center' alignItems='flex-end' spacing={!isMobile ? 2 : 1.5}>
                        <Grid item xs={12}>
                            <TextField sx={{ width: '10vh', textAlign: 'center' }} onChange={handleTotalLineupsChange} id="lineup-count" label="Lineups" value={userSettings['num-lineups']} variant="standard" inputProps={{ style: { textAlign: 'center' } }} />
                        </Grid>
                        <Grid item xs={12}>
                            <LoadingButton onClick={handleOptimizeClick} size='medium' endIcon={<CalculateIcon />} loading={buttonLoading} loadingPosition='end' variant='contained' color='primary' disabled={!ready}>Optimize</LoadingButton>
                            {buttonLoading && <IconButton onClick={handleCancelOptimize}><CancelIcon color='error' /></IconButton>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
        </>
    )
}
export { SettingsPanel }