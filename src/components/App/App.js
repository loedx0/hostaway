import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import HostAuthToken from '../Services/HostAuthToken';

function App() {
  const[propertieslist, setpropertieslist] = useState([]);

  const handleOnClickPresionalo = async (e) => {
      e.preventDefault();
      const list = await HostAuthToken(setpropertieslist) ;
      console.log(list);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button style={{marginTop:'5%'}} onClick={handleOnClickPresionalo}>Presioname</button>
        {propertieslist?.map((property)=>{
          <div>{property.id}</div>
        })}
      </header>
    </div>
  );
}

export default App;
