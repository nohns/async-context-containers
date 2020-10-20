# Node.js TypeScript Starter

  

The quickest way to bootstrap a **Node.js** application using **TypeScript**. Simply clone this repository to get started!

### Structure

- All your `.ts` files lives inside the `/src` folder. 
- The main entry point of your typescript is the `/src/main.ts` file.
- The built `.js` code lives inside the `/dist` folder.
- The default TypeScript configuration lives at the root directory in `tsconfig.json`
- The default nodemon configuration also lives at the root directory in `nodemon.json`

## Quick start

 1. Clone this repository with **git** using this command `git clone https://github.com/nohns/node-typescript-starter.git`
 2. Install the dev dependencies using `yarn install` or `npm install`
 3. Almost done! Just test out the application by running `yarn start` or `npm start`

## Watch and more

The package.json keeps a record of all the available scripts but I will list them here aswell.

| Script | Function  |
|--|--|
| `yarn start` or `npm start` | Simply runs the application. |
| `yarn start:dev` or `npm run start:dev`| Runs the applicaiton while watching the `/src` folder and restarts the updated application as soon as the source files changes.  |
| `yarn build` or `npm run build`| Compiles the TypeScript from the `/src` folder and outputs the plain JavaScript in the `/dist` folder. |
| `yarn start:prod` or `npm run start:prod`| Runs the applications directly from the `/dist` folder using just Node.js  |

Feel free to change the scripts to your liking, as they are pretty simple to modify.
> Note: When changing paths inside the package.json file, you should update the tsconfig.json and nodemon.json aswell to make sure all still works as intended

## Contributing
All contributions to this template is more than welcome. Just keep in mind that this starter is meant to be simple and not include too much bloat.