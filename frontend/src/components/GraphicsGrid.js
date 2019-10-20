import React, {useRef, useState, useEffect} from 'react';
import * as d3 from 'd3';

import { getLog } from '../util/log';

export default ({search}) => {
    const graphicsD3 = useRef(null);
    const [data, setData] = useState({});

    useEffect(() => {
        if (search) {
            getLog(search)
                .then((log) => setData(log))
                .catch(() => setData([]))
        }
    }, [search]);

    useEffect(() => {
        console.log(data)
        if (Object.entries(data).length !== 0 && graphicsD3.current) {
            const width = 1200, height = 1200;
            const drag = simulation => {
  
                function dragstarted(d) {
                  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                }
                
                function dragged(d) {
                  d.fx = d3.event.x;
                  d.fy = d3.event.y;
                }
                
                function dragended(d) {
                  if (!d3.event.active) simulation.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                }
                
                return d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended);
              }
            const svg = d3.select(graphicsD3.current)
                .attr("viewBox", [-width / 2, -height / 2, width, height]);
            const cm1 = data[Object.keys(data)[0]];
            const root = d3.stratify()(cm1);
            const links = root.links();
            const nodes = root.descendants();
            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
                .force("charge", d3.forceManyBody().strength(-4000))
                .force("x", d3.forceX())
                .force("y", d3.forceY());
            
                const link = svg.append("g")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
              .selectAll("line")
              .data(links)
              .join("line");
          
            const node = svg.append("g")
                .attr("fill", "#fff")
                .attr("stroke", "#000")
                .attr("stroke-width", 5)
              .selectAll("circle")
              .data(nodes)
              .join("circle")
                .attr("fill", d => d.children ? null : "#000")
                .attr("stroke", d => d.children ? null : "#fff")
                .attr("r", 3.5*7)
                .call(drag(simulation));
          
            node.append("title")
                .text(d => d.data.name);
          
            simulation.on("tick", () => {
              link
                  .attr("x1", d => d.source.x)
                  .attr("y1", d => d.source.y)
                  .attr("x2", d => d.target.x)
                  .attr("y2", d => d.target.y);
          
              node
                  .attr("cx", d => d.x)
                  .attr("cy", d => d.y);
            });
          
            // invalidation.then(() => simulation.stop());
        }
    }, [search, data, graphicsD3.current]);

    return (
        <svg className="graphics-grid" ref={graphicsD3}>
        </svg>
    )
}