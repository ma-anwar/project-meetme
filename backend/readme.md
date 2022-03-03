#Setup Instructions

1. Install [mongodb](https://docs.mongodb.com/manual/installation/) and make sure it's running
2. `touch .env` in the root dir and configure as follows `DB_URL="mongodb://localhost:27017/<custom_name>"`
3. `npm install`
4. `npm run dev`

Please inform me of any issues or if instructions are incomplete.

#Sample Queries
After visiting Apollo studio at `http://localhost:3000/graphql`, queries can be executed as follows,

To sign a user up,

```
mutation {
  signUp(username: "Hellen", email: "email", password: "mercutio"){
    id,
    email,
    username

  }
}
```

To view all users,

```
query getAllUsers {
  users{
    id,
    username,
    email
  }
}
```
