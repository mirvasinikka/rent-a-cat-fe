import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemAvatar,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

import { useEffect, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Link, useNavigate } from 'react-router-dom';

function CatManage() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch(`/api/cats`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const catsData = await response.json();
        setCats(catsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch cats:', error);
      }
    };

    fetchCats();
  }, [cats.length]);

  const handleEditCat = (catId) => {
    navigate(`/edit-cat/${catId}`);
  };

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(number);
  };

  const handleDeleteCat = async () => {
    try {
      const response = await fetch(`/api/cats/${catToDelete}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setCats((prevCats) => prevCats.filter((cat) => cat.id !== catToDelete));
    } catch (error) {
      console.error('Failed to delete cat:', error);
    } finally {
      handleCloseDialog();
    }
  };

  const handleOpenDialog = (catId) => {
    setCatToDelete(catId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Button size="large" component={Link} to="/add-cat" variant="primary" sx={{ display: 'flex', mt: 2 }}>
        <AddCircleOutlineOutlinedIcon fontSize="large" sx={{ marginRight: 1 }} /> Add a cat
      </Button>
      <List sx={{ width: '100%', bgcolor: 'background.paper', padding: 5 }}>
        {loading && cats.length === 0 ? (
          <div>Loading cats...</div>
        ) : (
          cats.map((cat, index) => {
            const labelId = `cat-list-label-${cat.id}`;

            return (
              <>
                <ListItem
                  key={index + cat.id}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 5 }}>
                      <IconButton size="large" edge="end" aria-label="edit" onClick={() => handleEditCat(cat.id)} sx={{ color: 'black' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="large" edge="end" aria-label="delete" onClick={() => handleOpenDialog(cat.id)} sx={{ color: 'red' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <img alt={cat.name} src={cat.image} style={{ width: 150, height: 150, marginRight: 20 }} />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={cat.name} secondary={`City: ${cat.city}`} />
                  <ListItemText id={labelId} primary={formatCurrency(cat.price)} />

                  <ListItemText primary={`Availbility: ${cat.available_from} -  ${cat.available_until}`} />
                </ListItem>
                <Divider />
              </>
            );
          })
        )}
        <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Are you sure you want to delete this cat?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleDeleteCat} color="error" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </List>
    </>
  );
}

export default CatManage;
