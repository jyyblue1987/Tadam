
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
import * as Global from "../Global/Global";
import ProgressIndicator from "../components/ProgressIndicator";
import VideoPlayer from 'react-native-video-player';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class CreateSummaryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            contents_text: "people will get a chance to rank your creation, mean whille relax and rank the other candidates",
            answerType: props.route.params.answerType,
            image_uri: "",
            video_uri: "",
            answer_text: "",
            mission: props.route.params.mission,
        }
    }

    UNSAFE_componentWillMount() {

        this.initListener = this.props.navigation.addListener('willFocus', this.init_data());
        
    }

    init_data = async() => {
        this.setState({
            answerType: this.props.route.params.answerType,
            mission: this.props.route.params.mission,
        }, () => {
            if(this.state.answerType == "IMAGE") {
                this.setState({
                    image_uri: this.props.route.params.image_uri,
                })
            } else if(this.state.answerType == "VIDEO") {
                this.setState({
                    video_uri: this.props.route.params.video_uri,
                })
            } else if(this.state.answerType == "TEXT") {
                this.setState({
                    answer_text: this.props.route.params.answer_text,
                })
            }
        })
    }

    componentWillUnmount = async() => {
        this.initListener();
    }

    next_question = async() => {
        // if(this.state.mission == "first") {
        //     this.props.navigation.navigate("MissionSecondScreen");
        // } else if(this.state.mission == "second") {
        //     this.props.navigation.navigate("MissionThirdScreen");
        // } else if(this.state.mission == "third") {
        //     // this.props.navigation.navigate("MissionThirdScreen");
        // }
        this.setState({
            loading: true
        })
        await fetch(Global.BASE_URL + 'index.php/nextquestion/?gameAuthToken=' + Global.gameAuthToken, {
            method: "GET",
        })
        .then(response => {
            return response.json();
            // const status_code = response.status;
            // if(status_code == 200) {
            //     if(this.state.mission == "first") {
            //         this.props.navigation.navigate("MissionSecondScreen");
            //     } else if(this.state.mission == "second") {
            //         this.props.navigation.navigate("MissionThirdScreen");
            //     } else if(this.state.mission == "third") {
            //         // this.props.navigation.navigate("MissionThirdScreen");
            //     }
            // } else {
            //     Alert.alert("Warning!", "Your game code is wrong. Please try again");
            // }
        })
        .then(responseData => {
            console.log(JSON.stringify(responseData))
            if(responseData.success) {
                if(this.state.mission == "first") {
                    this.props.navigation.navigate("MissionSecondScreen");
                } else if(this.state.mission == "second") {
                    this.props.navigation.navigate("MissionThirdScreen");
                } else if(this.state.mission == "third") {
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
            success = false;
            Alert.alert("Warning!", "Network error");
        });
        this.setState({
            loading: false
        })
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
                        <Image style = {{width: 80, height: 80, resizeMode: 'contain'}} source = {require("../assets/images/faceicon.png")}/>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 20}]}>GOOD JOB!</Text>
                        <View style = {{width: '80%', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center'}]}>{this.state.contents_text}</Text>
                        </View>
                        
                        <View style = {stylesGlobal.mission_shadow_view}>
                            <View style = {[stylesGlobal.mission_color_view, {backgroundColor: '#ffffff', paddingVertical: 0, paddingHorizontal: 0, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}]}>
                            {
                                this.state.answerType == "IMAGE" &&
                                <Image style = {{width: '100%', height: '100%', resizeMode: 'cover'}} source={this.state.image_uri != "" ? {uri: this.state.image_uri} : {}}></Image>
                            }
                            {
                                this.state.answerType == "VIDEO" &&
                                <VideoPlayer
                                    ref={ref => this._video = ref}
                                    // videoWidth={height * 0.7}
                                    // videoHeight={height * 0.7}
                                    disableFullscreen
                                    autoplay
                                    video={{uri: this.state.video_uri}}
                                    // resizeMode='cover'
                                    onLoad={() => {
                                        this._video.seek(0);
                                        this._video.pause();
                                    }}
                                    onPlayPress={() => {
                                        this._video.resume();
                                    }}
                                    style = {{width: width * 0.9 - 30, height: '100%'}}
                                />
                            }
                            {
                                this.state.answerType == "TEXT" &&
                                <View style = {{width: '100%', padding: 5}}>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, textAlign: 'center', color: '#000000'}]}>{this.state.answer_text}</Text>
                                </View>
                            }
                            </View>
                        </View>
                        <View style = {{width: '100%', height: 40, marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 40, borderWidth: 1, borderColor: '#808080', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.next_question()}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, color: '#2AB7CA'}]}>ALRIGHT!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            {
                this.state.loading && <ProgressIndicator/>
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