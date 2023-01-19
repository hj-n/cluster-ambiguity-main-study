import React from "react";
import Scatterplot from "./Scatterplot";

const Trial = (props) => {

	const dataset = props.dataset
	const coord = require(`../data/${dataset}.json`)

	return (
		<div className="trial">
			<h2>{`${props.type}: Trial ${props.trial + 1} / ${props.trialNum}`}</h2>
			<p>
				Press ESC to undo the latest/current lasso selection.<br />
			</p>
			<Scatterplot 
				coord={coord} dataset={dataset} 
				updatePhase={props.updatePhase}
				updateAmbiguity={props.updateAmbiguity} updateLassoResult={props.updateLassoResult} 
			/>
		</div>
	)
}

export default Trial;