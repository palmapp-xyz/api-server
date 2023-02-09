# Oedi Backend
This project contains the server for the Oedi project based on firebase services.

## Firebase services
Oedi backend is based on the following firebase services:
- [Firebase Extensions](https://firebase.google.com/docs/extensions)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Secret Manager](https://cloud.google.com/secret-manager/)
- [Firestore](https://firebase.google.com/docs/firestore)

## Project structure
The project is structured as follows:
- `functions` contains the cloud functions
  - `src` contains the source code
    - `api` contains the api _**moralis evm proxy**_ routes generator
    - `pofile` contains the users profile management routes
    - `stream` contains the stream routes
    - `utils` contains the utility files of functions
    - `index.ts` contains the main entry point of the functions
  - `test` contains the tests
- `hosting` contains the static files for the hosting
- `extensions` contains the firebase extensions
  - `moralis-authentication-extension` contains the [authentication extension](https://moralisweb3.github.io/Moralis-JS-SDK/demos/firebase-auth-ext/)
  - `moralis-streams-extension` contains the [streams extension](https://moralisweb3.github.io/Moralis-JS-SDK/demos/firebase-streams-ext)

## Prerequisites
To start the project you need to have the following installed:
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)

## How to start
1. Clone the project
2. Install the dependencies with per module
   3. For functions
      4. `cd functions`
      5. `yarn install`
      6. `cp .env.example .env`
      7. add the values in `.env`
      8. `cd ..`
3. Login to firebase with `firebase login` using your Google account (you need to be a member of the project `oedi-a1953`)
4. Select the project with `firebase use oedi-a1953`
5. Deploy the project with 
   - if you want to deploy all the services `firebase deploy`
   - if you want to deploy only function `firebase deploy --only functions`
   - if you want to deploy only hosting `firebase deploy --only hosting`
   - if you want to deploy only extensions `firebase deploy --only extensions`

## Run locally
To run the project locally using the firebase emulators `firebase emulators:start`
