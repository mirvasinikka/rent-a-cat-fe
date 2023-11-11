import { useContext, useEffect, useState } from 'react';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AddIcon from '@mui/icons-material/Add';
import { Box, Paper, TextField, Button, Typography, InputLabel, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

const initalCatState = { nimi: '', laji: '', sijainti: '', omistaja: '', lelu: '', kuva: '', kuvaNimi: '' };

function CatForm() {
  const navigate = useNavigate();
  const {cats, setCats} = useContext(AppContext);
  const [message, setMessage] = useState('');
  const [cat, setCat] = useState(initalCatState);

  useEffect(() => {
    if (cat.nimi && cat.laji && cat.sijainti && cat.omistaja && cat.lelu && cat.kuva) {
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  }, [cat.nimi, cat.laji, cat.sijainti, cat.omistaja, cat.lelu, cat.kuva]);

  const muutaCat = (e) => {
    setCat({ ...cat, [e.target.name]: e.target.value });
  };

  const muutaCatKuva = (e) => {
    if (e.target.files) {
    setCat({ ...cat, kuva: URL.createObjectURL(e.target.files[0]), kuvaNimi: e.target.files[0].name });
    }
  };

  const handleCatUpdate = (cat) => {
    setCats([...cats, cat]);
  };

  const handleSubmit = () => {
    if (cat.nimi === '' || cat.laji === '' || cat.sijainti === '' || cat.omistaja === '' || cat.lelu === '' || cat.kuva === '') {
      setMessage('Kaikissa kentissä täytyy olla arvot, myös kuva!');
    } else {
      handleCatUpdate(cat);
      setCat(initalCatState);
      setMessage('Tiedot tallennettin!');
      navigate('/');
    }
  };

  return (
    <>
      <Box component="form" autoComplete="off" sx={{ '& .MuiTextField-root': { marginBottom: 2 }, margin: 5 }}>
        <input accept="image/*" name="kuva" id="kuva" type="file" onChange={muutaCatKuva} hidden />

        <InputLabel htmlFor="kuva" sx={{ marginBottom: 5 }}>
          <Typography sx={{ display: 'inline' }}>Kuva</Typography>
          <Button component="span" onClick={muutaCatKuva}>
            <AttachmentIcon fontSize="large" />
          </Button>
          {cat.kuvaNimi}
        </InputLabel>

        <TextField label="Kissan nimi" name="nimi" value={cat.nimi} onChange={muutaCat} required fullWidth autoFocus />
        <TextField label="Laji" name="laji" value={cat.laji} onChange={muutaCat} required fullWidth />
        <TextField label="Sijainti" name="sijainti" value={cat.sijainti} onChange={muutaCat} required fullWidth />
        <TextField label="Omistaja" name="omistaja" value={cat.omistaja} onChange={muutaCat} required fullWidth />
        <TextField label="Lempilelu" name="lelu" value={cat.lelu} onChange={muutaCat} required fullWidth />

        <Box sx={{ textAlign: 'center' }}>
          <Button size="large" onClick={handleSubmit} variant="contained" sx={{ marginRight: 3, marginTop: 3 }} startIcon={<AddIcon />}>
            Lisää
          </Button>
          <p>{message}</p>
        </Box>
      </Box>
    </>
  );
}

export default CatForm;
