import * as colors from './colors'

const page = {
  minHeight: '100vh',
}

const signInModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'common.white',
  border: '1px solid #000',
  boxShadow: 24,
  p: 1,
}

const mobileSignInModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'common.white',
  border: '1px solid #000',
  boxShadow: 24,
  p: 1,
}

const topBar = {
  height: '80px',
}

const logo = {
  flexGrow: '1',
}

const logoLink = {
  color: 'common.white',
  textDecoration: 'none',
  boxShadow: 'none',
}

const navLinks = {
  display: 'flex',
}

const buttonLink = {
  color: 'common.white',
  ml: 1,
  '&:hover': {
    color: 'secondary.main'
  }
}

const drawerItem = {
  textDecoration: 'none',
  color: colors.main
}

const secondaryNav = {
  bgcolor: 'common.white',
  color: 'primary.main',
  height: '40px',
  justifyContent: 'center',
}

const slateSelector = {
  maxHeight: '30px',
  fontSize: '13px',
  color: 'primary.main',
}

const slateSelectorDropdown = {
  fontSize: '13px'
}



export {logo, navLinks, buttonLink, topBar, logoLink, drawerItem, page, signInModal, mobileSignInModal, secondaryNav, slateSelector, slateSelectorDropdown }