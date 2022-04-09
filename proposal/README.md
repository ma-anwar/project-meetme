# CSCC09 Project Proposal

## Title
MeetMe

## Web Application
Have you ever struggled to book appointments with multiple people and keep track of them? Well, look no further. MeetMe is an application that allows users to create calendars and book appointments with other users. When it's time to meet, simply click the link to join the video call.

## Key Features (Beta Version)
- Users will be able to sign up and signin/signout
- Users will be able to create a profile
- Users will be able to view their profile
- Users will be able to create a calendar
- Users will be able to select dates and setup time slots
- Users will be able to access another user's calendar
- Users will be able to book a timeslot
- Users will be able to cancel a booking

## Additional Features (Final Version)
- Users will get live updates of bookings
- A booking generates a link for video calling
- Users will be able to join/end a video call with another user

## Technology Stack

**Frontend:** The fronted ui will be built using ReactJS. We will be using other JS libraries (such as Material-ui as our component library), adding them in as required during development.

**Backend:** The backend will be built using NodeJS along with either express-graphql or a suitable graphql server such as Apollo. For the database, we will use MongoDB.

**Development/Deployment:** For development and deployment we will containerize the application using Docker. We will tentatively deploy it to an EC2 instance, pending further research and understanding of deployment.

## Technical Challenges
- **React:** The team has little to no experience with React. As such, we will be learning it along the way.
- **Video Calling:** This concept (implementation) is entirely new to us, so we will be doing some research to figure out which approach we wish to use and how to go about it. This will also require us to learn about websockets/sockets and understand continuous communication.
- **Graphql Subscriptions:** We will learn how to create a Graphql subscription server so that data on our calendar can be displayed in real time.
- **Understanding Libraries:** We will learn about MongoDB schema design, frontend/backend libraries and how to integrate all these technologies together.
- **Containerization/Deployment:** We will learn how to containerize the application for a development and production environment.

## Team Members
- Mahdiya Wazir
- Mohammad Anwar
