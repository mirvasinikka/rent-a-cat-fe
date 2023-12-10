import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Typography, Box, Button } from '@mui/material';

function NavigateBackToButton() {
  const navigate = useNavigate();
  return (
    <Button variant="contained" onClick={() => navigate('/cats')} size="large">
      Back to Cats
    </Button>
  );
}

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
        <NavigateBackToButton />
      </Box>
    );
  }

  if (!cat) {
    return (
      <Box>
        <p>Cat doesn't exist, please try another cat. Thank you!</p>
        <NavigateBackToButton />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', img: { margin: 2, width: 300, height: 450 } }}>
      <img src={cat.kuva} />
      <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
        <Typography variant="h6">Nimi: </Typography> <Typography variant="h6"> {cat.nimi}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h6">Kaupunki: </Typography> <Typography variant="h6"> {cat.city}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h6">Laji: </Typography> <Typography variant="h6"> {cat.laji}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h6">Omistaja: </Typography> <Typography variant="h6"> {cat.omistaja}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
        <Typography variant="h6">Lempi lelu: </Typography> <Typography variant="h6"> {cat.lelu}</Typography>
      </Box>

      <NavigateBackToButton />
    </Box>
  );
}

export default CatInfo;
