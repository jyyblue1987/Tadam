
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

export default class MissionFirstScreen extends Component {
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
                <View style = {stylesGlobal.left_color_bar}>
                    <View style = {stylesGlobal.left_color_bar_first}/>
                    <View style = {stylesGlobal.left_color_bar_second}/>
                    <View style = {stylesGlobal.left_color_bar_third}/>
                    <View style = {stylesGlobal.left_color_bar_forth}/>
                    <View style = {stylesGlobal.left_color_bar_fifth}/>
                </View>
                <View style = {styles.main_container}>
                    <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: isIphoneX ? 55 : 20}}>
                        <Image style = {{width: 50, height: 50, resizeMode: 'contain'}} source = {require("../assets/images/mission_number1.png")}/>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 20}]}>YOUR FIRST MISSION HEADING</Text>
                        <View style = {stylesGlobal.mission_shadow_view}>
                            <View style = {[stylesGlobal.mission_color_view, {backgroundColor: '#2AB7CA'}]}>
                                <View style = {{flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                    <Image style = {stylesGlobal.mission_avatar_image} source = {require("../assets/images/intro1_icon.png")}/>
                                    <Text style = {[stylesGlobal.general_font_style, {color: '#ffffff', marginLeft: 10}]}>BY HOVAV</Text>
                                </View>
                                <View style = {{flex: 2, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <TouchableOpacity style = {[stylesGlobal.mission_camera_container_view, {backgroundColor: '#3a95a7'}]}>
                                        <Image style = {{width: '60%', height: '60%'}} source = {require("../assets/images/mission1_camera.png")}></Image>
                                    </TouchableOpacity>
                                </View>
                                <View style = {{flex: 3, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#ffffff'}]}>{this.state.contents_text}</Text>
                                </View>
                                <View style = {{flex: 1.5, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#ffffff', fontWeight: 'bold'}]}>30</Text>
                                    <Image style = {{width: 35, height: 35, marginLeft: 10, resizeMode: 'contain'}} source = {require("../assets/images/mission1_coin.png")}></Image>
                                </View>
                                <View style = {{flex: 1.5, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                    <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {require("../assets/images/mission_timer.png")}></Image>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#ffffff', fontWeight: 'bold', marginLeft: 10}]}>00:10:25</Text>
                                </View>
                                <View style = {{flex: 1.5, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <TouchableOpacity style = {stylesGlobal.mission_button} onPress = {() => this.props.navigation.navigate("MissionSecondScreen")}>
                                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#ffffff'}]}>LET'S GO!</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        flexDirection: 'row'
    },
    main_container: {
        flex: 1,
    },
    input_component: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20
    },
    input_style: {
        width: '80%',
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000000',
        paddingHorizontal: 15,
        marginTop: 10,
        textAlign: 'center'
    },
    dot_style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#7A7A7A',
        backgroundColor: '#7A7A7A'
    },
    skip_button: {
        position: 'absolute',
        right: 15,
        top: isIphoneX ? 40 : 15,
        zIndex: 10
        
    }
});