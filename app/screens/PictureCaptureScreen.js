
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
    ImageBackground,
    BackHandler
} from 'react-native';

import {stylesGlobal} from '../styles/stylesGlobal';
import ImagePicker from 'react-native-image-picker';
import KeepAwake from 'react-native-keep-awake';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class PictureCaptureScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image_uri: "",
        }
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {return true});
    }

    showImagePicker = () => {
        var options = {
            title: 'Select Image',
            mediaType: 'photo',
            quality: 1.0,
            allowsEditing: false,
            noData: true,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response.type);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({
                    image_uri: response.uri
                })
            }
        });
    }

    render() {
        return (
            <View style = {styles.container} onStartShouldSetResponder = {() => {
                if(this.state.image_uri != "") {
                    this.props.navigation.navigate("PictureCheckScreen", {image_uri: this.state.image_uri})}
                }
            }>
                <ImageBackground style = {{flex: 1, resizeMode: 'cover'}} source={this.state.image_uri != "" ? {uri: this.state.image_uri} : {}}>
                    <View style = {{width: '100%', flexDirection: 'row', position: 'absolute', left: 0, bottom: isIphoneX ? 45 : 20, justifyContent: 'center'}}>
                        <TouchableOpacity style = {{width: 40, height: 40, borderRadius: 40, borderWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.props.navigation.goBack()}>
                            <View style = {{width: 40, height: 40, borderRadius: 40, opacity: 0.4, backgroundColor: '#000000', position: 'absolute', left: 0, top: 0}}/>
                            <Image style = {{width: 20, height: 20, resizeMode: 'contain'}} source = {require("../assets/images/left_arrow.png")}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style = {{width: '60%', height: 40, marginLeft: 10, borderRadius: 40, borderWidth: 1, borderColor: '#ffffff',  justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}} onPress = {() => this.showImagePicker()}>
                            <View style = {{width: '100%', height: 40, borderRadius: 40, opacity: 0.4, backgroundColor: '#000000', position: 'absolute', left: 0, top: 0}}/>
                            <Image style = {{width: 20, height: 20, resizeMode: 'contain'}} source = {require("../assets/images/camera_picture.png")}></Image>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, marginLeft: 10, color: '#2AB7CA'}]}>PICTURE</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <KeepAwake />
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