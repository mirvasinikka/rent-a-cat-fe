import { Alert, Box, Button, Divider, Typography } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Paper from '@mui/material/Paper';

function CatRent({ price, id }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [rentStartDate, setRentStartDate] = useState(null);
  const [rentEndDate, setRentEndDate] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(number);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const startRentDate = searchParams.get('startDate');
    const rentEndDate = searchParams.get('endDate');

    if (startRentDate) {
      const parsedStartDate = new Date(startRentDate);

      setRentStartDate(parsedStartDate);
    }

    if (rentEndDate) {
      const parsedEndDate = new Date(rentEndDate);
      setRentEndDate(parsedEndDate);
    }
  }, [location.search]);

  const rentalDays = useMemo(() => {
    if (rentStartDate && rentEndDate) {
      const timeDiff = rentEndDate - rentStartDate;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      return daysDiff > 0 ? daysDiff : 0;
    }
  }, [rentStartDate, rentEndDate]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
    } else {
      try {
        const response = await fetch('/api/rent-cat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            catId: id,
            userId: user.id,
            usersName: user.userName,
            userEmail: user.email,
            rentStartDate: rentStartDate.toISOString().split('T')[0],
            rentEndDate: rentEndDate.toISOString().split('T')[0],
            price,
          }),
        });

        if (response.ok) {
          setFormSubmitted(true);
          setTimeout(() => navigate('/rentals'), 3000);
        } else {
          throw new Error('Failed to submit form');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const serviseFee = 10;
  const rentPrice = price * rentalDays;
  const endPrice = rentPrice + serviseFee;

  return (
    <Box sx={{ width: '50%' }}>
      <Paper elevation={3} sx={{ padding: 2, borderRadius: '8px', width: '100%' }}>
        {rentalDays > 0 && (
          <Typography variant="h6" sx={{ marginTop: 1, marginBottom: 3, fontWeight: 'bold' }}>
            {formatCurrency(price)}/day
          </Typography>
        )}
        <form onSubmit={handleFormSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <DatePicker
              sx={{ width: '100%' }}
              label="Rental Start Date"
              inputFormat="dd.MM.yyyy"
              value={rentStartDate}
              onChange={(newDate) => {
                setRentStartDate(newDate);
              }}
            />
            <DatePicker
              sx={{ width: '100%' }}
              label="Rental End Date"
              inputFormat="dd.MM.yyyy"
              value={rentEndDate}
              onChange={(newDate) => {
                setRentEndDate(newDate);
              }}
              minDate={rentStartDate}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2, width: '100%' }}>
            Rent
          </Button>

          {rentalDays > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Typography variant="body1">
                {formatCurrency(price)} x {rentalDays} days
              </Typography>
              <Typography variant="body1">{formatCurrency(rentPrice)}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Typography variant="body1">Service fee:</Typography>
            <Typography variant="body1">{formatCurrency(serviseFee)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          {rentalDays > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
              <Typography sx={{ fontWeight: 'bold' }} variant="body1">
                Price of the rent:
              </Typography>
              <Typography sx={{ fontWeight: 'bold' }} variant="body1">
                {formatCurrency(endPrice)}
              </Typography>
            </Box>
          )}
        </form>
        {formSubmitted && (
          <Alert severity="success" sx={{ marginTop: 2 }}>
            Cat Rented successfully!
          </Alert>
        )}
      </Paper>
    </Box>
  );
}

export default CatRent;
