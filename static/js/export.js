// This script is used to export and import the data from the tracker -- WIP
function exportData() {
    const exportPoints = [];

    document.querySelectorAll("#inputs .point").forEach(point => {
        const name = point.querySelector(".name").value;

        const latitudeInput = point.querySelector("input.latitude");
        const latitudeSelect = point.querySelector("select.latitude");
        const latitude = latitudeInput.value + latitudeSelect.getAttribute("data-selected").replace("°", "");

        const longitudeInput = point.querySelector("input.longitude");
        const longitudeSelect = point.querySelector("select.longitude");
        const longitude = longitudeInput.value + longitudeSelect.getAttribute("data-selected").replace("°", "");

        let speed = Number(point.querySelector("input.speed").value);
        const speedSelect = point.querySelector("select.speed");
        const unit = speedSelect.getAttribute("data-selected");
        if (unit === "mph") {
            speed /= 1.151;
            speed = Math.round(speed);
        } else if (unit === "kph") {
            speed /= 1.852;
            speed = Math.round(speed);
        }

        const stage = point.querySelector(".stage").getAttribute("data-selected");

        exportPoints.push({
            name,
            latitude,
            longitude,
            speed,
            stage
        });
    });

    console.log(`Whew. Data successfully exported: ${exportPoints}`);
    return exportPoints;
}

// Downloads the storm data
function downloadTrackData() {
    const stormName = document.querySelector(".name").value;
    const data = exportData();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stormName}.json`;
    a.click();
    console.log(`Storm data downloaded!`);
}

document.querySelector("#export-data").addEventListener("click", downloadTrackData);

// Imports the storm data
function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.addEventListener("change", () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const data = JSON.parse(reader.result);
            console.log(`Imported data successfully: ${data}`);
            importPoints(data);
        };
        reader.readAsText(file);
    });
    input.click();
    console.log(`Importing data...`);
}

document.querySelector("#import-data").addEventListener("click", importData);

// We now import the data
function importPoints(data) {
    const inputs = document.querySelector("#inputs");
    let new_inputs = document.querySelector(".point");

    function populatePoint(pointData, pointElement) {
        pointElement.querySelector(".name").value = pointData.name;

        const latitude = pointData.latitude;
        pointElement.querySelector("input.latitude").value = latitude.slice(0, -1);
        pointElement.querySelector("select.latitude").setAttribute("data-selected", latitude.slice(-1));
        if (latitude.slice(-1) === "S") {
            pointElement.querySelector("select.latitude").selectedIndex = 1;
        }

        const longitude = pointData.longitude;
        pointElement.querySelector("input.longitude").value = longitude.slice(0, -1);
        pointElement.querySelector("select.longitude").setAttribute("data-selected", longitude.slice(-1));
        if (longitude.slice(-1) === "W") {
            pointElement.querySelector("select.longitude").selectedIndex = 1;
        }

        let speed = pointData.speed;
        const unit = pointElement.querySelector("select.speed").getAttribute("data-selected");
        if (unit === "mph") {
            speed *= 1.151;
        } else if (unit === "kph") {
            speed *= 1.852;
        }
        pointElement.querySelector("input.speed").value = speed;
        pointElement.querySelector("select.speed").setAttribute("data-selected", unit);

        const stage = pointData.stage;
        const stageSelect = pointElement.querySelector(".stage");
        Array.from(stageSelect.options).forEach(option => {
            if (option.value === stage) {
                option.selected = true;
            }
        });
        stageSelect.setAttribute("data-selected", stage);

        handle_removal(pointElement.querySelector(".remove"));
    }

    populatePoint(data[0], new_inputs);

    for (let i = 1; i < data.length; i++) {
        const cloned_inputs = new_inputs.cloneNode(true);
        populatePoint(data[i], cloned_inputs);
        inputs.appendChild(cloned_inputs);
        cloned_inputs.scrollIntoView();
    }
}
