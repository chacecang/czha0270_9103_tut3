let song, fft, layer, btn, playing = false, fr = 60, a, b;

function preload() {
  song = loadSound("sample-visualisation.mp3");
  song.onended(() => {
    playing = false;
    btn.html('Play');
    a = 0;
  });
}

function setup() {
  createCanvas(500, 500);
  layer = createGraphics(width, height);

  background('black');
  fft = new p5.FFT(0, 256);

  a = 360 / (song.duration() * fr);
  b = a;

  frameRate(fr);

  btn = createButton('Play');
  btn.position(20, 520);
  btn.mousePressed(toggleAudio);
}

function draw() {
  background(0);
  const spectrumB = fft.analyze().reverse();
  spectrumB.splice(0, 40);

  push();
  translate(250, 250);

  drawDynamicSquare(spectrumB, 150);
  drawDynamicCircle(spectrumB, 100);
  drawDynamicSquare(spectrumB, 50);

  pop();

  if (playing) a += b;
  displayProgressBar();
}

function drawDynamicSquare(spectrumB, size) {
    beginShape();

    // Top edge
    for(let i = 0; i < spectrumB.length/4; i++){
        let amp = spectrumB[i];
        let x = map(i, 0, spectrumB.length/4, -size, size);
        let y = map(amp, 0, 256, -size, -size-10);
        vertex(x, y);
    }

    // Right edge
    for(let i = spectrumB.length/4; i < spectrumB.length/2; i++){
        let amp = spectrumB[i];
        let y = map(i - spectrumB.length/4, 0, spectrumB.length/4, -size, size);
        let x = map(amp, 0, 256, size, size+10);
        vertex(x, y);
    }

    // Bottom edge
    for(let i = spectrumB.length/2; i < 3*spectrumB.length/4; i++){
        let amp = spectrumB[i];
        let x = map(i - spectrumB.length/2, 0, spectrumB.length/4, size, -size);
        let y = map(amp, 0, 256, size, size+10);
        vertex(x, y);
    }

    // Left edge
    for(let i = 3*spectrumB.length/4; i < spectrumB.length; i++){
        let amp = spectrumB[i];
        let y = map(i - 3*spectrumB.length/4, 0, spectrumB.length/4, size, -size);
        let x = map(amp, 0, 256, -size, -size-10);
        vertex(x, y);
    }

    endShape(CLOSE);
}

function drawDynamicCircle(spectrumB, radius) {
    beginShape();
    for(let i = 0; i < spectrumB.length; i++){
        let amp = spectrumB[i];
        let r = map(amp, 0, 256, radius, radius+10);
        let x = r * cos(TWO_PI * i / spectrumB.length);
        let y = r * sin(TWO_PI * i / spectrumB.length);
        vertex(x, y);
    }
    endShape(CLOSE);
}

function displayProgressBar() {
  let progress = song.currentTime() / song.duration();
  let barHeight = 10;

  fill(50);
  rect(0, height - barHeight, width, barHeight);

  fill(150, 0, 150);
  rect(0, height - barHeight, width * progress, barHeight);
}

function toggleAudio() {
  playing ? song.pause() : song.play();
  btn.html(playing ? 'Play' : 'Pause');
  playing = !playing;
}
