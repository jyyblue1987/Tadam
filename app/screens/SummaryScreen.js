
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

export default class SummaryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contents_text: 'Today we will invistigate the use of symbols but from a different angle We are waiting to see your take on the mission',
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
                    <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: 60}}>
                        <Image style = {{width: 80, height: 80, resizeMode: 'contain'}} source = {require("../assets/images/intro1_icon.png")}/>
                        <ImageBackground style = {{width: '80%', height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: '#999999'}}>

                        </ImageBackground>
                        <Image style = {{width: '100%', height: 80, marginTop: 50, resizeMode: 'contain'}} source = {require("../assets/images/summary_flag.png")}/>
                        <View style = {{width: '80%', alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 24,}]}>GET READY FOR YOUR</Text>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 24,}]}>FIRST MISSION</Text>
                        </View>
                    </View>
                    {/* <View style = {{width: '100%', height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: isIphoneX ? 50 : 15}}>
                        <TouchableOpacity style = {stylesGlobal.intro_button}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center'}]}>NEXT</Text>
                        </TouchableOpacity>
                    </View> */}
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