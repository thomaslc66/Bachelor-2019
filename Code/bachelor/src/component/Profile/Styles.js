/***************************************************************
 *
 * File      : Styles.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : // src/component/Profile/Styles sheet
 *
 *********************************************************************/

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  button: {
    marginTop: "1%",
    marginBottom: "1%",
    marginLeft: "10%",
    marginRight: "10%"
  },
  centeredButton: {
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  customBorder: {
    borderTopWidth: 0.7,
    borderColor: "#fff"
  },
  container: {
    flex: 1,
    backgroundColor: "#0D1C2F"
  },
  dialog: {
    marginTop: 10,
    marginBottom: 10,
    color: "#5B5A5A",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },

  header: {
    color: "#fff",
    backgroundColor: "#5B5A5A",
    padding: 8
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 0,
    marginTop: 10
  },
  icon: {
    fontSize: 20,
    color: "#FF8710",
    padding: 3
  },
  listContainer: {
    marginTop: 15,
    marginBottom: 15
  },
  logout_text: {
    color: "#fff",
    marginLeft: 10,
    marginRight: 10
  },
  row: {
    padding: 7,
    borderBottomColor: "#fff",
    borderBottomWidth: 1
  },
  rowDirection: {
    flexDirection: "row"
  },
  rowFlexDirection: {
    flexDirection: "row",
    flex: 1
  },
  scroll: {
    margin: 10,
    backgroundColor: "#FFF"
  },
  sessionsRow: {
    padding: 10,
    flexDirection: "column",
    flex: 1
  },
  sessionRowTitleText: {
    fontWeight: "bold",
    color: "#fff"
  },
  sessionRowSubtitleText: {
    fontSize: 11,
    color: "#ddd7d7",
    textAlignVertical: "center"
  },
  startGame: {
    backgroundColor: "#FF8710",
    color: "#fff",
    marginBottom: 0,
    flex: 1
  },
  userBioRow: {
    marginLeft: 40,
    marginRight: 40
  },
  userBioText: {
    color: "#FF8710",
    fontSize: 13.5,
    textAlign: "center"
  },
  userColumn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingTop: 20
  },
  userImage: {
    borderRadius: 60,
    height: 80,
    width: 80
  },
  userNameRow: {
    marginBottom: 0
  },
  userNameText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  userRow: {
    alignItems: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 0
  },
  userValueText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  userView: { flex: 1, alignItems: "center" }
});
