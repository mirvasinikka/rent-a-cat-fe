import { Box, Typography, Container, Grid } from '@mui/material';
import CatSearch from './CatSearch';

const HomePage = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url('/assets/background2.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Container sx={{ pt: 10 }}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <Box sx={{ bgcolor: '#f2f1f0', boxShadow: 3, borderRadius: '8px', overflow: 'hidden', width: 'auto', mx: 'auto', pb: 3 }}>
              <Typography
                color="secondary"
                variant="h3"
                sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center', fontWeight: 900, textTransform: 'capitalize' }}
              >
                Rent a Cat 🐈
              </Typography>
              <CatSearch sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
