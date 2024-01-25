import '../../styles/PlayerTable.css';

function ProjectionCell({ cell, projection, setProjection }) {

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
    setProjection(dotTrails ? roundedValue.toString() + '.' : roundedValue.toString())
  }

  return (
    <td {...cell.getCellProps()} className='projection-cell'>
      <input
        type='text'
        name='projection'
        value={projection}
        onChange={handleChange}
        className='projection-input'
      />
    </td>
  );
}

export { ProjectionCell };
