
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
import * as Global from "../Global/Global";
import ProgressIndicator from "../components/ProgressIndicator";
import ImagePicker from 'react-native-image-picker';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class MissionThirdScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            question: "",
            answerType: "",
            numberOfPoints: 0,
            count_down_time: "00:00:00",
            disable_button: true,

            image_uri: "",
            video_uri: "",

            text_Q_popup_show: false,
            answer_text: "",
            answer_text_temp: ""
        }
    }

    UNSAFE_componentWillMount = async() => {
        BackHandler.addEventListener('hardwareBackPress', () => {return true});
        this.setState({
            loading: true
        })
        
        await fetch(Global.BASE_URL + 'index.php/question/?gameAuthToken=' + Global.gameAuthToken, {
            method: "GET",
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            console.log(responseData)
            if(responseData.success) {
                this.setState({
                    question: responseData.question,
                    answerType: responseData.answerType,
                    numberOfPoints: responseData.numberOfPoints,
                })
                if(responseData.questionEndTimestamp > Date.now() / 1000) {
                    var difference_time = responseData.questionEndTimestamp - Math.floor(Date.now() / 1000);
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
                            this.props.navigation.navigate("MissionThirdScreen");
                        }
                    }, 1000);
                } else {
                    // this.props.navigation.navigate("MissionThirdScreen");
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

    answerAction = async() => {
        if(this.state.answerType == "IMAGE") {
            var options = {
                title: 'Select Image',
                mediaType: 'photo',
                quality: 1.0,
                allowsEditing: false,
                noData: true,
                storageOptions: {
                    skipBackup: true,
                    path: 'images'
                }
            };
    
            ImagePicker.showImagePicker(options, (response) => {
    
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    this.setState({
                        image_uri: response.uri,
                        disable_button: false
                    })
                }
            });
        } else if(this.state.answerType == "VIDEO") {
            const options = {
                title: 'Video Picker',
                takePhotoButtonTitle: 'Take Video...',
                mediaType: 'video',
                videoQuality: 'medium',
            };
    
            ImagePicker.showImagePicker(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled video picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    this.setState({
                        video_uri: response.uri,
                        disable_button: false
                    });
                }
            });
        } else if(this.state.answerType == "TEXT") {
            this.setState({
                text_Q_popup_show: true
            })
        }
    }

    textAnswer = () => {
        this.setState({
            answer_text: this.state.answer_text_temp, 
            text_Q_popup_show: false
        })
        if(this.state.answer_text_temp != "") {
            this.setState({
                disable_button: false
            });
        }
    }

    next_mission = async() => {
        console.log("asdfasdfasdfasfd")
        console.log(this.state.answerType)
        if(this.state.answerType == "IMAGE") {
            this.props.navigation.navigate("PictureCheckScreen", {answerType: "IMAGE", image_uri: this.state.image_uri, mission: 'third'});
        } else if(this.state.answerType == "VIDEO") {
            this.props.navigation.navigate("PictureCheckScreen", {answerType: "VIDEO", video_uri: this.state.video_uri, mission: 'third'});
        } else if(this.state.answerType == "TEXT") {
            this.props.navigation.navigate("PictureCheckScreen", {answerType: "TEXT", answer_text: this.state.answer_text, mission: 'third'});
        }
    }


    render() {
        return (
            <View style = {styles.container} onStartShouldSetResponder = {() => Keyboard.dismiss()}>
            {
                this.state.loading && <ProgressIndicator/>
            }
            {
                this.state.text_Q_popup_show &&
                <View style = {{width: '100%', height: '100%', position: "absolute", top: 0, left: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10, elevation: 20}}>
                    <View style = {{width: '100%', height: '100%', position: "absolute", top: 0, left: 0, backgroundColor: '#000000', opacity: 0.3}}/>
                    <View style = {{width: '90%', backgroundColor: '#ffffff', borderRadius: 10}}>
                        <View style = {{width: '100%', height: 50, justifyContent: 'center', alignItems: 'center',}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#000000'}]}>Please input answer</Text>
                        </View>
                        <View style = {{width: '100%', height: 1, backgroundColor: '#000000'}}/>
                        <View style = {{width: '100%', marginVertical: 10, alignItems: 'center'}}>
                            <TextInput multiline = {true} style = {[stylesGlobal.general_font_style, {width: '90%', height: 150, borderColor: '#d0d0d0', borderWidth: 0.5, borderRadius: 5, padding: 5, fontSize: 14, color: '#000000'}]}
                                onChangeText = {(text) => this.setState({answer_text_temp: text})}
                            >{this.state.answer_text_temp}</TextInput>
                        </View>
                        <View style = {{width: '100%', height: 1, backgroundColor: '#000000'}}/>
                        <View style = {{width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'center'}}>
                            <View style = {{width: '40%', marginRight: 20}}>
                                <TouchableOpacity style = {[stylesGlobal.mission_button, {borderColor: '#000000',}]} onPress = {() => this.setState({text_Q_popup_show: false})}>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, textAlign: 'center', color: '#000000'}]}>CANCEL</Text>
                                </TouchableOpacity>
                            </View>
                            <View style = {{width: '40%'}}>
                                <TouchableOpacity style = {[stylesGlobal.mission_button, {borderColor: '#000000',}]} onPress = {() => this.textAnswer()}>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, textAlign: 'center', color: '#000000'}]}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            }
                <View style = {stylesGlobal.left_color_bar}>
                    <View style = {stylesGlobal.left_color_bar_first}/>
                    <View style = {stylesGlobal.left_color_bar_second}/>
                    <View style = {stylesGlobal.left_color_bar_third}/>
                    <View style = {stylesGlobal.left_color_bar_forth}/>
                    <View style = {stylesGlobal.left_color_bar_fifth}/>
                </View>
                <View style = {styles.main_container}>
                    <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: isIphoneX ? 55 : 20}}>
                        <Image style = {{width: 50, height: 50, resizeMode: 'contain'}} source = {require("../assets/images/mission_number3.png")}/>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 20}]}>YOUR FIRST MISSION HEADING</Text>
                        <View style = {stylesGlobal.mission_shadow_view}>
                            <View style = {[stylesGlobal.mission_color_view, {backgroundColor: '#FED766'}]}>
                                <View style = {{flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                    <Image style = {stylesGlobal.mission_avatar_image} source = {require("../assets/images/intro1_icon.png")}/>
                                    <Text style = {[stylesGlobal.general_font_style, {color: '#ffffff', marginLeft: 10}]}>BY HOVAV</Text>
                                </View>
                                <View style = {{flex: 2, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <TouchableOpacity style = {[stylesGlobal.mission_camera_container_view, {backgroundColor: '#f1b64b'}]} onPress = {() => this.answerAction()}>
                                    {
                                        this.state.answerType == "IMAGE" &&
                                        <Image style = {{width: '60%', height: '60%'}} source = {require("../assets/images/mission_camera.png")}></Image>
                                    }
                                    {
                                        this.state.answerType == "VIDEO" &&
                                        <Image style = {{width: '60%', height: '60%'}} source = {require("../assets/images/mission_video.png")}></Image>
                                    }
                                    {
                                        this.state.answerType == "TEXT" &&
                                        <Image style = {{width: '60%', height: '60%'}} source = {require("../assets/images/mission_doc.png")}></Image>
                                    } 
                                    </TouchableOpacity>
                                </View>
                                <View style = {{flex: 3, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#ffffff'}]}>{this.state.question}</Text>
                                </View>
                                <View style = {{flex: 1.5, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#ffffff', fontWeight: 'bold'}]}>{this.state.numberOfPoints}</Text>
                                    <Image style = {{width: 35, height: 35, marginLeft: 10, resizeMode: 'contain'}} source = {require("../assets/images/mission1_coin.png")}></Image>
                                </View>
                                <View style = {{flex: 1.5, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                    <Image style = {{width: 25, height: 25, resizeMode: 'contain'}} source = {require("../assets/images/mission_timer.png")}></Image>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#ffffff', fontWeight: 'bold', marginLeft: 10}]}>{this.state.count_down_time}</Text>
                                </View>
                                <View style = {{flex: 1.5, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <TouchableOpacity style = {stylesGlobal.mission_button} disabled = {this.state.disable_button} onPress = {() => this.next_mission()}>
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