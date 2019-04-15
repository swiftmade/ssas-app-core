import React, {Component} from 'react'
import Query from '../Lib/Query'
import Files from "../Lib/Files"
import Session from "../Lib/Session"
import HtmlView from "../Components/HtmlView"

import AppCore from '../AppCore'

class Survey extends Component
{
    getSource() {

        const params = {
            lang: "en",
            survey: Files.surveyJson(),
            assets: Files.assetsPath(),
            db: Session.get("domain"),
            bg: Session.bgPath(),
        }

        if (AppCore.get('validationOff')) {
            params.novalidate = true
        }

        if (AppCore.has('extendSurveyParams')) {
            params = AppCore.get('extendSurveyParams')(params)
        }

        // Exception: turn off jump to button for FijiFSP
        if (Session.get('domain') === 'fijifsp') {
            params.jumpto = 'off'
            params.title = 'off'
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