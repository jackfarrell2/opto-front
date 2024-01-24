function ValueCell({salary, projection}) {
    return (
        <td>
            {Math.round(projection / (salary / 1000))}
        </td>
    )
}

export { ValueCell }