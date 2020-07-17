
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

export default class IntroSecondScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contents_text: 'Each mission has it own score that will be determined with the qulity of your creative',
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
                    <TouchableOpacity style = {styles.skip_button} onPress = {() => this.props.navigation.navigate("IntroSummaryScreen")}>
                        <Text style = {stylesGlobal.general_font_style}>SKIP</Text>
                    </TouchableOpacity>
                    <View style = {{width: '100%', height: 150, alignItems: 'center', justifyContent: 'center'}}>
                        <Image style = {{width: '100%', height: 40, resizeMode: 'contain'}} source = {require("../assets/images/logo.png")}/>
                    </View>
                    <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <View style = {{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                            <Image style = {{width: '100%', height: width * 0.3, resizeMode: 'contain'}} source = {require("../assets/images/intro2_icon.png")}/>
                        </View>
                        <View style = {{flex: 1.5, width: '100%', alignItems: 'center'}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 24,}]}>TIMING IS EVERYTHING</Text>
                            <View style = {{width: '80%', alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#7A7A7A'}]}>{this.state.contents_text}</Text>
                            </View>
                            <View style = {{width: '100%', marginTop: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                <View style = {[styles.dot_style, {backgroundColor: '#FFFFFF'}]}/>
                                <View style = {[styles.dot_style, {marginLeft: 15}]}/>
                                <View style = {[styles.dot_style, {backgroundColor: '#FFFFFF', marginLeft: 15}]}/>
                            </View>
                        </View>
                    </View>
                    <View style = {{width: '100%', height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: isIphoneX ? 50 : 15}}>
                        <TouchableOpacity style = {stylesGlobal.intro_button} onPress = {() => this.props.navigation.navigate("IntroThirdScreen")}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center'}]}>UNDERSTOOD</Text>
                        </TouchableOpacity>
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