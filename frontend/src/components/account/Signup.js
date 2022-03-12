import './Signup.css';
import { useRef, useState } from "react";
import axios from "axios";
import { Container, Grid, Paper, TextField, Button, Typography } from '@mui/material';

export function SignupForm() {

  const [user, setUser] = useState("")

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value, 
        confirmPassword: confirmPasswordRef.current.value,
    }
    axios.post('/signup', newUser)
        .then((res) => {
            console.log(res.data)
            setUser(res.data)
        }).catch((error) => {
            console.log(error)
        });
    
    console.log(newUser);
    e.target.reset();
  };
  
  return (
    <div>
    <Container className="SignupForm__container">
        <Grid >
            <Paper elevation={4}>
                <Typography className="SignupForm__title">Create an account</Typography>
                <form className="SignupForm" onSubmit={handleSubmit}>
                    <TextField className="SignupForm__item-content" placeholder="Username" name="user_name" required ref={usernameRef}/>
                    <TextField className="SignupForm__item-content" placeholder="Email" name="user_email" required ref={emailRef}/>
                    <TextField className="SignupForm__item-content" placeholder="Password" name="user_pass" required ref={passwordRef}/>
                    <TextField className="SignupForm__item-content" placeholder="Confirm Password" name="user_password" required ref={confirmPasswordRef}/>
                    <Button className="SignupForm_btn" type="submit" variant="contained">Sign up</Button>
                    <Typography variant="body2" className="SignupForm__login">Already registered?<a href="/login">Login</a></Typography>
                </form>
            </Paper>
        </Grid>
    </Container>
    </div>
  );
}