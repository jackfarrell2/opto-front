import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function ScrollableOptoTabs({ optoCount, setSelectedOpto, selectedOpto }) {
    const handleChange = (event, newValue) => {
        setSelectedOpto(newValue);
    };

    const tabLabels = Array.from({ length: optoCount }, (_, index) => index + 1);

    return (
        <Box sx={{ maxWidth: '90vw' }}>
            <Tabs
                value={selectedOpto - 1}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons='auto'
                aria-label="opto-tabs"
                indicatorColor="secondary"
                textColor='inherit'
            >
                {tabLabels.map(label => (
                    <Tab onClick={() => setSelectedOpto(label)} sx={{ color: '#352311' }} key={label} label={`Opto ${label}`} />
                ))}
            </Tabs>
        </Box>
    );
}

export { ScrollableOptoTabs };