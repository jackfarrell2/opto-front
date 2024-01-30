import React from "react"
import { LockedContext } from "./SlateInfo"
import LockIcon from '@mui/icons-material/Lock';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Grid } from "@mui/material";

function LockedData() {
    const [lockedData] = React.useContext(LockedContext)
    const totalLockedSalary = lockedData['salary'].toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    if (lockedData['count'] === 0) {
        return (
            <Grid container direction='row' alignItems='center' justifyContent='center' spacing={1}>
                <Grid item>
                    <LockOutlinedIcon />
                </Grid>
                <Grid item>
                    <Typography>(0)</Typography>
                </Grid>
                <Grid item>
                    <Typography>$0</Typography>
                </Grid>
            </Grid>
        )
    } else {
        return (
            <Grid container direction='row' alignItems='center' justifyContent='center' spacing={1}>
                <Grid item>
                    <LockIcon />
                </Grid>
                <Grid item>
                    <Typography>({lockedData['count']})</Typography>
                </Grid>
                <Grid item>
                    <Typography sx={{ color: 'red' }}>{totalLockedSalary}</Typography>
                </Grid>
            </Grid>
        )
    }
}

export { LockedData }