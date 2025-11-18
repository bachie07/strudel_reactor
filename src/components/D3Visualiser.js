import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function D3GraphVisualizer() {
    const svgRef = useRef();

    useEffect(() => { // handler function that receives data from strudel
        const handleD3Data = (event) => {
            const hapStrings = event.detail || [];
            updateVisualization(hapStrings);
        };

        document.addEventListener("d3Data", handleD3Data);

        return () => {
            document.removeEventListener("d3Data", handleD3Data);
        };
    }, []);

    //function to update D3 visualiation with new hap data
    const updateVisualization = (hapStrings) => {
        if (!svgRef.current || hapStrings.length === 0) return;
    
        //set dimension
        const svg = d3.select(svgRef.current);
        const width = 1020;
        const height = 550;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
    
        svg.selectAll("*").remove();
    
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // Extract amplitude from last 80 events
        const amplitudeData = hapStrings.slice(-80).map((hapString, index) => {
            const gainMatch = hapString.match(/gain:([\d.]+)/);
            const postgainMatch = hapString.match(/postgain:([\d.]+)/);
            
            let amplitude = 1;
            if (postgainMatch) {
                amplitude = parseFloat(postgainMatch[1]);
            } else if (gainMatch) {
                amplitude = parseFloat(gainMatch[1]);
            }
            
            return { index, amplitude };
        });
    
        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, amplitudeData.length - 1])
            .range([0, innerWidth]);
    
        const maxAmplitude = d3.max(amplitudeData, d => d.amplitude) || 2;
        const yScale = d3.scaleLinear()
            .domain([0, maxAmplitude])
            .range([innerHeight, 0]);
    
        // Line generator
        const line = d3.line()
            .x(d => xScale(d.index))
            .y(d => yScale(d.amplitude))
            .curve(d3.curveCardinal.tension(0.5));
    
        // Area generator (filled wave)
        const area = d3.area()
            .x(d => xScale(d.index))
            .y0(innerHeight)
            .y1(d => yScale(d.amplitude))
            .curve(d3.curveCardinal.tension(0.5));
    
        // Gradient definition
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
        
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#00ff88")
            .attr("stop-opacity", 0.8);
        
        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#00d4ff")
            .attr("stop-opacity", 0.2);
    
        // Draw filled area
        g.append("path")
            .datum(amplitudeData)
            .attr("fill", "url(#gradient)")
            .attr("opacity", 0.6)
            .attr("d", area);
    
        // Draw wave line
        g.append("path")
            .datum(amplitudeData)
            .attr("fill", "none")
            .attr("stroke", "#00ff88")
            .attr("stroke-width", 3)
            .attr("d", line);
        
        //X-axis
        const xAxis = d3.axisBottom(xScale).ticks(10);
            g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(xAxis)
            .attr("color", "#00d4ff")
    .       style("font-size", "12px");

      // Y-axis
        const yAxis = d3.axisLeft(yScale).ticks(5);
            g.append("g")
            .call(yAxis)
            .attr("color", "#00d4ff")
            .style("font-size", "12px");
            };

    return (
        <div className="mt-3">
            <h5 className="d3-title">Real-Time Amplitude Visualization</h5>
            <svg 
                ref={svgRef} 
                width="1020" 
                height="550"
                style={{ 
                    background: '#0d1117', 
                    border: '2px solid #00ff88',
                    borderRadius: '8px'
                }}
            />
        </div>
    );
}

export default D3GraphVisualizer;