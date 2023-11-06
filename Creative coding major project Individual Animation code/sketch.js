let graphicalList = []
let scalePub = 1
let t = 0;

class Graphical {
  constructor(x = 0, y = 0) {
    this.W = 250
    this.H = 290
    this.x = x
    this.y = y
    this.color = {}
    this.noiseOffsetX = random(1000); // Offset for x coordinate in noise space
    this.noiseOffsetY = random(1000); // Offset for y coordinate in noise space
  }

  getPart1Color(index) {
    // Update noise seed for x and y coordinates based on index to get variety
    let n = noise(this.noiseOffsetX + index, this.noiseOffsetY + index, t);
    // Directly return the color mapped from noise value
    return color(n * 360, 90, random(20, 50));
  }

  getPart2Color(index) {
  let n = noise(this.noiseOffsetX + index * 10, this.noiseOffsetY + index * 10, t);
  return color(n * 360, 12, random(80, 90));
}

getPart3Color(index) {
  let n = noise(this.noiseOffsetX + index * 20, this.noiseOffsetY + index * 20, t);
  return color(n * 360, 90, random(20, 50));
}

// Use noise to perturb position for an organic look
getNoisePerturbedPosition(x, y) {
  let noiseScale = 0.01; // Scale to adjust the frequency of the noise
  let noiseIntensity = 35; // Increase this value to make the motion more pronounced

  let noiseX = noise(this.noiseOffsetX + x * noiseScale, this.noiseOffsetY + y * noiseScale, t) - 0.5;
  let noiseY = noise(this.noiseOffsetX + y * noiseScale, this.noiseOffsetY + x * noiseScale, t) - 0.5;
  return {
    x: x + noiseX * noiseIntensity, // Adjust multiplier to tweak intensity
    y: y + noiseY * noiseIntensity
  };
}
  
  // Modified method to include size variation
  createdCenterMiniEllipseGroup() {
    for (let i = 0; i < 9; i++) {
      let nSize = noise(t + i) * 5; // Adding a bit of noise-based variation to size
      fill(this.getPart2Color(i + 4));
      ellipse(0, 0, 140 - (i * 10) + nSize, 140 - (i * 10) + nSize);
    }
  }

  createdCenterSmallEllipseGroup() {
    fill(this.getPart1Color(1))
    ellipse(0, 0, 54, 54)
    fill(this.getPart1Color(2))
    ellipse(0, 0, 36, 36)
    fill(this.getPart1Color(3))
    ellipse(0, 0, 24, 24)
  }

  createdCnterMediumGroup() {
    fill(0, 0, 100);
    ellipse(0, 0, 240, 240);
    push();
    // Modify this multiplier to change the speed of the pulse
    let pulseSpeedMultiplier = 5; 
    let strokePulse = sin(t * pulseSpeedMultiplier) * 0.5 + 0.5; // Creates a smooth oscillation between 0 and 1
    let strokeWeightRange = map(strokePulse, 0, 1, 1, 10); // Map to a wider range for dramatic effect

    // Subtle color variation over time, kept the same
    let strokeHue = noise(t * 0.1) * 360;
    let strokeSaturation = noise(t * 0.1 + 5) * 50 + 50;
    let strokeBrightness = noise(t * 0.1 + 10) * 50 + 50;

    stroke(strokeHue, strokeSaturation, strokeBrightness);
    strokeWeight(strokeWeightRange);

    beginShape(POINTS);
    for (let a = 0; a < 360; a += 10) {
        for (let b = 5; b > 0; b--) {
            let angle = radians(a);
            vertex(cos(angle) * (124 - b * 10), sin(angle) * (124 - b * 10));
        }
    }
    endShape();
    pop();
}
    // Draw the outer vertices and edges of the hexagon
  createdVertex() {

    let vertexPoints = {
      top: {},
      topLeft: {},
      bottomLeft: {},
      bottom: {},
      bottomRight: {},
      topRight: {},
    }
    vertexPoints.top.x = 0, vertexPoints.top.y = -this.H / 2
    vertexPoints.bottom.x = 0, vertexPoints.bottom.y = this.H / 2
    vertexPoints.topLeft.x = -this.W / 2, vertexPoints.topLeft.y = -this.H / 2 + 71
    vertexPoints.topRight.x = this.W / 2, vertexPoints.topRight.y = -this.H / 2 + 71
    vertexPoints.bottomLeft.x = -this.W / 2, vertexPoints.bottomLeft.y = this.H / 2 - 71
    vertexPoints.bottomRight.x = this.W / 2, vertexPoints.bottomRight.y = this.H / 2 - 71
    strokeWeight(4);
    stroke(27, 80, 91)
    noFill()
    beginShape();
    Object.values(vertexPoints).forEach(({ x, y }) => {
      vertex(x, y)
      push()
      noStroke()
      fill(256, 87, 52)
      ellipse(x, y, 28, 28)
      fill(0, 74, 70)
      ellipse(x, y, 18, 18)
      fill(227, 62, 26)
      ellipse(x, y, 12, 12)
      pop()
    });
    endShape(CLOSE);
    Object.values(vertexPoints).forEach(({ x, y }) => {
      push()
      noStroke()
      fill(256, 87, 52)
      ellipse(x, y, 28, 28)
      fill(0, 74, 70)
      ellipse(x, y, 18, 18)
      fill(227, 62, 26)
      ellipse(x, y, 12, 12)
      pop()
    });
  }
  display() {
    push();
    let np = this.getNoisePerturbedPosition(this.x + this.W / 2 + 28, this.y + this.H / 2 + 28 + 11);
    translate(np.x, np.y);
    noStroke();
    this.createdCnterMediumGroup();
    this.createdCenterMiniEllipseGroup();
    this.createdCenterSmallEllipseGroup();
    this.createdVertex();
    pop();
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  updateGraphicalList()
}


function draw() {
  scale(scalePub)
  background(198, 85, 62)
  // Update the time variable for animation effect
  t += 0.01;
  graphicalList.forEach(item => {
    item.display()
  })
}
function windowResized() {
  updateGraphicalList()
  resizeCanvas(windowWidth, windowHeight);
}

function updateGraphicalList() {
  scalePub = map(windowWidth, 0, 1920, 0, 1)
  graphicalList = []
  let rowNum = ceil(windowHeight / 200 / scalePub)
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < rowNum; j++) {
      graphicalList.push(new Graphical(j % 2 ? (i * 250 -224) : (i * 250 - 100), j * 220 - 100))
    }
  }
}