/***************************************************************
 *
 * File      : Zone.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Geofence display component
 *
 *********************************************************************/
import React, { Component } from "react";
import { View, Image } from "react-native";
import { Circle, Marker } from "react-native-maps";

class Zone extends Component {
  render() {
    const { withMarker, center, radius, color, index } = this.props;
    const markersArray = [
      { marker: require("../../img/markers/marker_start.png") },
      { marker: require("../../img/markers/marker_1.png") },
      { marker: require("../../img/markers/marker_2.png") },
      { marker: require("../../img/markers/marker_key.png") },
      { marker: require("../../img/markers/marker_tree.png") },
      { marker: require("../../img/markers/marker_3.png") }
    ];

    return (
      <View>
        <Circle
          center={center}
          radius={radius}
          strokeWidth={2}
          strokeColor={color}
          fillColor={"rgba(230,238,255,0.5)"}
        />
        {withMarker && (
          <Marker coordinate={center}>
            <Image
              source={markersArray[index].marker}
              size={{ width: 75 }}
            ></Image>
          </Marker>
        )}
      </View>
    );
  }
}

export default Zone;
