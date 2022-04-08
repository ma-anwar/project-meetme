/* Auth Provider - (https://www.jeffedmondson.dev/blog/react-protected-routes/) */

import React, { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { GET_ME } from '../graphql/queries';
import { useQuery } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { API } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, data, refetch } = useQuery(GET_ME, {
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
      setUserProfile(data.me);
      setAuthReady(true);
      setLoggedIn(true);
    } else if (error) {
      setAuthReady(true);
    }
  }, [data, error]);

  const logout = async () => {
    try {
      await axios.post(`${API}/api/auth/signout`);
      setLoggedIn(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        setLoggedIn,
        loggedIn,
        logout,
        authReady,
        userProfile,
        redirect,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
