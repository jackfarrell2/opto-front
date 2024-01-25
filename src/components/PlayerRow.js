import React from 'react'
import { RemoveCell } from './PlayerCells/RemoveCell'
import { LockCell } from './PlayerCells/LockCell'
import { StaticCell } from './PlayerCells/StaticCell'
import { OwnershipCell } from './PlayerCells/OwnershipCell'
import { ProjectionCell } from './PlayerCells/ProjectionCell'
import { XValueCell } from './PlayerCells/XValueCell'
import { ExposureCell } from './PlayerCells/ExposureCell'

function PlayerRow({row}) {
    const [projection, setProjection] = React.useState(row.original.projection)
    const [lock, setLock] = React.useState(false)
    const [exclude, setExclude] = React.useState(false)
    return(
        <tr {...row.getRowProps()}>
            <RemoveCell cell={row.cells[0]} exclude={exclude} setExclude={setExclude} setLock={setLock} />
            <LockCell cell={row.cells[1]} lock={lock} setExclude={setExclude} setLock={setLock}  />
            <StaticCell cell={row.cells[2]} value={row.original.name} className='player-cell'/>
            <StaticCell cell={row.cells[3]} value={row.original.position}/>
            <StaticCell cell={row.cells[4]} value={row.original.salary}/> 
            <StaticCell cell={row.cells[5]} value={row.original.team}/> 
            <StaticCell cell={row.cells[6]} value={row.original.opponent}/>  
            <OwnershipCell cell={row.cells[7]} ownership={'0'} />
            <ExposureCell cell={row.cells[8]} exposure={'0'} />
            <ProjectionCell cell={row.cells[9]} projection={projection} setProjection={setProjection} />
            <XValueCell cell={row.cells[10]} projection={projection} salary={row.original.salary}/>
        </tr>
    )
}

export { PlayerRow }