import React, {useState} from 'react';
import './App.css';
import Example from './components/Example';
import SearchBar from './components/SearchBar';
import GraphicsGrid from './components/GraphicsGrid';

function App() {
  const [search, setSearch] = useState('');
  return (
    <div className="App">
      <h1>Git Visualization</h1>
      <SearchBar setSearch={setSearch} />
      <GraphicsGrid search={search} />
    </div>
  );
}

export default App;
