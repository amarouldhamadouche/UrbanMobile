export const LoginStart = (userCrendetial) => ({
  type: "LOGIN_START",
});
export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
});
export const Update = (updatedUser) => ({
  type: "UPDATE",
  payload: updatedUser,
});
export const UpdateCar = (updatedUser) => ({
  type: "UPDATE_CAR",
  payload: updatedUser,
});
export const Logout = () => ({
  type: "LOGOUT",
});
