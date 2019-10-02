/***************************************************************
 *
 * File      : Styles.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : // src/component/Map/Styles sheet
 *
 *********************************************************************/
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  button: {
    backgroundColor: "#0D1C2F",
    justifyContent: "center"
  },
  textButton: {
    color: "#fff"
  },
  background: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    top: 0,
    left: 0,
    position: "absolute",
    zIndex: 10,
    width: "100%",
    color: "#fff"
  },
  backgroundButton: {
    position: "absolute",
    bottom: 0,
    left: 5,
    right: 5,
    zIndex: 10,
    marginBottom: 5
  },
  column: {
    flexDirection: "column",
    flex: 1,
    padding: 3
  },
  headerRow: { textAlign: "right", flex: 1, color: "#FF8710" },
  map: {
    flex: 1,
    zIndex: -1
  },
  row: {
    flexDirection: "row",
    padding: 10
  },
  rowDirection: { flexDirection: "row" },
  textColorWhite: {
    color: "#fff"
  },
  timerText: {
    fontSize: 24,
    color: "#FF8710",
    textAlignVertical: "center"
  },
  timerTextsmall: {
    fontSize: 10,
    color: "#FF8710"
  },
  dataResume: {
    flex: 1,
    margin: 7
  },
  dialogText: {
    marginTop: 10
  },
  totalPointText: {
    color: "white",
    flexBasis: "20%",
    textAlignVertical: "center",
    textAlign: "center",
    padding: 5
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center"
  },
  indiceText: {
    color: "white",
    textAlign: "center"
  },
  indiceButton: {
    justifyContent: "center",
    flexBasis: "20%",
    margin: 5,
    height: 19,
    width: 20,
    backgroundColor: "#FF8710"
  }
});
