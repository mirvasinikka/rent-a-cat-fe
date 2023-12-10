import { useState, useEffect } from 'react';
import { Badge, Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CatCard from './CatCard';
import FavoriteIcon from '@mui/icons-material/Favorite';

function LikedCats() {
  const [cats, setCats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('/api/user/liked-cats');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const catsData = await response.json();
        setCats(catsData);
      } catch (error) {
        console.error('Failed to fetch liked cats:', error);
      }
    };

    fetchCats();
  }, []);

  return (
    <>
      <Typography variant="h3" gutterBottom sx={{ marginTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <Badge badgeContent={cats.length} color="primary" showZero>
          Liked Cats <FavoriteIcon fontSize="xLarge" sx={{ color: 'red' }} />
        </Badge>
      </Typography>

      {cats.length === 0 ? (
        <Typography
          variant="h5"
          sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}
        >
          <p>You haven&apos;t liked any of the cats </p>
          <Button variant="contained" onClick={() => navigate('/cats')} size="large">
            Navigate back to Cats
          </Button>
        </Typography>
      ) : (
        <Box sx={{ marginTop: 3, padding: 8 }}>
          <Grid container spacing={3}>
            {cats.map((cat, index) => (
              <Grid item key={index} xs={6} sm={6} md={4} lg={3}>
                <CatCard cat={cat} handleLikes={null} compact />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
}

export default LikedCats;
