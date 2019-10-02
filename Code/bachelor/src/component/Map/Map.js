/***************************************************************
 *
 * File      : Map.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Gaming map component
 *
 *********************************************************************/

import React, { Component } from 'react';
import MapView, { Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import styles from './Styles';
import Zone from './Zone';

class CustomMap extends Component {
  constructor(props) {
    super(props);
    this.map;
  }

  componentDidMount = () => {
    const { region } = this.props;
  };

  render() {
    const { region, routeCoordinates, geofences } = this.props;

    return (
      <MapView
        ref={component => {
          this.map = component;
        }}
        maxZoomLevel={25}
        style={styles.map}
        mapType='satellite'
        region={region}
        showsUserLocation
        followUserLocation
        zoomEnabled
        loadingEnabled={true}
        showsMyLocationButton={false}
      >
        {// Display on the map only the isVisible geofence
        geofences.map((geofence, index) => {
          if (geofence.isVisible) {
            return (
              <Zone
                key={index}
                center={{
                  latitude: geofence.latitude,
                  longitude: geofence.longitude
                }}
                radius={geofence.radius}
                color={
                  index === 0
                    ? '#DB6060'
                    : geofence.firstTimeIn
                    ? '#19fc4e'
                    : '#19B5FE'
                }
                index={index}
                withMarker
              />
            );
          }
        })}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor='#19B5FE'
          strokeWidth={3}
          lineJoin='round'
          miterLimit={5}
        />
      </MapView>
    );
  }
}

// REDUX STATE MANAGEMENT
const mapStateToProps = state => ({
  geofences: state.game.geofences,
  region: state.game.region,
  routeCoordinates: state.game.routeCoordinates
});

const mapActionToProps = {};

export default connect(
  mapStateToProps,
  mapActionToProps
)(CustomMap);
