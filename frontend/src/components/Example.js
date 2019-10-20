import React, {useEffect, useState} from 'react';

import * as d3 from 'd3';

import {getLog} from '../util/log';

export default ({search}) => {
    const [nodes, setNodes] = useState([]);
    useEffect(() => {
        if (search)
            getLog(search)
                .then((a) => setNodes(a))
                .catch((a) => setNodes([]));
    }, [search]);
    return (
        <>
        {nodes && console.log(nodes)}
        </>
    )
}
