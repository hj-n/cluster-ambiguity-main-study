import React from "react";

const Closing = (props) => {


	return (
		<div className="intro">
			<h1>Thank you for participating the experiment!!</h1>
			<h2> Your submission number is {props.seed}.</h2>
		</div>
	)
};

export default Closing;