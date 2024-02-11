
import { Typography, Divider } from "@mui/material"
import '../styles/PlayerTable.css';
import { teamColors } from '../styles/colors'

function LineupCardRow({ player, pos }) {
    return (
        <>
            <tr style={{ color: 'white', height: '6vh', backgroundColor: teamColors[player['team']] }}>
                <td className='lineup-card-cell'><Typography variant="body2">{pos}</Typography></td>
                <td><Typography variant="body2">{player['name']}</Typography></td>
                <td className='lineup-card-cell'><Typography variant="body2">${player['salary']}</Typography></td>
                <td className='lineup-card-cell'><Typography variant="body2">{player['team']}</Typography></td>
                <td className='lineup-card-cell'><Typography variant="body2">{player['opponent']}</Typography></td>
                <td className='lineup-card-cell'><Typography variant="body2">{player['projection']}</Typography></td>
            </tr>
            <Divider />
        </>
    )
}

export { LineupCardRow }