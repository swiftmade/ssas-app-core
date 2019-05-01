import {Alert} from 'react-native'
import React, {Component} from 'react'
import querystring from 'query-string'
import {NavigationActions} from 'react-navigation'
import {Platform, View, BackHandler} from 'react-native'

import CustomWebview from './CustomWebview'

class HtmlView extends Component
{
    constructor(props) {
        super(props)
        this.rejectBackButton = this.rejectBackButton.bind(this)
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.rejectBackButton)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.rejectBackButton)
    }

    rejectBackButton() {
        return !this.props.hasOwnProperty('allowBackButton')
    }

    _handleStateChange({nativeEvent}) {
        if (nativeEvent.url && nativeEvent.url.indexOf('/index.html') >= 0) {
            const message = this._extractMessageFromUrl(nativeEvent.url)
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: "Menu", params: {
                        message
                    }})],
                })
            )
        }
    }

    _extractMessageFromUrl(url) {
        const query = url.substr(url.indexOf("?") + 1, url.length)
        const params = querystring.parse(query)
        if (!params.message) {
            return null
        }
        return params
    }
    
    async confirmLeave() {

        if ( ! this.props.sensitive) {
            return this.props.navigation.goBack(null)
        }

        const promise = new Promise((resolve, reject) => {
        Alert.alert(
          "Do you really want to leave?",
          "Any unsaved progress will be LOST. Do you want to exit now?",
          [
            { text: "Yes, Leave", onPress: () => {resolve(true); this.props.navigation.goBack(null)} },
            { text: "Cancel", onPress: () => {resolve(false)}, style: "cancel" }
          ],
          { cancelable: true }
        );
        
        })

        return promise
    }
    
    render() {
        return <View style={{flex:1}}>
                {this.renderiOSStatusBarMargin()}
                <CustomWebview source={this.props.source}
                    onLoadStart={this._handleStateChange.bind(this)}
                    onError={() => { this.props.navigation.goBack(null) }}  />
        </View>
    }

    renderiOSStatusBarMargin() {
        if (Platform.OS !== 'ios') {
            return null
        }
        return <View style={{height:20}} />
    }
}

export default HtmlView