import { useContext } from 'react';
import './CatTable.css';

import { AppContext } from '../App';

function CatTable() {
  const {cats} = useContext(AppContext);

  if (cats.length === 0) {
    return <p>Kissoja ei ole</p>;
  }

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
