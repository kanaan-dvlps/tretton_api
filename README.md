# Tretton Test API

#### .env file
In order to run the application you need to provide the application with a **.env** file, please copy the ```.env.example``` file and except the database set any variable you want to run the application with.

If you're using linux you can use comand below to copy the .env.example file to a .env file (with this command you don't need to create the .env file the command will take care of everything).

```
cp .env.example .env
```

- **NOTE:** The app will run on port 9000, if this port is occupied by any other processes please feel free to change it.

#### Run the app
The application is fully containerized and you can use ```docker-compose build``` and then ```docker-compose up -d``` for **detached mode** and also ```docker-compose up``` to see everything on the **foreground**
You can use ```docker ps -a``` to get the **ID** of the service and then using that ID you can see the logs of the application using the ```docker logs -f <service_id>``` the ```-f``` flag is used to see the logs **continuously**.

You can see the logs of all the docker-compose you're running by using the ```docker-compose logs```.
Use the ```--tail``` linux terminal flag followed by the number of latest logs you want to see in order to limit the number of logs you're seening: ```docker logs --tail 100 <container_id>```.

**NOTE:** If you take a look at the docker-compose that I've made, the instruction bellow the backend service might catch your eye and say why has he done that:

```
volumes:
        - .:/app
```

So this is one of the work arounds that you can chnage your local files and then inside of your container you have the changes without having to rebuild and restart your container(s).

I've tried my best to use all the best practices that I know and learned during this second round.
In this file there are couple of best practices to be mentioned for the sake of documentation and also the test itself.

**befor we get started with our ```Dockerfile``` and ```docker-compose.yml``` we need to explain some important parts of the infrastructure that we've setup for running our app**

**Run your Dockerfile in two stages**
- **First stage**
- would be the main image that we will create our dependencies and ``package.json`` file.
- We will then remove our ``.npmrc`` file for the sake of the security issues, this topic is really vast and long but to mention it very quickly, there are dependencies that npm runtime would need to run and also node.js as well in order to keep these running and if anyone can get their hands to it they are able to do bad stuff with our code, so we will remove it after we're done creating our dependencies.
- Using npm ci instead of npm install allows you to install only your production dependencies and avoid installing dev dependencies in your container.
- **Second Stage**
- It's good practice to not use un specified images like ```FROM node``` or ```FROM node:latest``` you don't know what will break every time you restart your application so you need to specify your version of your image as well as the digest of it which you can find in the detail of the tag you're using in docker hub like: ```FROM node:lts-alpine@sha256:777b5a7bf0c40e37766ff8df382c900f16c688ed05ae3a72d32a26f3e9002cf9```
- In this stage which is our main step we will use this stage to run our container on it.
- **What is dumb-init**:
When we run our Node.js container they get PID of 1, these are operating layer IDs and when you give the responsibilities of PID of 1 not only to containerized Node.js applications but almost every other labguages as well they act strangly since they are not ment to handle these operations.
in order to stop this strange behaviors and have a properly running Node.js application in our container(s) we'd want to wrap them into something like dumb-init, tini or equivalent process supervisors and init systems to run with PID 1.
- Changing the user to Node, when we containerize a Node.js application it creates a user by defualt inside of the container and if someone get's into the container and our container is running on its default user which is root, they can do what ever they want, however, by changing the user to the default user of the container any instruction that is using root privilages would not be possible.
in order to run our own commands with Node user that we have now we need to use ```chown``` to change the privilages of the command we're running.

- In order to be able to recive the runtime signals via Node.js applications and gracefully kill any running process instead of suddenly stopping it, which who knows what happens when this happens, we need to handle our signals. inside the ```server.js``` file we have our ```process``` and then using the ```.on()``` function we'll handle our signals, however we need to handle the signals in our docker-compose file as well. this part is again deep enough to go through in greater detail.

## Modules
#### server.js
- This module is our main file to run the server.
- This file is running the server and is listening for the **signals** that come from the runtime. 
- Handling our routes and middlewares

#### Models
This folder consists of our data model(s)/schema(s) for MongoDB. in this test we only had one enity hence we have only one Schema file called **```CoworkersSchema.js```**.

#### Routes
This folder is responsible for our routes and API(s).
- **```getCoworkers.js```:**
This module will get all of our coworkers, in this module we will call our ```fetcher()``` function in order to invoke the scrapper and also update the database, then we will show all the coworkers in response.

- **```getCoworker.js```:**
This module will get only one entity of coworkers passing the id as a query parameter. This API needs authentication as asked in the **Test Description**. You need to first head over to the ```login.js``` module to get your token.

- **```editCoworker.js```:**
This module is used to edit the entities. You need to send the entity's id as url parametes and then edit the ```name```, ```city```, ```text``` fields of the user. these three are required as well.

- **```login.js```:**
This module is responsible for creating your token. You have to send a **username** to the body as **application/json** format and you'll receive your token.

#### Helpers
**```scraper.js```:**
This module is responsible for:
- ```fetcher()```: Calling the tretton's URL.
- ```scrapper()```: Using Cheerio to clear the HTML DOM and create array of objects.
- ```databaseManager()```: Save the array of objects into MongoDB database using the ```insertMany()``` method. This module will check if the array of objects length is bigger than the count of entities in our database it will update the whole database and also if the database is empty it will save the array of objects into our database.

**```textScrapper.js```:**
In our HTML data that we're scrapping in our ```scraper.js``` module, we have a test field, the text field consists of a link for every coworkers' personal page, we need to create an array of arrays that each array consists of couple of these links to break down the data into smaller chunks and then call each link and scrap the test inside it. however this module doesn't work but in orther to show the mindset and logical process of the code I've kept this. This process definitly needs to be async and done in the background, however we would like to see the data available so there might be more to it than just breaking it to chunks.

**```token.js```:**
This module creates our JWT tokens.

#### Middleware
**```JWT.js```:**
This middleware module is responsible for authenticating our routes, when we use the ```veryfyToken()``` function in our routes it'll look for the token, if it's not available it'll send an error to user that the token is required.

#### Unit Test
I've used Jest to create unit tests, I've tested my scrapper function since I need to test that if the data I'm looking for is being scrapped via axios and then the currect type of data is inserted to the database.

## Technologies
- Node.js
- MongoDB (database)
- mongoose (ODM)
- Jest (TDD)
- JWT (authentication)
- axios (to request to other APIs)
- Joi (to validate entry data)
- body-parser
- docker and docker-compose
------------------------------------
- you can checkout the package.json file for more info about the project
