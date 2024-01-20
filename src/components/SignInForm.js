import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Button, TextField, FormControlLabel, Checkbox, Box, Grid, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


function SignInForm({handleClose, onSubmit, setOpenModal, openModal}) {

  const [checked, setChecked] = React.useState(false)
  const handleCheck = () => setChecked(!checked)

  let buttonText = ''
  if (openModal === 'sign-in') {
    buttonText = 'Sign In'
  } else if (openModal === 'signup') {
    buttonText = 'Sign Up'
  } else {
    buttonText = 'Submit'
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (openModal === 'sign-in') {
      const email = event.target.elements.email.value
      const password = event.target.elements.password.value
      const remember = event.target.elements.remember.checked
      
      onSubmit({
        email: email,
        password: password,
        remember: remember
      })  
    } else if (openModal === 'signup') {
      const firstName = event.target.elements.firstName.value
      const lastName = event.target.elements.lastName.value
      const email = event.target.elements.email.value
      const password = event.target.elements.password.value

      onSubmit({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      })
    } else if (openModal === 'forgot') {
      const email = event.target.elements.email.value
      onSubmit({
        email: email
      })
    }

  }

  return (
    <>
        <Button onClick={handleClose} sx={{ color: 'common.black' }}>
            <CloseIcon />
        </Button>
        <Grid container>
          <Box
            sx={{
              my: 6,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {(openModal !== 'forgot') && (
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
            )}
            {(openModal === 'sign-in') && (
              <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            )}
            {(openModal === 'signup') && (
              <Typography component="h1" variant="h5">
                Sign Up
              </Typography>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                  {(openModal === 'forgot') && (
                    <>
                      <Typography sx={{ mb: 4 }}>Lost your password? Please enter your email. You will receive an email to create a new one.</Typography>
                    </>
            )}
                  {(openModal === 'signup') && (
                    <Grid item xs={12} sm={6}>              
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                      />
                    </Grid>
                  )}
                  {(openModal === 'signup') && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                      />
                    </Grid>  
                  )}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />   
                </Grid> 
                <Grid item xs={12}>
                  {(openModal !== 'forgot') && (
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {(openModal === 'sign-in') && (
                  <FormControlLabel
                    control={<Checkbox onClick={handleCheck} checked={checked} value="remember" color="primary" id='remember'/>}
                    label="Remember me"
                  />  
                )}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {buttonText}
              </Button>
              <Grid container>
                <Grid item xs>
                  {(openModal !== 'forgot') && (
                    <Button onClick={() => setOpenModal('forgot')}variant='text' size='small' sx={{ textDecoration: 'underline' }}>Forgot password?</Button>
                  )}
                  {(openModal === 'forgot') && (
                    <Button onClick={() => setOpenModal('sign-in')} variant='text' size='small' sx={{ textDecoration: 'underline' }}>Remember your password?</Button>
                  )}
                </Grid>
                <Grid item>
                  {(openModal === 'sign-in') && (
                    <Button onClick={() => setOpenModal('signup')} variant='text' size='small' sx={{ textDecoration: 'underline' }}>Don't have an account? Sign Up</Button>
                  )}
                  {(openModal === 'signup') && (
                    <Button onClick={() => setOpenModal('sign-in')} variant='text' size='small' sx={{ textDecoration: 'underline' }}>Already have an account? Sign In</Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>
      </Grid>
    </>
  );
}

export { SignInForm }