function ProjectionCell({projection, player, handleProjectionChange}) {
    return (
        <input type='text' value={projection} onChange={(e) => handleProjectionChange(e.target.value, player)} style={{ maxWidth: '50px', minWidth: '50px', textAlign: 'center' }}></input>
    )
}

export { ProjectionCell }