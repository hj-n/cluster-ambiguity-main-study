import React, { useEffect } from "react";
import * as d3 from 'd3';
import "./Scatterplot.css"

const Scatterplot = (props) => {

	const coord = props.coord;
	const label = new Array(coord.length).fill(-1);

	// normalize coord
	const maxX = d3.max(coord, d => d[0]);
	const minX = d3.min(coord, d => d[0]);
	const maxY = d3.max(coord, d => d[1]);
	const minY = d3.min(coord, d => d[1]);

	const xScale = d3.scaleLinear()
						 			 .domain([minX, maxX])
						  		 .range([35, 663]);

	const yScale = d3.scaleLinear()
									 .domain([minY, maxY])
									 .range([663, 35]);
	
	let lassoObj = null;
	
	coord.forEach(xy => {
		xy[0] = xScale(xy[0]);
		xy[1] = yScale(xy[1]);
	})


	
	// render a scatterplot in the canvas with id "scatterplot"
	// if label is -1, the point should be black. Else, the point should follow the schemecategory20 color scheme

	useEffect(() => {
		const canvas = document.getElementById("scatterplot");
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const colorMap = d3.schemeCategory10;
		console.log(colorMap)

		// draw the scatterplot
		coord.forEach(xy => {
			ctx.beginPath();
			ctx.arc(xy[0], xy[1], 3, 0, 2 * Math.PI);
			ctx.fill();
		})
	})

	// lasso setting
	useEffect(() => {

	})

	



	return (
		<div className="splot">
			<canvas
				id="scatterplot"
				width="700"
				height="700"
				style={{ border: "1.5px solid #000000", position:"absolute", zIndex: 1}} 
			/>
			<svg
				id="lassoSvg"
				width="700"
				height="700"
				style={{ position: "absolute", zIndex: 2}}
			/>
		</div>
	)
}

export default Scatterplot;