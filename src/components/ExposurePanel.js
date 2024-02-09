import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { teamColors } from '../styles/colors'

function ExposurePanel({ exposures }) {
    // Get an array of player IDs
    const exposuresArray = Object.entries(exposures).map(([id, data]) => ({ id, ...data }));
    exposuresArray.sort((a, b) => b.exposure - a.exposure);

    return (
        <>
            {exposures && (
                <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                    <TableContainer component={Paper}>
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
                                            {item["exposure"]} %
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </>
    );
}

export { ExposurePanel };
