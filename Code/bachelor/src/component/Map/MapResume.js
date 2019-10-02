/***************************************************************
 *
 * File      : MapResume.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Resume of a previous session
 *
 *********************************************************************/
import React, { Component } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import styles from "./Styles";
import moment from "moment";
import fr from "moment/locale/fr-ch";
import text from "../../utils/text";

class MapResume extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      latitudeDelta: 0.00222,
      longitudeDelta: 0.01 * 2.5
    };
    this.map = null;
    this._isMounted = false;
    this.timer = null;
  }

  /* Navigation options, header */
  static navigationOptions = ({ navigation }) => {
    return {
      headerVisible: true,
      headerRight: navigation.getParam("headerLeft") || (
        <ActivityIndicator
          size="small"
          color={"white"}
          style={{ marginRight: 10 }}
        />
      ),
      BackgroundColor: "#1B5E20"
    };
  };

  componentWillMount = () => {
    this._isMounted = true;
  };

  componentWillUnmount = () => {
    this._isMounted = false;
    clearInterval(this.timer);
  };

  // see if it's really usefull
  handleBackPress = () => {
    this._isMounted = false;
    clearInterval(this.timer);
    return true;
  };

  render() {
    // get the resume of the session
    const session = this.props.navigation.getParam(
      "session",
      // a fake session in cas no data is avaliable
      {
        avgSpeed: 13.2,
        distance: 14.3,
        key: 0,
        points: 146,
        totalTime: "10:45",
        routeCoordinates: [
          { latitude: 46.782878, longitude: 6.653347 },
          { latitude: 46.780681, longitude: 6.656571 },
          { latitude: 46.782138, longitude: 6.655391 },
          { latitude: 46.784037, longitude: 6.65703 },
          { latitude: 46.783599, longitude: 6.655768 },
          { latitude: 46.785932, longitude: 6.647616 },
          { latitude: 46.781898, longitude: 6.671506 }
        ],
        altitudDown: 14,
        altitudeUp: 55
      }
    );

    return (
      <View style={styles.container}>
        <MapView
          ref={ref => {
            this.map = ref;
          }}
          onMapReady={() => {
            {
              this._isMounted &&
                this.map.fitToCoordinates(session.routeCoordinates, {
                  edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
                  animated: false
                });
            }
            this.timer = setTimeout(() => {
              this.setState({ loading: false });
              //passing a dumy component
              this.props.navigation.setParams({ headerLeft: <View></View> });
            }, 5000);
          }}
          mapType="satellite"
          style={styles.map}
          initialRegion={{
            latitude: session.routeCoordinates[0].latitude,
            longitude: session.routeCoordinates[0].longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}
          zoomControlEnabled={false}
          loadingEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Polyline
            coordinates={session.routeCoordinates}
            strokeColor="#19B5FE"
            strokeWidth={3}
            lineJoin="round"
            miterLimit={5}
          />
        </MapView>
        <View style={styles.dataResume}>
          <Text>
            {text.sessions.workout}
            {moment
              .unix(session.date.seconds)
              .locale("fr", fr)
              .format("LLLL")}
          </Text>
          <Text>
            {text.sessions.duration} {session.totalTime}
          </Text>
          <Text>
            {text.sessions.points} {Math.round(session.totalPoint)}
          </Text>
          <Text>
            {text.sessions.distance} {session.distance.toFixed(2)}{" "}
            {text.sessions.m}
          </Text>
          <Text>
            {text.sessions.avg_speed} {session.avgSpeed.toFixed(2)}{" "}
            {text.sessions.kmh}
          </Text>
          <Text>
            {text.sessions.asc_altitude} {session.altitudeUp.toFixed(2)}{" "}
            {text.sessions.m}
          </Text>
          <Text>
            {text.sessions.dsc_altitude} {session.altitudeDown.toFixed(2)}{" "}
            {text.sessions.m}
          </Text>
        </View>
      </View>
    );
  }
}

export default MapResume;
