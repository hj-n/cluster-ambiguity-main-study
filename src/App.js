import Trial from "./components/Trial";
import "./App.css";
import { useState, useRef } from "react";
import Introduction from "./components/Introduction";

function Wrapper() {

	const datasetList = require("./sampled_datasets_manual_sample.json")
	const trainingList = require("./sampled_datasets_training.json")
	const testList = datasetList.filter((d) => !trainingList.includes(d))
	testList.sort(() => Math.random() - 0.5)

	return (
		<App trainingList={trainingList} testList={testList}/>
	)
}

function App(props) {

	// experiment data
	const ambiguity = useRef({});
	const lassoResult = useRef({});

	// updateData
	const updateAmbigutiy = (dataset, ambiguity) => {
		ambiguity.current[dataset] = ambiguity;
	}
	const updateLassoResult = (dataset, lassoResult) => {
		lassoResult.current[dataset] = lassoResult;
	}
	



	const [phase, setPhase] = useState("intro");
	const [train, setTrain] = useState(0);
	const [test, setTest] = useState(0);

	const trainingList = props.trainingList;
	const testList = props.testList;

	const trainingNum = trainingList.length
	const testNum     = testList.length




  return (
    <div className="App">
      {phase === "intro" && <Introduction/>}
			{phase === "train" && <Trial 
				type={"Training session"} trial={train} trialNum={trainingNum} dataset={trainingList[train]}/>}
			{phase === "test"  && <Trial type={"Experiment"} trial={test} trialNum={testNum} dataset={testList[test]} updateAmbigutiy={updateAmbigutiy} updateLassoResult={updateLassoResult}/>}
			<div id="startButton">
				{phase === "intro" && <button onClick={() => setPhase("train")}>Start Experiment!!</button>}
			</div>
    </div>
  );
}

export default Wrapper;
