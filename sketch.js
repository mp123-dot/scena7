let imageFiles = ["bitchy.png", "casual.png", "smart casual.png", "classy.png"];
let images = [];
let buttons = [];
let successSound;
let failSounds = [];
let nextScreen = false;
let correctLabel = "bitchy.png";

let glitter = [];
let kissGif;

let rawDalejImg, dalejImg;
let przyciskX, przyciskY, przyciskSzer, przyciskWys;

let tloUbrania; // tło na start
let futuraFont; // czcionka futura
let glimmerSound; // dźwięk kliknięcia przycisku DALEJ
let flowerMouse;  // obrazek kursora

function preload() {
  for (let file of imageFiles) {
    images.push(loadImage(file));
  }
  successSound = loadSound("whistle.wav");
  failSounds.push(loadSound("fail1.wav"));
  failSounds.push(loadSound("fail2.wav"));
  failSounds.push(loadSound("fail3.wav"));
  rawDalejImg = loadImage("PrzyciskDALEJ.png");
  tloUbrania = loadImage("t.ubrania.png");
  futuraFont = loadFont("futura.ttf");
  glimmerSound = loadSound("glimmer.wav");
  flowerMouse = loadImage("flowerMouse.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(28);
  noStroke();
  setupButtons();
  setupGlitter();
  setupKissGif();
  setupDalejImg();
  noCursor();
}

function setupButtons() {
  buttons = [];
  let btnWidth = min(200, width / 5);
  let btnHeight = btnWidth;
  let spacing = min(30, width / 30);
  let totalWidth = btnWidth * 4 + spacing * 3;
  let startX = (width - totalWidth) / 2;
  let y = height * 0.33;
  for (let i = 0; i < 4; i++) {
    let x = startX + i * (btnWidth + spacing);
    buttons.push({ x, y, w: btnWidth, h: btnHeight, label: imageFiles[i], color: color(255) });
  }
}

function setupGlitter() {
  glitter = [];
  for (let i = 0; i < 200; i++) {
    glitter.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      speed: random(0.5, 2),
      alpha: random(100, 255),
      angle: random(TWO_PI),
      life: 0,
      maxLife: random(20, 40),
      color: color(
        random(180, 255),
        random(120, 200),
        random(200, 255),
        200
      )
    });
  }
}

function setupKissGif() {
  if (kissGif) kissGif.remove();
  kissGif = createImg("kiss-dinner.gif");
  kissGif.position(width / 2 - width * 0.14, height / 2 - width * 0.14);
  kissGif.size(width * 0.28, width * 0.28);
  kissGif.hide();
}

function setupDalejImg() {
  const s = min(rawDalejImg.width, rawDalejImg.height);
  dalejImg = createImage(s, s);
  rawDalejImg.loadPixels();
  dalejImg.copy(
    rawDalejImg,
    (rawDalejImg.width  - s) / 2,
    (rawDalejImg.height - s) / 2,
    s, s,
    0, 0, s, s
  );
  let maskG = createGraphics(s, s);
  maskG.noStroke(); maskG.fill(255);
  maskG.circle(s/2, s/2, s);
  dalejImg.mask(maskG);

  // Przycisk DALEJ - rozmiar i pozycja zależne od okna
  przyciskSzer = min(90, width / 10);
  przyciskWys = przyciskSzer;
  przyciskX = width / 2;
  przyciskY = height - przyciskWys / 2 - 80;
}

function draw() {
  if (nextScreen) {
    drawNextScreen();
    return;
  }

  image(tloUbrania, 0, 0, width, height);

  for (let i = 0; i < buttons.length; i++) {
    let btn = buttons[i];
    fill(btn.color);
    rect(btn.x, btn.y, btn.w, btn.h, 10);
    image(images[i], btn.x, btn.y, btn.w, btn.h);
  }

  // Glitter efekt na głównej scenie
  for (let i = glitter.length - 1; i >= 0; i--) {
    let g = glitter[i];
    fill(g.color);
    ellipse(g.x, g.y, g.size);
    g.life++;
    g.x += cos(g.angle) * 1.5;
    g.y += sin(g.angle) * 1.5;
    if (g.life > g.maxLife) glitter.splice(i, 1);
  }

  // Kursor flowerMouse
  if (flowerMouse) {
    image(flowerMouse, mouseX - 16, mouseY - 16, 32, 32);
  }
}

function mousePressed() {
  if (nextScreen) {
    let d = dist(mouseX, przyciskY, przyciskX, przyciskY);
    if (d < przyciskSzer / 2) {
      if (glimmerSound && glimmerSound.isLoaded()) {
        glimmerSound.play();
      }
      for (let i = 0; i < 18; i++) {
        glitter.push({
          x: mouseX,
          y: mouseY,
          size: random(3, 7),
          angle: random(TWO_PI),
          life: 0,
          maxLife: random(20, 40),
          color: color(
            random(180, 255),
            random(120, 200),
            random(200, 255),
            200
          )
        });
      }
      // Przeniesienie do scena8
      window.location.href = "https://mp123-dot.github.io/scena8/";
      return;
    }
    return;
  }

  for (let i = 0; i < buttons.length; i++) {
    let btn = buttons[i];
    if (
      mouseX > btn.x &&
      mouseX < btn.x + btn.w &&
      mouseY > btn.y &&
      mouseY < btn.y + btn.h
    ) {
      if (btn.label === correctLabel) {
        btn.color = color(0, 200, 0);
        successSound.play();

        setTimeout(() => {
          nextScreen = true;
          kissGif.show();
        }, 1000);
      } else {
        btn.color = color(255, 0, 0);
        let randomSound = random(failSounds);
        randomSound.play();

        setTimeout(() => {
          btn.color = color(255);
        }, 1000);
      }
    }
  }

  // Dodaj glitter przy każdym kliknięciu na głównej scenie
  if (!nextScreen) {
    for (let i = 0; i < 18; i++) {
      glitter.push({
        x: mouseX,
        y: mouseY,
        size: random(3, 7),
        angle: random(TWO_PI),
        life: 0,
        maxLife: random(20, 40),
        color: color(
          random(180, 255),
          random(120, 200),
          random(200, 255),
          200
        )
      });
    }
  }
}

function drawNextScreen() {
  background("#ff93ff");

  // Dodawaj drobinki automatycznie w każdej klatce
  for (let i = 0; i < 3; i++) {
    glitter.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      angle: random(TWO_PI),
      life: 0,
      maxLife: random(20, 40),
      color: color(
        random(180, 255),
        random(120, 200),
        random(200, 255),
        200
      )
    });
  }

  // Glitter efekt na ekranie końcowym
  for (let i = glitter.length - 1; i >= 0; i--) {
    let g = glitter[i];
    fill(g.color);
    ellipse(g.x, g.y, g.size);
    g.life++;
    g.x += cos(g.angle) * 1.5;
    g.y += sin(g.angle) * 1.5;
    if (g.life > g.maxLife) glitter.splice(i, 1);
  }

  fill(255);
  stroke(255, 105, 180);
  strokeWeight(2);
  textSize(min(36, width / 25));
  textFont(futuraFont);
  text("Świetny wybór! Miłej randki!", width / 2, height * 0.13);

  imageMode(CENTER);
  image(dalejImg, przyciskX, przyciskY, przyciskSzer, przyciskWys);
  imageMode(CORNER);

  if (flowerMouse) {
    image(flowerMouse, mouseX - 16, mouseY - 16, 32, 32);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupButtons();
  setupGlitter();
  setupKissGif();
  setupDalejImg();
}
