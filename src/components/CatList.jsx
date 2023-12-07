import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CatList() {
  const [cats, setCats] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('/api/cats');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const catsData = await response.json();
        setCats(catsData);
      } catch (error) {
        console.error('Failed to fetch cats:', error);
      }
    };

    fetchCats();
  }, []);

  const handleLikes = async (catId) => {
    const likedCat = cats.find((cat) => cat.id === catId);
    if (likedCat) {
      try {
        const response = await fetch(`/api/cats/like/${catId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ liked: !likedCat.liked }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        setCats((prevCats) => prevCats.map((cat) => (cat.id === catId ? { ...cat, liked: !cat.liked } : cat)));
      } catch (error) {
        console.error('Failed to update like status:', error);
      }
    }
  };

  const handleOpenDialog = (catId) => {
    setCatToDelete(catId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const deleteCat = async () => {
    try {
      const response = await fetch(`/api/cats/${catToDelete}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setCats((prevCats) => prevCats.filter((cat) => cat.id !== catToDelete));
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to delete cat:', error);
    }
  };

  if (cats.length === 0) {
    return <p>Kissoja ei ole</p>;
  }

  return (
    <Box sx={{ marginTop: 3 }}>
      <Grid container spacing={{ xs: 2, md: 5 }} columns={{ xs: 4, sm: 8, md: 18 }}>
        {cats.map((cat, index) => (
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
                  <InfoIcon color="primary" />
                </Button>
                <IconButton onClick={() => handleLikes(cat.id)}>{cat.liked ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}</IconButton>
                <Button component={Link} to={'/edit/' + cat.id}>
                  <EditIcon color="primary" />
                </Button>
                <Button onClick={() => handleOpenDialog(cat.id)}>
                  <DeleteIcon color="error" />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this cat?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={deleteCat} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CatList;
