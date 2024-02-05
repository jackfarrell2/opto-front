import '../../styles/PlayerTable.css';

function ProjectionCell({ cell, playerSettings, setPlayerSettings }) {
  const projection = playerSettings['projection']['projection']
  const custom = playerSettings['projection']['custom']
  const setProjection = (value) => setPlayerSettings({ ...playerSettings, 'projection': value })
  function handleChange(e) {
    // Validate input
    const inputValue = e.target.value;
    let dotTrails = false
    if (inputValue === '') {
      setProjection({ 'projection': '0', 'custom': true });
      return;
    }
    if (isNaN(inputValue)) {
      return;
    }
    if (inputValue.endsWith('.')) {
      dotTrails = true
    }
    if (inputValue > 1000 || inputValue < 0) {
      return;
    }
    const parsedValue = parseFloat(inputValue);
    const roundedValue = Math.round((parsedValue + Number.EPSILON) * 100) / 100
    const cleanValue = dotTrails ? roundedValue.toString() + '.' : roundedValue.toString()
    cell.row.original.projection = cleanValue
    setProjection({ 'projection': cleanValue, 'custom': true })
  }

  return (
    <td {...cell.getCellProps()} className='projection-cell'>
      <input
        type='text'
        name={`players[${cell.row.original.id}][projection]`}
        value={projection}
        onChange={handleChange}
        className='projection-input'
        style={custom ? { backgroundColor: 'lightgreen' } : { backgroundColor: 'white' }}
      />
    </td>
  );
}

export { ProjectionCell };
