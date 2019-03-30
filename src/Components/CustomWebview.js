import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

export default class CustomWebView extends Component {
  
  static propTypes = {
    ...WebView.propTypes
  };

  render() {
    return <WebView {...this.props}
      bounces={false}
      originWhitelist={['*']}
      allowFileAccess={true}
      domStorageEnabled={true}
      javaScriptEnabled={true}
      geolocationEnabled={true}
      saveFormDataDisabled={true}
      allowUniversalAccessFromFileURLs={true} />
  }

  // unfortunately, the refs don't transfer cleanly, so if you use any of the static methods, you need to handle them here
  injectJavaScript(...args) {
    this.webview.injectJavaScript(...args);
  }

  reload(...args) {
    this.webview.reload(...args);
  }
}