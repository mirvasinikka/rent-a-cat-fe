import { AppContext } from '../App';
import { useContext } from 'react';
import { useParams } from 'react-router';

import { Typography, Box } from '@mui/material';

function CatInfo() {
  const { cats } = useContext(AppContext);

  let { id } = useParams();
  const catId = id - 1;

  return (
    <Box sx={{ width: '100%', height: '100%', img: { margin: 2, width: 300, height: 450 } }}>
      <img src={cats[catId].kuva} />
      <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
        <Typography variant="h6">Nimi: </Typography> <Typography variant="h6"> {cats[catId].nimi}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h6">Kaupunki: </Typography> <Typography variant="h6"> {cats[catId].sijainti}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h6">Laji: </Typography> <Typography variant="h6"> {cats[catId].laji}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h6">Omistaja: </Typography> <Typography variant="h6"> {cats[catId].omistaja}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="h6">Lempi lelu: </Typography> <Typography variant="h6"> {cats[catId].lelu}</Typography>
      </Box>
    </Box>
  );
}

export default CatInfo;
