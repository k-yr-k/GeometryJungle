//This is for converting .ts to .js respectively
//it will generate the .js file out of .ts file when you run 'npm run start'

const path = require('path');
const src = path.resolve(__dirname, 'src');


// CONVERT wave.ts
module.exports = {
  mode: 'development',
  entry: './src/wave.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'wave.js',
    path: src
  },
  devServer: {
    contentBase: src,
  },
}


// CONVERT terrain.ts
module.exports = {
  mode: 'development',
  entry: './src/terrain.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'terrain.js',
    path: src
  },
  devServer: {
    contentBase: src,
  },
}


// CONVERT origami.ts
module.exports = {
  mode: 'development',
  entry: './src/origami.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'origami.js',
    path: src
  },
  devServer: {
    contentBase: src,
  },
}