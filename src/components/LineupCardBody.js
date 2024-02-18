import { LineupCardRow } from './LineupCardRow';
import '../styles/PlayerTable.css';
import { useTheme } from '@mui/material/styles';

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
                {playerInfo.map((pos) => (
                    <LineupCardRow key={lineup['name']} pos={pos} player={lineup[pos]} />
                ))}
            </tbody>
        </table>
    )
}
export { LineupCardBody }
