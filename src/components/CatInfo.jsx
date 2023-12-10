import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Link } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

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
        <p>Cat doesn't exist, please try another cat. Thank you!</p>
        <NavigateBackToCats />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 2 }}>
      <Box sx={{ width: '50%', img: { margin: 2, width: 300, height: 450, marginLeft: 30 } }}>
        <img src={cat.kuva} alt={cat.nimi} />
        <Box sx={{ display: 'flex', gap: 1, marginTop: 2, marginLeft: 30 }}>
          <Typography variant="h6">Nimi: </Typography> <Typography variant="h6"> {cat.nimi}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginLeft: 30 }}>
          <Typography variant="h6">Kaupunki: </Typography> <Typography variant="h6"> {cat.city}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginLeft: 30 }}>
          <Typography variant="h6">Laji: </Typography> <Typography variant="h6"> {cat.laji}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginLeft: 30 }}>
          <Typography variant="h6">Omistaja: </Typography> <Typography variant="h6"> {cat.omistaja}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginLeft: 30 }}>
          <Typography variant="h6">Lempi lelu: </Typography> <Typography variant="h6"> {cat.lelu}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginBottom: 2, marginLeft: 30 }}>
          <Typography variant="h6">Hinta: </Typography>
          <Typography variant="h6"> {formatCurrency(cat.price)} per day</Typography>
        </Box>
        <Button variant="secondary" component={Link} onClick={() => navigate('/')}>
          Back to cats
        </Button>
      </Box>
      <CatRent />
    </Box>
  );
}

export default CatInfo;
