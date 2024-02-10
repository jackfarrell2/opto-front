import React from 'react'
import { RemoveCell } from './PlayerCells/RemoveCell'
import { LockCell } from './PlayerCells/LockCell'
import { StaticCell } from './PlayerCells/StaticCell'
import { OwnershipCell } from './PlayerCells/OwnershipCell'
import { ProjectionCell } from './PlayerCells/ProjectionCell'
import { XValueCell } from './PlayerCells/XValueCell'
import { ExposureCell } from './PlayerCells/ExposureCell'
import { updatePlayerSettings } from '../util/nbaUtils'
import { UserContext } from './UserProvider'

const PlayerRow = React.memo(function PlayerRow({ row }) {
    const { token } = React.useContext(UserContext)
    const [playerSettings, setPlayerSettings] = React.useState({ 'ownership': row.original.ownership, 'exposure': row.original.exposure, 'projection': row.original.projection, 'lock': row.original.lock, 'remove': row.original.remove })
    const [storedValue, setStoredValue] = React.useState(playerSettings)

    const setStoredValueMeta = React.useCallback(async (value) => {
        if (value === storedValue) return
        setStoredValue(value)
        try {
            await updatePlayerSettings(row.original.id, value, token);
        } catch (error) {
            console.error('Failed to update user settings', error)
        }
    }, [row.original.id, storedValue, token])

    React.useEffect(() => {
        if (!token) return
        const timeoutId = setTimeout(() => setStoredValueMeta(playerSettings), 1200);
        return () => clearTimeout(timeoutId);
    }, [setStoredValueMeta, playerSettings, token]);

    return (
        <tr {...row.getRowProps()}>
            <RemoveCell cell={row.cells[0]} playerSettings={playerSettings} setPlayerSettings={setPlayerSettings} />
            <LockCell cell={row.cells[1]} playerSettings={playerSettings} setPlayerSettings={setPlayerSettings} />
            <StaticCell cell={row.cells[2]} value={row.original.name} className='player-cell' />
            <StaticCell cell={row.cells[3]} value={row.original.position} />
            <StaticCell cell={row.cells[4]} value={row.original.salary} />
            <StaticCell cell={row.cells[5]} value={row.original.team} />
            <StaticCell cell={row.cells[6]} value={row.original.opponent} />
            <OwnershipCell cell={row.cells[7]} playerSettings={playerSettings} setPlayerSettings={setPlayerSettings} />
            <ExposureCell cell={row.cells[8]} playerSettings={playerSettings} setPlayerSettings={setPlayerSettings} />
            <ProjectionCell cell={row.cells[9]} playerSettings={playerSettings} setPlayerSettings={setPlayerSettings} />
            <XValueCell cell={row.cells[10]} projection={playerSettings['projection']['projection']} salary={row.original.salary} />
        </tr>
    );
});

export { PlayerRow }