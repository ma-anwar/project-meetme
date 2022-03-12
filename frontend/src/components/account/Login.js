import './Login.css';
import { useRef, useState } from "react";
import { Container, Grid, Paper, TextField, Button, Typography } from '@mui/material';

export function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  //state = {username, password};

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
        email: emailRef.current.value,
        password: passwordRef.current.value, 
    }
    console.log(user);
    e.target.reset();
  };
  
  return (
    <div>
    <Container className="LoginForm__container">
        <Grid >
            <Paper elevation={4}>
                <Typography className="LoginForm__title">Sign in</Typography>
                <form className="LoginForm" onSubmit={handleSubmit}>
                  <TextField className="LoginForm__item-content" placeholder="Enter your email" name="email" required ref={emailRef} />
                  <TextField className="LoginForm__item-content" placeholder="Enter your password" name="password" required ref={passwordRef}/>
                  <Button className="LoginForm_btn" type="submit" variant="contained">Log in</Button>
                  <Typography variant="body2" className="LoginForm__signup">Don't have an account?<a href="/signup">Signup</a></Typography>
                </form>
            </Paper>
        </Grid>
    </Container>
  </div>
  

  );
}