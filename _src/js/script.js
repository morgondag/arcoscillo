/**
 * Global variables
 */
var audioContext;
var canvasContext;
var mediaStreamSource;
var meter;
var oscillator;
var oscillatorContext;
var volume;
var cacheWaveType;

var isOscillatorOn = false;
var isAllowed = false;

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

    if (cacheWaveType) {
        oscillator.type = cacheWaveType;
    }

    oscillator.frequency.value = 0;
    oscillator.start(0);

    isOscillatorOn = true;
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
    isAllowed = true;

    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    audioContext = new AudioContext();

    mediaStreamSource = audioContext.createMediaStreamSource(stream);

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
    if (volume > 100 && volume <= 250) {
        // Green
        return '#0F9D58';
    } else if (volume > 250 && volume <= 350){
        // Yellow
        return '#F4B400';
    } else if (volume > 350) {
        // Red
        return '#DB4437';
    } else {
        // Blue
        return '#4285F8';
    }
}

/**
 * [toggleActiveClass description]
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function toggleActiveClass(element, toggleWaveType) {
    if (toggleWaveType) {
        var waveType = document.querySelectorAll('.wave-type.active');
        waveType[0].classList.toggle('active');
    }

    if (element.classList) {
        element.classList.toggle('active');
    } else {
        var classes = element.className.split(' ');
        var existingIndex = classes.indexOf('active');
        
        if (existingIndex >= 0) {
            classes.splice(existingIndex, 1);            
        } else {
            classes.push('active');
        }

        element.className = classes.join(' ');
    }
} 

/**
 * Change oscillator wave type
 * @param  {Event} event
 */
function changeWaveType(event) {
    if (typeof oscillator == 'undefined') return;
    toggleActiveClass(event.target, true);

    cacheWaveType = JSON.parse(event.target.value)

    oscillator.type = cacheWaveType;
}

/**
 * [changeMediaSource description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function toggleMediaSource(event) {
    toggleActiveClass(event.target, false);

    if (isOscillatorOn) {
        oscillator.stop(0);
        mediaStreamSource.disconnect();
        isOscillatorOn = false;
    } else if (isAllowed){
        createOscillator();
        mediaStreamSource.connect(meter);
        isOscillatorOn = true;
    } else {
        init();
    }
}