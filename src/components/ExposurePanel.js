import React from 'react'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Typography } from '@mui/material';
import { teamColors } from '../styles/colors'

function ExposurePanel({ exposures, selectedOpto, optoLen }) {

    const exposuresArray = React.useMemo(() => {
        let array = [];
        if (exposures && exposures[selectedOpto]) {
            array = Object.entries(exposures[selectedOpto]).map(([id, data]) => ({ id, ...data }));
            array.sort((a, b) => b.count - a.count);
        }
        return array;
    }, [exposures, selectedOpto]);

    return (
        <>
            {exposures && (
                <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                    {/* <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                            </TableHead>
                            <TableBody>
                                {exposuresArray.map((item, index) => (
                                    <TableRow key={index} style={{ color: 'white', backgroundColor: teamColors[`${item.team}`] }}>
                                        <TableCell style={{ color: 'white' }} component="th" scope="row">
                                            <span>{item["player-name"]}</span>
                                            <span> (</span><span>{item["count"]}<span>)</span></span>
                                        </TableCell>
                                        <TableCell style={{ color: 'white' }} align="right">
                                            {Math.trunc((item["count"] / optoLen) * 100)} %
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer> */}
                </Box>
            )}
            {(exposuresArray.length === 0) && (
                <Grid container direction='row' justifyContent='center' alignItems='center'>
                    <Grid item>
                        <Typography>You haven't optimized any lineups!</Typography>
                    </Grid>
                </Grid>
            )}
        </>
    );
}

export { ExposurePanel };
