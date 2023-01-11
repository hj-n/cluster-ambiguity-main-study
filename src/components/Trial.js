import React from "react";
import Scatterplot from "./Scatterplot";

const Trial = (props) => {

	const dataset = props.dataset
	const coord = require(`../data/${dataset}.json`)


	return (
		<div className="trial">
			<h2>{`${props.type}: Trial ${props.trial} / ${props.trialNum}`}</h2>
			<Scatterplot coord={coord} dataset={dataset} updateAmbigutiy={props.updateAmbigutiy} updateLassoResult={props.updateLassoResult} />
		</div>
	)
}

export default Trial;