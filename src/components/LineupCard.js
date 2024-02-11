import { Paper, Container } from '@mui/material'
import { LineupCardBody } from './LineupCardBody'
import { LineupCardHeader } from './LineupCardHeader'

function LineupCard({ lineup, index }) {
    return (
        <Paper sx={{ m: '2vh' }} elevation={20}>
            <Container disableGutters>
                <LineupCardHeader projection={lineup['total_projection']} salary={lineup['total_salary']} number={index + 1} />
                <LineupCardBody lineup={lineup} />
            </Container>
        </Paper>
    )
}

export { LineupCard }