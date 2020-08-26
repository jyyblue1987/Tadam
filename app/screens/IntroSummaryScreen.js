
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
import {format_time} from '../utils/utils';
import KeepAwake from 'react-native-keep-awake';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class IntroSummaryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            contents_text: 'Today we will invistigate the use of symbols but from a different angle We are waiting to see your take on the mission',
            count_down_time: "00:00:00",
            game_manager_image_path: "",
        }
    }

    UNSAFE_componentWillMount = async() => {
        
        this.setState({
            
            loading: true
        })

        this.waiting_timer = setInterval(async() => {
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
                    // var gameStartTimestamp = responseData.gameStartTimestamp;
                    if(responseData.gameManagerProfileImage != null && responseData.gameManagerProfileImage != "") {
                        this.setState({
                            game_manager_image_path: responseData.gameManagerProfileImage
                        })
                    }
                    if(responseData.gameState == "question") {
                        clearInterval(this.waiting_timer);

                        var gameStartTimestamp = Global.gamestart_time
                        var current_time = Date.now();
                        
                        if(Math.floor(current_time / 1000) >= gameStartTimestamp) {
                            this.get_question();
                        } else {
                            var difference_time = gameStartTimestamp - Math.floor(current_time / 1000);
                            this.setState({
                                count_down_time: format_time(difference_time)
                            })
                            this.timer = setInterval(() => {
                                difference_time -= 1;
                                this.setState({
                                    count_down_time: format_time(difference_time)
                                })
                                if(difference_time == 0) {
                                    clearInterval(this.timer);
                                    this.get_question();
                                }
                            }, 1000);
                        }
                    } else if(responseData.gameState == "completed") {
                        clearInterval(this.waiting_timer);
                        this.setState({
                            loading: false
                        })
                        this.props.navigation.navigate("YourRankScreen");
                    } else if(responseData.gameState == "rank") {
                        clearInterval(this.waiting_timer);
                        this.setState({
                            loading: false
                        })
                        this.props.navigation.navigate("RateOthersIntroScreen");
                    } else {
                        this.setState({
                            count_down_time: "Waiting..."
                        })
                    }
                    
                } else {
                    this.setState({
                        loading: false
                    })
                    var error_text = responseData.error_text;
                    if(error_text == null) {
                        error_text = "";
                    }
                    Alert.alert("Warning!", error_text);
                }
                
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    loading: false
                })
                Alert.alert("Warning!", "Network error");
            });
        }, 5000)

        
    }

    get_question = async() => {
        this.setState({
            loading: true
        })
        
        var success = false;

        // await fetch(Global.BASE_URL + 'index.php/startgame/?gameAuthToken=' + Global.gameAuthToken, {
        //     method: "GET",
        // })
        // .then(response => {
        //     // const status_code = response.status;
        //     // if(status_code == 200) {
        //     //     success = true;
        //     // } else {
        //     //     success = false;
        //     //     Alert.alert("Warning!", "Your game code is wrong. Please try again");
        //     // }
        //     return response.json();
        // })
        // .then(responseData => {
        //     console.log("start game")
        //     console.log(responseData)
        //     if(responseData.success == true) {
        //         success = true;
        //     } else {
        //         success = false;
        //         var error_text = responseData.error_text;
        //         if(error_text == null) {
        //             error_text = "";
        //         }
        //         Alert.alert("Warning!", error_text);
        //     }
        // })
        // .catch(error => {
        //     console.log(error)
        //     success = false;
        //     Alert.alert("Warning!", "Network error");
        // });

        // if(success) {
            await fetch(Global.BASE_URL + 'index.php/question/?gameAuthToken=' + Global.gameAuthToken, {
                method: "GET",
            })
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                console.log("question")
                console.log(responseData)
                if(responseData.success) {
                    Global.mission_order = 1;
                    this.props.navigation.navigate("MissionScreen", {question: responseData.question, answerType: responseData.answerType, numberOfPoints: responseData.numberOfPoints, questionEndTimestamp: responseData.questionEndTimestamp});
                    // this.setState({
                    //     question: responseData.question,
                    //     answerType: responseData.answerType,
                    //     numberOfPoints: responseData.numberOfPoints,
                    // })
                    // if(responseData.questionEndTimestamp > Date.now() / 1000) {
                    //     var difference_time = responseData.questionEndTimestamp - Math.floor(Date.now() / 1000);
                    //     this.setState({
                    //         count_down_time: this.format_time(difference_time)
                    //     })
                    //     this.timer = setInterval(() => {
                    //         difference_time -= 1;
                    //         this.setState({
                    //             count_down_time: this.format_time(difference_time)
                    //         })
                    //         if(difference_time == 0) {
                    //             clearInterval(this.timer);
                    //             this.props.navigation.navigate("MissionSecondScreen");
                    //         }
                    //     }, 1000);
                    // } else {
                    //     // this.props.navigation.navigate("MissionSecondScreen");
                    // }
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
        // }
        this.setState({
            loading: false
        })
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
                        <View style = {{width: 80, height: 80, borderRadius: 80, overflow: 'hidden'}}>
                        {
                            this.state.game_manager_image_path == "" &&
                            <Image style = {{width: '100%', height: '100%', resizeMode: 'cover'}} source = {require("../assets/images/default_avatar.jpg")}/>
                        }
                        {
                            this.state.game_manager_image_path != "" &&
                            <Image style = {{width: '100%', height: '100%', resizeMode: 'cover'}} source = {{uri: this.state.game_manager_image_path}}/>
                        }   
                        </View>
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