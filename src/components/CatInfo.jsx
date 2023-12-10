import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TextField, FormControlLabel, Checkbox, Snackbar, Typography, Box, Button } from '@mui/material';

function NavigateBackToButton() {
  const navigate = useNavigate();
  return (
    <Button variant="contained" onClick={() => navigate('/cats')} size="large">
      Back to Cats
    </Button>
  );
}

function CatInfo() {
  const getCurrentDateFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const day = `0${today.getDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
  };

  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let { id } = useParams();
  const [rentStartDate, setRentStartDate] = useState(getCurrentDateFormatted());
  const [rentEndDate, setRentEndDate] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [rentalDays, setRentalDays] = useState(0);

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

  useEffect(() => {
    if (rentStartDate && rentEndDate) {
      const startDate = new Date(rentStartDate);
      const endDate = new Date(rentEndDate);
      const timeDiff = endDate - startDate;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      setRentalDays(daysDiff > 0 ? daysDiff : 0);
    }
  }, [rentStartDate, rentEndDate]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    try {
      const response = await fetch('/api/rent-cat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        /** TODO: Figure out how to get the userId */
        body: JSON.stringify({ catId: id, userId: id, usersName, userEmail, rentStartDate, rentEndDate }),
      });

      if (response.ok) {
        setFormSubmitted(true);
        setTimeout(() => navigate('/'), 3000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
    <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 2 }}>
      <Box sx={{ width: '50%', img: { margin: 2, width: 300, height: 450, marginLeft: 30 } }}>
        <img src={cat.kuva} alt={cat.nimi} />
        <Box sx={{ display: 'flex', gap: 1, marginTop: 2, marginLeft: 30 }}>
          <Typography variant="h6">Nimi: </Typography> <Typography variant="h6"> {cat.nimi}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginLeft: 30 }}>
          <Typography variant="h6">Kaupunki: </Typography> <Typography variant="h6"> {cat.city}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginLeft: 30 }}>
          <Typography variant="h6">Laji: </Typography> <Typography variant="h6"> {cat.laji}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginLeft: 30 }}>
          <Typography variant="h6">Omistaja: </Typography> <Typography variant="h6"> {cat.omistaja}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginBottom: 2, marginLeft: 30 }}>
          <Typography variant="h6">Lempi lelu: </Typography> <Typography variant="h6"> {cat.lelu}</Typography>
        </Box>
        <Button variant="secondary" component={Link} onClick={() => navigate('/')}>
          Back to cats
        </Button>
      </Box>
      <Box sx={{ width: '50%' }}>
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2, marginRight: 10 }}>
            <TextField
              label="Rent Start Date"
              value={rentStartDate}
              onChange={(e) => setRentStartDate(e.target.value)}
              required
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Rent End Date"
              value={rentEndDate}
              onChange={(e) => setRentEndDate(e.target.value)}
              required
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            {rentalDays > 0 && <Typography variant="body1">Number of rental days: {rentalDays}</Typography>}
          </Box>
          <FormControlLabel
            control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />}
            label="I agree to the terms and conditions"
          />
          <Button type="submit" variant="contained" color="primary">
            Rent Cat
          </Button>
        </form>
        <Snackbar open={formSubmitted} autoHideDuration={6000} onClose={() => setFormSubmitted(false)} message="Renting submitted successfully!" />
      </Box>
    </Box>
  );
}

export default CatInfo;
