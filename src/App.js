import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mlb from "./pages/mlb";
import Nba from "./pages/nba";
import Nfl from "./pages/nfl";
import { Navbar } from "./components/Navbar";
import { SignInModal } from "./components/SignInModal";
import { Footer } from "./components/Footer";
import config from "./config";
import { UserProvider } from "./components/UserProvider";
import { ActivationPage } from './components/ActivationPage';
import NotFound from './pages/notfound';
import { IntercomChat } from "./components/IntercomChat";


const theme = createTheme({
  palette: {
    primary: {
      main: '#0C2340',
      accent: '#0C3D40'
    },
    secondary: {
      main: '#62400B'
    },
    accent: {
      main: '#143a6b'
    },
  },
  typography: {
    button: {
      textTransform: 'none'
    },
    fontFamily: [
      'sans-serif',
      'Roboto',
      'Helvetica',
      'Arial',
    ].join(','),
  }
});

const apiUrl = `${config.apiUrl}`

function App() {

  const [openModal, setOpenModal] = React.useState('none');
  const handleOpen = () => setOpenModal('sign-in');
  const handleClose = () => setOpenModal('none');

  return (
    <UserProvider apiUrl={apiUrl} setOpenModal={setOpenModal}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SignInModal openModal={openModal} handleClose={handleClose} setOpenModal={setOpenModal} />
        <IntercomChat />
        <Router>
          <Navbar handleOpen={handleOpen} />
          <Routes>
            <Route exact path="/" element={<Nfl />} />
            <Route path='/activate/:token' element={<ActivationPage />} />
            <Route path='/mlb' element={<Mlb />} />
            <Route path='/nba' element={<Nba />} />
            <Route path='nfl' element={<Nfl />} />
            <Route path='*' Component={NotFound} />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
