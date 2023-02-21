import logo from './logo.svg';
import './App.css';
import HostAuthToken from '../Services/HostAuthToken';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button style={{marginTop:'5%'}} onClick={HostAuthToken}>Presioname</button>
      </header>
    </div>
  );
}

export default App;
