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

function PlayerTable({ data, optomize }) { 
    const apiUrl = `${config.apiUrl}nba/optomize/`
    const optimizeMutation = useMutation(async (formData) => {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
        throw new Error('Failed to optimize players');
        }

        return response.json();
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
            Header: 'Pos',
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
            Header: 'Own',
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

    // I may choose to use this later instead of the handleSearchChange
    // (e) => setGlobalFilter(e.target.value)

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
        const formDataObject = Object.fromEntries(formData);
        const json = JSON.stringify(formDataObject);
        const timeout = globalFilter ? 1500 : 0;
        setGlobalFilter('');
        setTimeout(() => {
            optimizeMutation.mutate(json);

        }, timeout)
    }

    return (
        <form id='PlayerTableForm' onSubmit={handleFormSubmit}>
            <div>
                <TextField size='small' id="filled-search" label="Search Player" type="search" variant="filled" value={globalFilter || ''} onChange={handleSearchChange} />
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
    )
}

export { PlayerTable }