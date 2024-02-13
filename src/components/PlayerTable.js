import React from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import '../styles/PlayerTable.css'
import { PlayerRow } from './PlayerRow'
import { TextField, Grid, Button } from '@mui/material'
import { XValueCell } from './PlayerCells/XValueCell'
import { StaticCell } from './PlayerCells/StaticCell'
import { RemoveCell } from './PlayerCells/RemoveCell'
import { ProjectionCell } from './PlayerCells/ProjectionCell'
import { OwnershipCell } from './PlayerCells/OwnershipCell'
import { LockCell } from './PlayerCells/LockCell'
import { ExposureCell } from './PlayerCells/ExposureCell'


function PlayerTable({ data, handleOptimize, slateId }) {

    // Define columns
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

    // Create table instance

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

    // Search 
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

    // Retrieve stored data from local storage
    const storedData = localStorage.getItem('only-my') || '{}';
    const existingData = JSON.parse(storedData);

    // Remove expired items
    const now = new Date().getTime();
    for (const key in existingData) {
        if (now > existingData[key].expiresAt) {
            delete existingData[key];
        }
    }

    const booleanValueForSlateId = existingData[slateId] ? existingData[slateId].value : false;
    const [isFilterActive, setIsFilterActive] = React.useState(booleanValueForSlateId);

    // Use existingData as needed...


    const filteredRows = React.useMemo(() => {
        if (isFilterActive) {
            return rows.filter(row => row.original.projection['custom'] === true);
        } else {
            return rows;
        }
    }, [isFilterActive, rows]);

    function formDataToObject(formData) {
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        return formDataObj;
    }

    // Submit optimize
    function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const timeout = globalFilter ? 1500 : 0;
        setGlobalFilter('');
        setTimeout(() => {
            const formDataObj = formDataToObject(formData);
            handleOptimize(formDataObj)
        }, timeout)
    }

    function handleOnlyUseClick() {
        setIsFilterActive(prevIsFilterActive => {
            const newIsFilterActive = !prevIsFilterActive;
            const storedData = localStorage.getItem('only-my') || '{}';
            const existingData = JSON.parse(storedData);
            const expirationTimestamp = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 days expiration
            existingData[slateId] = { value: newIsFilterActive, expiresAt: expirationTimestamp };

            // Save updated data to local storage
            localStorage.setItem('only-my', JSON.stringify(existingData));

            return newIsFilterActive;
        });
    }





    return (
        <>

            <div>
                <Grid container direction='row' justifyContent='space-between' alignItems='flex-end' spacing={2}>
                    <Grid item>
                        <TextField size='small' id="filled-search" label="Search Player" type="search" variant="filled" value={globalFilter || ''} onChange={handleSearchChange} />
                    </Grid>
                    <Grid item>
                        <Grid style={{ marginBottom: '2vh' }} container direction='row' justifyContent='space-between' alignItems='center' spacing={2}>
                            <Grid item>
                                <Button sx={{ marginRight: '2vh' }} onClick={handleOnlyUseClick} variant='outlined' color='secondary'>{!isFilterActive ? 'Only Use My Projections' : 'Use All Projections'}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
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
                                {filteredRows.map(row => {
                                    prepareRow(row);
                                    return <PlayerRow key={row.id} row={row} />;
                                })}
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
        </>
    )
}

export { PlayerTable }