# Geometry Jungle

![](home.gif)


Geometry Jungle is an inspirational website playground that lets users create 2D/3D geometries with stunning visual effects, materials, noise NURBS, etc.  Created by Xiying Bao, Ibrahim Ibrahim, and Kenny Kim.

The website will enable users to select amongst three geometries: waving sphere, playful terrain, and origami mirrors.  In each selection, the website GUI allows for adjusting its lighting, materiality, shape, and transformative effects to allow for easy and personal manipulations.  We aim to inspire designers and non-designers alike to give access to 3D modeling creation without a precise understanding of 3D or NURBS modeling software.

We built our website on Javascript, HTML, and CSS.  Then, using the Node.js engine, we implemented our website using Three.js, dat.GUI, orbit control, and GLTFLoader to build the website's foundation.

https://youtu.be/-kh2HfO1HCc

## Installation

1. Download node.js at: 
https://nodejs.org/en/

2. Run the following commands:

```
npm install

npm install --save dat.gui
```
3. Check if node and npm are installed
```
node -v

npm -v
```

4. Occasionally run the below commands if required
```
npm install --save-dev webpack-dev-server 

npm install --save-dev webpack-dev-middleware webpack-hot-middleware
```


## Usage

Run the following command to run the website:

```
npm run start
```

To update the code, type:

```
git pull
```

## Creation process

We mainly write the codes in typescript files to achieve all the geomtry creation, see "sphere_with_waves.ts", "terrain_editor.ts" and ""origami_mirror_editor.ts". We then use "wave.ts", "terrain.ts" and "origami.ts" to import the functions and convert into javascript file for html file to display. ("webpack.config.js" is the file that converts typescript file into javasctip file.) The reason why we have to use typescript is that typescript allow us to import types that we need to create the geometry. We also found that typescript is a really good language for debugging compared to javascript, as it showed the bugs immediately when we were coding.
