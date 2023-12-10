import { Card, CardContent, CardMedia, IconButton, Snackbar, Typography, Box } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function CatCard({ cat, handleLikes, compact = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();

    if (isAuthenticated) {
      handleLikes(cat.id);
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleInfo = () => {
    const searchParams = new URLSearchParams(location.search);
    const startRentDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const queryParams =
      startRentDate && endDate
        ? new URLSearchParams({
            startDate: startRentDate,
            endDate: endDate,
          }).toString()
        : '';

    return navigate(`/info/${cat.id}?${queryParams}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          maxWidth: 350,
          cursor: 'pointer',
          overflow: 'hidden',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
        onClick={handleInfo}
      >
        {!compact && (
          <>
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                zIndex: 1,
                color: isAuthenticated && cat.likes ? 'red' : 'white',
              }}
              onClick={handleClick}
            >
              {isAuthenticated && cat.likes ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderOutlinedIcon fontSize="large" />}
            </IconButton>
          </>
        )}
        <CardContent sx={{ padding: 0.8 }}>
          <CardMedia sx={{ height: 0, paddingTop: '100%', marginBottom: 2, position: 'relative' }} image={cat.image} title={'Cat name ' + cat.name} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {cat.name}
              <Typography variant="body1" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mt: 1 }}>
                {cat.city}
              </Typography>
            </Typography>
            <Box sx={{ backgroundColor: '#76bbc2', padding: 1, borderRadius: 4, marginRight: 2 }}>
              <Typography variant="h5" sx={{ color: 'white' }}>
                {cat.price}
              </Typography>
              <Typography variant="h7" sx={{ color: 'white' }}>
                €/day
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Please log in to like cats." />
    </>
  );
}

export default CatCard;
