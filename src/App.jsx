import CatTable from './components/CatTable';
import CatForm from './components/CatForm';
import CatAppBar from './components/CatAppBar';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createContext, useState } from 'react';

import image1 from './assets/miri1.jpg';
import image2 from './assets/miri4.jpg';
import image3 from './assets/miri11.jpg';
import CatList from './components/CatList';
import CatInfo from './components/CatInfo';

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
  {
    id: 4,
    nimi: 'Miri',
    laji: 'Scottish long hair',
    sijainti: 'Helsinki',
    omistaja: 'Mirva',
    lelu: 'pallo',
    kuva: image1,
  },
  {
    id: 5,
    nimi: 'Musti',
    laji: 'Persian',
    sijainti: 'Espoo',
    omistaja: 'Pekka',
    lelu: 'naru',
    kuva: image2,
  },
  {
    id: 6,
    nimi: 'Molla',
    laji: 'Thai Siamese',
    sijainti: 'Oulu',
    omistaja: 'Vilma',
    lelu: 'hiiri',
    kuva: image3,
  },
];

export const AppContext = createContext(null);

const router = createBrowserRouter([
  {
    element: <CatAppBar />,
    errorElement: null,
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
    ],
  },
]);

function App() {
  const [cats, setCats] = useState(mockData);

  return (
    <AppContext.Provider value={{cats, setCats}}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}

export default App;
