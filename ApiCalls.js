const axios = require("axios").default;

import * as Notifications from "expo-notifications";
import { ToastAndroid } from "react-native";
import firebase from "firebase";
export const scheduleArriveNotification = async (
  h,
  min,
  day,
  month,
  d,
  distance,
  user
) => {
  var hour;
  var minute;
  var x = Math.floor(distance / 100000);
  hour = h + x;
  var xx = distance % 100000;
  if (xx !== 0) {
    var y = 100000 / xx;
    var yy = Math.floor(60 / y);

    var minute1 = min + yy;
    if (minute1 >= 60) {
      hour = hour + Math.floor(minute1 / 60);
      minute = minute1 % 60;
    } else {
      minute = minute1;
    }
  } else {
    minute = min;
  }
  console.log("dis", distance);
  console.log("hh", hour);
  console.log("month", month);
  console.log("min", minute);
  console.log('day',day)
  var id1;
  try {
    id1 = await Notifications.scheduleNotificationAsync({
      content: {
        sound: true,
        title: `s'il vous plait laisser-nous savoir si vous avez atteint votre destination`,
        data: {
          trajet: d,
          type: 8,
          recipientId: user.user,
        },
      },
      trigger: {
        day: day,
        month: month - 1,
        hour: hour,
        minute: minute + 1,
        repeats: true,
      },
    });
  } catch (err) {
  }
  firebase
    .database()
    .ref(`scheduleNotificationsId/`)
    .child(`arriver${d.id}`)
    .update({ id: id1 });
  return id1;
};
export const UpdateScheduleNotification = async (trajet, user) => {
  try {
    const resp = await axios.get(
      `https://urban-online.herokuapp.com/api/trips/${trajet.id}/` 
    );
    const d = new Date(resp.data.start_time);
    var h = d.getHours() == 0 ? 23 : d.getHours() - 1;
    var min = d.getMinutes();
    var month = d.getMonth() + 1;
    var day = d.getDate()  ;
    SchedulePushNotification(h, min, day, month, trajet, user);
  } catch (err) {}
};
export const SchedulePushNotification = async (h, min, day, month, d, user) => {
  var hour;
  var minute;
  if (min >= 0 && min <= 5) {
    minute = 50;
    if (h - 1 == -1) {
      hour = 23;
    } else {
      hour = h - 1;
    }
  } else if (min > 5 && min <= 10) {
    minute = 55;
    if (h - 1 == -1) {
      hour = 23;
    } else {
      hour = h - 1;
    }
  } else if (min > 10 && min <= 15) {
    minute = 0;
    hour = h;
  } else {
    minute = min - 15;
    hour = h;
  }
console.log(hour,minute,day,month)
  var id;
  try {
    id = await Notifications.scheduleNotificationAsync({
      content: {
        sound: true,
        title: `il rest 15 min pour trajer`,
        data: {
          trajet: d,
          type: 7,
          recipientId: user.user,
        },
      },
      trigger: {
        day: day,
        month: month - 1,
        hour: hour,
        minute: minute + 1,
        repeats: true,
      },
    });
  } catch (err) {
  }
  user.car_brand
    ? firebase
        .database()
        .ref(`scheduleNotificationsId/`)
        .child(`reveille${d.id}`)
        .update({ id: id })
    : firebase
        .database()
        .ref(`scheduleNotificationsId/`)
        .child(`reveille${user.user}${d.id}`)
        .update({ id: id });
  return id;
};
export const LoginCall = async (token, dispatch) => {
  dispatch({ type: "LOGIN_START" });

  try {
    const resp = await axios({
      method: "GET",
      url: "https://urban-online.herokuapp.com/api/login/",
      headers: {
        Authorization: `Basic ${token}`,
        Accept: "application/json",
        "Content-Type": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
    });

    var resp1;

    resp.data.client_id
      ? (resp1 = await axios.get(
          `https://urban-online.herokuapp.com/api/client/${resp.data.client_id}`
        ))
      : resp.data.driver_id &&
        (resp1 = await axios.get(
          `https://urban-online.herokuapp.com/api/driver/${resp.data.driver_id}`
        ));

    dispatch({ type: "LOGIN_SUCCESS", payload: resp1.data });
    return true;
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE" });
    if (err.message === "Network Error") {
      ToastAndroid.show("verifier votre conexion internet ", ToastAndroid.LONG);
    } else {
      ToastAndroid.show("Email/mot de pass invalid ", ToastAndroid.LONG);
    }
    return false;
  }
};
export const CreatAccount = async (dispatch, data1, data2, passager) => {
  dispatch({ type: "CREATE_START" });
  console.log(data1,data2,passager)
  try {
    const resp = await axios({
      url: "https://urban-online.herokuapp.com/api/user/",
      method: "POST",
      transformRequest: (d) => {
        return data1;
      },
      data: data1,
    });
   await data2.append("user", resp.data.id);

    const resp1 = passager
      ? await axios({
          url: "https://urban-online.herokuapp.com/api/client/",
          method: "POST",
          transformRequest: (d) => {
            return data2;
          },
          data: data2,
        })
      : await axios({
          url: "https://urban-online.herokuapp.com/api/driver/",
          method: "POST",
          transformRequest: (d) => {
            return data2;
          },
          data: data2,
        });
    dispatch({ type: "CREATE_SUCCESS", payload: resp1.data });
     console.log('yes')
    return true;
  } catch (err) {
    dispatch({ type: "CREATE_FAILE" });
    if (err.message === "Network Error") {
      ToastAndroid.show("verifier votre conexion internet ", ToastAndroid.LONG);
    }
    console.log(err,'err')
    return false;
  }
};
export const CreateTrajet = async (data, dispatch) => {
  try {
    const resp = await axios({
      url: "https://urban-online.herokuapp.com/api/trips/",
      method: "POST",
      transformRequest: (d) => {
        return data;
      },
      data: data,
    });
    ToastAndroid.show("trajet a été bien crée", ToastAndroid.LONG);

    return resp.data;
  } catch (err) {
    if (err.message === "Network Error") {
      ToastAndroid.show("verifier votre conexion internet ", ToastAndroid.LONG);
    }
  }
  return false;
};
export const ChangePassword = async (token, data1) => {
  try {
    const resp = await axios({
      url: "https://urban-online.herokuapp.com/change_password/?=",
      method: "PUT",
      headers: {
        Authorization: `Basic ${token}`,
        Accept: "application/json",
        "Content-Type": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
      transformRequest: (d) => {
        return data1;
      },
      data: data1,
    });

    return true;
  } catch (err) {
    if (err.message === "Network Error") {
      ToastAndroid.show("verifier votre conexion internet ", ToastAndroid.LONG);
    } else {
      ToastAndroid.show(
        "le mot de pass vous avez saiser est incorrect ",
        ToastAndroid.LONG
      );
    }
    return false;
  }
};
export const UpdateUser = async (dispatch, data, id, passager, car) => {
  try {
    await axios({
      url:
        passager === 1
          ? `https://urban-online.herokuapp.com/api/client/${id}/`
          : passager === 0 &&
            `https://urban-online.herokuapp.com/api/driver/${id}/`,
      method: "PATCH",
      transformRequest: (d) => {
        return data;
      },
      data: data,
    });
    ToastAndroid.show("vos informations a été changé ", ToastAndroid.LONG);
    car === 0
      ? dispatch({ type: "UPDATE", payload: data })
      : car === 1 && dispatch({ type: "UPDATE_CAR", payload: data });
    return true;
  } catch (err) {
    if (err.message === "Network Error") {
      ToastAndroid.show("verifier votre conexion internet ", ToastAndroid.LONG);
    }
    return false;
  }
};
export const Logout = (dispatch) => {
  dispatch({ type: "LOGOUT" });
};
export const CreateComent = async (data) => {
 
  try {
    await axios({
      url: "https://urban-online.herokuapp.com/api/comments/",

      method: "POST",
      transformRequest: (d) => {
        return data;
      },
      data: data,
    });
    return true;
  } catch (err) {
    if (err.message === "Network Error") {
      ToastAndroid.show("verifier votre conexion internet ", ToastAndroid.LONG);
    }
    return false;
  }
};
export const SendMessage = async (data) => {
  try {
    await axios({
      url: "https://urban-online.herokuapp.com/api/contacts/",

      method: "POST",
      transformRequest: (d) => {
        return data;
      },
      data: data,
    });
    return true;
  } catch (err) {
    if (err.message === "Network Error") {
      ToastAndroid.show("verifier votre conexion internet ", ToastAndroid.LONG);
    } else {
      ToastAndroid.show("un erreur se produit", ToastAndroid.LONG);
    }
    return false;
  }
};
export const sendNotification = async (message) => {
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (err) {}
};
