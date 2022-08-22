import React from "react";
import {
  Text,
  View,

  Dimensions,
 
} from "react-native";

export default function Age({ age }) {
console.log('age',age)
  return (
    <View
      style={{
        borderWidth: 0.5,
        width: Dimensions.get("window").width * 0.15,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 2,
      }}
    >
      <Text> {age == 1 ||age == 0? "18-25" : age == 2 ? "26-40" : "+40"}</Text>
    </View>
  );
}
