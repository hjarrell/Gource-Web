import React, {useEffect, useState} from 'react';

import {getLog} from '../util/log';

export default ({search}) => {
    const [nodes, setNodes] = useState([]);
    useEffect(() => {
        if (search)
            getLog(search).then((a) => setNodes(a));
    }, [search]);
    return (
        <>
        {nodes.map((node) => {
            return (
            <div>
                <h2>{node.user} - {node.timestamp.toUTCString()}</h2>
                <ul>
                    {node.addedFiles.map((add) => <li>{add}</li>)}
                </ul>
            </div>
            )
        })}
        </>
    )
}