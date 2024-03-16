import React from 'react'
import { TextField } from '@mui/material'
import { UserContext } from './UserProvider';
import { updateUserSettings } from '../util/utils';



function SalaryField({ variant, userSettings, setUserSettings }) {
    const { token } = React.useContext(UserContext)
    const salary = userSettings[`${variant}-salary`] || ''
    const setSalary = (value) => setUserSettings({ ...userSettings, [`${variant}-salary`]: value })
    const label = `${variant.charAt(0).toUpperCase() + variant.slice(1)}imum Salary`
    const [storedValue, setStoredValue] = React.useState(salary)

    const setStoredValueMeta = React.useCallback(async (value) => {
        if (value === storedValue) return
        setStoredValue(value)
        try {
            await updateUserSettings({ ...userSettings, label: value }, token);
        } catch (error) {
            console.error('Failed to update user settings', error)
        }
    }, [storedValue, userSettings, token])

    React.useEffect(() => {
        if (!token) return
        const timeoutId = setTimeout(() => setStoredValueMeta(salary), 1200);
        return () => clearTimeout(timeoutId);
    }, [setStoredValueMeta, salary, token]);

    function handleChange(e) {
        const newValue = e.target.value
        if (isNaN(newValue)) return console.log('Salary must be a number')
        if (newValue > 50000) {
            setSalary(salary)
        } else {
            setSalary(newValue)
        }
    }

    return (
        <>
            <TextField id={`${variant}-salary`} value={salary} onChange={(e) => handleChange(e)} label={label} variant="filled" />
        </>
    )
}

export { SalaryField }