import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, CircularProgress } from '@mui/material';
import { page } from '../styles/classes';
import config from '../config';
import { UserContext } from './UserProvider';
import { useNavigate } from 'react-router-dom';


const ActivationPage = () => {
    const { token } = useParams();
    const { setUser, setToken } = React.useContext(UserContext)
    const navigate = useNavigate();


    useEffect(() => {
        fetch(`${config.apiUrl}users/activate/${token}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                setUser(data.user);
                setToken(data.token);
                navigate('/')
            })
            .catch(error => {
                console.error('Error activating account:', error);
            });
    }, [navigate, setToken, setUser, token]);

    return (
        <Box sx={page}>
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '75vh' }}>
                <Grid item>
                    <CircularProgress size={150} />
                </Grid>
            </Grid>
        </Box>
    );
};

export { ActivationPage }
