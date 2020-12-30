
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
    PermissionsAndroid,
    BackHandler
} from 'react-native';

import {stylesGlobal} from '../styles/stylesGlobal';
import * as Global from "../Global/Global";
import ProgressIndicator from "../components/ProgressIndicator";
import ImagePicker from 'react-native-image-picker';
import {format_time} from '../utils/utils';
import ActionSheet from 'react-native-actionsheet';
import DocumentPicker from 'react-native-document-picker';
// import { ActionSheet, ActionSheetAndroid } from 'react-native-cross-actionsheet';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import PermissionsAndroid from 'react-native-permissions';
import KeepAwake from 'react-native-keep-awake';

const audioRecorderPlayer = new AudioRecorderPlayer();

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class MissionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            game_image_path: "",
            game_name: "",
            question: "",
            answerType: "",
            numberOfPoints: 0,
            count_down_time: "00:00:00",
            disable_button: true,

            image_uri: "",
            video_uri: "",

            text_Q_popup_show: false,
            audio_Q_popup_show: false,
            answer_text: "",
            answer_text_temp: "",
            order_array: ["0", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"],
            audio_recording: false
        }
    }

    UNSAFE_componentWillMount = async() => {
        BackHandler.addEventListener('hardwareBackPress', () => {return true});
        this.initListener = this.props.navigation.addListener('focus', this.init_data.bind(this));

    }

    init_data = async() => {
        console.log("this is mission screen init data function")
        var difference_time = this.props.route.params.questionEndTimestamp - Math.floor(Date.now() / 1000);

        this.setState({
            question: this.props.route.params.question, 
            answerType: this.props.route.params.answerType, 
            numberOfPoints: this.props.route.params.numberOfPoints, 
            count_down_time: format_time(difference_time),
            mission_order: Global.mission_order,
            game_image_path: Global.game_image_path,
            game_name: Global.game_name,
            image_uri: "",
            video_uri: "",
            answer_text: "",
            disable_button: true
        }, () => {
            if(difference_time <= 0) {
                this.next_mission();
            } else {
                this.timer = setInterval(() => {
                    difference_time -= 1;
                    this.setState({
                        count_down_time: format_time(difference_time)
                    })
                    if(difference_time == 0) {
                        clearInterval(this.timer);
                        this.next_mission();
                        // this.props.navigation.navigate("MissionSecondScreen");
                    }
                }, 1000);
            }
        })
    }

    componentWillUnmount = () => {
        this.props.navigation.removeListener("focus");
    }

    answerAction = async() => {
        if(this.state.answerType == "IMAGE") {
            // this.ActionSheet.show();
            
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
                clearInterval(this.timer);
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    this.setState({
                        image_uri: response.uri,
                        disable_button: false,
                    }, () => {
                        this.props.navigation.navigate("PictureCheckScreen", {answerType: "IMAGE", image_uri: this.state.image_uri, questionEndTimestamp: this.props.route.params.questionEndTimestamp})
                    })
                }


                // var difference_time = this.props.route.params.questionEndTimestamp - Math.floor(Date.now() / 1000);
                // this.setState({
                //     count_down_time: format_time(difference_time)
                // }, () => {
                //     if(difference_time <= 0) {
                //         this.next_mission();
                //     } else {
                //         this.timer = setInterval(() => {
                //             difference_time -= 1;
                //             this.setState({
                //                 count_down_time: format_time(difference_time)
                //             })
                //             if(difference_time == 0) {
                //                 clearInterval(this.timer);
                //                 this.next_mission();
                //             }
                //         }, 1000);
                //     }
                // })
            });
        } else if(this.state.answerType == "VIDEO") {
            
            const options = {
                title: 'Video Picker',
                takePhotoButtonTitle: 'Take Video...',
                mediaType: 'video',
                quality: 1.0,
                videoQuality: 'low',
                storageOptions:{
                    skipBackup:true,
                    path:'images'
                }
            };
    
            ImagePicker.showImagePicker(options, (response) => {
                clearInterval(this.timer);
                if (response.didCancel) {
                    console.log('User cancelled video picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    console.log(response.uri)
                    this.setState({
                        video_uri: response.uri,
                        disable_button: false
                    }, () => {
                        this.props.navigation.navigate("PictureCheckScreen", {answerType: "VIDEO", video_uri: this.state.video_uri, questionEndTimestamp: this.props.route.params.questionEndTimestamp})
                    });
                }
                // var difference_time = this.props.route.params.questionEndTimestamp - Math.floor(Date.now() / 1000);
                // this.setState({
                //     count_down_time: format_time(difference_time)
                // }, () => {
                //     if(difference_time <= 0) {
                //         this.next_mission();
                //     } else {
                //         this.timer = setInterval(() => {
                //             difference_time -= 1;
                //             this.setState({
                //                 count_down_time: format_time(difference_time)
                //             })
                //             if(difference_time == 0) {
                //                 clearInterval(this.timer);
                //                 this.next_mission();
                //             }
                //         }, 1000);
                //     }
                // })
            });
        } else if(this.state.answerType == "TEXT") {
            this.setState({
                text_Q_popup_show: true
            })
        } else if(this.state.answerType == "AUDIO") {
            this.ActionSheet.show();
        }
    }

    textAnswer = () => {
        clearInterval(this.timer);
        this.setState({
            answer_text: this.state.answer_text_temp, 
            text_Q_popup_show: false
        }, () => {
            this.props.navigation.navigate("PictureCheckScreen", {answerType: "TEXT", answer_text: this.state.answer_text, questionEndTimestamp: this.props.route.params.questionEndTimestamp})
        })
        // if(this.state.answer_text_temp != "") {
        //     this.setState({
        //         disable_button: false
        //     });
        // }
    }

    next_mission = async() => {
        clearInterval(this.timer);
        this.setState({
            text_Q_popup_show: false,
            audio_Q_popup_show: false
        })
        
        if(this.state.answerType == "IMAGE") {
            this.props.navigation.navigate("PictureCheckScreen", {answerType: "IMAGE", image_uri: this.state.image_uri, questionEndTimestamp: this.props.route.params.questionEndTimestamp});
        } else if(this.state.answerType == "VIDEO") {
            this.props.navigation.navigate("PictureCheckScreen", {answerType: "VIDEO", video_uri: this.state.video_uri, questionEndTimestamp: this.props.route.params.questionEndTimestamp});
        } else if(this.state.answerType == "TEXT") {
            this.props.navigation.navigate("PictureCheckScreen", {answerType: "TEXT", answer_text: this.state.answer_text, questionEndTimestamp: this.props.route.params.questionEndTimestamp});
        } if(this.state.answerType == "AUDIO") {
            this.props.navigation.navigate("PictureCheckScreen", {answerType: "AUDIO", audio_uri: this.state.audio_uri, questionEndTimestamp: this.props.route.params.questionEndTimestamp});
        }
        
    }

    onStartRecord = async () => {
        var premission_granted = true;
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Permissions for write access',
                        message: 'Give permission to your storage to write a file',
                        buttonPositive: 'ok',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    premission_granted = true;
                    console.log('You can use the storage');
                } else {
                    premission_granted = false;
                    console.log('permission denied strorage');
                    return;
                }
            } catch (err) {
                premission_granted = false;
              console.warn(err);
              return;
            }
            if(premission_granted) {
                try {
                    const granted = await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                      {
                        title: 'Permissions for micorophone access',
                        message: 'Give permission to microphone to record audio',
                        buttonPositive: 'ok',
                      },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        premission_granted = true;
                        console.log('You can use the microphone');
                    } else {
                        premission_granted = false;
                        console.log('permission denied microphone');
                        return;
                    }
                } catch (err) {
                    premission_granted = false;
                    console.warn(err);
                    return;
                }
            }
        }
        if(premission_granted) {
            const result = await audioRecorderPlayer.startRecorder()
            audioRecorderPlayer.addRecordBackListener((e) => {
                this.setState({
                    recordSecs: e.current_position,
                    recordTime: audioRecorderPlayer.mmssss(
                    Math.floor(e.current_position),
                    ),
                });
                return;
            });
            
        }
    };
    
    onStopRecord = async () => {
        clearInterval(this.timer);
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        this.setState({
            recordSecs: 0,
            audio_uri: result,
            disable_button: false
        }, () => {
            this.props.navigation.navigate("PictureCheckScreen", {answerType: "AUDIO", audio_uri: this.state.audio_uri, questionEndTimestamp: this.props.route.params.questionEndTimestamp})
        });
    };

    audio_action = async(index) => {
        if(index == 0) {
            this.setState({
                audio_Q_popup_show: true
            })
        } else if(index == 1) {
            try {
                const response = await DocumentPicker.pick({
                    type: [DocumentPicker.types.allFiles],
                });
                console.log(
                    response.uri,
                    response.type, // mime type
                    response.name,
                    response.size
                );
                this.setState({
                    audio_uri: response.uri,
                    disable_button: false
                }, () => {
                    this.props.navigation.navigate("PictureCheckScreen", {answerType: "AUDIO", audio_uri: this.state.audio_uri, questionEndTimestamp: this.props.route.params.questionEndTimestamp})
                })
    
            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                    // User cancelled the picker, exit any dialogs or menus and move on
                } else {
                    throw err;
                }
            }
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
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#000000'}]}>Press enter to send</Text>
                        </View>
                        <View style = {{width: '100%', height: 1, backgroundColor: '#000000'}}/>
                        <View style = {{width: '100%', marginVertical: 10, alignItems: 'center'}}>
                            <TextInput style = {[stylesGlobal.general_font_style, {width: '90%', height: 50, borderColor: '#d0d0d0', borderWidth: 0.5, borderRadius: 5, padding: 5, fontSize: 14, color: '#000000'}]}
                                onChangeText = {(text) => this.setState({answer_text_temp: text})} onSubmitEditing = {() => this.textAnswer()}
                            >{this.state.answer_text_temp}</TextInput>
                        </View>
                        <View style = {{width: '100%', height: 1, backgroundColor: '#000000'}}/>
                        {/* <View style = {{width: '100%', marginVertical: 10, flexDirection: 'row', justifyContent: 'center'}}>
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
                        </View> */}
                    </View>
                </View>
            }
            {
                this.state.audio_Q_popup_show &&
                <View style = {{width: '100%', height: '100%', position: "absolute", top: 0, left: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10, elevation: 20}}>
                    <View style = {{width: '100%', height: '100%', position: "absolute", top: 0, left: 0, backgroundColor: '#000000', opacity: 0.3}}/>
                    <View style = {{width: '90%', backgroundColor: '#ffffff', borderRadius: 10}}>
                        <View style = {{width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 20}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#000000'}]}>Please click below icon to start and stop recording</Text>
                        </View>
                        <View style = {{width: '100%', height: 150, alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity style = {{width: 100, height: 100, borderRadius: 100, overflow: 'hidden'}} 
                                onPress = {() => {
                                    this.setState({
                                        audio_recording: !this.state.audio_recording
                                    }, () => {
                                        if(this.state.audio_recording) {
                                            this.onStartRecord();
                                        } else {
                                            this.onStopRecord();
                                            this.setState({
                                                audio_Q_popup_show: false
                                            })
                                        }
                                    });

                                }}
                            >
                            {
                                this.state.audio_recording &&
                                <Image style = {{width: 100, height: 100, borderRadius: 100, overflow: 'hidden'}} source = {require("../assets/images/microphone_recording.gif")}/>
                            }
                            {
                                !this.state.audio_recording &&
                                <Image style = {{width: 100, height: 100, borderRadius: 100, overflow: 'hidden'}} source = {require("../assets/images/microphone_stop.png")}/>
                            }    
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }  
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Select audio'}
                    options={['Create audio', 'Select from library', 'Cancel']}
                    cancelButtonIndex={2}
                    onPress={(index) => this.audio_action(index)}
                />             
                <View style = {stylesGlobal.left_color_bar}>
                    <View style = {stylesGlobal.left_color_bar_first}/>
                    <View style = {stylesGlobal.left_color_bar_second}/>
                    <View style = {stylesGlobal.left_color_bar_third}/>
                    <View style = {stylesGlobal.left_color_bar_forth}/>
                    <View style = {stylesGlobal.left_color_bar_fifth}/>
                </View>
                <View style = {styles.main_container}>
                    <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: isIphoneX ? 55 : 20}}>
                        <View style = {{width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 50, overflow: 'hidden', backgroundColor: this.state.mission_order % 3 == 1 ? '#2AB7CA' : this.state.mission_order % 3 == 2 ? '#FE4A49' : '#FED766'}}>
                            <Text style = {[stylesGlobal.general_font_style, {color: '#ffffff', fontSize: 32, fontWeight: 'bold'}]}>{this.state.mission_order}</Text>
                        </View>
                        {/* <Image style = {{width: 50, height: 50, resizeMode: 'contain'}} source = {require("../assets/images/mission_number1.png")}/> */}
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 20}]}>YOUR {this.state.order_array[this.state.mission_order]} MISSION HEADING</Text>
                        <View style = {stylesGlobal.mission_shadow_view}>
                            <View style = {[stylesGlobal.mission_color_view, {backgroundColor: this.state.mission_order % 3 == 1 ? '#2AB7CA' : this.state.mission_order % 3 == 2 ? '#FE4A49' : '#FED766'}]}>
                                <View style = {{flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                {
                                    this.state.game_image_path == "" &&
                                    <Image style = {stylesGlobal.mission_avatar_image} source = {require("../assets/images/default_avatar.jpg")}/>
                                }
                                {
                                    this.state.game_image_path != "" &&
                                    <Image style = {stylesGlobal.mission_avatar_image} source = {{uri: this.state.game_image_path}}/>
                                }   
                                    <Text style = {[stylesGlobal.general_font_style, {color: '#ffffff', marginLeft: 10}]}>{this.state.game_name}</Text>
                                </View>
                                <View style = {{flex: 2, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <View style = {[stylesGlobal.mission_camera_container_view, {backgroundColor: this.state.mission_order % 3 == 1 ? '#3a95a7' : this.state.mission_order % 3 == 2 ? '#db2c33' : '#f1b64b'}]} >
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
                                    {
                                        this.state.answerType == "AUDIO" &&
                                        <Image style = {{width: '60%', height: '60%'}} source = {require("../assets/images/mission_audio.png")}></Image>
                                    }
                                    </View>
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
                                    <TouchableOpacity style = {stylesGlobal.mission_button} onPress = {() => this.answerAction()}>
                                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#ffffff'}]}>LET'S GO!</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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