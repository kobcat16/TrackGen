function speedToCat(speed) {
	const maxSpeed = Number.MAX_SAFE_INTEGER;
	const speedCatMap = new Map([
		[0, -999],
		[39, -2],
		[74, -1],
		[96, 1],
		[111, 2],
		[130, 3],
		[157, 4],
		[180, 5],
		[maxSpeed, 5]
	]);
	for (let [speedThreshold, cat] of speedCatMap.entries()) {
		if (speed <= speedThreshold) {
			return cat;
		}
	}
}
  
function stageToShape(stage) {
	const s2s = {
		"": "",
		"extratropical cyclone": "triangle",
		"subtropical cyclone": "square",
		"tropical cyclone": "circle"
	}
	return s2s[stage.toLowerCase()];
}

document.querySelector("form").addEventListener("submit", (e) => {
	e.preventDefault();

	const data = [];
	document.querySelectorAll("#inputs .point").forEach(point => {
		const name = point.querySelector(".name").value;

		const latitude = point.querySelector("input.latitude").value +
			point.querySelector("select.latitude").getAttribute("data-selected").replace("°", "");

		const longitude = point.querySelector("input.longitude").value +
			point.querySelector("select.longitude").getAttribute("data-selected").replace("°", "");

		let speed = Number(point.querySelector("input.speed").value);
		const unit = point.querySelector("select.speed").getAttribute("data-selected");
		if (unit === "kts") {
			speed *= 1.151;
		} else if (unit === "kph") {
			speed /= 1.609;
		} else if (unit === "m/s") {
			speed *= 2.237;
		}

		const stage = point.querySelector(".stage").getAttribute("data-selected");

		data.push({
			name: name,
			shape: stageToShape(stage),
			category: speedToCat(speed),
			latitude: latitude,
			longitude: longitude
		})
	});

	const accessible = document.querySelector("#accessible").checked;

	createMap(data, accessible);
});
