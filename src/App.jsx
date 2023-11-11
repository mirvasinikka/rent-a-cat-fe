import { useState } from 'react';

import image1 from './assets/miri1.jpg';
import image2 from './assets/miri4.jpg';
import image3 from './assets/miri11.jpg';

import CatTable from './components/CatTable';
import CatForm from './components/CatForm';
import CatAppBar from './components/CatAppBar';
// import './App.css'

// kovakoodattu esimerkkidata
const mockData = [
  {
    id: 1,
    nimi: 'Miri',
    laji: 'Scottish long hair',
    sijainti: 'Helsinki',
    omistaja: 'Mirva',
    lelu: 'pallo',
    kuva: image1,
  },
  {
    id: 2,
    nimi: 'Musti',
    laji: 'Persian',
    sijainti: 'Espoo',
    omistaja: 'Pekka',
    lelu: 'naru',
    kuva: image2,
  },
  {
    id: 3,
    nimi: 'Molla',
    laji: 'Thai Siamese',
    sijainti: 'Oulu',
    omistaja: 'Vilma',
    lelu: 'hiiri',
    kuva: image3,
  },
];

function App() {
  const [cats, setCats] = useState(mockData);

  const handleCatUpdate = (newCatInfo) => {
    setCats([...cats, newCatInfo]);
  };

  return (
    <>
      <CatAppBar />
      <CatTable cats={cats} />
      <CatForm handleCatUpdate={handleCatUpdate} />
    </>
  );
}

export default App;
