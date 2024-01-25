function XValueCell({cell, salary, projection}) {
    const result = projection / (salary / 1000)
    const roundedResult = parseFloat(result.toFixed(1))
    cell.row.original.xvalue = roundedResult

    return (
        <td {...cell.getCellProps()}>
           {roundedResult}
        </td>
    )
}

export { XValueCell }