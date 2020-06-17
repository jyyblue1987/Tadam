
//
//  
//  Tarma
//  Copyright © 2020 Water Flower(waterflower12591@gmail.com). All rights reserved. 
//

import * as React from 'react';
import {Component} from "react";
import {
    AppState, 
    AsyncStorage, 
    Dimensions, 
    Image, 
    Platform, 
    ScrollView, 
    StyleSheet, 
    Text, 
    View, 
    Alert, 
    Linking,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput,
    Keyboard,
    ImageBackground
} from 'react-native';

import {stylesGlobal} from '../styles/stylesGlobal';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class PictureCaptureScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contents_text: 'Take a picture that fits the title: Coca Cola Taste of life or something like that, make sure the picture include one or more blue items',
        }
    }

    UNSAFE_componentWillMount() {
        
    }


    render() {
        return (
            <View style = {styles.container} onStartShouldSetResponder = {() => Keyboard.dismiss()}>
                <ImageBackground style = {{flex: 1, resizeMode: 'cover', backgroundColor: '#888888'}}>
                    <View style = {{width: '100%', flexDirection: 'row', position: 'absolute', left: 0, bottom: isIphoneX ? 45 : 20, justifyContent: 'center'}}>
                        <TouchableOpacity style = {{width: 40, height: 40, borderRadius: 40, borderWidth: 1, borderColor: '#ffffff', backgroundColor: '#000000', opacity: 0.4, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.props.navigation.goBack()}>
                            <Image style = {{width: 20, height: 20, resizeMode: 'contain'}} source = {require("../assets/images/left_arrow.png")}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style = {{width: '60%', height: 40, marginLeft: 10, borderRadius: 40, borderWidth: 1, borderColor: '#ffffff', backgroundColor: '#000000', opacity: 0.4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}  onPress = {() => this.props.navigation.navigate("PictureCheckScreen")}>
                            <Image style = {{width: 20, height: 20, resizeMode: 'contain'}} source = {require("../assets/images/camera_picture.png")}></Image>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, marginLeft: 10, color: '#2AB7CA'}]}>PICTURE</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    
});