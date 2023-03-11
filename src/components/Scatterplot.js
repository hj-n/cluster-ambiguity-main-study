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
				ctx.fillStyle = colorMap[label[i] % 10];
			}
			ctx.fill();
		})
	} 

	function makeCirclesBalck() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		coord.forEach((xy, i) => {
			ctx.beginPath();
			ctx.arc(xy[0], xy[1], 3, 0, 2 * Math.PI);
			ctx.fillStyle = "black";
			ctx.fill();
		});
	}
	



	// variables for status
	let lassos = {};
	let lassoPaths = {};
	let currentLassoNum = -1;
	let isLassoing = false;
	let startPosition = null;
	let status = "lasso";
	let previousLabel = new Array(coord.length).fill(-1);

	useEffect(() => {
		canvas = document.getElementById("scatterplot");
		ctx = canvas.getContext("2d");
		updateSplot();
	})

	// lasso setting
	useEffect(() => {

		function clickLasso(event) {
			if (!isLassoing && status === "lasso") {

				// disable button
				document.getElementById("finishButton").disabled = true;
				// update status
				isLassoing = true;
				currentLassoNum += 1;
				lassos[currentLassoNum] = new Array(coord.length).fill(false);
				startPosition = [event.offsetX, event.offsetY];
				lassoPaths[currentLassoNum] = [startPosition];
				previousLabel = label.map(d => d);
				// draw lasso start circle
				d3.select(event.target)
				  .append("circle")
					.attr("id", "currentLassoCircle")
					.attr("cx", event.offsetX)
					.attr("cy", event.offsetY)
					.attr("r", 5)
					.attr("fill", "None")
					.attr("stroke", colorMap[currentLassoNum % 10])
				
				d3.select(event.target)
				  .append("path")
					.attr("id", "currentLassoPath")
					.attr("fill", "None")
					.attr("stroke", colorMap[currentLassoNum % 10])
					.attr("stroke-dasharray", "5,5");
			}
			else if (isLassoing && status === "lasso"){
				// finish lassoing
				// enable button
				document.getElementById("finishButton").disabled = false;
				isLassoing = false;
				d3.select(event.target).selectAll("#currentLassoCircle").remove();
				d3.select(event.target).selectAll("#currentLassoPath").attr("id", "lassoPath" + currentLassoNum).attr("class", "lassoFinishedPath");

			}
		}

		function mousemoveLasso(event) {
			if (isLassoing && status === "lasso") {
				document.getElementById("finishButton").disabled = true;
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
					// find points inside lasso
					coord.forEach((xy, i) => {
						if (robustPointInPolygon(lassoPaths[currentLassoNum], xy) === -1) {
							lassos[currentLassoNum][i] = true;
							label[i] = currentLassoNum;
						}
						else {
							lassos[currentLassoNum][i] = false;
							label[i] = previousLabel[i];
						}
					});

					updateSplot();				
				}
			}
			else if (!isLassoing && status === "lasso") {
				if (d3.select(event.target).selectAll("#currentLassoCircle").size() > 0) {
					d3.select(event.target).selectAll("#currentLassoCircle").remove();
				}
				if (d3.select(event.target).selectAll("#currentLassoPath").size() > 0) {
					d3.select(event.target).selectAll("#currentLassoPath").attr("id", "lassoPath" + currentLassoNum).attr("class", "lassoFinishedPath");
				}
			}

		}

		d3.select("#lassoSvg")
		  .on("click", clickLasso)
			.on("mousemove", mousemoveLasso)
		
		

	})

	document.addEventListener("keydown", (event) => { if (event.key === "Escape") { removeLasso(event); } });


	function clickFinishButton() {
		if (props.updateLassoResult != undefined) {
			props.updateLassoResult(props.dataset, lassos);
		}
		d3.selectAll(".lassoFinishedPath").remove();
		props.updatePhase();


	}

	function clickAmbiguity(event) {
		if (props.updateAmbiguity != undefined) {
			props.updateAmbiguity(props.dataset, event.target.id);
		}
		document.getElementsByClassName("ambiguityConfirm")[0].disabled = false;

	}

	function confirmAmbiguity(event) {
		props.updatePhase();
		document.getElementsByClassName("ambiguityDivSplot")[0].style.display = "none";
		document.getElementsByClassName("buttonDivSplot")[0].style.display = "block";
		document.getElementById("ambform").reset();
	}

	function removeLasso() {
		if (status !== "lasso") return;
		if (isLassoing) {
			document.getElementById("finishButton").disabled = false;
			isLassoing = false;
			delete lassoPaths[currentLassoNum];
			delete lassos[currentLassoNum];
			currentLassoNum -= 1;
			for (let i = 0; i < label.length; i++) {
				label[i] = previousLabel[i];
			}
			d3.select("#lassoSvg").selectAll("#currentLassoCircle").remove();
			d3.select("#lassoSvg").selectAll("#currentLassoPath").remove();
			updateSplot();
		}
		else if (currentLassoNum > -1) {
			d3.select("#lassoSvg").selectAll("#lassoPath" + currentLassoNum).remove();
			delete lassoPaths[currentLassoNum];
			delete lassos[currentLassoNum];
			currentLassoNum -= 1;
			restoreLabel();
			updateSplot();
		}
	}

	function restoreLabel() {
		for (let i = 0; i < label.length; i++) {
			label[i] = -1;
		}
		for (let key in lassos) {
			for (let i = 0; i < lassos[key].length; i++) {
				if (lassos[key][i]) {
					label[i] = key;
				}
			}
		}
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
				<button className="finish" id="finishButton" onClick={clickFinishButton}>Submit</button>
			</div>
			<div className="ambiguityDivSplot" style={{"display": "none"}}>
				<div className="ambiguityButtonWrapper">
					<form id="ambform">
						<label className="ambLabel">
							Very clear
							<input type="radio" name="ambiguity" id="0" onClick={clickAmbiguity}/>
						</label>
						<label className="ambLabel">
							Clear
							<input type="radio" name="ambiguity" id="1" onClick={clickAmbiguity}/>
						</label>
						<label className="ambLabel">
							Neutral
							<input type="radio" name="ambiguity" id="2" onClick={clickAmbiguity}/>
						</label>
						<label className="ambLabel">
							Ambiguous
							<input type="radio" name="ambiguity" id="3" onClick={clickAmbiguity}/>
						</label>
						<label className="ambLabel">
							Very ambiguous
							<input type="radio" name="ambiguity" id="4" onClick={clickAmbiguity}/>
						</label>
					</form>
				</div>
				<div className="ambiguityConfirmWrapper">
					<button className="ambiguityConfirm" onClick={confirmAmbiguity}>Confirm</button>
				</div>

			</div>
		</div>
	)
}

export default Scatterplot;