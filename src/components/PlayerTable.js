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

function PlayerTable({ data, setOptimizedLineup, slateId }) {

    const { user, token } = React.useContext(UserContext)
    console.log('slateId', slateId)
    const userId = user.id
    const apiUrl = userId ? `${config.apiUrl}nba/api/authenticated-optimize/` : `${config.apiUrl}nba/api/unauthenticated-optimize/`

    function formDataToObject(formData) {
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }

    const optimizeMutation = useMutation(async (requestData) => {
        console.log('requestData', Object.keys(requestData['players']).length)
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error('Failed to optimize players');
        }

        return response.json();
    },
        {
            onSuccess: (data) => {
                setOptimizedLineup(data['lineup'])
            },
        });

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

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable({ columns, data }, useGlobalFilter, useSortBy)

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

    function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log('formData', formData)
        const timeout = globalFilter ? 1500 : 0;
        setGlobalFilter('');
        setTimeout(() => {
            const requestData = {
                'slate-id': slateId,
                'user-id': userId,
                'players': formDataToObject(formData)
            }

            // Iterate over form fields and include only those with the selected slate ID
            for (const [key, value] of formData.entries()) {
                console.log('key', key)
                console.log('value', value)
            }

            optimizeMutation.mutate(requestData);

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