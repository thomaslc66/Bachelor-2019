/***************************************************************
 *
 * File      : DistancePoint.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Component managin distance and point display in profile.js
 *
 *********************************************************************/
import React, { Component } from "react";
import { View, Text } from "native-base";
import styles from "./Styles";

class DistancePoint extends Component {
  render() {
    const { text, value } = this.props;
    return (
      <View style={styles.userView}>
        <Text style={styles.userValueText}>{value}</Text>
        <Text style={styles.userBioText}>{text}</Text>
      </View>
    );
  }
}

export default DistancePoint;
