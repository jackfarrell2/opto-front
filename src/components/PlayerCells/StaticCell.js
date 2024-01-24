function StaticCell({value, className}) {

    return (
        <td className={className}>
            {value}
        </td>
    )
}

export { StaticCell }