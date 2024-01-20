import { Box, Container, Grid, Typography } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Link } from '@mui/material'


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
            <Typography color="common.white" variant="h6">
              Jack Farrell
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='center' alignItems='center'>
               <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
                  {`${new Date().getFullYear()}`}
                </Typography>
                <Typography m={1} variant="subtitle1" sx={{ color: 'common.white' }}>|</Typography>
                <Link href="https://github.com/jackfarrell2">
                  <Box display='flex' justifyContent='center'>
                    <GitHubIcon fontSize='small' sx={{ color: 'common.white' }} />
                  </Box>
                </Link>
                <Typography m={1} variant="subtitle1" sx={{ color: 'common.white' }}>|</Typography>
                <Link href="https://www.linkedin.com/">
                  <Box display='flex' justifyContent='center'>
                    <LinkedInIcon fontSize='small' sx={{ color: 'common.white' }} />
                  </Box>
                </Link>
                <Typography m={1} variant="subtitle1" sx={{ color: 'common.white' }}>|</Typography>
                <Link href="https://www.paypal.com/paypalme/jaaackthecat">
                  <Box display='flex' justifyContent='center'>
                    <AttachMoneyIcon fontSize='small' sx={{ color: 'common.white' }} />
                  </Box>
                </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export { Footer };