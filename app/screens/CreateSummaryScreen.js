
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
import {format_time} from '../utils/utils';
import KeepAwake from 'react-native-keep-awake';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class CreateSummaryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            contents_text: "people will get a chance to rank your creation, mean whille relax and rank the other candidates",
            answerType: "",
            image_uri: "",
            video_uri: "",
            answer_text: "",
            audio_uri: "",
        }
    }

    componentDidMount() {

        this.initListener = this.props.navigation.addListener('focus', this.init_data.bind(this));
        
    }

    init_data() {

        var difference_time = this.props.route.params.questionEndTimestamp - Math.floor(Date.now() / 1000);
        
        this.setState({
            answerType: this.props.route.params.answerType,
            count_down_time: format_time(difference_time),
            game_image_path: Global.game_image_path
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
            } else if(this.state.answerType == "AUDIO") {
                this.setState({
                    audio_uri: this.props.route.params.audio_uri,
                })
            }
            if(difference_time <= 0) {
                this.props.navigation.navigate("RateOthersIntroScreen");
            } else {
                this.timer = setInterval(() => {
                    difference_time -= 1;
                    this.setState({
                        count_down_time: format_time(difference_time),
                        difference_time: difference_time
                    })
                    if(difference_time == 0) {
                        clearInterval(this.timer);
                        this.props.navigation.navigate("RateOthersIntroScreen");
                    }
                }, 1000);
            }
        })
    }

    componentWillUnmount = async() => {
        
        this.props.navigation.removeListener("focus");
        
    }

    // componentDidUpdate(){
    //     if(this.state.difference_time == 0){ 
    //         clearInterval(this.timer);
    //         this.props.navigation.navigate("RateOthersIntroScreen");
    //     }
    // }

    // next_question = async() => {
    //     // if(this.state.mission == "first") {
    //     //     this.props.navigation.navigate("MissionSecondScreen");
    //     // } else if(this.state.mission == "second") {
    //     //     this.props.navigation.navigate("MissionThirdScreen");
    //     // } else if(this.state.mission == "third") {
    //     //     // this.props.navigation.navigate("MissionThirdScreen");
    //     // }
    //     this.setState({
    //         loading: true
    //     })
    //     await fetch(Global.BASE_URL + 'index.php/nextquestion/?gameAuthToken=' + Global.gameAuthToken, {
    //         method: "GET",
    //     })
    //     .then(response => {
    //         return response.json();
    //         // const status_code = response.status;
    //         // if(status_code == 200) {
    //         //     if(this.state.mission == "first") {
    //         //         this.props.navigation.navigate("MissionSecondScreen");
    //         //     } else if(this.state.mission == "second") {
    //         //         this.props.navigation.navigate("MissionThirdScreen");
    //         //     } else if(this.state.mission == "third") {
    //         //         // this.props.navigation.navigate("MissionThirdScreen");
    //         //     }
    //         // } else {
    //         //     Alert.alert("Warning!", "Your game code is wrong. Please try again");
    //         // }
    //     })
    //     .then(responseData => {
    //         console.log(JSON.stringify(responseData))
    //         if(responseData.success) {
    //             if(this.state.mission == "first") {
    //                 this.props.navigation.navigate("MissionSecondScreen");
    //             } else if(this.state.mission == "second") {
    //                 this.props.navigation.navigate("MissionThirdScreen");
    //             } else if(this.state.mission == "third") {
    //                 // this.props.navigation.navigate("MissionThirdScreen");
    //             }
    //         } else {
    //             var error_text = responseData.error_text;
    //             if(error_text == null) {
    //                 error_text = "";
    //             }
    //             Alert.alert("Warning!", error_text);
    //         }
    //     })
    //     .catch(error => {
    //         console.log(error)
    //         success = false;
    //         Alert.alert("Warning!", "Network error");
    //     });
    //     this.setState({
    //         loading: false
    //     })
    // }

    render() {
        return (
            <View style = {styles.container} >
                <View style = {stylesGlobal.left_color_bar}>
                    <View style = {stylesGlobal.left_color_bar_first}/>
                    <View style = {stylesGlobal.left_color_bar_second}/>
                    <View style = {stylesGlobal.left_color_bar_third}/>
                    <View style = {stylesGlobal.left_color_bar_forth}/>
                    <View style = {stylesGlobal.left_color_bar_fifth}/>
                </View>
                <View style = {styles.main_container}>
                    <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: isIphoneX ? 55 : 20}}>
                        <View style = {{width: 80, height: 80, borderRadius: 80, overflow: 'hidden'}}>
                        {
                            this.state.game_image_path == "" &&
                            <Image style = {{width: '100%', height: '100%', resizeMode: 'cover'}} source = {require("../assets/images/default_avatar.jpg")}/>
                        }
                        {
                            this.state.game_image_path != "" &&
                            <Image style = {{width: '100%', height: '100%', resizeMode: 'cover'}} source = {{uri: this.state.game_image_path}}/>
                        }   
                        </View>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 20}]}>GOOD JOB!</Text>
                        <View style = {{width: '80%', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center'}]}>{this.state.contents_text}</Text>
                        </View>
                        
                        <View style = {stylesGlobal.mission_shadow_view}>
                            <View style = {[stylesGlobal.mission_color_view, {backgroundColor: '#ffffff', paddingVertical: 0, paddingHorizontal: 0, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}]}>
                            {
                                this.state.answerType == "IMAGE" &&
                                <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source={this.state.image_uri != "" ? {uri: this.state.image_uri} : {}}></Image>
                            }
                            {
                                this.state.answerType == "VIDEO" && this.state.video_uri != "" &&
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
                            {
                                this.state.answerType == "AUDIO" && this.state.audio_uri != "" &&
                                <View style = {{width: width * 0.9 - 30, height: '100%'}}>
                                    <Image style = {{width: width * 0.9 - 30 - 50, height: '100%', position: 'absolute', left: 25, top: 0, resizeMode: 'contain'}} source = {require("../assets/images/logo.png")}></Image>
                                    <VideoPlayer
                                        ref={ref => this._video = ref}
                                        // videoWidth={height * 0.7}
                                        // videoHeight={height * 0.7}
                                        disableFullscreen
                                        autoplay
                                        video={{uri: this.state.audio_uri}}
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
                                </View>
                            }
                            </View>
                        </View>
                        <View style = {{width: '100%', height: 40, marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                            <Image style = {{width: 25, height: 25, resizeMode: 'contain', tintColor: '#808080'}} source = {require("../assets/images/mission_timer.png")}></Image>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#808080', fontWeight: 'bold', marginLeft: 10}]}>{this.state.count_down_time}</Text>
                        </View>
                    </View>
                </View>
            {
                this.state.loading && <ProgressIndicator/>
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