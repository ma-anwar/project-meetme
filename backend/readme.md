# Setup Instructions

If using docker then `docker-compose up`, by default server will run on `localhost:5000`.

Else,

1. Install [mongodb](https://docs.mongodb.com/manual/installation/) and make sure it's running
2. `touch .env` in the root dir and configure as follows

```
DB_URL="mongodb://localhost:27017/<custom_name>"
SESSION_SECRET="MY_SECRET"
```

Optionally a port can be specified, `PORT=<####>`.

3. `npm install`
4. `npm run dev`

Please inform me of any issues or if instructions are incomplete.

# Sample Queries

Use Postman to execute graphql queries for now.

Apollo studio can be accessed at `http://localhost:3000/graphql`, but isn't working due to CORS issues right now.

Queries can be executed as follows,

To sign a user up,

```
mutation {
  signUp(username: "Hellen", email: "email", password: "mercutio"){
    _id,
    email,
    username

  }
}
```

To view current users' saved info after logging in,

```
query me {
  me{
    _id,
    username,
    email
  }
}
```
