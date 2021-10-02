# OREN DEMO-FOOD-DELIVERY-APP
This application is built using NodeJS. Mongo DB is used for data persistence. Mongoose driver is used to interact with
MongoDB collection through NodeJS code. 

## Running the Application locally:

1. Install node and Robo3t
2. Clone this repo
3. cd to code repo, and run `npm install`, to install the dependencies
4. run `npm start` to run the application
5. To run in dev mode, run `npm run dev`

## Code Structure

1. src/app.js is the entry point for the application
2. To find all the supported APIs, check routers/api.js
3. The api.js file will redirect to relevant controller files under controllers/ folder
4. models/ folder includes all the Schema. There are 4 major collections.
    * MenuItem
    * CartItem
    * Order
    * User

## Core Functionalities

1. New users can register
2. A registered user can login
3. A logged in user can get the menu
4. A logged in user can add the item on menu to his cart, he can also increase or decrease the item on his cart
5. A logged in user can proceed to checkout the order in his cart
6. At checkout he will make the payment
7. After successful payment he will get the confirmation email on his registered email.


