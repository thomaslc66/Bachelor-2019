/***************************************************************
 *
 * File      : TextInputComp.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Input component used in forms
 *
 *********************************************************************/
import React from "react";
import { TextInput } from "react-native";
import styles from "../Styles";

//React.forwardRef to pass the ref from the parent to the children
export const TextInputComp = React.forwardRef(
  ({ value, onChangeText, name, ...props }, ref) => (
    <TextInput
      ref={ref}
      value={value}
      onChangeText={text => onChangeText(text, name)}
      placeholderTextColor="#fff"
      style={styles.input}
      {...props}
    />
  )
);
