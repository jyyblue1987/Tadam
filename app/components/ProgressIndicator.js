import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Image,
    Text
} from 'react-native';

export default class ProgressIndicator extends React.Component {
/**
    * common activity indicator view
    */
    render() {
        return (
            <View style={[styles.container, this.props.extraStyle]}>
                <View style = {{position: 'absolute', width: '100%', height: '100%', backgroundColor: '#000000', opacity: 0.3}}></View>
            {
                !this.props.percentage &&
                <Image style = {{width: 80, height: 80}} resizeMode = {'contain'} source={require("../assets/images/loader.gif")}/>
            }
            {
                (this.props.percentage > 0) &&
                <View style = {{paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#ffffff', marginTop: 20}}>
                    <Text style = {{fontSize: 32, color: '#000000'}}>{"Uploading " + this.props.percentage + "%..."}</Text>
                </View>
            }
            </View>
        );
    }
}

ProgressIndicator.defaultProps = {
    extraStyle: {}
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        // backgroundColor: '#000000',
        // opacity: 0.3
        elevation: 10
    },
    activityIndicator: {
        width: 30,
        height: 30,
    },
});
