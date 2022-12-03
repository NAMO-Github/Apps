# NamoWorkspace

This project was generated using [Nx](https://nx.dev).

🔎 **Smart, Fast and Extensible Build System**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@namo-workspace/mylib`.

## Run react native apps

Run `nx run-android namo-mobile` or `nx run-ios namo-mobile` to run your react-native app

## Development server

Run `nx serve namo-webapp` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build namo-mobile` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

### Code push

GET LIST KEY
appcenter codepush deployment list -a VmodevC2/Namo-Platform-Android -k
appcenter codepush deployment list -a VmodevC2/Namo-Platform-IOS -k

Android:
staging: a9E35YFA8RTQE14tB\_-RcCYynNlF3xQp30oXN
product: 8lVrFmzMJtJ35WROa-707q_dNPx4qlhmKTmD5

IOS:
staging: xGgfK0kqu76F7Hg-nIFjzUhi_rJ0iLq95tTK2
product: wpH7g9MotrllLIwOOVe76adaTK7Jft2K9NiG4

'RELEASE APP'
cpis: appcenter codepush release-react -a VmodevC2/Namo-Platform-IOS -d Staging -e="src/main.tsx"
cpas: appcenter codepush release-react -a VmodevC2/Namo-Platform-Android -d Staging -e="src/main.tsx"
cpip: appcenter codepush release-react -a VmodevC2/Namo-Platform-IOS -d Production -e="src/main.tsx"
cpap: appcenter codepush release-react -a VmodevC2/Namo-Platform-Android -d Production -e="src/main.tsx"

'DELETE ALL RELEASE'
appcenter codepush deployment clear -a VmodevC2/Namo-Platform-Android Production
appcenter codepush deployment clear -a VmodevC2/Namo-Platform-Android Staging
