
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
import StarRating from 'react-native-star-rating';
import KeepAwake from 'react-native-keep-awake';
import ProgressIndicator from "../components/ProgressIndicator";
import * as Global from "../Global/Global";

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class SendEmailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contents_text: "Enter your email and we'll send you your creations",
            score: "",
            rank: "",
            loading: false,
            email: ""
        }
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {return true});
        this.initListener = this.props.navigation.addListener('focus', this.init_data.bind(this));

        
    }

    init_data = async() => {
        this.setState({
            loading: true
        })
        await fetch(Global.BASE_URL + 'index.php/summary/?gameAuthToken=' + Global.gameAuthToken + '&playerAuthToken=' + Global.playerAuthToken, {
            method: "GET",
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            console.log("summary")
            console.log(responseData)
            if(responseData.success) {
                this.setState({
                    rank: responseData.rank,
                    score: responseData.score
                })
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

    sendEmail = async() => {
        if(this.state.email == "") {
            this.props.navigation.navigate("ConclusionScreen");
        } else {
            if(this.isEmailValid(this.state.email)) {
                let params = new FormData();
                params.append("gameAuthToken", Global.gameAuthToken);
                params.append("playerAuthToken", Global.playerAuthToken);
                params.append("emailAddress", this.state.email);
                
                this.setState({
                    loading: true
                })
                await fetch(Global.BASE_URL + 'index.php/email', {
                    method: "POST",
                    body: params,
                })
                .then(response => {
                    return response.json();
                })
                .then(responseData => {
                    console.log(responseData);
                    if(responseData.success) {
                        this.props.navigation.navigate("ConclusionScreen");
                    } else {
                        
                        var error_text = responseData.error_text;
                        if(error_text == null) {
                            error_text = "";
                        }
                        Alert.alert("Warning!", error_text);
                    }
                })
                .catch(error => {
                    console.log(error + " 00000 ")
                    Alert.alert("Warning!", "Network error");
                });
                this.setState({
                    loading: false
                })
            } else {
                Alert.alert("Waring!", "Please input valid email address");
            }
        }
    }

    isEmailValid = (email) => {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(String(email).toLowerCase())
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
                        <Image style = {{width: 80, height: 80, resizeMode: 'contain'}} source = {Global.game_image_path == "" ? require("../assets/images/default_avatar.jpg") : {uri: Global.game_image_path}}/>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 10}]}>{Global.game_name}</Text>
                        <View style = {{width: '100%', alignItems: 'center', marginTop: 30, justifyContent: 'center', flexDirection: 'row'}}>
                            <View style = {{width: 100, alignItems: 'center', justifyContent: 'center'}}>
                                <Image style = {{width: '100%', height: 40, resizeMode: 'contain'}} source = {require("../assets/images/medal_icon.png")}></Image>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 12, color: '#000000', marginTop: 5}]}>Final Score:</Text>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#000000'}]}>{this.state.score}</Text>
                            </View>
                            <View style = {{width: 1, height: '60%', backgroundColor: '#000000'}}/>
                            <View style = {{width: 100, alignItems: 'center', justifyContent: 'center'}}>
                                <Image style = {{width: '100%', height: 40, resizeMode: 'contain'}} source = {require("../assets/images/barchart_icon.png")}></Image>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 12, color: '#000000', marginTop: 5}]}>Final Rank:</Text>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#000000'}]}>{this.state.rank}</Text>
                            </View>
                        </View>
                        <View style = {{width: '60%', justifyContent: 'center', alignItems: 'center', marginVertical: 30}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#808080'}]}>{this.state.contents_text}</Text>
                        </View>
                        <View style = {styles.input_component}>
                            <TextInput style = {styles.input_style} placeholder = {'Enther your email'} onChangeText = {(text) => this.setState({email: text})}></TextInput>
                        </View>
                        <View style = {{width: '100%', height: 40, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 40, borderWidth: 1, borderColor: '#808080', justifyContent: 'center', alignItems: 'center'}}  onPress = {() => this.sendEmail()}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, color: '#2AB7CA'}]}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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