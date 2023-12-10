import { Box, Button, Snackbar, Typography } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { DatePicker } from '@mui/x-date-pickers';

function CatRent() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [rentStartDate, setRentStartDate] = useState(null);
  const [rentEndDate, setRentEndDate] = useState(null);

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

  return (
    <Box sx={{ width: '50%' }}>
      <form onSubmit={handleFormSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2, marginRight: 10 }}>
          <DatePicker
            label="Rental Start Date"
            inputFormat="dd.MM.yyyy"
            value={rentStartDate}
            onChange={(newDate) => {
              setRentStartDate(newDate);
            }}
          />
          <DatePicker
            label="Rental End Date"
            inputFormat="dd.MM.yyyy"
            value={rentEndDate}
            onChange={(newDate) => {
              setRentEndDate(newDate);
            }}
            minDate={rentStartDate}
          />
          {rentalDays > 0 && <Typography variant="body1">Number of rental days: {rentalDays}</Typography>}
          {rentalDays > 0 && <Typography variant="body1">Price of the rent: {rentalDays}€</Typography>}
        </Box>
        <Button type="submit" variant="contained" color="primary">
          Rent
        </Button>
      </form>
      <Snackbar open={formSubmitted} autoHideDuration={6000} onClose={() => setFormSubmitted(false)} message="Renting submitted successfully!" />
    </Box>
  );
}

export default CatRent;
