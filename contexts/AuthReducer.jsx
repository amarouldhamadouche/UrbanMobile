export const AuthReducer = (state, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetshing: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetshing: false,
        error: false,
      };

    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "UPDATE":
      return {
        ...state,
        user: {
          ...state.user,
          first_name: action.payload._parts[0][1],
          last_name: action.payload._parts[1][1],
          phone: action.payload._parts[2][1],
        },
      };
    case "UPDATE_CAR":
      return {
        ...state,
        user: {
          ...state.user,
          car_brand: action.payload._parts[0][1],
          car_type: action.payload._parts[1][1],
          car_year: action.payload._parts[2][1],
        },
      };
    case "CREATE_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "CREATE_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "CREATE_FAILE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "UPLOAD":
      return {
        ...state,
        user: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
  }
};
