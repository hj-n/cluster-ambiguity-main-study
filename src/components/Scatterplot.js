import React, { useEffect } from "react";
import * as d3 from 'd3';
import "./Scatterplot.css"
import robustPointInPolygon from "robust-point-in-polygon";

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
	

	const colorMap = d3.schemeCategory10;
	
	coord.forEach(xy => {
		xy[0] = xScale(xy[0]);
		xy[1] = yScale(xy[1]);
	})

	let canvas, ctx;

	function updateSplot() {
		// clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// draw scatterplot
		coord.forEach((xy, i) => {
			ctx.beginPath();
			ctx.arc(xy[0], xy[1], 3, 0, 2 * Math.PI);
			if (label[i] === -1) {
				ctx.fillStyle = "black";
			}
			else {
				ctx.fillStyle = colorMap[label[i]];
			}
			ctx.fill();
		})
	} 
	



	// variables for status
	let lassos = {};
	let lassoPaths = {};
	let currentLassoNum = -1;
	let isLassoing = false;
	let startPosition = null;
	let status = "lasso";

	useEffect(() => {
		canvas = document.getElementById("scatterplot");
		ctx = canvas.getContext("2d");
		updateSplot();
	})

	// lasso setting
	useEffect(() => {

		function clickLasso(event) {
			if (!isLassoing && status === "lasso") {
				// update status
				isLassoing = true;
				currentLassoNum += 1;
				lassos[currentLassoNum] = new Array(coord.length).fill(false);
				startPosition = [event.offsetX, event.offsetY];
				lassoPaths[currentLassoNum] = [startPosition];
				// draw lasso start circle
				d3.select(event.target)
				  .append("circle")
					.attr("id", "currentLassoCircle")
					.attr("cx", event.offsetX)
					.attr("cy", event.offsetY)
					.attr("r", 5)
					.attr("fill", "None")
					.attr("stroke", colorMap[currentLassoNum])
				
				d3.select(event.target)
				  .append("path")
					.attr("id", "currentLassoPath");
			}
			else {
				// finish lassoing
				isLassoing = false;
				d3.select(event.target).select("#currentLassoCircle").remove();
				d3.select(event.target).select("#currentLassoPath").attr("id", "lassoPath" + currentLassoNum).attr("class", "lassoFinsihedPath");
			}
		}

		function mousemoveLasso(event) {
			if (isLassoing) {
				const previousPosition = lassoPaths[currentLassoNum][lassoPaths[currentLassoNum].length - 1];
				const currentPosition = [event.offsetX, event.offsetY];
				const distance = Math.sqrt((previousPosition[0] - currentPosition[0]) ** 2 + (previousPosition[1] - currentPosition[1]) ** 2);
				if (distance > 8) {
					lassoPaths[currentLassoNum].push([event.offsetX, event.offsetY]);
				
					// draw lasso path
					const polygon = [...lassoPaths[currentLassoNum], startPosition]
					d3.select(event.target)
					  .select("#currentLassoPath")
						.attr("d", d3.line()(polygon))
						.attr("fill", "None")
						.attr("stroke", colorMap[currentLassoNum])
						.attr("stroke-dasharray", "5,5");
					// find points inside lasso
					coord.forEach((xy, i) => {
						if (robustPointInPolygon(lassoPaths[currentLassoNum], xy) === -1) {
							lassos[currentLassoNum][i] = true;
							label[i] = currentLassoNum;
						}
					});

					updateSplot();				
				}
			}
		}



		d3.select("#lassoSvg")
		  .on("click", clickLasso)
			.on("mousemove", mousemoveLasso)
	})


	function clickFinishButton() {
		if (props.updateLassoResult != undefined) {
			console.log(props.updateLassoResult, props.dataset)
			props.updateLassoResult(props.dataset, lassos);
		}

		document.getElementsByClassName("buttonDivSplot")[0].style.display = "none";
		document.getElementsByClassName("ambiguityDivSplot")[0].style.display = "block";
		status = "ambiguity";
	}

	function clickAmbiguity(event) {
		if (props.updateAmbiguity != undefined) {
			props.updateAmbiguity(event.target.id);
		}
		props.updatePhase();
		document.getElementsByClassName("ambiguityDivSplot")[0].style.display = "none";
		document.getElementsByClassName("buttonDivSplot")[0].style.display = "block";
		d3.selectAll(".lassoFinsihedPath").remove();
	}

	return (
		<div className="splot">
			<div>
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
			<div className="buttonDivSplot">
				<button className="finish" onClick={clickFinishButton}>Finish!!</button>
			</div>
			<div className="ambiguityDivSplot" style={{"display": "none"}}>
				<div className="ambiguityButtonWrapper">
					<button className="ambiguity" onClick={clickAmbiguity} id="not_emb">Not Ambiguious</button>
					<button className="ambiguity" onClick={clickAmbiguity} id="unclear">Unclear</button>
					<button className="ambiguity" onClick={clickAmbiguity} id="amb">Ambiguious</button>

				</div>

			</div>
		</div>
	)
}

export default Scatterplot;