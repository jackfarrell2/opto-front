import React, { useContext } from "react";

const UserContext = React.createContext();

function UserProvider({ setOpenModal, apiUrl, children }) {
    const userUrl = `${apiUrl}users/`
    const [user, setUser] = React.useState(null);
    const [token, setToken] = React.useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    const signIn = async (formData) => {
        try {
            const response = await fetch(`${userUrl}sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, message: errorData.detail };
            }

            const data = await response.json();
            setUser(data.user);
            setToken(data.token);
            setOpenModal('none');
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            window.location.reload();

        } catch (error) {
            console.error('Sign-in error:', error);
            return { success: false, message: { general: 'An error occurred during sign-in.' } };
        }
    };

    function resetPass(formData) {
        fetch(`${userUrl}reset-password-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        return
    }

    const confirmResetPass = async (formData) => {
        try {
            const response = await fetch(`${userUrl}confirm-password-reset/${formData.code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, message: errorData.detail };
            }

            const data = await response.json();
            return { success: true, user: data.user, token: data.token };

        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, message: 'An error occurred during reset password.' };
        }
    }

    const resetPassword = async (formData) => {
        try {
            const response = await fetch(`${userUrl}reset-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, message: errorData.detail };
            }
            const data = await response.json();
            return { success: true, message: data.detail };
        } catch (error) {
            console.error('Resend password error:', error);
            return { success: false, message: 'An error occurred during resend password.' };
        }
    }

    const signUp = async (formData) => {
        try {
            const response = await fetch(`${userUrl}signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, message: errorData };
            }

            const data = await response.json();
            return { success: true, user: data.user, token: data.token };

        } catch (error) {
            console.error('Sign-up error:', error);
            return { success: false, message: { general: 'An error occurred during sign-up.' } };
        }
    };


    const signOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        window.location.reload();
    };

    function useUser() {
        const context = useContext(UserContext);
        if (!context) {
            throw new Error('useUser must be used within a UserProvider');
        }
        return context;
    }

    return <UserContext.Provider value={{ user, token, signIn, signOut, useUser, signUp, setUser, setToken, resetPass, confirmResetPass, resetPassword }}>{children}</UserContext.Provider>
}

export { UserProvider, UserContext };