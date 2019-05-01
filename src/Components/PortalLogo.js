import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';

import {AppCore} from "../";
import Images from "../Constants/Images";

class PortalLogo extends Component
{
    render() {
        return <Image source={Images.logo()}
          defaultSource={AppCore.get('defaultLaunchLogo')}
          style={styles.logo} />;
    }
}

const styles = StyleSheet.create({
  logo: {
    width: 90,
    height: 90,
    marginTop: 8
  }
});

export default PortalLogo