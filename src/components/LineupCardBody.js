import React from 'react'
import { LineupCardRow } from './LineupCardRow';
import '../styles/PlayerTable.css';
import { useTheme } from '@mui/material/styles';
import { Divider } from '@mui/material';

function LineupCardBody({ lineup }) {
    let sport = 'nba'
    if (lineup['P1']) {
        sport = 'mlb'
    }
    if (lineup['QB']) {
        sport = 'nfl'
    }
    let playerInfo = []
    if (sport === 'mlb') {
        playerInfo = ['P1', 'P2', 'C', 'FB', 'SB', 'TB', 'SS', 'OF1', 'OF2', 'OF3']
    } else if (sport === 'nfl') {
        playerInfo = ['QB', 'RB1', 'RB2', 'WR1', 'WR2', 'WR3', 'TE', 'FLEX', 'DST']
    } else {
        playerInfo = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL']
    }

    const theme = useTheme();
    const secondaryColor = theme.palette.secondary.main;

    return (
        <table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
            <thead>
                <tr style={{ height: '5vh', fontSize: '1.5vh', color: 'white', backgroundColor: secondaryColor }}>
                    <th>Pos</th>
                    <th></th>
                    <th>Salary</th>
                    <th>Team</th>
                    <th>Opp</th>
                    <th>Proj</th>
                </tr>
            </thead>
            <tbody>
                {playerInfo.map((pos, index) => (
                    <React.Fragment key={index}>
                        <LineupCardRow sport={sport} key={lineup['name']} pos={pos} player={lineup[pos]} />
                        {index < playerInfo.length - 1 && (
                            <tr>
                                <td colSpan={6} style={{ padding: 0 }}>
                                    <Divider style={{ margin: 0 }} />
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    )
}
export { LineupCardBody }
