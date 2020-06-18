
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
import StarRating from 'react-native-star-rating';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class SendEmailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contents_text: "Enter your email and we'll send you your creations",
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
                <KeyboardAvoidingView style = {styles.main_container} behavior='padding'>
                    <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: isIphoneX ? 60 : 25}}>
                        <Image style = {{width: 80, height: 80, resizeMode: 'contain'}} source = {require("../assets/images/faceicon.png")}/>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 10}]}>YOAV SCHUMACHER</Text>
                        <View style = {{width: '100%', alignItems: 'center', marginTop: 30, justifyContent: 'center', flexDirection: 'row'}}>
                            <View style = {{width: 100, alignItems: 'center', justifyContent: 'center'}}>
                                <Image style = {{width: '100%', height: 40, resizeMode: 'contain'}} source = {require("../assets/images/medal_icon.png")}></Image>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 12, color: '#000000', marginTop: 5}]}>Total Score:</Text>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#000000'}]}>12.4</Text>
                            </View>
                            <View style = {{width: 1, height: '60%', backgroundColor: '#000000'}}/>
                            <View style = {{width: 100, alignItems: 'center', justifyContent: 'center'}}>
                                <Image style = {{width: '100%', height: 40, resizeMode: 'contain'}} source = {require("../assets/images/barchart_icon.png")}></Image>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 12, color: '#000000', marginTop: 5}]}>Total Score:</Text>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#000000'}]}>30</Text>
                            </View>
                        </View>
                        <View style = {{width: '60%', justifyContent: 'center', alignItems: 'center', marginVertical: 30}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#808080'}]}>{this.state.contents_text}</Text>
                        </View>
                        <View style = {styles.input_component}>
                            <TextInput style = {styles.input_style} placeholder = {'Enther your email'}></TextInput>
                        </View>
                        <View style = {{width: '100%', height: 40, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 40, borderWidth: 1, borderColor: '#808080', justifyContent: 'center', alignItems: 'center'}}  onPress = {() => this.props.navigation.navigate("ConclusionScreen")}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, color: '#2AB7CA'}]}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
    },
    input_style: {
        width: '80%',
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#808080',
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