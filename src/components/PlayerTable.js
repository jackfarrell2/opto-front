import React from 'react'
import { useTable, useSortBy } from 'react-table'
import '../styles/PlayerTable.css'
import { LockCell } from './LockCell'
import { RemoveCell } from './RemoveCell'
import { ProjectionCell } from './ProjectionCell'

function PlayerTable({ columns, data }) {
    const [playerData, setPlayerData] = React.useState(data)
 
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: playerData }, useSortBy)

    const [lockedPlayers, setLockedPlayers] = React.useState([])
    const [removedPlayers, setRemovedPlayers] = React.useState([])

    function handleLockChange(change, player) {
        if (change === 'lock') {
            const lockedBuffer = [...lockedPlayers]
            lockedBuffer.push(player)
            setLockedPlayers(lockedBuffer)
        } else if (change === 'unlock') {
            const lockedBuffer = [...lockedPlayers]
            const index = lockedBuffer.indexOf(player)
            lockedBuffer.splice(index, 1)
            setLockedPlayers(lockedBuffer)
        }
    }

    function handleRemovePlayer(change, player) {
        if (change === 'remove') {
            const removedBuffer = [...removedPlayers]
            const index = removedBuffer.indexOf(player)
            removedBuffer.splice(index, 1)
            setRemovedPlayers(removedBuffer)
        } else if (change === 'add') {
            const removedBuffer = [...removedPlayers]
            removedBuffer.push(player)
            setRemovedPlayers(removedBuffer)
        }
    }

    function handleProjectionChange(projection, playerId) {
        const playerBuffer = [...playerData]
        console.log('projection', projection)
        const updatedPlayerData = playerBuffer.map((player => 
            player.id === playerId ? { ...player, projection: projection} : player))
        setPlayerData(updatedPlayerData)
        console.log(projection, playerId, updatedPlayerData)
    }


    return (
        <table className='player-table' {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}> 
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}> 
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()} className={`${cell.column.id}-cell`}>
                                        {cell.column.id === 'projection' ? (
                                            <ProjectionCell projection={cell.row.original.projection} player={cell.row.original.id} handleProjectionChange={handleProjectionChange} />
                                        ): cell.column.id === 'value' ? (
                                            (row.original.projection / (row.original.salary / 1000)).toFixed(2)
                                        ) : cell.column.id === 'ownership' ? (
                                            <input type='text' onChange={() => console.log('changed')} value={cell.row.original.ownership ? cell.row.original.ownership : 0} style={{ maxWidth: '50px', textAlign: 'center', minWidth: '50px' }}/>
                                        ) : cell.column.id === 'lock' ? (
                                            <LockCell player={cell.row.original.name} lockedPlayers={lockedPlayers} removedPlayers={removedPlayers} handleLockChange={handleLockChange} />
                                        ) : cell.column.id === 'select' ? (
                                            <RemoveCell player={cell.row.original.name} removedPlayers={removedPlayers} lockedPlayers={lockedPlayers} handleRemovePlayer={handleRemovePlayer} />
                                        ) : cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export { PlayerTable }