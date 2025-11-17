import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function D3GraphVisualizer() {
    const svgRef = useRef();

    useEffect(() => {
        const handleD3Data = (event) => {
            const hapStrings = event.detail || [];
            updateVisualization(hapStrings);
        };

        document.addEventListener("d3Data", handleD3Data);

        return () => {
            document.removeEventListener("d3Data", handleD3Data);
        };
    }, []);
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
    };

    return (
        <div className="mt-3">
            <h5 className="d3-title">Real-Time Amplitude Visualization</h5>
            <svg 
                ref={svgRef} 
                width="1000" 
                height="400"
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