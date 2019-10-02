/***************************************************************
 *
 * File      : SessionRow.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Session row component (used on Profile.js)
 *
 *********************************************************************/
import React, { Component } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import styles from "./Styles";

class SessionRow extends Component {
  render() {
    const { iconName, text } = this.props;

    return (
      <View style={styles.rowDirection}>
        <Icon name={iconName} iconSize={20} style={styles.icon} />
        <Text style={styles.sessionRowSubtitleText}>{text}</Text>
      </View>
    );
  }
}

export default SessionRow;
