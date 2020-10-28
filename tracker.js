var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function savePosition() {
    (() => __awaiter(this, void 0, void 0, function* () {
        let position = yield getPosition();
        localStorage.setItem("position", JSON.stringify(position));
    }))();
    speechDemo();
}
function getPosition() {
    return new Promise((resolve, reject) => {
        function showPosition(position) {
            resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        }
        navigator.geolocation.getCurrentPosition(showPosition);
    });
}
function replayAudio() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        const audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
        });
        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        });
        setTimeout(() => {
            mediaRecorder.stop();
        }, 3000);
    });
}
const recordAudio = () => {
    return new Promise((resolve) => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", (event) => {
                audioChunks.push(event.data);
            });
            const start = () => {
                mediaRecorder.start();
            };
            const stop = () => {
                return new Promise((resolve) => {
                    mediaRecorder.addEventListener("stop", () => {
                        const audioBlob = new Blob(audioChunks);
                        const audioUrl = URL.createObjectURL(audioBlob);
                        const audio = new Audio(audioUrl);
                        const play = () => {
                            audio.play();
                        };
                        resolve({ audioBlob, audioUrl, play });
                    });
                    mediaRecorder.stop();
                });
            };
            resolve({ start, stop });
        });
    });
};
// export { a };
function drawMap() {
    // Note: This example requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you.
    let map, infoWindow;
    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 6,
        });
        infoWindow = new google.maps.InfoWindow();
        const locationButton = document.createElement("button");
        locationButton.textContent = "Pan to Current Location";
        locationButton.classList.add("custom-map-control-button");
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
        locationButton.addEventListener("click", () => {
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Location found.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                }, () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            }
            else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }
        });
    }
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation.");
        infoWindow.open(map);
    }
}
/** Converts numeric degrees to radians */
if (typeof Number.prototype.toRad === "undefined") {
    Number.prototype.toRad = function () {
        return (this * Math.PI) / 180;
    };
}
function getDistance(lon1, lat1, lon2, lat2) {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - lat1).toRad(); // Javascript functions in radians
    var dLon = (lon2 - lon1).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) *
            Math.cos(lat2.toRad()) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}
function checkDistance() {
    let distance1 = getDistance(37.5157364, 55.6355041, 37.5117264, 55.6355941);
    console.log({ distance1 });
}
function initTracker() {
    // recordAudio();
    // checkDistance();
    setInterval(() => {
        let distance = "?";
        (() => __awaiter(this, void 0, void 0, function* () {
            let position = yield getPosition();
            const coordsEl = document.getElementById("coords");
            const distanceEl = document.getElementById("distance");
            let savedPosition = JSON.parse(localStorage.getItem("position"));
            if (savedPosition) {
                distance = getDistance(position.longitude, position.latitude, savedPosition.longitude, savedPosition.latitude);
            }
            coordsEl.innerHTML = `${position.latitude} ${position.longitude}`;
            distanceEl.innerHTML = `${distance}`;
        }))();
    }, 1000);
}
function speechDemo() {
    let synth = window.speechSynthesis;
    let voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if (aname < bname)
            return -1;
        else if (aname == bname)
            return 0;
        else
            return +1;
    });
    console.log({ voices });
    var utterThis = new SpeechSynthesisUtterance("привет всем, как дела?");
    utterThis.lang = "ru-RU";
    // utterThis.voice = voices[12];
    synth.speak(utterThis);
    // inputTxt.blur();
}
function textRecognition() {
    var grammar = "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";
    var recognition = new webkitSpeechRecognition();
    var speechRecognitionList = new webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    recognition.onresult = function (event) {
        console.log(event.results);
        document.getElementById("transcript").innerHTML =
            event.results[0][0].transcript;
        // var color = event.results[0][0].transcript;
        // diagnostic.textContent = "Result received: " + color;
        // bg.style.backgroundColor = color;
    };
}
//# sourceMappingURL=tracker.js.map