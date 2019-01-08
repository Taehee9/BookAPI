import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class DetailScreen extends Component {
    render() {
        //App.js에 추가된 애들만 this.props.navigation 사용 가능
        const itemId = this.props.navigation.getParam('itemId');

        //const {navigation} = this.props;
        //navigation.getParam('itemId');

        return (
            <WebView
                source={{ uri: itemId }}
                style={{ marginTop: 20 }}
            />
        );
    }
}