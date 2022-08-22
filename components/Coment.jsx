import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Entrypo from "react-native-vector-icons/Entypo";
import { FacebookLoader } from "react-native-easy-content-loader";
import { mainColor } from "../screens/mainColor";
import axios from "axios";
export default function Comment({ coment }) {
  const [commenter, setCommenter] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const fetchComenter = async () => {
    setIsFetching(true);
    try {
      const resp = await axios.get(
        `https://urban-online.herokuapp.com/api/client/${coment.client}`
      );
      setCommenter(resp.data);

      setIsFetching(false);
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );
      }
    }
  };
  useEffect(() => {
    coment && fetchComenter();
  }, [coment.client]);
  return isFetching ? (
    <FacebookLoader active />
  ) : (
    <View style={{ paddinTop: 10, flex: 1 }}>
      <View style={styles.top}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            backgroundColor: mainColor,
            borderRadius: 25,
            marginRight: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 25, textAlign: "center" }}>
            {commenter && commenter.first_name[0].toUpperCase()}
          </Text>
        </View>
        <Text>
          {commenter && commenter.first_name} {commenter && commenter.last_name}
        </Text>
      </View>
      <View style={styles.center}>
        <Entrypo
          name="star"
          size={15}
          color={coment.star > 0 ? mainColor : "#C4C4C4"}
        />
        <Entrypo
          name="star"
          size={15}
          color={coment.star >= 2 ? mainColor : "#C4C4C4"}
        />
        <Entrypo
          name="star"
          size={15}
          color={coment.star >= 3 ? mainColor : "#C4C4C4"}
        />
        <Entrypo
          name="star"
          size={15}
          color={coment.star >= 4 ? mainColor : "#C4C4C4"}
        />
        <Entrypo
          name="star"
          size={15}
          color={coment.star === 5 ? mainColor : "#C4C4C4"}
        />
      </View>
      <View style={styles.bottom}>
        <Text>{coment.content} </Text>
      </View>
      <View
        style={{
          borderBottomColor: "#C4C4C4",
          borderBottomWidth: 1,
          marginVertical: 10,
          marginHorizontal: 40,
        }}
      ></View>
    </View>
  );
}
const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    alignItems: "center",
  },
  center: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
  },
  bottom: {},
});
