function ProjectionCell({ projection, setProjection }) {

  function handleChange(event) {
    const inputValue = event.target.value;

    // Regular expression to validate input with up to two decimal places
    const validInput = /^\d+(\.\d{0,2})?$/.test(inputValue);

    if (validInput) {
      const newValue = inputValue === '' ? '0' : inputValue.replace(/^0+/, ''); // Remove leading zeros
      setProjection(newValue);
    }
  }

  return (
    <td>
      <input
        type='text'
        name='projection'
        value={projection}
        onChange={handleChange}
        style={{ maxWidth: '50px', minWidth: '50px', textAlign: 'center' }}
      />
    </td>
  );
}

export { ProjectionCell };
