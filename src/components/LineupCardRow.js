
import { Typography } from "@mui/material"
import '../styles/PlayerTable.css';
import { teamColors, mlbTeamColors, nflTeamColors } from '../styles/colors'

function LineupCardRow({ sport, player, pos }) {
    let cardColors = teamColors
    if (sport === 'mlb') {
        cardColors = mlbTeamColors
    } else if (sport === 'nfl') {
        cardColors = nflTeamColors
    }
    const mlbPositionMappings = { 'P1': 'P', 'P2': 'P', 'C': 'C', 'FB': '1B', 'SB': '2B', 'TB': '3B', 'SS': 'SS', 'OF1': 'OF', 'OF2': 'OF', 'OF3': 'OF' }
    const nflPositionMappings = { 'QB': 'QB', 'TE': 'TE', 'DST': 'DST', 'RB1': 'RB', 'RB2': 'RB', 'WR1': 'WR', 'WR2': 'WR', 'WR3': 'WR', 'FLEX': 'FLEX' }

    return (
        <>
            <tr style={{ color: 'white', height: '5vh', backgroundColor: cardColors[player['team']] }}>
                <td className='lineup-card-cell'><Typography variant="body2">{(sport === 'mlb') ? mlbPositionMappings[pos] : (sport === 'nfl') ? nflPositionMappings[pos] : pos}</Typography></td>
                <td><Typography variant="body2">{player['name']}</Typography></td>
                <td className='lineup-card-cell'><Typography variant="body2">${player['salary']}</Typography></td>
                <td className='lineup-card-cell'><Typography variant="body2">{player['team']}</Typography></td>
                <td className='lineup-card-cell'><Typography variant="body2">{player['opponent']}</Typography></td>
                <td className='lineup-card-cell'><Typography variant="body2">{player['projection']}</Typography></td>
            </tr>
        </>
    )
}

export { LineupCardRow }