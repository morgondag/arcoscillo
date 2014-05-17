/**
 * Global variables
 */
var audioContext;
var canvasContext;
var meter;
var oscillator;
var oscillatorContext;
var volume;

var body = document.body;
var html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
var width = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Trigger functions
 */
function init() {
    setCanvas();
    createOscillator();
    getUserMedia();
}

/**
 * Prepare canvas
 */
function setCanvas() {
    var canvas = document.getElementById('canvas');
    
    canvas.height = height;
    canvas.width = width;

    canvasContext = canvas.getContext('2d');
}

/**
 * Create oscillator
 */
function createOscillator() {
    oscillatorContext = new webkitAudioContext();
    oscillator = oscillatorContext.createOscillator();

    oscillator.connect(oscillatorContext.destination);
    oscillator.frequency.value = 0;
    oscillator.start(0);
}

/**
 * Get media stream
 * @return {[type]} [description]
 */
function getUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia( { audio: true }, createMediaStreamSource );
}

/**
 * Create media stream source & trigger animation
 * @param  {[type]} stream
 */
function createMediaStreamSource(stream) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    audioContext = new AudioContext();

    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    animate();
}

/**
 * Request animation frame & trigger updateOscillatorFreq
 */
function animate() {
    requestAnimFrame(animate);

    volume = Math.floor(meter.volume * 1000);
    var color = getColor();

    canvasContext.clearRect(0, 0, width, height);
    canvasContext.beginPath();
    canvasContext.arc(width/2, height/2, volume, 0, Math.PI*2, true); 
    canvasContext.closePath();
    canvasContext.fillStyle = color;
    canvasContext.fill();

    updateOscillatorFreq();
}

/**
 * Updates frequency of oscillator
 */
function updateOscillatorFreq() {
    if (volume >= 100) {
        oscillator.frequency.value = volume * 2;
    } else {
        oscillator.frequency.value = 100;
    }
}

/**
 * Returns HEX color depending on volume variable
 * @return {String}
 */
function getColor() {
    if (volume > 50 && volume <= 100) {
        // Green
        return '#0F9D58';
    } else if (volume > 100 && volume <= 150){
        // Yellow
        return '#F4B400';
    } else if (volume > 150) {
        // Red
        return '#DB4437';
    } else {
        // Blue
        return '#4285F8';
    }
}

/**
 * Change oscillator wave type
 * @param  {Event} event
 */
function changeWaveType(event) {
    oscillator.type = JSON.parse(event.target.value);
}

init();