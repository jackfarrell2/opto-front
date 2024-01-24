function ValueCell({salary, projection}) {
    const result = projection / (salary / 1000)
    const roundedResult = result.toFixed(1)
    return (
        <td>
           {roundedResult}
        </td>
    )
}

export { ValueCell }