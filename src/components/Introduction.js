import React from "react";

const Introduction = (props) => {


	return (
		<div className="intro">
			<h1>Welcome!!</h1>
			<p>
				First of all, thanks for participating in our experiment. <br />
			</p>
			<p>
				In the study, you will see a series of monochrome scatterplots, and will be asked to conduct two tasks for each scatterplots.
			</p>
			<p>
				At frist, we will ask you to find the clusters in the scatterplot. Specifically, we will ask you to <i>lasso</i> the clusters you find using the mouse.
				Then, we will ask you to explicitly determine the <b>ambiguity</b> of the scatterplot, which can be interpreted as the difficulty of the lassoing task.
			</p>
			<p>
				The experiment will last about 60 minutes (one hour). You will see 64 scatterplots in total, where the first four scatterplots will be included in the practice session.
				There will be a short interview after the experiment.
			</p>	
		</div>
	)
};

export default Introduction;