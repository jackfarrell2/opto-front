import { Box, Container, Grid, Typography } from "@mui/material";
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
              <Grid item xs={12} alignItems='center'>
                <Typography textAlign='center' color="common.white" variant="h6" sx={{ mb: '.7vh' }}>DFS Opto</Typography>
              </Grid>
              <Grid item xs={12} alignItems='center' justifyContent='center'>
                <Typography textAlign='center' color="common.white" variant="body2">Welcome to DFS Opto! This tool is completely free to use! You may build as many lineups as you need.</Typography>
              </Grid>
              <Grid item>
                <CopyrightIcon fontSize="small" sx={{ color: 'white' }} />
              </Grid>
              <Grid item>
                <Box display='flex' justifyContent='center' alignItems='center'>
                  <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
                    {`${new Date().getFullYear()}`}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <a href="mailto:support@dfsopto.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography textAlign='center' color='common.white' variant='subtitle2'>Contact: support@dfsopto.com</Typography>
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export { Footer };