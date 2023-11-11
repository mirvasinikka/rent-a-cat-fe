import { useContext } from 'react';
import { AppContext } from '../App';
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function LikedCats() {
  const { cats } = useContext(AppContext);
  const navigate = useNavigate();

  const likedCats = cats.filter((cat) => cat.liked);

  if (likedCats.length === 0) {
    return (
      <Box>
        <p>You haven't liked any of the cats </p>
        <Button component={Link} onClick={() => navigate('/')}>
          Back to the cats
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: 3 }}>
      <Grid container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 18 }}>
        {likedCats.map((cat, index) => {
          return (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Card sx={{ maxWidth: 350 }}>
                <CardContent>
                  <CardMedia sx={{ height: 300, marginBottom: 2 }} image={cat.kuva} title={'Cat name ' + cat.nimi} />
                  <Typography gutterBottom variant="h5" component="div">
                    {cat.nimi}
                  </Typography>
                  <Typography variant="h6">{cat.sijainti}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default LikedCats;
