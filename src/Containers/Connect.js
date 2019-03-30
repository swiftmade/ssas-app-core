import { Image } from "react-native";
import React, { Component } from "react";
import {NavigationActions} from 'react-navigation';

import AppCore from "../AppCore";
import Alerts from "../Lib/Alerts";
import Text from "../Components/Text";
import ConnectFlow from "../Flows/ConnectFlow";
import Container from "../Components/Container";

class Connect extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            busy: false
        }
    }

    async componentDidMount() {
        if (AppCore.has('domainLock')) {
            await this.connect(AppCore.get('domainLock'))
        }
    }

    async connect(domain) {

        this.setState({busy: true})

        try {
            await ConnectFlow.handle(domain)
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: "Launch",})],
                })
            )
        } catch (error) {
            Alerts.error('Oops', error.toString())
            // TODO: Show error
            this.setState({busy: false})
        }
    }
    
    render() {
        return <Container center>
            <Image source={AppCore.get('defaultLaunchLogo')} />
            <Text title>{AppCore.get('defaultLaunchName')}</Text>
        </Container>
    }
}

export default Connect