import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Example from './components/Example';
import SearchBar from './components/SearchBar';

function App() {
  const [search, setSearch] = useState('');
  return (
    <div className="App">
      <h1>Git Visualization</h1>
      <SearchBar setSearch={setSearch} />
      <Example search={search} />
    </div>
  );
}

export default App;
