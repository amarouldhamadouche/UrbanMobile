import React, { useState, useContext } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  Keyboard,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import Icons from "react-native-vector-icons/Feather";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Buffer } from "buffer";
import { ChangePassword } from "../ApiCalls";
export default function ModifierMotPass() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [Password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [secure1, setSecure1] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const handleChange = async () => {
    if (Password.length >= 8 && newPassword.length >= 8) {
      setIsFetching(true);
      try {
        const resp = await axios.get(
          `https://urban-online.herokuapp.com/api/user/${user.user}/`
        );
        const Username = resp.data.email;
        console.log(Username);
        const token = Buffer.from(`${Username}:${Password}`, "utf8").toString(
          "base64"
        );

        const data1 = new FormData();
        data1.append("old_password", Password);
        data1.append("new_password", newPassword);
        const resp1 = await ChangePassword(token, data1);
        if (resp1) {
          setIsFetching(false);
          ToastAndroid.show(
            "votre mot de pass a été changé ",
            ToastAndroid.LONG
          );
          navigation.goBack();
        } else {
          setIsFetching(false);
        }
      } catch (err) {
        setIsFetching(false);
        if (err.message === "Network Error") {
          ToastAndroid.show(
            "verifier votre conexion internet ",
            ToastAndroid.LONG
          );
        }
      }
    }
  };

  return (
    <View style={styles.conatainer}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingVertical: 5,
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{ padding: 5, borderRadius: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Icons size={25} name="arrow-left" color="black" />
        </TouchableOpacity>
        <Text style={{ marginLeft: 20, fontWeight: "bold", fontSize: 17 }}>
          Modifier votre mot de pass
        </Text>
      </View>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 1,
          marginVertical: 10,
          marginHorizontal: 30,
        }}
      ></View>

      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View
            style={{
              padding: 40,
            }}
          >
            <View style={styles.inputsContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  secureTextEntry={secure}
                  placeholder="Ancien mot de pass"
                  style={styles.input}
                  minLength="8"
                  value={Password}
                  onChangeText={(text) => setPassword(text)}
                />
                <Icons
                  size={25}
                  color={mainColor}
                  name={secure ? "eye-off" : "eye"}
                  onPress={() => setSecure(!secure)}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  secureTextEntry={secure1}
                  placeholder="Nouveau Mot de pass"
                  style={styles.input}
                  minLength="8"
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                />
                <Icons
                  size={25}
                  color={mainColor}
                  name={secure1 ? "eye-off" : "eye"}
                  onPress={() => setSecure1(!secure1)}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text style={{ color: "#C4C4C4" }}>8 caractere minimum</Text>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        Password.length >= 8 && newPassword.length >= 8
                          ? mainColor
                          : "#DCDCDC",
                      opacity: 1,
                    },
                  ]}
                  onPress={() =>
                    Password.length >= 8 &&
                    newPassword.length >= 8 &&
                    handleChange()
                  }
                >
                  {isFetching && (
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
                  )}
                  {!isFetching && (
                    <Text style={{ color: "white" }}>Enregistrer</Text>
                  )}
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
  conatainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flex: 1,
    backgroundColor: "white",
  },
  inputsContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    height: 50,
    width: Dimensions.get("window").width * 0.85,
    flexDirection: "row",
    borderColor: "#C4C4C4",
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  input: {
    width: "75%",
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
    borderRadius: 10,
    marginTop: 50,
  },
});
