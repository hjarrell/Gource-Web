import React, {
    useRef,
    useState,
    useEffect
} from 'react';
import * as d3 from 'd3';

import {
    getLog
} from '../util/log';

export default ({
    search
}) => {
    const graphicsD3 = useRef(null);
    const [allData, setAllData] = useState([]);
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const [title, setTitle] = useState("");
    const [simulation, setSimulation] = useState(null);

    useEffect(() => {
        if (search) {
            getLog(search)
                .then((log) => setAllData(log) && setData([]) && setIndex(0))
                .catch(() => setAllData({}) && setData([]))
        }
    }, [search]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (allData.length > 0 && index < allData.length) {
                setData(allData[index][1]);
                setTitle(allData[index][0]);
                setIndex(index + 1)
            }
        }, 1500);

        return () => {
            clearInterval(interval);
        };
    }, [allData, index]);

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

    useEffect(() => {
        if (data.length !== 0 && graphicsD3.current) {
            const width = 1200, height = 1200;
            const svg = d3.select(graphicsD3.current)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .call(d3.zoom().on("zoom", function () {
                  svg.attr("transform", d3.event.transform)
                }))
                  .on("mousedown.zoom", null)
                  .on("touchstart.zoom", null)
                  .on("touchmove.zoom", null)
                  .on("touchend.zoom", null)
               
            const root = d3.stratify()(data);
            const links = root.links();
            const nodes = root.descendants();

            let sim = simulation;

            if (!simulation) {
                sim = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(0.6))
                .force("charge", d3.forceManyBody().strength(-500))
                .force("x", d3.forceX())
                .force("y", d3.forceY());
                setSimulation(sim);
            } else {
                simulation.nodes(nodes);
                simulation.force('link').links(links);
                simulation.alpha(1).restart();
            }
            

            const link = svg.select(".link")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(links)
                .join("line");

            const node = svg.select(".node")
                .attr("fill", "#fff")
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .selectAll("circle")
                .data(nodes)
                .join("circle")
                .attr("fill", d => {
                    if (!d.children) {
                        switch (d.data.id.split(".")[d.data.id.split(".").length - 1]) {
                            case "js":
                                return ("red")
                                break;
                            case "css":
                                return ("blue")
                                break;
                            case "html":
                                return ("orange")
                                break;
                            case "png":
                                return ("yellow")
                                break;
                            case "md":
                                return ("pink")
                                break;
                            case "py":
                                return ("purple")
                            default:
                                return ("green")
                        }
                    } else {
                        return ("gray")
                    }
                })
                .attr("stroke", d => d.children ? null : "#fff")
                .attr("r", 3.5 * 3)
                .call(drag(sim));

            const text = svg.select(".nText")
                .selectAll('text')
                .data(nodes)
                .join('text')
                .text(d => d.data.id)
                .attr('font-size', 15)
                .attr('fill', 'white')
                .attr('dx', 15)
                .attr('dy', 4)

            node.append("title")
                .text(d => d.data.id);

                sim.on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y)
                text
                    .attr("x", node => node.x)
                    .attr("y", node => node.y);

                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
            });

            // invalidation.then(() => simulation.stop());
        }
    }, [search, data, graphicsD3.current, simulation]);

    return (
        <>
        <div>
            {title}
        </div>
        <svg className="graphics-grid" ref={graphicsD3}>
            <g className="link" id="link"></g>
            <g className="node" id="node"></g>
            <g className="nText" id="nText"></g>
        </svg>
        </>
    )
}