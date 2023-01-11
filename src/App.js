import Trial from "./components/Trial";
import "./App.css";
import { useState } from "react";
import Introduction from "./components/Introduction";

function App() {

	const [phase, setPhase] = useState("intro");

  return (
    <div className="App">
      {phase === "intro" && <Introduction/>}
    </div>
  );
}

export default App;
