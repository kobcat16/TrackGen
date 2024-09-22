function catToColour(cat = -999, accessible = true) {
    const colorMap = new Map([
        [-999, "#C0C0C0"],
        [-2, accessible ? "#6ec1ea" : "#5EBAFF"],
        [-1, accessible ? "#4dffff" : "#00FAF4"],
        [1, accessible ? "#ffffD9" : "#FFFFCC"],
        [2, accessible ? "#ffd98c" : "#FFE775"],
        [3, accessible ? "#ff9e59" : "#FFC140"],
        [4, accessible ? "#ff738a" : "#FF8F20"],
        [5, accessible ? "#a188fc" : "#FF6060"],
    ]);
    return colorMap.get(cat) || "#C0C0C0";
}

document.querySelector("#close").addEventListener("click", () => {
    document.querySelector("#image-container").classList.add("hidden");
});

let loaded = false;
const BLUE_MARBLE = new Image();
BLUE_MARBLE.crossOrigin = "anonymous";
const loader = document.querySelector("#map-indicator .loader");
const buttons = document.querySelectorAll(".generate");
const mapSelector = document.getElementById('map-selector');

// Preloads the map images
const mapUrls = {
    "xlarge": "static/media/bg16383.webp",
    "large-nxtgen": "static/media/bg21600-nxtgen.jpg",
    "large": "static/media/bg12000.jpg",
    "blkmar": "static/media/bg13500-blkmar.jpg",
    "normal": "static/media/bg8192.png",
};

Object.values(mapUrls).forEach(url => {
    const img = new Image();
    img.src = url;
});

// Event listener for map selector and buttons
mapSelector.addEventListener('change', handleMapChange);

buttons.forEach(button => {
    button.addEventListener("click", () => {
        handleButtonClick(button.dataset.size);
    });
});

function handleMapChange() {
    const size = document.querySelector('.generate').dataset.size;
    BLUE_MARBLE.src = getMapUrl(size);
}

function handleButtonClick(size) {
    BLUE_MARBLE.src = getMapUrl(size);
    BLUE_MARBLE.onload = () => {
        loaded = true;
        loader.style.display = "none";
        document.querySelector("#map-indicator ion-icon").style.color = "#70c542";
    };
    BLUE_MARBLE.onerror = (err) => { console.error(err); };
}

function getMapUrl(size) {
    const { selectedIndex, options } = mapSelector;
    const mapType = options[selectedIndex].value;

    return mapUrls[mapType] || mapUrls[size];
}

function createMap(data, accessible) {
    document.querySelector("#close").classList.add("hidden");
    document.querySelector("#output").classList.add("hidden");
    document.querySelector("#loader").classList.remove("hidden");
    document.querySelector("#image-container").classList.remove("hidden");

    setTimeout(() => {
        let interval = setInterval(() => {
            if (loaded) {
                const FULL_WIDTH = BLUE_MARBLE.width;
                const FULL_HEIGHT = BLUE_MARBLE.height;

                let DOT_SIZE = 0.29890625 / 360 * FULL_WIDTH;
                let LINE_SIZE = 0.09 / 360 * FULL_WIDTH;
                
                if (document.getElementById("smaller-dots").checked) {
                    DOT_SIZE *= 2.35 / Math.PI;
                    LINE_SIZE *= 1.6 / Math.PI;
                }

                let max_lat = 0;
                let max_long = 0;

                let min_lat = FULL_HEIGHT + 1;
                let min_long = FULL_WIDTH + 1;

                for (let i = 0; i < data.length; i++) {
                    const tmp_lat = Number(data[i].latitude.slice(0, -1));
                    const tmp_long = Number(data[i].longitude.slice(0, -1));

                    data[i].latitude = FULL_HEIGHT / 2 - tmp_lat % 90 * (data[i].latitude.slice(-1) === "S" ? -1 : 1) / 180 * FULL_HEIGHT;
                    data[i].longitude = FULL_WIDTH / 2 - tmp_long % 180 * (data[i].longitude.slice(-1) === "E" ? -1 : 1) / 360 * FULL_WIDTH;

                    if (Math.floor(tmp_lat / 90) % 2 === 1) {
                        data[i].latitude -= FULL_HEIGHT / 2;
                    }

                    if (Math.floor(tmp_long / 180) % 2 === 1) {
                        data[i].longitude -= FULL_WIDTH / 2;
                    }

                    max_lat = Math.max(max_lat, data[i].latitude);
                    max_long = Math.max(max_long, data[i].longitude);

                    min_lat = Math.min(min_lat, data[i].latitude);
                    min_long = Math.min(min_long, data[i].longitude);
                }

                let top = min_lat - FULL_HEIGHT * 5 / 180;
                let bottom = max_lat + FULL_HEIGHT * 5 / 180;

                let left = min_long - FULL_WIDTH * 5 / 360;
                let right = max_long + FULL_WIDTH * 5 / 360;

                if (right - left < FULL_HEIGHT * 45 / 180) {
                    const padding = (FULL_HEIGHT * 45 / 180 - (right - left)) / 2;

                    left -= padding;
                    right += padding;
                }

                if (right - left < bottom - top) {
                    const padding = ((bottom - top) - (right - left)) / 2;

                    left -= padding;
                    right += padding;
                }

                if (bottom - top < (right - left) / 1.618033988749894) {
                    const padding = ((right - left) / 1.618033988749894 - (bottom - top)) / 2;

                    top -= padding;
                    bottom += padding;
                }

                if (left < 0) left = 0;
                if (right > FULL_WIDTH) right = FULL_WIDTH;

                if (top < 0) top = 0;
                if (bottom > FULL_HEIGHT) bottom = FULL_HEIGHT;

                const canvas = document.createElement("canvas");

                canvas.width = right - left;
                canvas.height = bottom - top;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(
                    BLUE_MARBLE,
                    left, top,
                    right - left, bottom - top,
                    0, 0,
                    canvas.width, canvas.height
                );

                const named_tracks = {};
                data.forEach(point => {
                    point.latitude -= top;
                    point.longitude -= left;

                    if (point.name in named_tracks) {
                        named_tracks[point.name].push(point);
                    } else {
                        named_tracks[point.name] = [point];
                    }
                });


                Object.values(named_tracks).forEach(points => {
                    ctx.lineWidth = LINE_SIZE;
                    ctx.strokeStyle = "white";

                    ctx.beginPath();
                    ctx.lineTo(points[0].longitude, points[0].latitude);

                    points.slice(1).forEach(point => {
                        ctx.lineTo(point.longitude, point.latitude);
                    });

                    ctx.stroke();

                    points.forEach(point => {
                        ctx.fillStyle = catToColour(point.category, accessible);
                        ctx.beginPath();

                        if (point.shape === "triangle") {
                            const side = DOT_SIZE * 3 ** 0.5;
                            const bis = side * 3 ** 0.5 / 2;

                            ctx.moveTo(point.longitude, point.latitude - bis * 2 / 3);
                            ctx.lineTo(point.longitude - side / 2, point.latitude + bis / 3);
                            ctx.lineTo(point.longitude + side / 2, point.latitude + bis / 3);
                        } else if (point.shape === "square") {
                            const size = DOT_SIZE / 2 ** 0.5
                            ctx.rect(point.longitude - size, point.latitude - size, size * 2, size * 2);
                        } else if (point.shape === "circle") {
                            ctx.arc(point.longitude, point.latitude, DOT_SIZE, 0, 2 * Math.PI);
                        }

                        ctx.fill();
                    });
                });

                const output = document.querySelector("#output");
                output.innerHTML = "";
                output.classList.remove("hidden");
                output.src = canvas.toDataURL();

                document.querySelector("#loader").classList.add("hidden");
                document.querySelector("#close").classList.remove("hidden");
                document.querySelector("#output").classList.remove("hidden");

                clearInterval(interval);
            }
        }, 100);
    }, 100);
}