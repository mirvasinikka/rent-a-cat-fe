import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAuth } from './AuthContext';

function RentList() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rentals?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRentals(data);
      } catch (error) {
        console.error('Failed to fetch rentals:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [user.id]);

  if (loading) {
    return <Typography>Loading rentals...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Your Rentals
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="rental table">
          <TableHead>
            <TableRow>
              <TableCell>Cat ID</TableCell>
              <TableCell align="right">Cat Name</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell>{rental.catId}</TableCell>
                <TableCell align="right">{rental.catDetails.name}</TableCell>
                <TableCell align="right">{rental.rentStartDate}</TableCell>
                <TableCell align="right">{rental.rentEndDate}</TableCell>
                <TableCell align="right">{rental.catDetails.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default RentList;
