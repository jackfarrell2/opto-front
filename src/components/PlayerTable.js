import React from 'react'
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table'
import '../styles/PlayerTable.css'
import { PlayerRow } from './PlayerRow'
import { TextField, Grid, Button, useMediaQuery, Box } from '@mui/material'
import { XValueCell } from './PlayerCells/XValueCell'
import { StaticCell } from './PlayerCells/StaticCell'
import { RemoveCell } from './PlayerCells/RemoveCell'
import { ProjectionCell } from './PlayerCells/ProjectionCell'
import { OwnershipCell } from './PlayerCells/OwnershipCell'
import { LockCell } from './PlayerCells/LockCell'
import { ExposureCell } from './PlayerCells/ExposureCell'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { AdvancedSettingsModal } from "./AdvancedSettingsModal";


function PlayerTable({ sport, data, setOnlyUseMine, slateId, setClearedSearch, setStackData, stackData }) {
    const isMedium = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const defaultPageSize = isMedium ? 10 : 25
    const [openAdvancedSettingsModal, setOpenAdvancedSettingsModal] = React.useState(false)
    // Define columns
    const columns = React.useMemo(() => [
        {
            Header: 'Remove',
            accessor: 'select',
            Cell: RemoveCell,
            sortType: (rowA, rowB, columnId) => {
                const valueA = rowA.original.remove;
                const valueB = rowB.original.remove;
                return valueA === valueB ? 0 : valueA ? 1 : -1;
            }
        },
        {
            Header: 'Lock',
            accessor: 'lock',
            Cell: LockCell,
            sortType: (rowA, rowB, columnId) => {
                const valueA = rowA.original.lock;
                const valueB = rowB.original.lock;
                return valueA === valueB ? 0 : valueA ? 1 : -1;
            }
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
                const valueA = rowA.original.projection.projection;
                const valueB = rowB.original.projection.projection;
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

    const tableInstance = useTable({ columns, data, initialState: { pageSize: defaultPageSize }, disableSortRemove: true }, useGlobalFilter, useSortBy, usePagination);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        // rows,
        page,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        prepareRow,
        state,
        setGlobalFilter,
    } = React.useMemo(() => tableInstance, [tableInstance]);

    const { globalFilter } = state;

    React.useEffect(() => {
        if (globalFilter) {
            setClearedSearch(false);
        } else {
            setClearedSearch(true);
        }
    }, [globalFilter, setClearedSearch])

    // Search 
    function handleSearchChange(e) {
        const newFilterValue = e.target.value;
        const filteredRows = page.filter(row => {
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

    React.useEffect(() => {
        setOnlyUseMine(isFilterActive);
    }, [isFilterActive, setOnlyUseMine]);

    const filteredRows = React.useMemo(() => {
        if (isFilterActive) {
            return page.filter(row => row.original.projection['custom'] === true);
        } else {
            return page;
        }
    }, [isFilterActive, page]);

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



    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    let stacking = false
    if (stackData['WR-same'] !== 0 || stackData['TE-same'] !== 0 || stackData['WR-opp'] !== 0 || stackData['TE-opp'] !== 0) {
        stacking = true
    }

    return (
        <div>
            <AdvancedSettingsModal openAdvancedSettingsModal={openAdvancedSettingsModal} setOpenAdvancedSettingsModal={setOpenAdvancedSettingsModal} setStackData={setStackData} stackData={stackData} />
            <div>
                <Grid container direction='row' justifyContent='space-between' alignItems='flex-end' spacing={2}>
                    <Grid item sm={4} xs={5}>
                        <TextField size='5vh' id="filled-search" label="Search Player" type="search" variant="filled" value={globalFilter || ''} onChange={handleSearchChange} />
                    </Grid>
                    <Grid item>
                        <Grid style={{ marginBottom: '1vh' }} container direction='row' justifyContent='flex-end' alignItems='center' spacing={0}>
                            <Grid item>
                                {sport === 'nfl' && (
                                    <Grid item>
                                        <Button sx={{ mr: 2 }} size={isMedium ? 'small' : 'medium'} onClick={() => setOpenAdvancedSettingsModal(true)} variant={stacking ? 'contained' : 'outlined'} color='secondary'>{isMedium ? 'QB' : 'QB Stack Settings'}</Button>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid item>
                                {isMobile ? (
                                    <Button size='small' onClick={handleOnlyUseClick} variant='outlined' color='secondary'>{!isFilterActive ? 'Only Use Mine' : 'Use All'}</Button>
                                ) : (
                                    <Button onClick={handleOnlyUseClick} variant='outlined' color='secondary'>{!isFilterActive ? 'Only Use My Projections' : 'Use All Projections'}</Button>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <form id='PlayerTableForm'>
                    <Box style={{ width: isMobile ? '5vh' : '100%' }}>
                        <table className='player-table' {...getTableProps()}>
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {column.render('Header')}
                                                    <span style={{ marginLeft: '.3vh', display: 'inline-flex', alignItems: 'center' }}>
                                                        {column.isSorted ? (column.isSortedDesc ? <ArrowDownwardIcon sx={{ fontSize: '1.5vh' }} /> : <ArrowUpwardIcon sx={{ fontSize: '1.5vh' }} />) : ''}
                                                    </span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {filteredRows.map(row => {
                                    prepareRow(row);
                                    return <PlayerRow key={row.id} row={row} sport={sport} />;
                                })}
                            </tbody>
                        </table>
                    </Box>
                </form>
                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                    <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
                    <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
                </Grid>
            </div >
        </div>
    )
}

export { PlayerTable }