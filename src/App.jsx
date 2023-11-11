import CatForm from './components/CatForm';
import CatAppBar from './components/CatAppBar';
import { blue, indigo, pink } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createContext, useState } from 'react';

import image1 from './assets/miri1.jpg';
import image2 from './assets/miri4.jpg';
import image3 from './assets/miri11.jpg';
import CatList from './components/CatList';
import CatInfo from './components/CatInfo';
import Error from './components/Error';
import LikedCats from './components/LikedCats';


const mockData = [
  {
    id: 1,
    nimi: 'Miri',
    laji: 'Scottish long hair',
    sijainti: 'Helsinki',
    omistaja: 'Mirva',
    lelu: 'pallo',
    kuva: image1,
    liked: true,
  },
  {
    id: 2,
    nimi: 'Musti',
    laji: 'Persian',
    sijainti: 'Espoo',
    omistaja: 'Pekka',
    lelu: 'naru',
    kuva: image2,
    liked: false,
  },
  {
    id: 3,
    nimi: 'Molla',
    laji: 'Thai Siamese',
    sijainti: 'Oulu',
    omistaja: 'Vilma',
    lelu: 'hiiri',
    kuva: image3,
    liked: false,
  },
  {
    id: 4,
    nimi: 'Miri',
    laji: 'Scottish long hair',
    sijainti: 'Helsinki',
    omistaja: 'Mirva',
    lelu: 'pallo',
    kuva: image1,
    liked: false,
  },
  {
    id: 5,
    nimi: 'Musti',
    laji: 'Persian',
    sijainti: 'Espoo',
    omistaja: 'Pekka',
    lelu: 'naru',
    kuva: image2,
    liked: false,
  },
  {
    id: 6,
    nimi: 'Molla',
    laji: 'Thai Siamese',
    sijainti: 'Oulu',
    omistaja: 'Vilma',
    lelu: 'hiiri',
    kuva: image3,
    liked: true,
  },
];

const theme = createTheme({
  palette: {
    primary: { main: pink[200], contrastText: '#FFFFFF' },
    secondary: { main: blue[400], contrastText: '#FFFFFF' },
    text: { primary: indigo[900], secondary: indigo[400] },
  },
  typography: {
    fontFamily: "'Sometype Mono', 'monospace'"
  },
});

export const AppContext = createContext(null);

const router = createBrowserRouter([
  {
    element: <CatAppBar />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <CatList />,
      },
      {
        path: 'add',
        element: <CatForm />,
      },
      {
        path: 'info/:id',
        element: <CatInfo />,
      },
      {
        path: 'likes',
        element: <LikedCats />,
      },
    ],
  },
]);

function App() {
  const [cats, setCats] = useState(mockData);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ cats, setCats }}>
        <RouterProvider router={router} />
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
