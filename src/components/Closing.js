import React from "react";
import SmallScatterplot from "./SmallScatterplot";

const Closing = (props) => {

	const posthocList = props.posthocList;

	// make posthocList array into 2D array with 4 elements in each row
	const posthocList2D = [];
	for (let i = 0; i < posthocList.length; i += 4) {
		posthocList2D.push(posthocList.slice(i, i + 4));
	}



	return (
		<div className="intro">
			<h1 style={{textAlign: "center"}}>Thank you for participating the experiment!!</h1>
			<div id="closingScatterWrapper"
				style={{
					margin: "0 auto",
					position: "relative",
					width: "900px",

				}}
			>


			{posthocList2D.map((row, i) => (
				<div className="row" key={i} style={{ display: "flex"}}> 
					{row.map((dataset, j) => (
						<SmallScatterplot
							key={j}
							data={dataset}
						/>
					))}
				</div>
				))}
			</div>
			<h2 style={{ textAlign: "center" }}> Your submission number is {props.seed}.</h2>
		</div>
	)
};

export default Closing;