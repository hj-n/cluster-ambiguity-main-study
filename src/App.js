import Trial from "./components/Trial";
import "./App.css";
import { useState } from "react";
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
			{phase === "train" && <Trial type={"Training session"} trial={train} trialNum={trainingNum} dataset={trainingList[train]}/>}
			{phase === "test"  && <Trial type={"Experiment"} trial={test} trialNum={testNum} dataset={testList[test]}/>}
			<div id="startButton">
				{phase === "intro" && <button onClick={() => setPhase("train")}>Start Experiment!!</button>}
			</div>
    </div>
  );
}

export default Wrapper;
