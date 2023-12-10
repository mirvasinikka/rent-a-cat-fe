import { Box, Typography, Container, Grid } from '@mui/material';
import CatSearch from './CatSearch';

const HomePage = () => {
  const backgroundStyle = {
    backgroundImage: `url('/assets/background2.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width: '100vw',
  };

  const color = '#f2f1f0';

  return (
    <Box sx={backgroundStyle}>
      <Container sx={{ pt: 10 }}>
        <Box sx={{ bgcolor: color, boxShadow: 3, borderRadius: '8px', overflow: 'hidden', width: 'auto', mx: 'auto', pb: 3, ml: 40, mr: 40 }}>
          <Typography color="secondary" variant="h4" sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center' }}>
            Rent a Cat
          </Typography>

          <CatSearch sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }} />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
