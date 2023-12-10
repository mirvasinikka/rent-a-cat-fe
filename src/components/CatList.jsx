import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Box, Button, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import Pagination from '@mui/material/Pagination';

import CatCard from './CatCard';

function CatList() {
  const [cats, setCats] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [catsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setLoading] = useState(true);

  const deleteCat = async () => {
    try {
      const response = await fetch(`/api/cats/${catToDelete}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Failed to delete cat:', error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const city = searchParams.get('city');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const fetchCats = async () => {
      const query = new URLSearchParams();
      if (city) query.append('city', city);
      if (startDate) query.append('startDate', startDate);
      if (endDate) query.append('endDate', endDate);

      try {
        const response = await fetch(`/api/cats?${query.toString()}`);
        // const response = await fetch(`/api/allcats`);

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

    setTotalPages(Math.ceil(cats.length / catsPerPage));
  }, [location.search, cats.length, catsPerPage]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastCat = currentPage * catsPerPage;
  const indexOfFirstCat = indexOfLastCat - catsPerPage;
  const currentCats = cats.slice(indexOfFirstCat, indexOfLastCat);

  const handleLikes = async (catId) => {
    try {
      const response = await fetch(`/api/cats/like/${catId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setCats((prevCats) => prevCats.map((cat) => (cat.id === catId ? { ...cat, likes: !cat.likes } : cat)));
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

  if (cats.length === 0) {
    return (
      <div>
        <p>Kissoja ei ole</p>
      </div>
    );
  }

  return (
    <Box sx={{ marginTop: 3, width: '100%', padding: 2 }}>
      <Grid container spacing={3}>
        {currentCats.map((cat, index) => (
          <Grid item key={index} xs={6} sm={6} md={4} lg={3}>
            <CatCard cat={cat} handleLikes={handleLikes} />
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
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3, marginBottom: 10 }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} size="large" color="primary" />
      </Box>
    </Box>
  );
}

export default CatList;
