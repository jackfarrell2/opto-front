import React from 'react'
import { useTable, useSortBy } from 'react-table'
import '../styles/PlayerTable.css'
import { PlayerRow } from './PlayerRow'

function PlayerTable({ columns, data }) {
    const [playerData, setPlayerData] = React.useState(data)
 
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: playerData }, useSortBy)

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
                prepareRow(row);
                return <PlayerRow key={row.id} row={row} />;
                })}
            </tbody>
        </table>
    )
}

export { PlayerTable }