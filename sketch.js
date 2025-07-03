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
  createCanvas(900, 600);
  textAlign(CENTER, CENTER);
  textSize(28);
  noStroke();

  let btnWidth = 200;
  let btnHeight = 200;
  let spacing = 30;
  let startX = (width - (btnWidth * 4 + spacing * 3)) / 2;
  let y = 200;

  for (let i = 0; i < 4; i++) {
    let x = startX + i * (btnWidth + spacing);
    buttons.push({ x, y, w: btnWidth, h: btnHeight, label: imageFiles[i], color: color(255) });
  }

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

  kissGif = createImg("kiss-dinner.gif");
  kissGif.position(width / 2 - 125, height / 2 - 125);
  kissGif.size(250, 250);
  kissGif.hide();

  // Przygotuj okrągły przycisk DALEJ
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

  // Pozycja i rozmiar przycisku DALEJ (80 px od dołu)
  przyciskSzer = 90;
  przyciskWys = 90;
  przyciskX = width / 2;
  przyciskY = height - 80;

  noCursor();
}

function draw() {
  if (nextScreen) {
    drawNextScreen();
    return;
  }

  // Tło na początku
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
    // Sprawdź, czy kliknięto okrągły przycisk DALEJ
    let d = dist(mouseX, mouseY, przyciskX, przyciskY);
    if (d < przyciskSzer / 2) {
      if (glimmerSound && glimmerSound.isLoaded()) {
        glimmerSound.play();
      }
      // Dodaj glitter przy kliknięciu w przycisk DALEJ
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
      // Przeniesienie do wskazanej strony:
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
        btn.color = color(0, 200, 0); // zielony
        successSound.play();

        setTimeout(() => {
          nextScreen = true;
          kissGif.show();
        }, 1000); // po 1 sekundzie
      } else {
        btn.color = color(255, 0, 0); // czerwony
        let randomSound = random(failSounds);
        randomSound.play();

        setTimeout(() => {
          btn.color = color(255); // reset do białego
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

  // Tekst futura.ttf
  fill(255);
  stroke(255, 105, 180);
  strokeWeight(2);
  textSize(36);
  textFont(futuraFont);
  text("Świetny wybór! Miłej randki!", width / 2, 80);

  // Rysuj okrągły przycisk DALEJ na środku na dole
  imageMode(CENTER);
  image(dalejImg, przyciskX, przyciskY, przyciskSzer, przyciskWys);
  imageMode(CORNER);

  // Kursor flowerMouse na ekranie końcowym
  if (flowerMouse) {
    image(flowerMouse, mouseX - 16, mouseY - 16, 32, 32);
  }
}