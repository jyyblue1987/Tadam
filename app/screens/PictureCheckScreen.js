
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
import VideoPlayer from 'react-native-video-player';
import { StackActions, NavigationActions } from '@react-navigation/native';
import {format_time} from '../utils/utils';
import {writeFile, readFile, readFileAssets, copyFile, readDir, exists, mkdir, unlink, DocumentDirectoryPath, DownloadDirectoryPath, LibraryDirectoryPath} from 'react-native-fs';
import KeepAwake from 'react-native-keep-awake';

var RNFS = require('react-native-fs');

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class PictureCheckScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            game_image_path: "",
            answerType: "",
            image_uri: "",
            video_uri: "",
            audio_uri: "",
            answer_text: "",
            mission: "",

            file_temp_path: DocumentDirectoryPath + Global.file_temp_path,
            percentage_done: 0
        }
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {return true});
        this.initListener = this.props.navigation.addListener('focus', this.init_data.bind(this));
    }

    init_data = async() => {
        var difference_time = this.props.route.params.questionEndTimestamp - Math.floor(Date.now() / 1000);
        this.setState({
            answerType: this.props.route.params.answerType,
            questionEndTimestamp: this.props.route.params.questionEndTimestamp,
            game_image_path: Global.game_image_path,
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
                if(this.state.answerType == "IMAGE") {
                    this.props.navigation.navigate("CreateSummaryScreen", {answerType: "IMAGE", image_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                } else if(this.state.answerType == "VIDEO") {
                    this.props.navigation.navigate("CreateSummaryScreen", {answerType: "VIDEO", video_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                } else if(this.state.answerType == "TEXT") {
                    this.props.navigation.navigate("CreateSummaryScreen", {answerType: "TEXT", answer_text: "", questionEndTimestamp: this.state.questionEndTimestamp});
                } else if(this.state.answerType == "AUDIO") {
                    this.props.navigation.navigate("CreateSummaryScreen", {answerType: "AUDIO", audio_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                }
            } else {
                difference_time += 5;
                this.timer = setInterval(() => {
                    difference_time -= 1;
                    
                    if(difference_time == 0) {
                        clearInterval(this.timer);
                        if(this.state.answerType == "IMAGE") {
                            this.props.navigation.navigate("CreateSummaryScreen", {answerType: "IMAGE", image_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                        } else if(this.state.answerType == "VIDEO") {
                            this.props.navigation.navigate("CreateSummaryScreen", {answerType: "VIDEO", video_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                        } else if(this.state.answerType == "TEXT") {
                            this.props.navigation.navigate("CreateSummaryScreen", {answerType: "TEXT", answer_text: "", questionEndTimestamp: this.state.questionEndTimestamp});
                        } else if(this.state.answerType == "AUDIO") {
                            this.props.navigation.navigate("CreateSummaryScreen", {answerType: "AUDIO", audio_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                        }
                    }
                }, 1000);
            }
        })
    }

    componentWillUnmount = () => {
        this.props.navigation.removeListener("focus");
    }

    save_answer = async() => {
        clearInterval(this.timer);
        this.setState({
            loading: true
        })
        
        var filename = Date.now().toString();

        if(this.state.image_uri != "" || this.state.video_uri != "" || this.state.audio_uri != "") {
            // if(this.state.answerType == "IMAGE") {
            //     params.append('answerFile', {
            //         uri: this.state.image_uri,
            //         type: 'image/jpeg',
            //         name: filename + '.jpg'
            //     });
            // } else if(this.state.answerType == "VIDEO") {
            //     params.append('answerFile', {
            //         uri: this.state.video_uri,
            //         type: 'video/mp4',
            //         name: filename + '.mp4'
            //     });
            // } else if(this.state.answerType == "AUDIO") {
            //     if(Platform.OS == "android") {
            //         params.append('answerFile', {
            //             uri: this.state.audio_uri,
            //             type: 'video/mp4',
            //             name: filename + '.mp4'
            //         });
            //     } else if(Platform.OS == "ios") {
            //         params.append('answerFile', {
            //             uri: this.state.audio_uri,
            //             type: 'video/mp4',
            //             name: filename + '.m4a'
            //         });
            //     }
            // }
            var filepath = "";
            var files = [];
            var selected_file = "";
            if(this.state.answerType == "IMAGE") {
                selected_file = this.state.image_uri;
                filename = filename + ".png";
            } else if(this.state.answerType == "VIDEO") {
                selected_file = this.state.video_uri;
                filename = filename + ".mp4";
            } else if(this.state.answerType == "AUDIO") {
                selected_file = this.state.audio_uri;
                if(Platform.OS == "android") {
                    filename = filename + ".mp4";
                } else {
                    filename = filename + ".m4a";
                }
            }
            
            await copyFile(selected_file, this.state.file_temp_path + filename)
            .then((res) => {
                filepath = this.state.file_temp_path + filename;
                
                console.log("333333::" + filepath);

            })
            .catch((error) => {
                console.log(error)
            })

            var uploadBegin = (response) => {
                
            };
            
            var uploadProgress = (response) => {
                var percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
                this.setState({
                    percentage_done: percentage
                })
                console.log('UPLOAD IS ' + percentage + '% DONE!');
            };
            
            
            if(this.state.answerType == "IMAGE") {
                files = [
                    {
                        name: "answerFile",
                        filename: filename + '.png',
                        filepath: filepath,
                        filetype: 'image/png'
                    }
                ];
            } else if(this.state.answerType == "VIDEO") {
                files = [
                    {
                        name: "answerFile",
                        filename: filename + '.mp4',
                        filepath: filepath,
                        filetype: 'video/mp4'
                    }
                ];
            } else if(this.state.answerType == "AUDIO") {
                if(Platform.OS == "android") {
                    files = [
                        {
                            name: "answerFile",
                            filename: filename + '.mp4',
                            filepath: filepath,
                            filetype: 'video/mp4'
                        }
                    ];
                } else if(Platform.OS == "ios") {
                    files = [
                        {
                            name: "answerFile",
                            filename: filename + '.m4a',
                            filepath: filepath,
                            filetype: 'video/mp4'
                        }
                    ];
                }
            }

            console.log("asdfasdfasdf:::" + filepath)
            await RNFS.uploadFiles({
                toUrl: Global.BASE_URL + 'index.php/answer',
                files: files,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                fields: {
                    'gameAuthToken': Global.gameAuthToken,
                    "playerAuthToken": Global.playerAuthToken
                },
                begin: uploadBegin,
                progress: uploadProgress
            }).promise.then(response => {
                if (response.statusCode == 200) {
                    var responseData = JSON.parse(response.body);
                    if(responseData.success) {
                        this.setState({
                            loading: false
                        })
                        if(this.state.answerType == "IMAGE") {
                            this.props.navigation.navigate("CreateSummaryScreen", {answerType: "IMAGE", image_uri: this.state.image_uri, questionEndTimestamp: this.state.questionEndTimestamp});
                        } else if(this.state.answerType == "VIDEO") {
                            this.props.navigation.navigate("CreateSummaryScreen", {answerType: "VIDEO", video_uri: this.state.video_uri, questionEndTimestamp: this.state.questionEndTimestamp});
                        } else if(this.state.answerType == "TEXT") {
                            this.props.navigation.navigate("CreateSummaryScreen", {answerType: "TEXT", answer_text: this.state.answer_text, questionEndTimestamp: this.state.questionEndTimestamp});
                        } else if(this.state.answerType == "AUDIO") {
                            this.props.navigation.navigate("CreateSummaryScreen", {answerType: "AUDIO", audio_uri: this.state.audio_uri, questionEndTimestamp: this.state.questionEndTimestamp});
                        }
                    } else {
                        this.game_state();
                        // if(this.state.answerType == "IMAGE") {
                        //     this.props.navigation.navigate("CreateSummaryScreen", {answerType: "IMAGE", image_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                        // } else if(this.state.answerType == "VIDEO") {
                        //     this.props.navigation.navigate("CreateSummaryScreen", {answerType: "VIDEO", video_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                        // } else if(this.state.answerType == "TEXT") {
                        //     this.props.navigation.navigate("CreateSummaryScreen", {answerType: "TEXT", answer_text: "", questionEndTimestamp: this.state.questionEndTimestamp});
                        // } else if(this.state.answerType == "AUDIO") {
                        //     this.props.navigation.navigate("CreateSummaryScreen", {answerType: "AUDIO", audio_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                        // }
                    }
                } else {
                    this.game_state();
                    console.log('SERVER ERROR');
                }
            })

            .catch((err) => {
                this.game_state();
                if(err.description === "cancelled") {
                    // cancelled by user
                }
                console.log(err);
            });

        } else {
            let params = new FormData();
            params.append("gameAuthToken", Global.gameAuthToken);
            params.append("playerAuthToken", Global.playerAuthToken);
            params.append("answer", this.state.answer_text);

            await fetch(Global.BASE_URL + 'index.php/answer', {
                method: "POST",
                body: params
            })
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                console.log("game question answer")
                console.log(responseData)
                if(responseData.success) {
                    if(this.state.answerType == "IMAGE") {
                        this.setState({
                            loading: false
                        })
                        // this.props.navigation.dispatch(
                        //     StackActions.replace("CreateSummaryScreen", {answerType: "IMAGE", image_uri: this.state.image_uri, mission: this.state.mission, questionEndTimestamp: this.props.route.params.questionEndTimestamp})
                        // )
                        this.props.navigation.navigate("CreateSummaryScreen", {answerType: "IMAGE", image_uri: this.state.image_uri, questionEndTimestamp: this.state.questionEndTimestamp});
                    } else if(this.state.answerType == "VIDEO") {
                        this.props.navigation.navigate("CreateSummaryScreen", {answerType: "VIDEO", video_uri: this.state.video_uri, questionEndTimestamp: this.state.questionEndTimestamp});
                    } else if(this.state.answerType == "TEXT") {
                        this.props.navigation.navigate("CreateSummaryScreen", {answerType: "TEXT", answer_text: this.state.answer_text, questionEndTimestamp: this.state.questionEndTimestamp});
                    } else if(this.state.answerType == "AUDIO") {
                        this.props.navigation.navigate("CreateSummaryScreen", {answerType: "AUDIO", audio_uri: this.state.audio_uri, questionEndTimestamp: this.state.questionEndTimestamp});
                    }
                } else {
                    this.game_state();
                    // if(this.state.answerType == "IMAGE") {
                    //     this.props.navigation.navigate("CreateSummaryScreen", {answerType: "IMAGE", image_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                    // } else if(this.state.answerType == "VIDEO") {
                    //     this.props.navigation.navigate("CreateSummaryScreen", {answerType: "VIDEO", video_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                    // } else if(this.state.answerType == "TEXT") {
                    //     this.props.navigation.navigate("CreateSummaryScreen", {answerType: "TEXT", answer_text: "", questionEndTimestamp: this.state.questionEndTimestamp});
                    // } else if(this.state.answerType == "AUDIO") {
                    //     this.props.navigation.navigate("CreateSummaryScreen", {answerType: "AUDIO", audio_uri: "", questionEndTimestamp: this.state.questionEndTimestamp});
                    // }
                }
            })
            .catch(error => {
                this.game_state();
                console.log(error)
                Alert.alert("Warning!", "Network error");
            });
        }

        
    }

    game_state = async() => {

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
                if(responseData.success) {
                    if(responseData.gameState == "question") {
                        clearInterval(this.waiting_timer);
                        this.get_question();
                    } else if(responseData.gameState == "results") {
                        clearInterval(this.waiting_timer);
                        this.setState({
                            loading: false
                        })
                        this.props.navigation.navigate("YourRankScreen");
                    } else if(responseData.gameState == "completed") {
                        clearInterval(this.waiting_timer);
                        this.setState({
                            loading: false
                        })
                        this.props.navigation.navigate("SendEmailScreen");
                    } else if(responseData.gameState == "rank") {
                        clearInterval(this.waiting_timer);
                        this.setState({
                            loading: false
                        })
                        this.props.navigation.navigate("RateOthersIntroScreen");
                    }
                    
                } else {
                    this.setState({
                        loading: false
                    })
                    var error_text = responseData.error_text;
                    if(error_text == null) {
                        error_text = "";
                    }
                    // Alert.alert("Warning!", error_text);
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

    go_backaction() {
        if(this.state.questionEndTimestamp > Math.floor(Date.now() / 1000)) {
            this.props.navigation.goBack();
        }
    }

    render() {
        return (
            <View style = {styles.container} onStartShouldSetResponder = {() => Keyboard.dismiss()}>
            {
                this.state.loading && <ProgressIndicator percentage = {this.state.percentage_done}/>
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
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 20}]}>YOUR CREATION</Text>
                        <View style = {[stylesGlobal.mission_shadow_view, {zIndex: -1}]}>
                            <View style = {[stylesGlobal.mission_color_view, {backgroundColor: '#ffffff', paddingVertical: 0, paddingHorizontal: 0, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}]}>
                            {
                                this.state.answerType == "IMAGE" && this.state.image_uri != "" &&
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
                                    thumbnail = {require("../assets/images/logo.png")}
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
                        <View style = {{width: '100%', height: 40, flexDirection: 'row', marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: 40, height: 40, borderRadius: 40, borderWidth: 1, borderColor: '#808080', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.go_backaction()}>
                                <Image style = {{width: 20, height: 20, resizeMode: 'contain', tintColor: '#808080'}} source = {require("../assets/images/left_arrow.png")}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity style = {{width: '60%', height: 40, marginLeft: 10, borderRadius: 40, borderWidth: 1, borderColor: '#808080', justifyContent: 'center', alignItems: 'center'}}  onPress = {() => this.save_answer()}>
                                <Image style = {{width: '100%', height: '60%', resizeMode: 'contain'}} source = {require("../assets/images/logo.png")}></Image>
                            </TouchableOpacity>
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