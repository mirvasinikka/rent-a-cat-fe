import { useEffect, useState } from 'react';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AddIcon from '@mui/icons-material/Add';
import { Box, TextField, Button, Typography, Autocomplete } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker } from '@mui/x-date-pickers';
import cities from '../cities.json';

const initalCatState = {
  name: '',
  breed: '',
  city: '',
  owner: '',
  toy: '',
  image: '',
  imageNimi: '',
  available_from: null,
  available_until: null,
  price: 0,
};

function CatForm() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [cat, setCat] = useState(initalCatState);
  const [suggestions, setSuggestions] = useState([]);
  const [city, setCity] = useState('');

  let { id: catId } = useParams();
  const isEditing = catId != null;

  useEffect(() => {
    const cityNames = Object.values(cities);
    setSuggestions(cityNames);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditing) {
          const response = await fetch(`/api/cats/${catId}`);
          const data = await response.json();

          const formattedData = {
            ...data,
            available_from: data.available_from ? new Date(data.available_from) : null,
            available_until: data.available_until ? new Date(data.available_until) : null,
          };

          setCat(formattedData);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [catId, isEditing]);

  useEffect(() => {
    if (cat.name && cat.breed && cat.city && cat.owner && cat.toy && cat.image) {
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  }, [cat.name, cat.breed, cat.city, cat.owner, cat.toy, cat.image]);

  const muutaCat = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;

    setCat({ ...cat, [e.target.name]: value });
  };
  const muutaCatimage = (e) => {
    if (e.target.files) {
      setCat({ ...cat, image: URL.createObjectURL(e.target.files[0]), imageNimi: e.target.files[0].name });
    }
  };
  const handleSubmit = async () => {
    // Format date fields
    const formattedCat = {
      ...cat,
      image: `https://source.unsplash.com/featured/?cat,${cat.id}`,
      available_from: cat.available_from ? new Date(cat.available_from).toISOString().split('T')[0] : null,
      available_until: cat.available_until ? new Date(cat.available_until).toISOString().split('T')[0] : null,
    };

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/cats/${catId}` : '/api/cats';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedCat),
      });

      const data = await response.json();

      if (response.ok) {
        setCat(initalCatState);
        setMessage(isEditing ? 'Tiedot päivitetty!' : 'Tiedot tallennettin!');
        navigate('/manage');
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Virhe tiedon tallennuksessa');
    }
  };

  return (
    <Box component="form" autoComplete="off" sx={{ '& .MuiTextField-root': { marginBottom: 2 }, margin: 5 }}>
      <Box sx={{ marginBottom: 5, textAlign: 'center' }}>
        {cat.image && (
          <img
            src={cat.image.startsWith('blob:') ? cat.image : `http://localhost:3001${cat.image}`}
            alt="Cat"
            style={{ maxWidth: '300px', maxHeight: '300px' }}
          />
        )}
        <input accept="image/*" name="image" id="image" type="file" onChange={muutaCatimage} hidden />
        <Typography sx={{ display: 'inline' }}>image: {cat.imageNimi}</Typography>
        <Button component="span" onClick={() => document.getElementById('image').click()}>
          <AttachmentIcon fontSize="large" />
          Upload Image
        </Button>
      </Box>

      <TextField label="name" name="name" value={cat.name} onChange={muutaCat} required fullWidth autoFocus />
      <TextField label="breed" name="breed" value={cat.breed} onChange={muutaCat} required fullWidth />
      <Autocomplete
        freeSolo
        options={suggestions}
        value={city}
        onInputChange={(_, newInputValue) => {
          setCity(newInputValue);
          setCat({ ...cat, city: newInputValue });
        }}
        renderInput={(params) => <TextField {...params} label="City" fullWidth />}
      />

      <TextField label="owner" name="owner" value={cat.owner} onChange={muutaCat} required fullWidth />
      <TextField label="favorite toy" name="toy" value={cat.toy} onChange={muutaCat} required fullWidth />

      <DatePicker
        label="Rental Start Date"
        inputFormat="dd.MM.yyyy"
        value={cat.available_from}
        onChange={(date) => {
          setCat({ ...cat, available_from: date });
        }}
      />
      <DatePicker
        label="Rental End Date"
        inputFormat="dd.MM.yyyy"
        value={cat.available_until}
        onChange={(date) => {
          setCat({ ...cat, available_until: date });
        }}
      />

      <TextField label="price" name="price" type="number" value={cat.price} onChange={muutaCat} required fullWidth />

      <Box sx={{ textAlign: 'center' }}>
        <Button
          size="large"
          onClick={handleSubmit}
          variant="contained"
          sx={{ marginRight: 3, marginTop: 3 }}
          startIcon={isEditing ? <EditIcon /> : <AddIcon />}
        >
          {isEditing ? 'Päivitä' : 'Lisää'}
        </Button>
        <p>{message}</p>
      </Box>
    </Box>
  );
}

export default CatForm;
