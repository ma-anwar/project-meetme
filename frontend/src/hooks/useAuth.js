import React, { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { GET_ME } from '../graphql/queries';
import { useQuery } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';

// adapted from https://www.jeffedmondson.dev/blog/react-protected-routes/
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, data } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
  });

  const redirect = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate('/profile');
    }
  };

  useEffect(() => {
    if (data) {
      setAuthReady(true);
      setLoggedIn(true);
      console.log(data.me);
      setUserProfile(data.me);
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
      redirect();
    } catch (err) {
      setLoggedIn(false);
      console.error(err);
    }
  };

  const login = async (email, password) => {
    try {
      const resp = await axios.post('/api/auth/login', { email, password });
      setLoggedIn(true);
      redirect();
    } catch (err) {
      setLoggedIn(false);
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/signout');
      setLoggedIn(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        login,
        logout,
        signup,
        authReady,
        userProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
