import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const SmallScatterplot = (props) => {


	const canvasRef = useRef(null);

	const data = require(`../data/${props.data}.json`)

	const minX = d3.min(data, d => d[0]);
	const maxX = d3.max(data, d => d[0]);
	const minY = d3.min(data, d => d[1]);
	const maxY = d3.max(data, d => d[1]);

	const xScale = d3.scaleLinear()
								   .domain([minX, maxX])
									 .range([0, 250]);
	
	const yScale = d3.scaleLinear()
									 .domain([minY, maxY])
									 .range([250, 0]);
	
	let canvas, ctx;

	console.log(data)

	useEffect(() => {
		canvas = canvasRef.current;
		ctx = canvas.getContext("2d");
		data.forEach(xy => {
			ctx.beginPath();
			ctx.arc(xScale(xy[0]), yScale(xy[1]), (2 / 7) * 2.5, 0, 2 * Math.PI);
			ctx.fillStyle = "black";
			ctx.fill();
		})
	});

	return (
		<div>
			<canvas
				id="smallscatter"
				ref={canvasRef}
				width={200}
				height={200}
				style={{ border: "1px solid #000000", margin: 10}}
			></canvas>
		</div>
	)
}

export default SmallScatterplot;