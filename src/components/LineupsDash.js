import React from 'react'
import { LineupsDashHeader } from "./LineupsDashHeader"
import { LineupsDashBody } from "./LineupsDashBody"

function LineupsDash({ optimizedLineups, selectedOpto, setSelectedOpto }) {
    const optoCount = optimizedLineups['count'] || 0

    return (
        <>
            <LineupsDashHeader optoCount={optoCount} selectedOpto={selectedOpto} setSelectedOpto={setSelectedOpto} />
            <LineupsDashBody optimizedLineups={optimizedLineups} selectedOpto={selectedOpto} />
        </>
    )
}

export { LineupsDash }