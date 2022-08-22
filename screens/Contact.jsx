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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/Feather";
import { SendMessage } from "../ApiCalls";
export default function Contact() {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState();
  const navigation = useNavigation();
  const [isFetching, setIsFetching] = useState();
  const handleEnv = async () => {
    if (user && text && text.length > 1) {
      const data = new FormData();
      data.append("user", user.user);
      data.append("type", "reclamation");
      data.append("content", text);
      setIsFetching(true);
      const d = await SendMessage(data);
      if (d) {
        setIsFetching(false);
        ToastAndroid.show("votre message a été envoyé", ToastAndroid.LONG);
        setText("");
        Keyboard.dismiss();
      } else {
        setIsFetching(false);

        Keyboard.dismiss();
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
          paddingTop: 10,
          paddingBottom: 10,
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{ padding: 5, borderRadius: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Icons size={25} name="arrow-left" color="black" />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 20,

            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          Contacter nous
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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View
            style={{
              justifyContent: "space-between",
              paddingBottom: 5,
              height: Dimensions.get("window").height - 155,

              alignItems: "center",
              marginTop: Dimensions.get("window").height * 0.08,
            }}
          >
            <Image
              style={{ width: 250, height: 250 }}
              source={require("../assets/img/Mail.png")}
              alt=""
            />
            <View
              style={{
                borderRadius: 10,
                width: "100%",
                height: 100,
                backgroundColor: "#F5F5F5",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                paddingHorizontal: 5,
                paddingBottom: 8,
              }}
            >
              <TextInput
                multiline
                onChangeText={(text) => setText(text)}
                value={text}
                placeholder="Ecrivez votre message"
                style={{
                  paddingHorizontal: 5,
                  alignItems: "flex-start",
                  width: "80%",
                  height: "100%",
                }}
              />
              {isFetching && (
                <ActivityIndicator
                  animating={isFetching}
                  color={mainColor}
                  size={30}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                  }}
                />
              )}
              {!isFetching && (
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                  }}
                  onPress={() => handleEnv()}
                >
                  <Text style={{ color: mainColor, fontWeight: "bold" }}>
                    Envoyer
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: mainColor,
    width: 150,

    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  conatainer: {
    paddingHorizontal: 10,

    flex: 1,
    backgroundColor: "white",
    height: Dimensions.get("window").height,
  },
});
