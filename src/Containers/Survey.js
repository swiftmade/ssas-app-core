import React, {Component} from 'react'
import Query from '../Lib/Query'
import Files from "../Lib/Files"
import Session from "../Lib/Session"
import HtmlView from "../Components/HtmlView"

import {AppCore} from '../'

import I18n from "../Utils/i18n";

class Survey extends Component
{
    getSource() {

        let params = {
            lang: I18n.locale,
            survey: Files.surveyJson(),
            assets: Files.assetsPath(),
            db: Session.get("domain"),
            bg: Session.bgPath(),
        }

        if (AppCore.get('validationOff')) {
            params.novalidate = true
        }

        if (AppCore.has('extendSurveyParams')) {
            params = AppCore.get('extendSurveyParams')(params, this.props)
        }

        const baseUri = Files.wwwFolder()
        const uri = baseUri + "/survey.html?" + Query(params);

        return { uri, baseUri }
    }

    render() {
        return <HtmlView navigation={this.props.navigation} source={this.getSource()} sensitive />
    }
}

export default Survey