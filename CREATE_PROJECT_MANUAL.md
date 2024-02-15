# How to use p5.js with TypeScript and webpack

This post is about creating a p5.js development using webpack and typescript. (Please install Node.js beforehand and make sure npm is available.)

## Step 1: Install libraries

First, create a project directory and install libraries.

```bash
mkdir p5-project
cd p5-project
npm init -y
npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader @types/p5
npm i p5
```

Delete `"main":"index.js"` in package.json and add `"private":true`

```json
{
    "name": "p5-project",
    "version": "1.0.0",
    "description": "",
    "private": true,
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "@types/p5": "^1.4.2",
        "ts-loader": "^9.3.0",
        "typescript": "^4.6.4",
        "webpack": "^5.72.1",
        "webpack-cli": "^4.9.2",
        "webpack-dev-server": "^4.9.0"
    },
    "dependencies": {
        "p5": "^1.4.1"
    }
}
```

According to webpack documentation, this is to prevent an accidental publication of your code.

## Step 2: Create directories and files

Create `src` and `dist` directories, `webpack.config.js`, `tsconfig.json` and `global.d.ts` files under the project directory.

The dist directory contains `index.html`, and the src directory contains `index.ts`.

```
p5-project
  |- package.json
  |- package-lock.json
  |- webpack.config.js
  |- tsconfig.json
  |- /dist
    |- index.html
  |- /src
    |- index.ts
```

Each file should be written with reference to the following.

webpack.config.js

```javascript
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: './dist',
    },
};
```

tsconfig.json

```json
{
    "compilerOptions": {
        "outDir": "./dist/",
        "noImplicitAny": true,
        "module": "es6",
        "target": "es5",
        "jsx": "react",
        "allowJs": true,
        "moduleResolution": "node"
    }
}
```

global.d.ts

```typescript
import module = require('p5');
export = module;
export as namespace p5;
```

index.html

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>P5 Project</title>
    </head>
    <body>
        <script src="bundle.js"></script>
    </body>
</html>
```

index.ts

```typescript
import * as p5 from 'p5';

export const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(400, 400);
    };

    p.draw = () => {
        p.background(220);
        p.ellipse(50, 50, 80, 80);
    };
};

export const myp5 = new p5(sketch, document.body);
```

Using the p5 instance mode to avoid possible conflicts with your own function names or other libraries.

## Step 3: Add npm scripts and try to build

Add `"start": "webpack serve --open"` in package.json and type `npm run start` in a terminal.

```json
{
    "name": "p5-project",
    "version": "1.0.0",
    "description": "",
    "private": true,
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "webpack serve --open"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "@types/p5": "^1.4.2",
        "ts-loader": "^9.3.0",
        "typescript": "^4.6.4",
        "webpack": "^5.72.1",
        "webpack-cli": "^4.9.2",
        "webpack-dev-server": "^4.9.0"
    },
    "dependencies": {
        "p5": "^1.4.1"
    }
}
```

###### Article fount at https://dev.to/tendonnman/how-to-use-p5js-with-typescript-and-webpack-57ae

# How configurer prettier

## Install `prettier` as dev dependencies

```bash
npm i -D prettier
```

## Install prettier extension on Visual Studio Code

-   extension Id: **esbenp.prettier-vscode**

## Configurer vs code

Create a folder called `.vscode` on your project root and create a file inside it named `.settings.json` with the following content:

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    },
    "files.eol": "\n",
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}
```

## Modifying prettier default configuration

Create a file called `.prettierrc.json` with the following content:

```json
{
    "trailingComma": "all",
    "singleQuote": true,
    "endOfLine": "lf",
    "tabWidth": 4,
    "arrowParens": "avoid",
    "printWidth": 80
}
```

# How configurer ESLint

## configurer `eslint` as dev dependencies

```bash
npm init @eslint/config
```

And choose the following options:

1. To check syntax and find problems
2. JavaScript modules (import/export)
3. None of these
4. Yes
5. Browser
6. JSON
7. Yes
8. npm

## Install eslint extension on Visual Studio Code

-   extensionId: **dbaeumer.vscode-eslint**
