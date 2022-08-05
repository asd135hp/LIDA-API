# LIDA-API

This is a REST API utilising the CQRS design pattern being exposed via Google Clouds serverless functions.

# Table of Contents

- [LIDA-API](#lida-api)
- [Table of Contents](#table-of-contents)
	- [Docker](#docker)
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
- To change database, rewrite all necessary services under `src/controller/v1/services/firebase-free`. It is recommended to make another sub-folder for it but the structure of the services should be the same for all related API Categories
### Downside
It would take a great deal of time to adapt this API solution to use another database solution since cloud database services are quite different. Hence, it is more recommended to use something more generic like Google Cloud Functions. But to use this service on free-tier forever, this is a good solution to use.


## Deployment and Operations

### Preface
This API is designed to specifically use Heroku container over the internet to avoid unnecessary fees to occur during the development phase. Automation scripts are specifically written to adapt these requirements and all of them are under *automation* folder. To understand more about how this integration works, please read more from the automation scripts.

### Required works before running commands
- Set up Firebase solution on the personal account. It is recommended to use a paid plan but a free plan is alright since the current API is developed to adapt with that free plan.
- Install the latest version of Python and set it as the default system python version for [Windows](https://stackoverflow.com/questions/5087831/how-should-i-set-default-python-version-in-windows), [MacOS](https://stackoverflow.com/questions/5846167/how-to-change-default-python-version) or [Linux](https://unix.stackexchange.com/questions/410579/change-the-python3-default-version-in-ubuntu). The python scripts in this project is written using Python 3.9.

### Local 
To run the project locally, use `python run_script.py -la` and point the postman collection against the supplied local-host URL (normally it is just localhost).
This action includes:
- Generate routes for the API
- Compile Typescript code
- Test Typescript code
- Deploy server locally

To read all available options, please use `python run_script.py --help` or `python run_script.py -h`

### Deploy to production (Heroku container)
To deploy the solution to production, which resides on Heroku container, use `python run_script.py -pa`. This action is the same as deploying solution locally but instead of using a local server, Heroku container over the internet holds the server and serves the complete solution on there.

## Tests
To run the test suite, use `python run_script.py -lc -lt` or `python run_script.py -pc -pt`. As to what the command do, `-lc` and `-pc` flags compile the application and `-lt` and `-pt` flags test the compiled solution

## Consumers
Front-End: https://github.com/asd135hp/LIDA-UI