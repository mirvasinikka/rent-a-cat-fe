import { useEffect, useState } from 'react';

import { Box, CircularProgress, Grid, Pagination } from '@mui/material';
import { useLocation } from 'react-router-dom';

import CatSearch from './CatSearch';
import CatCard from './CatCard';
import { useAuth } from './AuthContext';

function CatList() {
  const [cats, setCats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [catsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const { user } = useAuth();

  const location = useLocation();
  const indexOfLastCat = currentPage * catsPerPage;
  const indexOfFirstCat = indexOfLastCat - catsPerPage;
  const currentCats = cats.slice(indexOfFirstCat, indexOfLastCat);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const city = searchParams.get('city');
    const startRentDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const fetchCats = async () => {
      const query = new URLSearchParams();
      if (city) query.append('city', city);
      if (startRentDate) query.append('startDate', startRentDate);
      if (endDate) query.append('endDate', endDate);

      try {
        const response = await fetch(`/api/cats?${query.toString()}`);

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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleLikes = async (catId) => {
    try {
      const response = await fetch(`/api/cats/like/${catId}?userId=${user.id}`, {
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

  return (
    <Box sx={{ mt: 4, mb: 4, width: '100%', pl: 6, pr: 6 }}>
      <CatSearch compact />
      {cats.length === 0 ? (
        <div>
          <p>Kissoja ei ole</p>
        </div>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {currentCats.map((cat, index) => (
              <Grid item key={index} xs={6} sm={6} md={4} lg={3}>
                <CatCard cat={cat} handleLikes={handleLikes} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3, marginBottom: 10 }}>
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} size="large" color="primary" />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CatList;
