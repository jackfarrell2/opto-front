import React from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import '../styles/PlayerTable.css'
import { PlayerRow } from './PlayerRow'
import { TextField } from '@mui/material'
import { XValueCell } from './PlayerCells/XValueCell'
import { StaticCell } from './PlayerCells/StaticCell'
import { RemoveCell } from './PlayerCells/RemoveCell'
import { ProjectionCell } from './PlayerCells/ProjectionCell'
import { OwnershipCell } from './PlayerCells/OwnershipCell'
import { LockCell } from './PlayerCells/LockCell'
import { ExposureCell } from './PlayerCells/ExposureCell'
import config from '../config'
import { useMutation } from 'react-query'
import { UserContext } from './UserProvider'

function PlayerTable({ data, setOptimizedLineup, slateId, handleOptimize }) {
    console.log('playerTable is rendering')
    // const [userSettings] = React.useContext(UserSettingsContext)
    const { user, token } = React.useContext(UserContext)
    const userId = user ? user.id : null
    const apiUrl = userId ? `${config.apiUrl}nba/api/authenticated-optimize/` : `${config.apiUrl}nba/api/unauthenticated-optimize/`


    // const optimizeMutation = useMutation(async (requestData) => {
    //     const response = await fetch(apiUrl, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Token ${token}`,
    //         },
    //         body: JSON.stringify(requestData),
    //     });

    //     if (!response.ok) {
    //         throw new Error('Failed to optimize players');
    //     }

    //     return response.json();
    // },
    //     {
    //         onSuccess: (data) => {
    //             setOptimizedLineup(data['lineups'][0])
    //         },
    //     });

    const columns = React.useMemo(() => [
        {
            Header: '',
            accessor: 'select',
            Cell: RemoveCell,
        },
        {
            Header: '',
            accessor: 'lock',
            Cell: LockCell,
        },
        {
            Header: 'Player',
            accessor: 'name',
            Cell: StaticCell,
        },
        {
            Header: 'Position',
            accessor: 'position',
            Cell: StaticCell,
        },
        {
            Header: 'Salary',
            accessor: 'salary',
            Cell: StaticCell,
        },
        {
            Header: 'Team',
            accessor: 'team',
            Cell: StaticCell,
        },
        {
            Header: 'Opp',
            accessor: 'opponent',
            Cell: StaticCell,
        },
        {
            Header: 'Ownership',
            accessor: 'ownership',
            Cell: OwnershipCell,
            sortType: (rowA, rowB, columnId) => {
                const valueA = rowA.original.ownership;
                const valueB = rowB.original.ownership;
                return valueA - valueB;
            },
        },
        {
            Header: 'Exposure',
            accessor: 'exposure',
            Cell: ExposureCell,
            sortType: (rowA, rowB, columnId) => {
                const valueA = rowA.original.exposure;
                const valueB = rowB.original.exposure;
                return valueA - valueB;
            },
        },
        {
            Header: 'Proj',
            accessor: 'projection',
            Cell: ProjectionCell,
            sortType: (rowA, rowB, columnId) => {
                const valueA = rowA.original.projection;
                const valueB = rowB.original.projection;
                return valueA - valueB;
            },
        },
        {
            Header: 'Value',
            accessor: 'xvalue',
            Cell: XValueCell,
            sortType: (rowA, rowB, columnId) => {
                const valueA = rowA.original.xvalue;
                const valueB = rowB.original.xvalue;
                return valueA - valueB;
            },
        },
    ], [])

    const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy);

    const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
    } = React.useMemo(() => tableInstance, [tableInstance]);

    const { globalFilter } = state;

    function handleSearchChange(e) {
        const newFilterValue = e.target.value;
        const filteredRows = rows.filter(row => {
            const rowString = Object.values(row.values).join(' ');
            return rowString.toLowerCase().includes(newFilterValue.toLowerCase());
        });

        if (filteredRows.length > 0 || newFilterValue === '') {
            setGlobalFilter(newFilterValue);
        }
    }

    function formDataToObject(formData) {
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        return formDataObj;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        // const uniquesPerLineup = parseInt(localStorage.getItem('uniquePlayers')) || 3
        // const maxPlayersPerTeam = parseInt(localStorage.getItem('maxPlayersPerTeam')) || 5
        // const minSalary = parseInt(localStorage.getItem('min-salary')) || 45000
        // const maxSalary = parseInt(localStorage.getItem('max-salary')) || 50000
        // const numLineups = parseInt(localStorage.getItem('lineupCount')) || 20
        // const optoSettings = { 'uniques': uniquesPerLineup, 'maxTeamPlayers': maxPlayersPerTeam, 'minSalary': minSalary, 'maxSalary': maxSalary, 'numLineups': numLineups }
        const formData = new FormData(e.target);
        const timeout = globalFilter ? 1500 : 0;
        setGlobalFilter('');
        setTimeout(() => {
            const formDataObj = formDataToObject(formData);
            handleOptimize(formDataObj)
        }, timeout)
    }

    return (
        <>
            <TextField size='small' id="filled-search" label="Search Player" type="search" variant="filled" value={globalFilter || ''} onChange={handleSearchChange} />
            <form id='PlayerTableForm' onSubmit={handleFormSubmit}>
                <div>
                    <table className='player-table' {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                        </th>
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
                </div>
            </form>
        </>
    )
}

export { PlayerTable }