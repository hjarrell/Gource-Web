import React, {useState} from 'react';

export default ({setSearch}) => {
    const [localSearch, setLocalSearch] = useState('');

    return (
        <div>
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="https://github.com/..." aria-label="Recipient's username" aria-describedby="button-addon2" onChange={(e) => setLocalSearch(e.target.value)}/>
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={(e) => {
                        setSearch(localSearch)
                    }}>Go</button>
                </div>
            </div>
        </div>
    )
}
