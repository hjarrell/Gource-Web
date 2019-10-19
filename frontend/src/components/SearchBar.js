import React, {useState} from 'react';

export default ({search, setSearch}) => {
    const [localSearch, setLocalSearch] = useState('');

    return (
        <div>
            <input onChange={(e) => setLocalSearch(e.target.value)}></input>
            <button onClick={(e) => {
                setSearch(localSearch)
            }}>Search</button>
        </div>
    )
}
