import { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SavingsIcon from '@mui/icons-material/Savings';
import CatRent from './CatRent';

function NavigateBackToCats() {
  const navigate = useNavigate();
  return (
    <Button variant="contained" onClick={() => navigate('/cats')} size="large">
      Back to Cats
    </Button>
  );
}

const formatCurrency = (number) => {
  return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(number);
};

function CatInfo() {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let { id } = useParams();

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const response = await fetch(`/api/cats/${id}`);
        if (!response.ok) {
          throw new Error('Cat not found');
        }
        const data = await response.json();
        setCat(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCat();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <Box>
        <p>Error: {error}</p>
        <NavigateBackToCats />
      </Box>
    );
  }

  if (!cat) {
    return (
      <Box>
        <p>Cat doesn&apos;t exist, please try another cat. Thank you!</p>
        <NavigateBackToCats />
      </Box>
    );
  }

  return (
    <Grid container spacing={2} sx={{ marginTop: 2, padding: 3 }}>
      <Grid item xs={12} md={6}>
        <Box sx={{ img: { margin: 2, width: '100%', maxWidth: 500, maxHeight: 600, marginLeft: 5 } }}>
          <img src={cat.image} alt={cat.nimi} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
          <Box sx={{ display: 'flex', gap: 1, marginTop: 2, marginBottom: 2, marginLeft: 5 }}>
            <Typography variant="h3">{cat.nimi}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginLeft: 5 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <LocationOnIcon />
              <Typography variant="h6">{cat.city}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <PetsIcon />
              <Typography variant="h6">{cat.laji}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <PersonIcon />
              <Typography variant="h6">{cat.omistaja}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <SportsTennisIcon />
              <Typography variant="h6">{cat.lelu}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <SavingsIcon />
              <Typography variant="h6">{formatCurrency(cat.price)} per day</Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <CatRent id={cat.id} price={cat.price} />
      </Grid>
    </Grid>
  );
}

export default CatInfo;
