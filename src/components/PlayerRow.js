import React from 'react'
import { RemoveCell } from './PlayerCells/RemoveCell'
import { LockCell } from './PlayerCells/LockCell'
import { StaticCell } from './PlayerCells/StaticCell'
import { OwnershipCell } from './PlayerCells/OwnershipCell'
import { ProjectionCell } from './PlayerCells/ProjectionCell'
import { ValueCell } from './PlayerCells/ValueCell'

function PlayerRow({row}) {
    const [projection, setProjection] = React.useState(row.original.projection)
    return(
        <tr {...row.getRowProps()}>
            <RemoveCell exclude={false} />
            <LockCell lock={false} />
            <StaticCell value={row.original.name} className='player-cell'/>
            <StaticCell value={row.original.position}/>
            <StaticCell value={row.original.salary}/> 
            <StaticCell value={row.original.team}/> 
            <StaticCell value={row.original.opponent}/>  
            <OwnershipCell ownership={'0%'} />
            <ProjectionCell projection={projection} setProjection={setProjection} />
            <ValueCell projection={projection} salary={row.original.salary}/>
        </tr>
    )
}

export { PlayerRow }