
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
import { StackActions, NavigationActions } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class PictureCheckScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            answerType: "",
            image_uri: "",
            video_uri: "",
            answer_text: "",
            mission: "",
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

    componentWillUnmount = () => {
        this.initListener()
    }

    save_answer = async() => {
        // this.props.navigation.dispatch(
        //     StackActions.replace("CreateSummaryScreen", {answerType: "IMAGE", image_uri: this.state.image_uri, mission: this.state.mission})
        // )
        this.setState({
            loading: true
        })
        let params = new FormData();
        params.append("gameAuthToken", Global.gameAuthToken);
        params.append("playerAuthToken", Global.playerAuthToken);
        params.append("answer", this.state.answer_text);
        var filename = Date.now();
        if(this.state.answerType == "IMAGE") {
            params.append('answerFile', {
                uri: this.state.image_uri,
                type: 'image/jpeg',
                name: filename + '.jpg'
            });
        } else if(this.state.answerType == "VIDEO") {
            params.append('answerFile', {
                uri: this.state.video_uri,
                type: 'video/mp4',
                name: filename + '.mp4'
            });
        }
        
        await fetch(Global.BASE_URL + 'index.php/answer', {
            method: "POST",
            body: params
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            if(responseData.success) {
                if(this.state.answerType == "IMAGE") {
                    this.props.navigation.dispatch(
                        StackActions.replace("CreateSummaryScreen", {answerType: "IMAGE", image_uri: this.state.image_uri, mission: this.state.mission})
                    )
                    // this.props.navigation.navigate("CreateSummaryScreen", {answerType: "IMAGE", image_uri: this.state.image_uri, mission: this.state.mission});
                } else if(this.state.answerType == "VIDEO") {
                    this.props.navigation.dispatch(
                        StackActions.replace("CreateSummaryScreen", {answerType: "VIDEO", video_uri: this.state.video_uri, mission: this.state.mission})
                    )
                    // this.props.navigation.navigate("CreateSummaryScreen", {answerType: "VIDEO", video_uri: this.state.video_uri, mission: this.state.mission});
                } else if(this.state.answerType == "TEXT") {
                    this.props.navigation.dispatch(
                        StackActions.replace("CreateSummaryScreen", {answerType: "TEXT", answer_text: this.state.answer_text, mission: this.state.mission})
                    )
                    // this.props.navigation.navigate("CreateSummaryScreen", {answerType: "TEXT", answer_text: this.state.answer_text, mission: this.state.mission});
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
                    <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: isIphoneX ? 55 : 20}}>
                        <Image style = {{width: 80, height: 80, resizeMode: 'contain'}} source = {require("../assets/images/faceicon.png")}/>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 20}]}>YOUR CREATION</Text>
                        <View style = {[stylesGlobal.mission_shadow_view, {zIndex: -1}]}>
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
                        <View style = {{width: '100%', height: 40, flexDirection: 'row', marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: 40, height: 40, borderRadius: 40, borderWidth: 1, borderColor: '#808080', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.props.navigation.goBack()}>
                                <Image style = {{width: 20, height: 20, resizeMode: 'contain', tintColor: '#808080'}} source = {require("../assets/images/left_arrow.png")}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity style = {{width: '60%', height: 40, marginLeft: 10, borderRadius: 40, borderWidth: 1, borderColor: '#808080', justifyContent: 'center', alignItems: 'center'}}  onPress = {() => this.save_answer()}>
                                <Image style = {{width: '100%', height: '60%', resizeMode: 'contain'}} source = {require("../assets/images/logo.png")}></Image>
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