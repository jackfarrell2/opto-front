import { Paper,Container } from '@mui/material'
import { LineupCardBody } from './LineupCardBody'
import { LineupCardHeader } from './LineupCardHeader'

function LineupCard({lineup}) {
    return (
        <Paper sx={{m: '3vh'}} elevation={20}>
            <Container>
                <LineupCardHeader projection={lineup['total_projection']} salary={lineup['total_salary']} number={1} />
                <LineupCardBody lineup={lineup} />
            </Container>
        </Paper>
    )
}

export { LineupCard }