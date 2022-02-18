const sphere = document.querySelector(".sphere");
const terrain = document.querySelector(".terrain");
const origami = document.querySelector(".origami");
const sphereGIF = document.querySelector(".sphere-gif");
const terrainGIF = document.querySelector(".terrain-gif");
const origamiGIF = document.querySelector(".origami-gif");


// Sphere GIF
sphere.addEventListener("mouseover", () => {
	sphereGIF.style.display = "block";
      window.addEventListener("mousemove", (e) => {
        let x = e.offsetX,
          y = e.offsetY;
          sphereGIF.style.left = `${x-260}px`;
          sphereGIF.style.top = `${y-460}px`;
      })
});

sphere.addEventListener("mouseleave", () => {
	sphereGIF.style.display = "";
});


// Terrain GIF
terrain.addEventListener("mouseover", () => {
	terrainGIF.style.display = "block";
      window.addEventListener("mousemove", (e) => {
        let x = e.offsetX,
          y = e.offsetY;
          terrainGIF.style.left = `${x-460}px`;
          terrainGIF.style.top = `${y-550}px`;
      })
});

terrain.addEventListener("mouseleave", () => {
	terrainGIF.style.display = "";
});


// Origami GIF
origami.addEventListener("mouseover", () => {
	origamiGIF.style.display = "block";
      window.addEventListener("mousemove", (e) => {
        let x = e.offsetX,
          y = e.offsetY;
          origamiGIF.style.left = `${x-390}px`;
          origamiGIF.style.top = `${y-310}px`;
      })
});

origami.addEventListener("mouseleave", () => {
	origamiGIF.style.display = "";
});