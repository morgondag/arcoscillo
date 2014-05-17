function callback() {
    canvasContext.clearRect(0,0,width,height);

    canvasContext.beginPath();
    
    canvasContext.arc(width/2, height/2, peak, 0, Math.PI*2, true); 
    
    canvasContext.closePath();
    canvasContext.fillStyle = color;
    canvasContext.fill();

    if (peak >= 100) {
        oscillator.frequency.value = peak * 2;
    } else {
        oscillator.frequency.value = 100;
    }
}

function waveType(event) {
    oscillator.type = JSON.parse(event.target.value);
}