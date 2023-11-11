import { useLocation } from 'react-router-dom';
import './CatTable.css';
import { useEffect } from 'react';
import { useState } from 'react';

import image1 from '../assets/miri1.jpg';
import image2 from '../assets/miri4.jpg';
import image3 from '../assets/miri11.jpg';

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

function CatTable() {
  const location = useLocation();
  const [cats, setCats] = useState(mockData);

  if (cats.length === 0) {
    return <p>Kissoja ei ole</p>;
  }


  useEffect(() => {
    if (location.state) {
    setCats([...cats, location.state.cat]);
    }
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Kuva</th>
          <th>Nimi</th>
          <th>Laji</th>
          <th>Lempilelu</th>
          <th>Sijainti</th>
        </tr>
      </thead>
      <tbody>
        {cats.map((cat) => {
          return (
            <tr key={cat.nimi + cat.lelu}>
              <td>
                <img src={cat.kuva} />
              </td>
              <td>{cat.nimi}</td>
              <td>{cat.laji}</td>
              <td>{cat.lelu}</td>
              <td>{cat.sijainti}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default CatTable;
