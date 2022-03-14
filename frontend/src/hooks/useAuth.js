import React, { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { GET_ME } from '../graphql/queries';
import { useQuery } from '@apollo/client';
// adapted from https://www.jeffedmondson.dev/blog/react-protected-routes/
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const { loading, error, data } = useQuery(GET_ME);

  useEffect(() => {
    if (data) {
      setLoggedIn(true);
      //TODO: Set usename and email so it can be access globally or just unpack data
    }
    if (error) {
      setLoggedIn(false);
    }
  }, [loading, data, error]);

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
    <AuthContext.Provider value={{ loggedIn, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
