# Setup Instructions

If using docker then `docker-compose up --build -d` for the first time, by default server will run on `localhost:5000`.
To view the backend logs, `docker-compose logs --tail=all -f backend`
Else,

1. Install [mongodb](https://docs.mongodb.com/manual/installation/) and make sure it's running
2. Install and ensure redis is running (default port should be 6379).
3. `touch .env` in the root dir and configure as follows

```
DB_URL="mongodb://localhost:27017/<custom_name>"
SESSION_SECRET="MY_SECRET"
```

Optionally a port can be specified, `PORT=<####>`.

3. `npm install`
4. `npm run dev`

Please inform me of any issues or if instructions are incomplete.

# Sample Queries

Postman can be used to execute gql queries.

Apollo explorer can be accessed at `http://localhost:3000/graphql` and can provide a better UX when debugging queries. Using it involves a bit of a hack due to the fact that the GQL api is protected behind an auth layer. Essentially we want to modify our headers to send the session cookie along with out gql requests.

To use explorer, do as follows:

1. Search for and install the `modheader` extension for chrome/firefox.
2. Use Postman to make a login request. Click the headers and copy the cookie key and value into the headers in modheader.
3. Now you should be able to access the gql endpoint and make queries.

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
