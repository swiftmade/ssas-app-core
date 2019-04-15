import React, {Component} from 'react'

import AppCore from '../AppCore'
import Files from '../Lib/Files'
import Query from "../Lib/Query"
import Session from "../Lib/Session"
import HtmlView from '../Components/HtmlView'

class Upload extends Component
{   
    getSource() {
        const baseUri = Files.wwwFolder()
        const uri = baseUri + "/submissions.html?" + Query(this.queryParams())        
        return { uri, baseUri }
    }

    queryParams() {
        let params = {
            db: Session.get("domain"),
            submit: "openrosa/submissions",
            base: Session.get("settings.url"),
            bg: Session.bgPath(),
        }
        let token = Session.get('auth.token')
        // Only set the token if the user is authorized
        if (token) {
            params['token'] = token
        }

        if (AppCore.has('extendUploadParams')) {
            params = AppCore.get('extendUploadParams')(params, this.props)
        }
        
        return params
    }
    
    render() {
        return <HtmlView navigation={this.props.navigation} source={this.getSource()} allowBackButton />
    }
}

export default Upload
