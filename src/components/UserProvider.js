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
                throw new Error(`HTTP error! Status: ${response.status}`);
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
        }
    };

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
                const errorData = await response.json(); // Parse the JSON error
                // Return an object indicating success/failure and any messages
                return { success: false, message: errorData };
            }

            const data = await response.json(); // Assuming the response is successful and returns user data
            // Perform your success logic here, e.g., updating local storage and user context
            return { success: true, user: data.user, token: data.token };

        } catch (error) {
            console.error('Sign-up error:', error);
            // Return an error in a similar format for consistency
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

    return <UserContext.Provider value={{ user, token, signIn, signOut, useUser, signUp, setUser, setToken }}>{children}</UserContext.Provider>
}

export { UserProvider, UserContext };