import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Button, TextField, FormControlLabel, Checkbox, Box, Grid, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';


function SignInForm({ handleClose, onSubmit, setOpenModal, openModal, error, setError, passwordError, setPasswordError }) {

  const [checked, setChecked] = React.useState(true)

  const [confirmedName, setConfirmedName] = React.useState(null)
  const [confirmedEmail, setConfirmedEmail] = React.useState(null)

  const handleCheck = () => setChecked(!checked)

  const validatePassword = (password) => {
    const requirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return requirements.test(password);
  };

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

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
      setConfirmedEmail(email)
      setConfirmedName(firstName)

      if (openModal === 'signup' && !validatePassword(password)) {
        setPasswordError('Password must be at least 8 characters long, include a number, an uppercase and lowercase letter.');
        return;
      }

      if (openModal === 'signup' && !validateEmail(email)) {
        setPasswordError('Invalid Email')
        return;
      }

      if (firstName === '' || lastName === '') {
        setPasswordError('Your name must be at least one letter')
        return;
      }

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
      {error ? (
        <>
          <Button onClick={() => setOpenModal(false)} sx={{ color: 'primary' }}>
            <CloseIcon sx={{ color: 'primary' }} />
          </Button>
          <Grid container style={{ padding: '4.5vh' }} direction="column" justifyContent="center" alignItems="center" spacing={4}>
            <Grid item style={{ textAlign: 'center' }}>
              <Typography variant='h5'>{error}</Typography>
            </Grid>
            <Grid item>
              <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={12}>
                  <Button onClick={() => setError('')} variant='contained'>Got it!</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      ) :
        (
          <>
            {(openModal === 'confirm') ?
              (
                <>
                  <Button onClick={() => setOpenModal(false)} sx={{ color: 'primary' }}>
                    <CloseIcon sx={{ color: 'primary' }} />
                  </Button>
                  <Grid container style={{ padding: '4.5vh' }} direction="column" justifyContent="center" alignItems="center" spacing={4}>
                    <Grid item style={{ textAlign: 'center' }}>
                      <Typography variant='h5'>Verify your email<MarkEmailReadIcon fontSize='medium' color='success' sx={{ ml: 1 }} /></Typography>
                    </Grid>
                    <Grid item>
                      <Grid container direction='row' justifyContent='center' alignItems='center' spacing={0}>
                        <Grid item>
                          <Typography variant='body'>Thank you{confirmedName ? ` ${confirmedName}!` : '!'} We've sent {confirmedEmail ? `an email to ${confirmedEmail}` : 'you an email'} to verify your email address and activate your account. The link in the email will expire in 24 hours.</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant='body'>Click here to re-send the email.</Typography>
                    </Grid>
                    <Grid item>
                      <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                          <Button onClick={() => setOpenModal('none')} variant='contained'>Got it!</Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ) : (
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
                          <Grid item xs={12}>
                            {(openModal !== 'forgot' && passwordError) && (
                              <Grid container alignItems='center' justifyContent='center'>
                                <Grid item>
                                  <Typography color='error' variant='caption'>{passwordError}</Typography>
                                </Grid>
                              </Grid>)}
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          {(openModal === 'sign-in') && (
                            <FormControlLabel
                              control={<Checkbox onClick={handleCheck} checked={checked} value="remember" color="primary" id='remember' />}
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
                              <Button onClick={() => setOpenModal('forgot')} variant='text' size='small' sx={{ textDecoration: 'underline' }}>Forgot password?</Button>
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
              )}
          </>
        )}
    </>
  );
}

export { SignInForm }