import React from 'react'
import { LineupCardRow } from './LineupCardRow';
import '../styles/PlayerTable.css';
import { useTheme } from '@mui/material/styles';
import { Divider } from '@mui/material';

function LineupCardBody({ lineup }) {
    const playerInfo = Object.keys(lineup).filter(
        (key) => key !== 'total_projection' && key !== 'total_salary'
    );

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
                        <LineupCardRow key={lineup['name']} pos={pos} player={lineup[pos]} />
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
