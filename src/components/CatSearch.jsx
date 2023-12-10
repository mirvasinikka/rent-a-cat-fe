import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import Autocomplete from '@mui/material/Autocomplete';
import cities from '../cities.json';

function CatSearch({ compact = false, sx }) {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const cityNames = Object.values(cities);
    setSuggestions(cityNames);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const city = searchParams.get('city');
    const startRentDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (city) {
      setCity(city);
    }

    if (startRentDate) {
      const parsedStartDate = new Date(startRentDate);

      setStartDate(parsedStartDate);
    }

    if (endDate) {
      const parsedEndDate = new Date(endDate);
      setEndDate(parsedEndDate);
    }
  }, [location.search]);

  useEffect(() => {
    if (city && startDate == null) {
      setOpenStartDatePicker(true);
    }

    if (startDate && endDate == null) {
      setOpenEndDatePicker(true);
    }
  }, [city, endDate, startDate]);

  const minDate = new Date();

  const handleSearch = async () => {
    const offset = startDate.getTimezoneOffset();
    const adjustedStartDate = new Date(startDate.getTime() - offset * 60 * 1000);
    const adjustedEndDate = new Date(endDate.getTime() - offset * 60 * 1000);

    const formattedStartDate = adjustedStartDate.toISOString().split('T')[0];
    const formattedEndDate = adjustedEndDate.toISOString().split('T')[0];

    const queryParams = new URLSearchParams({
      city: city,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    }).toString();

    navigate(`/cats?${queryParams}`);
  };

  const citySize = compact ? 4 : 12;
  const dateSize = compact ? 2 : 6;
  const buttonSize = compact ? 2 : 12;

  return (
    <Box component="form" noValidate autoComplete="off" sx={sx}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={citySize}>
          <Autocomplete
            freeSolo
            options={suggestions}
            value={city}
            onInputChange={(_, newInputValue) => {
              setCity(newInputValue);
            }}
            renderInput={(params) => <TextField {...params} label="City" fullWidth />}
          />
        </Grid>
        <Grid item xs={dateSize}>
          <DatePicker
            label="Start Date"
            inputFormat="dd.MM.yyyy"
            value={startDate}
            onChange={(newDate) => {
              setStartDate(newDate);
              setOpenStartDatePicker(false);
            }}
            open={openStartDatePicker}
            onOpen={() => setOpenStartDatePicker(true)}
            onClose={() => setOpenStartDatePicker(false)}
            minDate={minDate}
          />
        </Grid>
        <Grid item xs={dateSize}>
          <DatePicker
            label="End Date"
            inputFormat="dd.MM.yyyy"
            value={endDate}
            onChange={(newDate) => {
              setEndDate(newDate);
              setOpenEndDatePicker(false);
            }}
            open={openEndDatePicker}
            onOpen={() => setOpenEndDatePicker(true)}
            onClose={() => setOpenEndDatePicker(false)}
            minDate={startDate || minDate}
          />
        </Grid>
        {compact && (
          <Grid item xs={buttonSize} style={{ display: 'flex' }}>
            <Button variant="contained" color="primary" onClick={handleSearch} size="large">
              Search
            </Button>
          </Grid>
        )}
      </Grid>
      {!compact && (
        <Box mt={2} width="100%" sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleSearch} fullWidth size="large">
            Search
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CatSearch;
