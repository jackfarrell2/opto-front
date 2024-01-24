import React from 'react';

function OwnershipCell({ownership}) {
    const [ownershipInput, setOwnership] = React.useState(ownership)

    return (
        <td>
            <input type='text' name='ownership' value={ownershipInput} onChange={(e) => setOwnership(e.target.value)} style={{ maxWidth: '50px', minWidth: '50px', textAlign: 'center' }}></input>
        </td>
    )
}

export { OwnershipCell }