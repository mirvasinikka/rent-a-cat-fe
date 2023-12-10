import { Card, CardContent, CardMedia, IconButton, Snackbar, Typography } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

import React, { useState } from 'react';
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

    const queryParams = new URLSearchParams({
      startDate: startRentDate,
      endDate: endDate,
    }).toString();

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
          <CardMedia sx={{ height: 0, paddingTop: '100%', marginBottom: 2, position: 'relative' }} image={cat.kuva} title={'Cat name ' + cat.nimi} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {cat.nimi}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {cat.city}
          </Typography>
        </CardContent>
      </Card>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Please log in to like cats." />
    </>
  );
}

export default CatCard;
