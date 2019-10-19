import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Example from './components/Example';
import SearchBar from './components/SearchBar';

function App() {
  const [search, setSearch] = useState('');
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
        <SearchBar search={search} setSearch={setSearch} />
      </header>
    </div>
  );
}

export default App;
