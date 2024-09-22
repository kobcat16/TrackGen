function getCADShape(initials) {
    const i = initials.toUpperCase();

    if (["TD", "TS", "HU", "TY", "STY"].includes(i)) {
        return "circle";
    } else if (["SD", "SS", "SH", "ST", "SST"].includes(i)) {
        return "square";
    } else if (["EX", "LO", "INV", "PTC"].includes(i)) {
        return "triangle";
    } else {
        console.error("Unknown CAD shape: " + i);
    }
}

function parseCAD(data) {
    const lines = data.split("\n");

    const parsed = [];
    let uniqueId = "";
    lines.forEach(line => {
        const cols = line.split("| ");

        if (cols.length <= 6) {
            uniqueId = cols[0];
        } else {
            parsed.push(
                {
                    name: uniqueId,
                    shape: getCADShape(cols[7]),
                    category: speedToCat(Number(cols[5])),
                    latitude: cols[3],
                    longitude: cols[4]
                }
            )
        }
    });

    return parsed
}

// todo:
// - nothingrn