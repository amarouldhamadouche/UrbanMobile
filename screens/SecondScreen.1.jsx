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
  ActivityIndicator,
  ToastAndroid,
  BackHandler,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";

import { LoginCall } from "../ApiCalls";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import { Buffer } from "buffer";
export default function SecondScreen() {
  const [secure, setSecure] = useState(true);
  const { user, dispatch } = useContext(AuthContext);

  const route = useRoute();
  const { passager, chauffeur } = route.params;
  const navigation = useNavigation();
  const [Username, setUserName] = useState();
  const [Password, setPassword] = useState();
  const [isFetching, setIsFetching] = useState(false);
  function navigateToRegistration() {
    navigation.navigate("firstLogin", { passager, chauffeur });
  }
  const handleChangeEmail = (text) => {
    if (/^[A-Za-z0-9@._]*$/.test(text[text.length - 1])) {
      setUserName(text);
    } else {
      setUserName(text.slice(0, text.length - 1));
    }
  };
  const token =Username&& Buffer.from(`${Username.toLowerCase()}:${Password}`, "utf8").toString(
    "base64"
  );
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
  const fetchUser = async () => {
    if (Username && Password) {
      if (Password.length >= 8) {
        setIsFetching(true);
        const r = await LoginCall(token, dispatch, passager);
        if (r) {
          setIsFetching(false);
          navigation.navigate('Home')
        } else {
          setIsFetching(false);
        }
      } else {
        ToastAndroid.show(
          "password must be in 8 character minimum ",
          ToastAndroid.LONG
        );
      }
    } else {
      ToastAndroid.show("Entrez votre Email et Mot de pass", ToastAndroid.LONG);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="white"
        hidden={false}
        translucent={true}
        barStyle="dark-content"
      />
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
                Login
              </Text>
            </View>
            <View
              style={{
                height:
                  Dimensions.get("window").height -
                  StatusBar.currentHeight -
                  (Dimensions.get("window").height * 0.15 +
                    StatusBar.currentHeight),

                justifyContent: "space-between",
              }}
            >
              <View style={styles.center}>
                <View style={styles.centerContainer}>
                  <View style={styles.inputsContainer}>
                    <View style={styles.inputContainer}>
                      <TextInput
                        value={Username}
                        onChangeText={(text) => handleChangeEmail(text)}
                        placeholder="Email"
                        style={styles.input}
                      />
                      <Icon size={25} color={mainColor} name="user" />
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        secureTextEntry={secure}
                        value={Password}
                        onChangeText={(text) => setPassword(text)}
                        placeholder="Mot de pass"
                        type="password"
                        style={styles.input}
                      />

                      <TouchableOpacity>
                        <Icon
                          size={25}
                          color={mainColor}
                          name={secure ? "eye-off" : "eye"}
                          onPress={() => setSecure(!secure)}
                        />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        alignItems: "center",
                        marginVertical: 10,
                      }}
                    >
                      <Text>Mot de pass oublié ! </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      !isFetching && fetchUser();
                    }}
                  >
                    {isFetching ? (
                      <ActivityIndicator
                        animating={isFetching}
                        color="white"
                        size={20}
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 100,
                        }}
                      />
                    ) : (
                      <Text style={{ color: "white" }}>Connexion</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bottom}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                  onPress={() => navigateToRegistration()}
                >
                  <Text style={{ fontSize: 15, marginRight: 20 }}>
                    Creer un nouveau compte
                  </Text>
                  <Icon size={22} color="black" name="chevron-right" />
                </TouchableOpacity>
              </View>
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
    backgroundColor: "white",
    paddingTop: StatusBar.currentHeight,
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
    justifyContent: "center",
    paddingTop: "10%",
  },
  centerContainer: {
    height: "90%",
    justifyContent: "space-around",
  },

  inputsContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    height: 50,
    width: "85%",
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    flexDirection: "row",
  },
  input: {
    width: "90%",
  },
  button: {
    width: "50%",
    backgroundColor: mainColor,
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

  bottom: {
    height: Dimensions.get("window").height * 0.1,

    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
