import React, { useReducer, createContext, useEffect, useState } from "react";
import { AuthReducer } from "./AuthReducer";
import { AsyncStorage } from "react-native";
const INTIAL_STATE = {
  user: null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INTIAL_STATE);
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INTIAL_STATE);
  const setUser = async (isMounted) => {
    try {
      (await isMounted) &&
        (await AsyncStorage.setItem("user", JSON.stringify(state.user)));
      isMounted = false;
    } catch (err) {}
  };
  useEffect(() => {
    let isMounted = true;

    setUser(isMounted).then(() => (isMounted = false));

    return () => (isMounted = false);
  }, [state.user]);
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
