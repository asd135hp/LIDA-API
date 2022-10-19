# LIDA-API

This is a REST API utilising the CQRS design pattern being exposed via Google Clouds serverless functions.

# Table of Contents

- [LIDA-API](#lida-api)
- [Table of Contents](#table-of-contents)
	- [Architecture](#architecture)
	- [Deployment and Operations](#deployment-and-operations)
		- [Local](#local)
		- [Ops](#ops)
	- [Tests](#tests)
	- [Consumers](#consumers)
	- [Contracts](#contracts)

## Architecture

This API was designed *restfully*, meaning that it conforms to the architecterual constraints of REST. These constraints are not fully defined, but act as guidelines that can be left up to the interpretation of the developer. This API has several resources defined, each with there own HTTP method. Please refer to the contract section of the guide for an in-depth showcase of the API contracts.

This API heavily utilises Google Firebase API, which is available as a library written in Typescript. This was to allow us to leverage TypeScript's strongly typed functionality, and furthermore segregate each resource into its own independent function so they can be edited without affecting the other functions.

The overall architectural design pattern being followed by this restful serverless API is CQRS, or the Command and Query Responsibility Segregation pattern. It revolves around seperating commands (create or updates) and queries (reads) to allow for complex domains to be easily manager with several different models as opposed to sharing them across operations. Albeit the domain within this project is quite small, this allows flexibility if the project demands it as it grows. It is quite simple to extend this pattern, by creating a new *controller*, and underneath it a new *method*, which will deal with *commands / queries*. See the [MSDN for more info](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs).

One more thing to note is this API is desgined to be used with Google Firebase Free plan, meaning that its capability is quite restricted due to storage problems. For the best API capability, Google Firebase Paid plan should be used instead and code should be written anew to adapt Google Cloud Functions instead of Google Firebase API.

## Architecture specification
Below is the best word-to-word explanation of how the API should work
### Structure
These are the structure of the REST API that we developed:

- Firebase API integration services path: `src/controller/database/firebase/**/*.ts`
- API Categories and its path:
	- Sensor - `src/controller/v1/methods/read/sensorReadMethods.ts` && `src/controller/v1/methods/write/sensorWriteMethods.ts`
	- Actuator - `src/controller/v1/methods/read/actuatorReadMethods.ts` && `src/controller/v1/methods/write/actuatorWriteMethods.ts`
	- DataSaving - `src/controller/v1/methods/read/dataSavingReadMethods.ts` && `src/controller/v1/methods/write/dataSavingWriteMethods.ts`
	- SystemLogs - `src/controller/v1/methods/read/systemLogsReadMethods.ts` && `src/controller/v1/methods/write/systemLogsWriteMethods.ts`
	- Security - `src/controller/security/methods/securityMethods.ts`
- Integration of API to CQRS framework:
	- Write responsibility: Firebase Firestore API + Firebase Storage API for data saving
	- Read responsibility: Firebase Realtime Database API + Firebase Storage API for data saving
- Additional integration of API:
	- Security responsibility: Firebase Authentication API
### Advantage
- Full usage of Firebase API
- To change database, rewrite all necessary services under `src/controller/v1/services/firebaseFreetier`. It is recommended to make another sub-folder for it but the structure of the services should be the same for all related API Categories (inherited from models in `src/v1/services` folder)
### Downside
It would take a great deal of time to adapt this API solution to use another database solution since cloud database services are quite different. Hence, it is more recommended to use something more generic like Google Cloud Functions. But to use Firebase on free-tier forever, this is a good solution to use.


## Deployment and Operations

### Preface
This API is designed to specifically use Heroku container over the internet to avoid unnecessary fees to occur during the development phase. Automation scripts are specifically written to adapt these requirements and all of them are under *automation* folder. To understand more about how this integration works, please read more from the automation scripts.

### Required works before running commands
- Set up Firebase solution on the personal account. It is recommended to use a paid plan but a free plan is alright since the current API is developed to adapt with that free plan.
- Set up a Vercel account to deploy apps
- Install Vercel CLI and login to CLI using your account credentials
- Install the latest version of Python and set it as the default system python version for [Windows](https://stackoverflow.com/questions/5087831/how-should-i-set-default-python-version-in-windows), [MacOS](https://stackoverflow.com/questions/5846167/how-to-change-default-python-version) or [Linux](https://unix.stackexchange.com/questions/410579/change-the-python3-default-version-in-ubuntu). The python scripts in this project is written using Python 3.9.
- Install packages by running `yarn --network-timeout=500000` command instead of `npm i`

### Local 
To run the project locally, use `npm run dev`

### Test
All test commands are within npm scripts, specifically `npm run test`. Project can be built and tested at the same time using `npm run build`

### Deployment
To deploy the project, use `npm run prod` for production deployment. Testing environment should be deployed via `npm run preview` instead

## Consumers
Front-End: https://github.com/asd135hp/LIDA-UI

# Note
## What to do when Firebase Free plan limits resources/operations
Either caching responses in Firebase Storage if we are intending to use the free plan for a long time, or move the database to
"pay as you go" plan. Either way will not affect the code much.

If, by chance, we would like to use AWS, for instance, we will have to rewrite the code to make it use AWS instead. The partition
to be rewritten will be discussed in the next section. It is not recommended to utilise AWS if the scaling is not a problem.

## What to rewrite in order to use the new database solution
Please follow these steps to rewrite the code:
- Step 1: Create a new folder in `./src/controller/v1/services` folder that reflects the database to be used (e.g. AWS or postgres)
- Step 2: Implement new code that extends from abstracts classes, all defined in `./src/model/v1/services`
- Step 3: Change all imports that uses `firebaseFreetier` folder for example to the new folder containing new code
- Step 4: Test the code
- Step 5: Enjoy

If there are any problems in rewriting new code then all old code can be seen in `./src/controller/v1/services/firebaseFreetier` folder.
The folder consists of all base implementation for a backend system that uses Firebase Free plan