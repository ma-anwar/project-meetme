import React, { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { GET_ME } from '../graphql/queries';
import { useQuery } from '@apollo/client';
// adapted from https://www.jeffedmondson.dev/blog/react-protected-routes/
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [userProfile, setUserProfile] = useState();

  const { loading, error, data } = useQuery(GET_ME);

  useEffect(() => {
    if (data) {
      setAuthReady(true);
      setLoggedIn(true);
      const { username, email } = data.me;
      setUserProfile({ username, email });
    } else if (error) {
      setAuthReady(true);
    }
  }, [data, error]);

  const signup = async (username, email, password) => {
    try {
      const resp = await axios.post('/api/auth/signup', {
        username,
        email,
        password,
      });
      setLoggedIn(true);
    } catch (err) {
      setLoggedIn(false);
      console.error(err);
    }
  };

  const login = async (email, password) => {
    try {
      const resp = await axios.post('/api/auth/login', { email, password });
      setLoggedIn(true);
      console.log(resp);
    } catch (err) {
      setLoggedIn(false);
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      const resp = await axios.post('/api/auth/signout');
      setLoggedIn(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, login, logout, signup, authReady, userProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
