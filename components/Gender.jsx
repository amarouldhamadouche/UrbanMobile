import React from "react";

import Icon from "react-native-vector-icons/FontAwesome";
export default function Gender({ gender}) {
  return (
    <Icon
      style={{ marginHorizontal: 5 }}
      size={20}
      color="black"
      name={gender === "homme" ? "male" : gender === "femme" && "female"}
    />
  );
}
