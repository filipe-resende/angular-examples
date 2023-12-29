# Running locally

- Run npm i
- create environment.local.ts
- run `npm run start-local`
- make sure you're Node version is compatible. v14.16.0 is known to be compatible

# Vale Angular Sample

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.1.

## Restore Packages

Run `npm install` to restore all packages.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

# Deployment with Azure DevOps CI/CD

for DEV environment use `npm run builddev` under npm task.

for Qa environment use `npm run buildqa` under npm task.

for Prod environment use `npm run buildprod` under npm task.

Or you can clone existing CI/CD definition and update repositoy and branch (CI) and Azure Resource inside (CD)

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

If application has more than one modules then separate pages by modules and lazy load modules using routes.

Ex. `module1` and `module2` in pages folder. Add new module under pages folder using `ng generate module <module name>` then add routing file and required component pages.

for simple application separate modules can be avoided and components can be added directly under pages folder.

## Sidenav Menu

Routes to component pages can be added to `Side Menu` in `sidenav.service.ts` under `components > main > sidenav`.

Side Menu is configured to have langauge specific menu names from language files from `i18n`
under `assets` folder.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
