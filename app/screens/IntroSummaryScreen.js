
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
import ProgressIndicator from "../components/ProgressIndicator";
import * as Global from "../Global/Global";

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class IntroSummaryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            contents_text: 'Today we will invistigate the use of symbols but from a different angle We are waiting to see your take on the mission',
            count_down_time: "00:00:00"
        }
    }

    UNSAFE_componentWillMount = async() => {
        this.setState({
            loading: true
        })


        await fetch(Global.BASE_URL + 'index.php/game/?gameAuthToken=' + Global.gameAuthToken, {
            method: "GET",
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            
            if(responseData.success) {
                // var gameStartTimestamp = responseData.gameStartTimestamp;
                var gameStartTimestamp = Global.gamestart_time
                var current_time = Date.now();
                // current_time = 1593245500000
                
                if(Math.floor(current_time / 1000) >= gameStartTimestamp) {
                    this.props.navigation.navigate("MissionFirstScreen");
                } else {
                    var difference_time = gameStartTimestamp - Math.floor(current_time / 1000);
                    this.setState({
                        count_down_time: this.format_time(difference_time)
                    })
                    this.timer = setInterval(() => {
                        difference_time -= 1;
                        this.setState({
                            count_down_time: this.format_time(difference_time)
                        })
                        if(difference_time == 0) {
                            clearInterval(this.timer);
                            this.props.navigation.navigate("MissionFirstScreen");
                        }
                    }, 1000);
                }
            } else {
                var error_text = responseData.error_text;
                if(error_text == null) {
                    error_text = "";
                }
                Alert.alert("Warning!", error_text);
            }
            
        })
        .catch(error => {
            console.log(error)
            Alert.alert("Warning!", "Network error");
        });
        this.setState({
            loading: false
        })
    }

    format_time(seconds_time) {
        var hour = Math.floor(seconds_time / 3600);
        var minute = Math.floor((seconds_time - 3600 * hour) / 60);
        var seconds = seconds_time - 3600 * hour - 60 * minute;
        var hour_str = "";
        var minute_str = "";
        var second_str = "";
        if(hour < 10) {
            hour_str = "0" + hour.toString();
        } else {
            hour_str = hour.toString();
        }
        if(minute < 10) {
            minute_str = "0" + minute.toString();
        } else {
            minute_str = minute.toString();
        }
        if(seconds < 10) {
            seconds_str = "0" + seconds.toString();
        } else {
            seconds_str = seconds.toString();
        }
        return hour_str + ":" + minute_str + ":" + seconds_str
    }

    render() {
        return (
            <View style = {styles.container} onStartShouldSetResponder = {() => Keyboard.dismiss()}>
            {
                this.state.loading && <ProgressIndicator/>
            }
                <View style = {stylesGlobal.left_color_bar}>
                    <View style = {stylesGlobal.left_color_bar_first}/>
                    <View style = {stylesGlobal.left_color_bar_second}/>
                    <View style = {stylesGlobal.left_color_bar_third}/>
                    <View style = {stylesGlobal.left_color_bar_forth}/>
                    <View style = {stylesGlobal.left_color_bar_fifth}/>
                </View>
                <View style = {styles.main_container}>
                    <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: 60}}>
                        <Image style = {{width: 80, height: 80, resizeMode: 'contain'}} source = {require("../assets/images/faceicon.png")}/>
                        <View style = {{width: '90%', height: 150,}}>
                            <ImageBackground style = {{width: '100%', height: '100%' }} resizeMode = {'stretch'} source = {require("../assets/images/summary_message_container.png")}>
                                <View style = {{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#7A7A7A'}]}>{this.state.contents_text}</Text>
                                </View>
                            </ImageBackground>
                        </View>
                        <Image style = {{width: '100%', height: 80, marginTop: 50, resizeMode: 'contain'}} source = {require("../assets/images/summary_flag.png")}/>
                        <View style = {{width: '80%', alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 24,}]}>GET READY FOR YOUR</Text>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 24,}]}>FIRST MISSION</Text>
                        </View>
                        <View style = {{width: '100%', marginTop: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                            <Image style = {{width: 25, height: 25, resizeMode: 'contain', tintColor: '#FED766'}} source = {require("../assets/images/mission_timer.png")}></Image>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#FED766', fontWeight: 'bold', marginLeft: 10}]}>{this.state.count_down_time}</Text>
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