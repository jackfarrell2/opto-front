import React from 'react'
import { TextField } from '@mui/material'


function SalaryField({ variant, salary, setSalary }) {
    // const localStorageValue = `${variant}-salary`
    // const initialSalary = parseInt(localStorage.getItem(localStorageValue)) || (variant === 'min' ? 45000 : 50000)
    const label = `${variant.charAt(0).toUpperCase() + variant.slice(1)}imum Salary`

    // React.useEffect(() => {
    //     localStorage.setItem(localStorageValue, salary.toString())
    // }, [localStorageValue, salary])

    function handleChange(e) {
        const newValue = e.target.value
        if (isNaN(newValue)) return console.log('Salary must be a number')
        if (newValue > 50000) {
            setSalary(50000)
        } else {
            setSalary(newValue)
        }
    }

    return (
        <TextField id={`${variant}-salary`} value={salary} onChange={(e) => handleChange(e)} label={label} variant="filled" />
    )
}

export { SalaryField }