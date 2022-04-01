// lookup table
const gamma = 1.2;
const correctGamma = (x) => (x / 255) ** (1 * gamma) * 255;
const gammaTable = [...Array(255)].map((_, i) => correctGamma(i));

interface Blossom {
  x: number;
  y: number;
  scale: number;
  scaleDiff: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  angle: number;
  delay: number;
}

window.onload = () => {
  // load an image
  const src = ["cherry1.jpeg"];
  const image = new Image();
  image.src = src[Math.round(Math.random() * (src.length - 1))];

  image.onload = () => {
    const canvas = document.querySelector("#main") as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth * (image.height / image.width);
    const context = canvas.getContext("2d");

    // img canvas
    const imgCanvas = document.createElement("canvas");
    imgCanvas.width = image.width / 2;
    imgCanvas.height = image.height / 2;
    const imgContext = imgCanvas.getContext("2d");
    imgContext.drawImage(image, 0, 0, imgCanvas.width, imgCanvas.height);
    const imageData = imgContext.getImageData(
      0,
      0,
      imgCanvas.width,
      imgCanvas.height
    );

    // bg canvas
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = imgCanvas.width;
    bgCanvas.height = imgCanvas.height;
    const bgContext = bgCanvas.getContext("2d");

    // initialize
    bgContext.fillStyle = "hsl(204 90% 55%)";
    bgContext.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    const firstBlossoms: Blossom[] = [];

    for (let y = 0; y < imgCanvas.height; y++) {
      for (let x = 0; x < imgCanvas.width; x++) {
        const i = (y * imgCanvas.width + x) * 4;
        const r = gammaTable[imageData.data[i]];
        const g = gammaTable[imageData.data[i + 1]];
        const b = gammaTable[imageData.data[i + 2]];

        // cherry blossoms
        if (r + g + b > 255 * 1.7) {
          if (Math.random() > 0.85) {
            const alpha = 0.3 + Math.random() * 0.7;
            firstBlossoms.push({
              x,
              y,
              scale: Math.random() * 2,
              scaleDiff:
                Math.random() > 0.8 ? Math.random() * 0.016 - 0.008 + 1 : 1,
              r,
              g,
              b,
              alpha,
              angle: 180 + 20 + Math.random() * 140,
              delay: Math.random() * 30 + 4,
            });
          }
        }

        // others
        else {
          bgContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
          bgContext.fillRect(x, y, 1, 1);
        }
      }
    }

    // draw
    const scale = canvas.width / imgCanvas.width;

    const moveBlossoms = (t: number) =>
      firstBlossoms.map((blossom) => {
        const radian = (2 * Math.PI * blossom.angle) / 360;
        const distance = Math.max(t - blossom.delay, 0) * 20;
        return {
          ...blossom,
          x: blossom.x + Math.cos(radian) * distance,
          y: blossom.y + Math.sin(radian) * distance + distance ** 2 * 0.0018,
          scale:
            blossom.scale *
            Math.pow(blossom.scaleDiff, Math.max(t - blossom.delay, 0)),
        };
      });

    context.font = `10px "Zen Old Mincho"`;

    const draw = (blossoms: Blossom[]) => {
      context.drawImage(bgCanvas, 0, 0, canvas.width, canvas.height);
      // cherry blossoms
      for (const blossom of blossoms) {
        context.fillStyle = `rgba(${blossom.r}, ${blossom.g}, ${blossom.b}, ${blossom.alpha})`;
        const randomRange = 20;
        context.save();
        context.scale(blossom.scale, blossom.scale);

        const x =
          blossom.x * scale + Math.random() * randomRange - randomRange / 2;
        const y =
          blossom.y * scale + Math.random() * randomRange - randomRange / 2;
        context.fillText("桜", x / blossom.scale, y / blossom.scale);
        context.restore();
      }
    };

    const loop = (t: number) => {
      const blossoms = moveBlossoms(t);
      draw(blossoms);
      setTimeout(() => {
        loop(t + 1);
      }, 200);
    };
    loop(0);
  };
};
