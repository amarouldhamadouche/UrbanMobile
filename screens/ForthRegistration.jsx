import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar,
  ToastAndroid,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { CreatAccount } from "../ApiCalls";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import { AuthContext } from "../contexts/AuthContext";
import Auth from "../firebase";
import firebase from "firebase";
import database from "firebase/database";
import auth from "firebase/auth";
//import firebase from "firebase";
export default function ForthRegistration() {
  const navigation = useNavigation();
  const [email, setEmail] = useState();
  const route = useRoute();
  const { dispatch } = useContext(AuthContext);
  const [sec, setSec] = useState(0);
  const [user, setUser] = useState();

  const [isFetching, setIsFecthing] = useState(false);
  const [isFetching1, setIsFecthing1] = useState(false);
  const revoieLeLien = async () => {
    if (user.email !== email.toLowerCase()) {
      setUser("");
    }

    try {
      await user.sendEmailVerification();
      ToastAndroid.show(
        "nous avons envoyé un lien à votre email,cliquez pour activer votre compte",
        ToastAndroid.LONG
      );
      setSec(20);
      setTimeout(() => setSec(0), 50000);
    } catch (err) {
      console.log(err, "err");
    }
  };
  const resetPass = async () => {
    try {
      const resp1 = await firebase
        .auth()
        .signInWithEmailLink("ouldnabil31@gmail.com", {
          handleCodeInApp: true,
          url: "https://urban-online.herokuapp.com/resetPassword?3",
        });

      
    } catch (err) {
          }
  };
  const CreateUserinFirebase = async () => {
    if(!email){
      ToastAndroid.show(
        "entrer votre email",
        ToastAndroid.LONG
      );
    }else{
    setIsFecthing1(true);
    try {
      const resp = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const resp2 = await resp.user.sendEmailVerification();
      setIsFecthing1(false);
      ToastAndroid.show(
        "nous avons envoyé un lien à votre email,cliquez pour activer votre compte",
        ToastAndroid.LONG
      );
      setSec(20);
      setTimeout(() => setSec(0), 60000);
      setUser(resp.user);
      let emailVerificationListenner = setInterval(async () => {
        resp.user.reload();
        if (resp.user.emailVerified) {
          clearInterval(emailVerificationListenner);
          console.log("verified");
          navigateTothreg();
        }
      }, 1000);
    } catch (err) {
      setIsFecthing1(false);
      if (
        err.message ===
        "The email address is already in use by another account."
      ) {
        ToastAndroid.show(
          "cette addresse email est déjà utilisé",
          ToastAndroid.LONG
        );
      } else if (err.message === "The email address is badly formatted.") {
        ToastAndroid.show(
          "L'adresse e-mail est mal formatée.",
          ToastAndroid.LONG
        );
      } else {
        ToastAndroid.show("un erreur se produit", ToastAndroid.LONG);
      }

     
    }}

    //then((newUser) => {
    //;
  };

  const {
    passager,
    chauffeur,
    nom,
    prenom,
    tel,
    password,
    checked,
    checkedAge,
    date,
    selectedCar,
    selectedYear,
  } = route.params;
  const navigateTothreg = async () => {
    if (email.length > 5) {
      setIsFecthing(true);
      const data1 = new FormData();
      data1.append("email", email.toLowerCase());
      data1.append("password", password);

      const data2 = new FormData();
      data2.append("first_name", prenom);
      data2.append("last_name", nom);
      passager && data2.append("age", checkedAge);
      data2.append("sex", checked);
      data2.append("phone", tel);
      chauffeur && data2.append("age", date);
      chauffeur && data2.append("car_brand", selectedCar.logo);
      chauffeur && data2.append("car_type", selectedCar.marque);
      chauffeur && data2.append("car_year", selectedYear);
      const d = await CreatAccount(dispatch, data1, data2, passager);
      setIsFecthing(false);
      if(d){
        navigation.navigate('Home')
      }else if (!d) {
        ToastAndroid.show("un erreur se produit", ToastAndroid.LONG);
      }
    }
  };
  const handleChangeEmail = (text) => {
    if (/^[A-Za-z0-9@._]*$/.test(text[text.length - 1])) {
      setEmail(text);
    } else {
      setEmail(text.slice(0, text.length - 1));
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);
  return isFetching ? (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 50,
        backgroundColor: "white",
      }}
    >
      <ActivityIndicator
        animating={isFetching}
        color={mainColor}
        size={60}
        style={{
          flex: 1,

          marginBottom: 20,
        }}
      />
      <Text style={{ fontSize: 20 }}>Creation de compte</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View
        style={{
          marginLeft: 10,
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: "#C4C4C4",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>1</Text>
        </View>
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: "#C4C4C4",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>2</Text>
        </View>
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: "#C4C4C4",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>3</Text>
        </View>
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: passager ? mainColor : "#C4C4C4",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>4</Text>
        </View>
        {chauffeur && (
          <View
            style={{
              width: 25,
              height: 25,
              backgroundColor: mainColor,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
              marginHorizontal: 2,
            }}
          >
            <Text style={{ color: "white" }}>5</Text>
          </View>
        )}
      </View>
      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View>
            <View style={styles.top}>
              <Text
                style={{ fontWeight: "bold", fontSize: 30, color: "white" }}
              >
                Inscription
              </Text>
            </View>

            <View style={styles.center}>
              <View style={styles.inputsContainer}>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => handleChangeEmail(text)}
                  />
                  <Icon size={25} color={mainColor} name="mail" />
                </View>
              </View>

              <Text style={{ textAlign: "center", color: "#C4C4C4" }}>
                Appuer sur le lien pour activer le compte
              </Text>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      user && user.email === email.toLowerCase() && sec === 20
                        ? "#DCDCDC"
                        : mainColor,
                  },
                ]}
                onPress={() =>
                  !isFetching && (!user || user.email !== email.toLowerCase())
                    ? CreateUserinFirebase()
                    : revoieLeLien()
                }
              >
                {isFetching1 ? (
                  <ActivityIndicator
                    animating={isFetching1}
                    color="white"
                    size={20}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                ) : (
                  <Text style={{ color: "white" }}>
                    {user && user.email === email.toLowerCase()
                      ? "Renvoyer le lien"
                      : "Envoyer le lien"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
  top: {
    height: Dimensions.get("window").height * 0.15,
    backgroundColor: mainColor,
    width: "95%",
    borderTopRightRadius: (Dimensions.get("window").height * 0.15) / 2,
    borderBottomRightRadius: (Dimensions.get("window").height * 0.15) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    height: Dimensions.get("window").height * 0.6,
    justifyContent: "space-around",
    paddingTop: "15%",
  },

  inputsContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    height: 50,
    width: Dimensions.get("window").width * 0.85,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  input: {
    width: "90%",
  },
  button: {
    width: "50%",

    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,

    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
});
