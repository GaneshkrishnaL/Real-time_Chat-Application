# Real-time_Chat-Application
minimal chat application on google cloud
# Chat application

## Service/application overview

We'll be building a chat application for daily use.

A user can access the application by logging into it using their Gmail credentials. On successful login, the user can search for another using using the search field, add him or her to their friendlist and then start chatting on right away.

## Components used

1. AppEngine
2. Google Authentication Provider
3. Cloud Functions
4. Cloud Storage/Firestore
5. Cloud Messaging

## Architecture

We'll be using a Model-View-Controller or MVC architecture for our application. This architecture is based on seperation of concerns in the field of product development. Here Model is the primary element of the pattern. It is the dynamic data structure of the application, apart from the user interface. It directly controls the application's data, logic, and rules. View refers to what the end user sees as a result of an action triggered by the Controller. The Controller controls both the View and the Model.

In terms of our chat application, when a user sends a message to someone, a cloud function is triggered which processes the message, stores it to the Cloud storage for persistence of data for future retrieval. We're yet to decide whether we'll use cloud storage or firestore, but it'll be either of these two. On triggering the cloud function, the Cloud messaging platform would trigger and send a notification to the receiving end user that he or she has received a message. The cloud messaging platform would work even when the application isn't open. Finally, we'd host the web application using AppEngine for public consumption.

## Design

We'll be using Node.js and Express.js for creating the cloud functions. For the frontend view, we'll be using React.js.

A user needs to be authenticated to use the application. This will be done using Google Authentication Provider. After the user is authenticated, he or she can search for a user and add him or her to the particular's friend list. When a message is entered into a text field and submitted, a POST request is sent to the cloud function that a message is being sent. The cloud function processes the message and feeds the required output to both the sender and receiver.

The primary function in the frontend is the friend list section, the messaging section which would contain the messaging textfield and previous messages that are fed from the data persisted in the cloud storage. The primary functions in the backend is to process the message, trigger the required services, store the data for future retrieval, etc.

A brief description of the above mentioned libraries and frameworks are briefly illustrated as follows:

1. Node.js
   Scalable network applications can be created using Node.js, an open-source, cross-platform JavaScript runtime environment that runs on a JavaScript Engine and executes JavaScript code outside of a web browser.

2. Express.js
   Express is a Node.js back end web application framework for creating RESTful APIs. It is made to be used in the creation of APIs and online applications. This server framework for Node.js has been referred to as the de facto standard.

3. React.js
   React is a front-end JavaScript toolkit that is free and open-source for creating user interfaces based on UI components. It is maintained by Facebook and a group of independent programmers and businesses.

4. TailwindCSS
   Tailwind CSS is a utility-first CSS framework for quickly creating unique user experiences. It is a low-level CSS framework that is extremely adaptable and provides all the building blocks required to create custom designs without requiring you to struggle to overcome obnoxious opinionated styles.

5. Google Authentication Provider
   This is Google's officially supported node.js client library for using OAuth 2.0 authorization and authentication with Google APIs.

6. Cloud Function
   Using Cloud Functions, developers can write standalone, single-purpose functions that react to cloud events without having to manage a server or runtime environment.

7. Cloud Storage
   Data can be stored and accessed on the Google Cloud Platform infrastructure using Google Cloud Storage, a RESTful online file storage web service. The service combines cutting-edge security and sharing features with the performance and scalability of Google's cloud.

8. Cloud Messaging
   We can send and receive messages and notifications for free on iOS, Android, and the web using Cloud Messaging, which offers a dependable and power-efficient connection between server and devices.

## Implementation

Firstly we'll implement the frontend UI part using React.js and TailwindCSS. Secondly, we'll implement the Google authentication. After that we'll program the cloud function and integrate it with the frontend and test the integration. On successful integration, we'll further integrate the data persistence layer and the cloud messaging component based on our plan of action for the project.

We'll be using Slack and Trello for listing out requirements and deadlines for each section of the project. These two applications work hand in hand and would help all the group members to be on the same page while we're developing the application.

## Test plan

We'll roll out the test version by hosting our application using the AppEngine. The application can be accessed by any user who has the URL for the application.

## Future plans

If everything goes well and if we have time to integrate other services, we further plan to integrate other services like end to end encryption of messages, support for media, etc.
