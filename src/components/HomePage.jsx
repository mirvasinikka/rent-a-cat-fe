import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import cities from '../cities.json';

const HomePage = () => {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cityNames = Object.values(cities);
    setSuggestions(cityNames);
  }, []);

  const handleSearch = async () => {
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const queryParams = new URLSearchParams({
      city: city,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    }).toString();

    navigate(`/cats?${queryParams}`);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 2 }}>
        Rent a Cat
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              options={suggestions}
              onInputChange={(_, newInputValue) => {
                setCity(newInputValue);
              }}
              renderInput={(params) => <TextField {...params} label="City" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <DatePicker label="Start Date" inputFormat="dd.MM.yyyy" value={startDate} onChange={setStartDate} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <DatePicker label="End Date" inputFormat="dd.MM.yyyy" value={endDate} onChange={setEndDate} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
