
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

export default class CreateSummaryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contents_text: "people will get a chance to rank your creation, mean whille relax and rank the other candidates"
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
                        <Image style = {{width: 80, height: 80, resizeMode: 'contain'}} source = {require("../assets/images/mission_number3.png")}/>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 20}]}>YOUR CREATION</Text>
                        <View style = {{width: '80%', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center'}]}>{this.state.contents_text}</Text>
                        </View>
                        
                        <View style = {stylesGlobal.mission_shadow_view}>
                            <View style = {[stylesGlobal.mission_color_view, {backgroundColor: '#FED766'}]}>
                                
                            </View>
                        </View>
                        <View style = {{width: '100%', height: 40, marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: '80%', height: 40, marginLeft: 10, borderRadius: 40, borderWidth: 1, borderColor: '#808080', justifyContent: 'center', alignItems: 'center'}}  onPress = {() => this.props.navigation.navigate("PictureCheckScreen")}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, color: '#2AB7CA'}]}>ALRIGHT!</Text>
                            </TouchableOpacity>
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