import { Box, Typography, Container, Grid } from '@mui/material';
import CatSearch from './CatSearch';
import { useTheme } from '@emotion/react';

function HomePage() {
  const theme = useTheme();

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
        <Box
          sx={{
            bgcolor: '#f2f1f0',
            boxShadow: 3,
            borderRadius: '8px',
            overflow: 'hidden',
            pb: 3,
            [theme.breakpoints.up('md')]: {
              ml: 40,
              mr: 40,
            },
          }}
        >
          <Typography color="secondary" variant="h4" sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center' }}>
            Rent a Cat
          </Typography>

          <CatSearch sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }} />
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
