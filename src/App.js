import Trial from "./components/Trial";
import "./App.css";
import { useState, useRef } from "react";
import Introduction from "./components/Introduction";
import Closing from "./components/Closing";
import Ready from "./components/Ready";
import Demographic from "./components/Demographic";

function Wrapper() {

	let datasetList = require("./ambreducer_list.json")
	datasetList = datasetList.map((d) => d.replace(".npy", ""))
	const trainingList = require("./sampled_datasets_training.json")
	const testList = datasetList.filter((d) => !trainingList.includes(d))
	// pick 16 scatterplots randomly from the testList
	const posthocList = testList.sort(() => Math.random() - 0.5).slice(0, 16)

	// const testList = 
	
	testList.sort(() => Math.random() - 0.5)

	return (
		<App trainingList={trainingList} testList={testList} posthocList={posthocList}/>
	)
}

function App(props) {

	// experiment data
	const ambiguity = useRef({});
	const lassoResult = useRef({});
	const demographic = useRef({});


	const seed = Math.floor(Math.random() * 10000000000)

	// updateData
	const updateAmbiguity = (dataset, ambiguityTrial) => {
		ambiguity.current[dataset] = ambiguityTrial;
	}
	const updateLassoResult = (dataset, lassoResultTrial) => {
		// lassoResult[dataset] = lassoResult;
		lassoResult.current[dataset] = lassoResultTrial;
		
	}

	const updateDemographic = (demographicTrial) => {
		demographic.current = demographicTrial;
	}

	
	const [phase, setPhase] = useState("intro");
	const [train, setTrain] = useState(0);
	const [test, setTest] = useState(0);

	const trainingList = props.trainingList;
	const testList = props.testList;

	const trainingNum = trainingList.length
	const testNum     = testList.length

	// update phase
	function updatePhase() {
		if (phase === "train") {
			if (train < trainingNum - 1) {
				setTrain(train + 1)
			} else {
				setPhase("ready")
			}
		} else if (phase === "test") {
			if (test < testNum - 1) {
				setTest(test + 1)
			} else {
				setPhase("finish");
				// save data
				(async () => {
					const blob = await new Blob([JSON.stringify({
						seed: seed,
						demographic: demographic.current,
						ambiguity: ambiguity.current,
						lassoResult: lassoResult.current
					})], { type: "text/plain;charset=utf-8" })
					const href = await URL.createObjectURL(blob)
					const link = document.createElement("a")
					link.href = href
					link.download = `${seed}_result.json`
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
				})();
			}
		}
	}



  return (
    <div className="App">
      {phase === "intro" && <Introduction/>}
			{phase === "demo" && <Demographic updateDemographic={updateDemographic}/>}
			{phase === "ready" && <Ready/>}
			{phase === "train" && <Trial 
				type={"Training session"} trial={train} trialNum={trainingNum} dataset={trainingList[train]}
				updatePhase={updatePhase}
			/>}
			{phase === "test"  && <Trial 
				type={"Experiment"} trial={test} trialNum={testNum} dataset={testList[test]}
				updatePhase={updatePhase} updateAmbiguity={updateAmbiguity} updateLassoResult={updateLassoResult}
				/>}
			{phase === "finish" && <Closing seed={seed} posthocList={props.posthocList}/>}
			<div id="startButton">
				{phase === "intro" && <button onClick={() => setPhase("demo")}>Continue!!</button>}
				{phase === "demo" && <button onClick={() => setPhase("train")}>Start Training!!</button>}
				{phase === "ready" && <button onClick={() => setPhase("test")}>Begin!!</button>}
			</div>
    </div>
  );
}

export default Wrapper;
