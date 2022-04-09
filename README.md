# MeetMe

## manwar.dev

**Task:** Provide the link to your deployed application. Please make sure the link works.

https://manwar.dev/

## Project Video URL

**Task:** Provide the link to your youtube video. Please make sure the link works.

https://www.youtube.com/watch?v=mkgOWZjPg5w

## Project Description

**Task:** Provide a detailed description of your app

MeetMe is an event scheduling application that allows you to book meetings with others. In particular, a user can create an event for a certain date range and identify what times they are available for meetings.

They can then share the link to the calendar with anyone else and after signing up, others can book meeting slots with the owner of the calendar. At the designated meeting time, both users can join a video call room to have their meeting 🎉.

## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used.

In general our app uses a React frontend that communicates with multiple servers on the backend.

### Frontend

We built the frontend using functional react components relying on Material-ui for the base components in Javascript.

At a highlevel, our React app is organized into multiple routes, all of which have access to an Auth provider component that provides global state related to auth. The Auth provider uses Axios to make REST requests to the auth layer in our backend.

We made extensive use of React Router. We used the router to protect routes that should only be accessible by authorized users and to handle redirects. I.e. when a user tries to access a page but are not signed in, they will be redirected to signin. Upon signing in, they will once again be redirected to the page they originally intended to visit. We also used the router to handle edge cases such as trying to access pages that do not exist.

The main routes of our app are the auth-routes, profile route, event creation, calendar route and video call route.

In all of these routes apart from the auth routes, we use Apollo client to query our backend graphql endpoint.

#### Auth

We only have a login and signup route. Logout is simply a button in our navbar that calls our API to destroy our current session. The login and signup routes make use of functions exposed by the auth provider component to make login and signup related api calls.

#### Profile

The profile route displays a paginated list of events that a user has created. It allows for navigation to those events, deletion of events and navigation to the create event page.

#### Event Creation

The event creation route displays a form that allows users to create events and redirects to the calendar route upon successful creation.

#### Calendar

The calendar route is one of the most complex routes of the app. This route displays a calendar representing the event.

There are two points of view, the owner view and the booker view. For an owner, the calendar allows them to create timeslots that other's can book and delete timeslots. They can also view all of their timeslots (booked and unbooked). For a booker, the calendar allows them to view unbooked timeslots, book timeslots, and unbook timeslots.

We used React-Big-Calendar for the calendar component. This component exposes an extensive API to customize the calendar to our needs.

We used some of the following functionality from the API exposed by the calendar.

Localizer - This applies formatting to the dates on our calendar. Our localizer is based off of the dataFnsLocalizer.

Views - This allowed us to show different calendar views, such as week view and day view. It also allowed us to restrict unwanted views, such as month view.

Selectable - This allowed us to create timeslots by dragging down and getting the slot info by clicking on it.

OnRangeChange - This is callback exposed by the API. This allowed us to change what was being queried and shown to the user based on the range of dates they navigated to on the calendar.

We implemented a unique pagination technique (to be detailed in challenges). We paginated results by the week or day currently being viewed in the calendar. At the same time, the component opens a websocket connection to allow getting live updates on any CRUD operations related to the timeslots being displayed on the calendar.

Date-Fns - This is the date library that we used. It is modular so we could selectively import only the functions we need. It also takes care of timezones and Daylight Savings.

#### Video Calls

The video call routes can be reached from the event calendar. When it is near time for a booked meeting, users will be able to join a video call by viewing the slot info and clicking the button.

For the video-calling itself, we have utilized PeerJS. PeerJS is a WebRTC framework that handles ICE and signalling logic, allowing peer-to-peer connections. Two peers connect to each other via a peerId. As such, the video call route makes requests to two backend servers. One is a signalling server, PeerServer, and the other is our graphql server. We created our own PeerServer to supply us with a peerId as requested. This peerId is then stored in our timeslot information on the backend so that the other user has access to it in order to begin the video call. In this way, the video call route makes requests to the graphql server to get and update the current timeslot information.

### Backend

Our backend is composed of multiple servers as below.

- Express-Graphql
- Redis
- PeerServer
- Mongo

#### Express-Graphql Server

The main server on our backend is an Express-Graphql server using Apollo Graphql written in Javascript. Apollo Server allows us to expose an underlying Express server which we used to mount our Graphql endpoint as well as our auth related endpoints as REST routes.

##### Models

The backbone of the server is the models that represent our data as it is stored in MongoDB. We use Mongoose to manage our model schemas and logic. We attempted as much as possible to keep business logic in the model layer. This can be seen in the User and Timeslot models as well as the Event model to some extent.

#### Routes

##### REST

Our REST routes are only used for signup, login and signout. We use express-validator to validate incoming requests and bcrypt to hash passwords. In general, the routes are architected so that validation is handled during routing and then the router hands off requests to the auth controller to handle. The auth controller uses the User model to handle user creation and also handles session management.

##### Session Management

We use express-session for session management. Sessions are stored in a Redis instance, further details of which are provided in the Redis section. However, for this server, we use auth middleware to protect our graphql endpoint. The graphql endpoint cannot be accessed if the incoming request does not have a valid session.

We architected it this way so that we could protect the whole graphql layer of our application behind auth. The advantage of this is that every query or mutation in our graphql layer always has access to data about the user that is making the request. This data is available in the context parameter that is passed along to any resolver. This was very useful for validation.

##### Graphql

The graphql endpoint handles the majority of requests made to the server. This layer is split into largely two parts. Schemas and resolvers.

Our schemas are very closely tied to our models and define the inputs and outputs to be expected on the client side.
The resolvers implement the queries, mutations and subscriptions specified in the schema. Our resolver layer largely makes use of the model layer to service requests. Some validation was handled through Yup. We also made use of date-fns and lodash on the backend for utility.

The most complex resolvers are the timeslot resolvers. These resolvers publish actions to dynamically generated redis topics that are used to service subscriptions and allow for clients to get live updates for any events. Further details in the challenges section.

#### Redis

Redis is used for session management and for pub sub channels that allow us to implement graphql subscriptions.

Using Redis for session management allows us to have multiple servers rely on the same session information without having to implement auth themselves.

#### PeerServer

We run an instance of PeerServer provided by PeerJS to handle signalling for P2P video. The server runs on top of an Express app. It is also hidden behind our auth layer as it connects to Redis to access current session information.

## Deployment

**Task:** Explain how you have deployed your application.

We configured a front facing nginx proxy on our vps that redirects all traffic to another nginx server that is managed by Docker. This allows us to take advantage of Docker's networking features. The external proxy decrypts all HTTPS traffic so that our internal servers can work on HTTP.

SSL is managed by certbot and was configued using Lets-Encrypt. We are running a cron job to automatically renew the certificates using certbot.

The internal nginx server routes traffic to either the backend graphql server, our peerServer or our frontend depending on the prefix of the request.

We also have a Redis instance and MongoDB instance running in the Docker network. These servers do not expose any port to the outside world and are only accessible inside the docker network for security.

## Maintenance

**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.

We use htop running on the server to monitor the deployed app and ensure no intense resource usage is ongoing. Furthermore, we have a live tail of the logs that shows us if anything goes wrong or fails suddenly.

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for your app? Please restrict your answer to only three items.

### Video Calling

This concept was entirely new to us, so we had to start off by researching our options and understanding the advantages/disadvantages of each. The nature of PeerJS abstracting away the ICE and signalling logic made it an appealing option. However, as we went down this route, we realized PeerJS had some of its own issues. Their public server was down because it was cracked into by a botnet looking at resource monitors [[reference](https://github.com/peers/peerjs/issues/937)]. The maintainer also decided to move on from this project which meant the server was down for quite a while. As such, we had to configure our own PeerServer.

Getting the PeerServer initially running on our own VPS was difficult. To speed up development speed, we set up a Heroku instance of PeerServer that was used for testing. After a lot of trial and error we were able to configure an Express app to run as part of our deployment to host the PeerServer. One of the key findings that led to this solution was realizing that we had to upgrade the socket connection in both the front facing proxy and the internal proxy that was running inside a docker container. Finally we connected this server to the same auth sessions as our graphql server by connecting it to the shared redis instance.

Thereafter, as we were utilizing some of the PeerJS functionality, we realized some things were broken. They had issues open on github that were unresolved. In particular, the server would not emit the close event, which was an open issue. So we had to come up with our own way of figuring out when a peer had disconnected from the call. We ended up communicating this information through our graphql api, in order for the other peer to realize the call has been ended.

Another difficulty with video calling was synchronizing the requests and making the code execute in a specific order. PeerJS relies on you to come up with your own way of communicating the other user's peerId. This meant that we had to ensure one user joined the video call before the other, so their generated peerId could be communicated to the other. In particular, we set it up so that the booker would join the room first. This way their peerId was generated and stored in the timeslot information in the backend. Thereafter, the owner would be able to join the room. However, even after the owner joined the room, before being able to connect with the booker, they needed to first create their own peerId and then get the booker's peerId. Having the video call start automatically when the owner joined the room caused issues in this regard. In particular, the owner would sometimes get the booker's peerId and try connecting before creating it's own peerId. So we added a button in the video room for the owner to begin the call. This ensured the owner had created a peerId first, and then successfully retrieved the booker's peerId from the backend before trying to connect.

In a similar way, we had issues with ending the call. When one user ends the call, that information is stored in the backend and communicated to the other user via the timeslot information. We were originally communicated this through the peerId variable, however that caused issues with being able to reuse timeslot video calls. Again, PeerJS would not emit the close event, so we created another variable just to tell whether a call was ended, and if so also reset the peerId variable. This way, the next time the call was started up, there would be no issues of trying to connect to a previous or unknown peerId.

### Subscriptions & Pagination

Another challenge we wanted to tackle was offering users live updates of the calendar as it was modified by other users. The scenario we had in mind was if multiple users were attempting to book meetings on one calendar at the same time. They should recieve immediate feedback on the state of a slot.

To do so, we implemented Graphql subscription on the backend. This involved idenitfying what queries should offer updates to users. Whenever such a query was executed it would publish an object containing the event (type of query) that took place and the timeslot related to the event.

On the server side, we made all such publishing dynamic with respect to the context of the event that the query was being made for. That is, any timeslot related event was always published to a topic for that specific event. This way clients would not get updates for events that they were not viewing.

Finally we configured the client to open a graphql subscription. We uniquely configured the Apollo link to switch between the graphql post endpoint and the websocket endpoint depending on the request being made. Then we added client side logic to react accordingly to different event types published on the server. I.e. if a timeslot is created, then the current state of timeslots needs to be added to. If it's deleted then we should delete it, etc.

### Deployment

One large challenge was setting up deployment for a prod and dev environment for seamless testing. We made multiple different design choices related to this. Firstly we set up a docker-compose file for our dev environment and a separate one for our prod environment. Then we configured the prod environment to run with a Watchtower container. The container would check if Docker hub had a new image and in that case it would update the running containers in our prod application.

Originally the Watchtower container would check every few minutes. It was essentialy polling Dockerhub. We wanted it to update the images immediately once a new image was pushed to our repo. To solve this we configured the container to expose an endpoint that we could make a secure request to after our build scripts had finished running. Hitting the endpoint triggers the container to check Dockerhub and update the running containers. We only did this for our Frontend React server and our backend Graphql Server. This allowed us to have extremely fast end-to-end testing of our new images straight in prod.

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).

Mahdiya Wazir & Mohammad Anwar

Given our group was a pair, we chose to divide up the work by having one person focus on the backend and the other on frontend. This however does not mean that we only worked on one end, it was just our focus. We supported each other on both ends, making sure everything was working and had the required components. By the time we finished the beta version, there were two main things to do, namely video calling and deployment. One of us took on deployment while the other figured out video calling. Throughout the process, we discussed our plans and next steps with each other, making sure we were both aware of what was going on. We also helped each other out in the debugging process, by way of pair programming.

# One more thing?

**Task:** Any additional comment you want to share with the course staff?

Mohammad:
I think the third homework assignment should have been the react lab, maybe with a backend provided to us. This would give more opportunity to learn React as picking up React was/is not trivial compared to the work that we did in class.

Mahdiya: I learned a lot through this course, however I agree with Mohammad. The leap from the labs/homeworks to the project was very big and made it difficult to figure out how to start.
