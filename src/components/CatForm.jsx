import { useEffect, useState } from 'react';

import './CatForm.css';

const initalCatState = { nimi: '', laji: '', sijainti: '', omistaja: '', lelu: '', kuva: '' };

function CatForm({ handleCatUpdate }) {
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
    setCat({ ...cat, kuva: URL.createObjectURL(e.target.files[0]) });
  };

  const handleSubmit = () => {
    if (cat.nimi === '' || cat.laji === '' || cat.sijainti === '' || cat.omistaja === '' || cat.lelu === '' || cat.kuva === '') {
      setMessage('Kaikissa kentissä täytyy olla arvot, myös kuva!');
    } else {
      handleCatUpdate(cat);
      setCat(initalCatState);
      setMessage('Tiedot tallennettin!');
    }
  };

  return (
    <form>
      <div className="block">
        <label>Kissan kuva</label>
        <input type="file" onChange={muutaCatKuva} id="kuva" name="kuva" />
      </div>
      <div className="block">
        <label>Kissan nimi</label>
        <input type="text" onChange={muutaCat} name="nimi" value={cat.nimi} />
      </div>
      <div className="block">
        <label>Laji</label>
        <input type="text" onChange={muutaCat} name="laji" value={cat.laji} />
      </div>
      <div className="block">
        <label>Sijainti</label>
        <input type="text" onChange={muutaCat} name="sijainti" value={cat.sijainti} />
      </div>
      <div className="block">
        <label>Omistaja</label>
        <input type="text" onChange={muutaCat} name="omistaja" value={cat.omistaja} />
      </div>
      <div className="block">
        <label>Lempilelu</label>
        <input type="text" onChange={muutaCat} name="lelu" value={cat.lelu} />
      </div>
      <div>
        <input type="button" value="Lisää" onClick={handleSubmit} />
        <p>{message}</p>
      </div>
    </form>
  );
}

export default CatForm;
