
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
    Keyboard
} from 'react-native';

import {stylesGlobal} from '../styles/stylesGlobal';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSplashScreen: true,
        }
    }

    UNSAFE_componentWillMount() {
        setTimeout(async() => {
            this.setState({
                isSplashScreen: false
            });
        }, 1000);
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
            {
                this.state.isSplashScreen &&
                <View style = {styles.main_container}>
                    <View style = {{marginTop: 150, height: 60}}>
                        <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {require("../assets/images/logo.png")}/>
                    </View>
                    <View style = {{width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 50, left: 0}}>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 16}]}>Your mission is a slogan</Text>
                    </View>
                </View>
            }
            {
                !this.state.isSplashScreen &&
                <KeyboardAvoidingView style = {styles.main_container}>
                    <View style = {{width: '100%', height: '25%', justifyContent: 'center', alignItems: 'center'}}>
                        <Image style = {{width: '100%', height: 50, resizeMode: 'contain'}} source = {require("../assets/images/logo.png")}/>
                    </View>
                    <View style = {{flex: 1, width: '100%'}}>
                        <View style = {{width: '100%', alignItems: 'center'}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 20, color: '#2AB7CA'}]}>JOIN GAME</Text>
                            <View style = {styles.input_component}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 16}]}>Your name</Text>
                                <TextInput style = {[styles.input_style, stylesGlobal.general_font_style]} placeholder = {"enter name or nickname"}></TextInput>
                            </View>
                            <View style = {styles.input_component}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 16}]}>Game code</Text>
                                <TextInput style = {[styles.input_style, stylesGlobal.general_font_style]} placeholder = {"enter the code you got"}></TextInput>
                            </View>
                        </View>
                        <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                            <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 20, borderColor: '#000000', borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style = {[stylesGlobal.general_font_style, {color: '#2AB7CA', fontSize: 16}]}>LET ME IT!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = {{width: '100%', height: 100, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.props.navigation.navigate("IntroFirstScreen")}>
                            <Image style = {{width: 20, height: 20, tintColor: '#2AB7CA', resizeMode: 'contain'}} source = {require("../assets/images/plus.png")}/>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, marginLeft: 10}]}>Create New game</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            }
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
});