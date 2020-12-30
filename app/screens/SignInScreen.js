
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
    BackHandler
} from 'react-native';

import {stylesGlobal} from '../styles/stylesGlobal';
import LocalizeString from '../assets/languages/strings';
import * as Global from "../Global/Global";
import ProgressIndicator from "../components/ProgressIndicator";
import KeepAwake from 'react-native-keep-awake';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSplashScreen: true,
            game_code: "",
            loading: false,
        }
    }

    UNSAFE_componentWillMount() {
        
        BackHandler.addEventListener('hardwareBackPress', () => {return true});
        setTimeout(async() => {
            this.setState({
                isSplashScreen: false
            });
        }, 1000);
    }
    

    onContinue = async() => {
        // var other_game_members_data = [{"answer": "https://dev.edit.co.il/tadam/files/o9DnQjvwz24RgiEahxaY/5f28ca0b22b3c.mp3", "answerType": "AUDIO", "voteTargetAuthToken": "5f28c93e7796e"}, {"answer": "https://dev.edit.co.il/tadam/files/o9DnQjvwz24RgiEahxaY/5f28ca0b26100.mp3", "answerType": "AUDIO", "voteTargetAuthToken": "5f28c9409eccf"}, {"answer": "https://dev.edit.co.il/tadam/files/o9DnQjvwz24RgiEahxaY/5f28ca0b2812a.mp3", "answerType": "AUDIO", "voteTargetAuthToken": "5f28c942876bb"}]
        // this.props.navigation.navigate("RateOthersScreen", {other_game_members_data: other_game_members_data, other_rating_timeLimit: 1596510000})
        Keyboard.dismiss()
        if(this.state.game_code.trim() == "") {
            Alert.alert("Warning!", "Please enter gmae code you got");
            return;
        }
        this.setState({
            loading: true
        })
        let params = new FormData();
        params.append("gameUniqueId", this.state.game_code);

        await fetch(Global.BASE_URL + 'index.php/login', {
            method: "POST",
            body: params
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            console.log(responseData)
            if(responseData.success) {
                Global.gameAuthToken = responseData.gameAuthToken;
                Global.gamestart_time = responseData.gameStartTimestamp;
                this.get_gamemanager_profile();
                this.props.navigation.navigate("CreateNameScreen");
            } else {
                var error_text = responseData.error_text;
                if(error_text == null) {
                    error_text = "";
                }
                Alert.alert("Warning!", error_text);
            }
            
        })
        .catch(error => {
            Alert.alert("Warning!", "Network error");
        });
        this.setState({
            loading: false
        })
    }

    get_gamemanager_profile = async() => {
        await fetch(Global.BASE_URL + 'index.php/game/?gameAuthToken=' + Global.gameAuthToken, {
            method: "GET",
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            console.log("game start intro response")
            console.log(responseData)
            if(responseData.success) {
                
                if(responseData.gameManagerProfileImage != null && responseData.gameManagerProfileImage != "") {
                    Global.game_manager_image_path = responseData.gameManagerProfileImage;
                    Global.gameInstructions = responseData.gameInstructions;
                }
                
            } else {
                
                var error_text = responseData.error_text;
                if(error_text == null) {
                    error_text = "";
                }
            }
            
        })
        .catch(error => {
            console.log(error)
            this.setState({
                loading: false
            })
            Alert.alert("Warning!", "Network error");
        });
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
                            {/* <View style = {styles.input_component}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 16}]}>Your name</Text>
                                <TextInput style = {[styles.input_style, stylesGlobal.general_font_style]} placeholder = {"enter name or nickname"}></TextInput>
                            </View> */}
                            <View style = {styles.input_component}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 16}]}>Game code</Text>
                                <TextInput style = {[styles.input_style, stylesGlobal.general_font_style]} placeholder = {"enter the code you got"} onChangeText = {(text) => this.setState({game_code: text})} onSubmitEditing = {() => this.onContinue()}></TextInput>
                            </View>
                        </View>
                        <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                            <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 20, borderColor: '#000000', borderWidth: 1, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.onContinue()}>
                                <Text style = {[stylesGlobal.general_font_style, {color: '#2AB7CA', fontSize: 16}]}>LET ME IT!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = {{width: '100%', height: 100, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} >
                            <Image style = {{width: 20, height: 20, tintColor: '#2AB7CA', resizeMode: 'contain'}} source = {require("../assets/images/plus.png")}/>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, marginLeft: 10}]}>{LocalizeString.login_create_new_game}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            }
            <KeepAwake />
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