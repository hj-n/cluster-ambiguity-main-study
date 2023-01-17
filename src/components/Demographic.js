import React, { useState } from "react";

const Demographic = (props) => {

	const [age, setAge] = useState("");
	const [gender, setGender] = useState("");

	const [education, setEducation] = useState("");
	const [major, setMajor] = useState("");
	const [job, setJob] = useState("");

	const [familarity, setFamilarity] = useState("");
	const [splotFamilarity, setSplotFamilarity] = useState("");

	props.updateDemographic({
		age: age,
		gender: gender, 
		education: education,
		major: major,
		job: job,
		familarity: familarity,
		splotFamilarity: splotFamilarity
	});


	return (
		<div className="intro">
			<h1>Welcome!!</h1>
			<p>
				Please fill out the following demographic information.
			</p>
			<p>
				Age:
				<input type="text" className="textInput" value={age} onChange={(e) => setAge(e.target.value)} style={{width: 60}}/>
			</p>
			<div className="radioInputWrapper">
				<p>
					Gender:
				</p>
				<div className="radioInputInner">

					<form>
						<label>
							Male
							<input type="radio" value="male" checked={gender === "male"} onChange={(e) => setGender(e.target.value)} />
						</label>
						<label>
							Female
							<input type="radio" value="female" checked={gender === "female"} onChange={(e) => setGender(e.target.value)} />
						</label>
						<label>
							Non-binary
							<input type="radio" value="non-binary" checked={gender === "non-binary"} onChange={(e) => setGender(e.target.value)} />
						</label>
					</form>

				</div>

			</div>

			<p>
				Education Level:
				<input type="text" className="textInput" value={education} onChange={(e) => setEducation(e.target.value)} style={{width: 200, marginRight: 30 }}/>
					Major:
					<input type="text" className="textInput" value={major} onChange={(e) => setMajor(e.target.value)} style={{width: 200}}/>
			</p>
			<p>
				Occupation: 
				<input type="text" className="textInput" value={job} onChange={(e) => setJob(e.target.value)} style={{width: 200}}/>
			</p>

			<div className="radioInputWrapper">
				<p>
					Familarity to Data Visualization:
				</p>
				<div className="radioInputInner">

					<form>
						<label>
							Not Familiar
							<input type="radio" value="not-familiar" checked={familarity === "not-familiar"} onChange={(e) => setFamilarity(e.target.value)} />
						</label>
						<label>
							Intermediate
							<input type="radio" value="inter" checked={familarity === "inter"} onChange={(e) => setFamilarity(e.target.value)} />
						</label>
						<label>
							Familiar
							<input type="radio" value="familiar" checked={familarity === "familiar"} onChange={(e) => setFamilarity(e.target.value)} />
						</label>
					</form>

				</div>

			</div>
			<div className="radioInputWrapper">
				<p>
					Familarity to Scatterplot-based Data Visualization:
				</p>
				<div className="radioInputInner">
					<form>
						<label>
							Not Familiar
							<input type="radio" value="not-familiar" checked={splotFamilarity === "not-familiar"} onChange={(e) => setSplotFamilarity(e.target.value)} />
						</label>
						<label>
							Intermediate
							<input type="radio" value="inter" checked={splotFamilarity === "inter"} onChange={(e) => setSplotFamilarity(e.target.value)} />
						</label>
						<label>
							Familiar
							<input type="radio" value="familiar" checked={splotFamilarity === "familiar"} onChange={(e) => setSplotFamilarity(e.target.value)} />
						</label>
					</form>
				</div>
			</div>
			
		</div>
	)
};

export default Demographic;