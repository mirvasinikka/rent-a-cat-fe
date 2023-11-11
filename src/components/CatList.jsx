import { useContext, useState } from 'react';
import { AppContext } from '../App';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function CatList() {
  const { cats, setCats } = useContext(AppContext);
  const [clicked, setClicked] = useState();

  if (cats.length === 0) {
    return <p>Kissoja ei ole</p>;
  }

  const handleLikes = (catId) => {
    const updateLike = (cat) => (cat.id === catId ? { ...cat, liked: !cat.liked } : cat);
    setCats((prevCats) => prevCats.map(updateLike));
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <Grid container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 18 }}>
        {cats.map((cat, index) => {
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
                <CardActions>
                  <Button component={Link} to={'/info/' + cat.id}>
                    <InfoIcon color="secondary" />
                  </Button>
                  <IconButton onClick={() => handleLikes(cat.id)}>{cat.liked ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}</IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
export default CatList;
