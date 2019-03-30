import React, { Component } from 'react'
import {
    View,
    Image,
    Platform,
    StyleSheet,
    ProgressViewIOS,
    ProgressBarAndroid,
} from 'react-native'

import AppCore from '../AppCore';
import LaunchFlow from '../Flows/LaunchFlow';

import Text from '../Components/Text';
import Container from '../Components/Container';

class Launch extends Component {

    constructor(props) {
        super(props)
        this.state = {
            progress: null
        }
    }

    async componentDidMount() {
        await LaunchFlow(this.props.navigation, (progress) => {
            this.setState({progress})
        })
    }

    render() {
        return (
            <Container center>
                <Image source={AppCore.get('defaultLaunchLogo')} />
                {this._renderProgress()}
            </Container>
        );
    }

    _renderProgress() {
        if (this.state.progress === null) {
            return null
        }
        return <View>
            <Text style={styles.loadingText}>Downloading... ({(this.state.progress * 100).toFixed(3)}%)</Text>
            {this._renderProgressBar()}
        </View>
    }

    _renderProgressBar() {
        if (Platform.OS === 'android') {
            return <ProgressBarAndroid
                style={styles.progress}
                styleAttr="Horizontal"
                indeterminate={false}
                progress={this.state.progress} />
        }
        // iOS
        return <ProgressViewIOS
            style={styles.progress}
            progress={this.state.progress} />
    }
}

const styles = StyleSheet.create({
    loadingText: {
        marginTop:16,
        textAlign: 'center',
    },
    progress: {
        width: 200,
        marginTop: 16,
    }
})

export default Launch;
