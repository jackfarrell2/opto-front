import '../../styles/PlayerTable.css';

function ProjectionCell({ cell, playerSettings, setPlayerSettings }) {

  const projection = playerSettings['projection']
  const setProjection = (value) => setPlayerSettings({ ...playerSettings, 'projection': value })
  function handleChange(e) {
    // Validate input
    const inputValue = e.target.value;
    let dotTrails = false
    if (inputValue === '') {
      setProjection('0');
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
    setProjection(cleanValue)
  }

  return (
    <td {...cell.getCellProps()} className='projection-cell'>
      <input
        type='text'
        name={`players[${cell.row.original.id}][projection]`}
        value={projection}
        onChange={handleChange}
        className='projection-input'
      />
    </td>
  );
}

export { ProjectionCell };
