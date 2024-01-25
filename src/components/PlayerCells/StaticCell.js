function StaticCell({cell, value, className}) {

    return (
        <td {...cell.getCellProps()} className={className}>
            {value}
        </td>
    )
}

export { StaticCell }