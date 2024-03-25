import { Box, Container, Grid, Typography } from "@mui/material";
// import GitHubIcon from '@mui/icons-material/GitHub';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import { Link } from '@mui/material'
import CopyrightIcon from '@mui/icons-material/Copyright';


function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "primary.main",
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Grid container direction='row' justifyContent='center' alignItems='center' spacing={1}>
              <Grid item>
                <CopyrightIcon fontSize="small" sx={{ color: 'white' }} />
              </Grid>
              <Grid item alignItems='center'>
                <Typography color="common.white" variant="h6" sx={{ mb: '.7vh' }}>DFS Opto</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
                {`${new Date().getFullYear()}`}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export { Footer };