
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
import {format_time} from '../utils/utils';
import VideoPlayer from 'react-native-video-player';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class YourRankScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects_array: [],
            score: 0,
            rank: 0,
            timeLimit: 0,
            resultsSummary: "",
        }

        this._video = [];
        this._audio = [];
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {return true});
        this.initListener = this.props.navigation.addListener('focus', this.init_data.bind(this));
    }

    init_data = async() => {
        this.setState({
            loading: true
        })
                
        await fetch(Global.BASE_URL + 'index.php/results?gameAuthToken=' + Global.gameAuthToken +  '&playerAuthToken=' + Global.playerAuthToken)
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            console.log(responseData)
            if(responseData.success) {
                this.setState({
                    score: responseData.score,
                    rank: responseData.rank,
                    timeLimit: responseData.timeLimit,
                    projects_array: responseData.results,
                    resultsSummary: responseData.resultsSummary
                }, () => {
                    var difference_time = this.state.timeLimit - Math.floor(Date.now() / 1000);
                    if(difference_time <= 0) {
                        this.game_state();
                    } else {
                        this.setState({
                            count_down_time: format_time(difference_time)
                        }, () => {
                            this.timer = setInterval(() => {
                                difference_time -= 1;
                                console.log(format_time(difference_time))
                                this.setState({
                                    count_down_time: format_time(difference_time)
                                })
                                if(difference_time == 0) {
                                    clearInterval(this.timer);
                                    this.game_state();
                                }
                            }, 1000);
                        })
                    }
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
            console.log(error)
            Alert.alert("Warning!", "Network error");
        });
        this.setState({
            loading: false
        })


    }

    componentDidMount() {
        this._video[0] && this._video[0].focus();
        this._audio[0] && this._audio[0].focus();
    }

    componentWillUnmount = () => {
        this.props.navigation.removeListener("focus");
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
                        this.next_question();
                    } else if(responseData.gameState == "completed") {
                        clearInterval(this.waiting_timer);
                        this.setState({
                            loading: false
                        })
                        this.props.navigation.navigate("SendEmailScreen")
                    } 
                    else {
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

    next_question = async() => {

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
            console.log("question response")
            console.log(responseData)
            if(responseData.success) {
                Global.mission_order += 1;
                this.props.navigation.navigate("MissionScreen", {question: responseData.question, answerType: responseData.answerType, numberOfPoints: responseData.numberOfPoints, questionEndTimestamp: responseData.questionEndTimestamp});
                
            } else {
                console.log("question error")
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
                    <ScrollView style = {{width: '100%'}}>
                        <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: isIphoneX ? 60 : 25}}>
                            <Image style = {{width: 80, height: 80, resizeMode: 'cover', borderRadius: 80}} source = {Global.game_image_path == "" ? require("../assets/images/default_avatar.jpg") : {uri: Global.game_image_path}}/>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 10}]}>{Global.game_name}</Text>
                            <View style = {{width: '100%', alignItems: 'center', marginTop: 30, justifyContent: 'center', flexDirection: 'row'}}>
                                <View style = {{width: 100, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image style = {{width: '100%', height: 40, resizeMode: 'contain'}} source = {require("../assets/images/medal_icon.png")}></Image>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 12, color: '#000000', marginTop: 5}]}>Total Score:</Text>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#000000'}]}>{this.state.score}</Text>
                                </View>
                                <View style = {{width: 1, height: '60%', backgroundColor: '#000000'}}/>
                                <View style = {{width: 100, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image style = {{width: '100%', height: 40, resizeMode: 'contain'}} source = {require("../assets/images/barchart_icon.png")}></Image>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 12, color: '#000000', marginTop: 5}]}>Current Rank:</Text>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#000000'}]}>{this.state.rank}</Text>
                                </View>
                            </View>
                            <View style = {{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 14, color: '#000000'}]}>{this.state.resultsSummary}</Text>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, color: '#2AB7CA', marginTop: 5}]}>Get ready for your next mission</Text>
                            </View>
                            <View style = {{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 12, color: '#000000'}]}>Tadam's past projects</Text>
                            </View>
                            <View style = {{width: '100%', padding: 10, marginTop: 5, alignItems: 'center'}}>
                            {
                                this.state.projects_array != null && this.state.projects_array.map((item, index) => 
                                <View key = {index} style = {{width: '95%', marginBottom: 10, backgroundColor: '#F0F0F0', borderRadius: 10, overflow: 'hidden', paddingTop: 10}}>
                                    <View style = {{width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
                                        <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                            <Image style = {{width: 40, height: 40, resizeMode: 'contain', borderRadius: 40, overflow: 'hidden'}} source = {(item.profileImage == null || item.profileImage == "") ? require("../assets/images/default_avatar.jpg") : {uri: Global.image_saved_path + item.profileImage}}/>
                                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 12, color: '#000000', marginLeft: 10}]}>{item.profileName}</Text>
                                        </View>
                                        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 12, color: '#000000', marginRight: 10}]}>{item.totalScores}</Text>
                                            <Image style = {{width: 30, height: 30, resizeMode: 'contain'}} source = {require("../assets/images/mission1_coin.png")}/>
                                        </View>
                                    </View>
                                    <View style = {{width: '100%', aspectRatio: 0.8, borderRadius: 10, overflow: 'hidden', marginTop: 10, }}>
                                    {
                                        item.answerType == "IMAGE" &&
                                        <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source={item.answer != "" ? {uri: item.answer} : {}}></Image>
                                    }
                                    {
                                        item.answerType == "VIDEO" && item.answer != "" &&
                                        <VideoPlayer
                                            ref={(ref) => this._video[index] = ref}
                                            // videoWidth={height * 0.7}
                                            // videoHeight={height * 0.7}
                                            disableFullscreen
                                            autoplay
                                            video={{uri: item.answer}}
                                            // resizeMode='cover'
                                            onLoad={() => {
                                                this._video[index].seek(0);
                                                this._video[index].pause();
                                            }}
                                            onPlayPress={() => {
                                                this._video[index].resume();
                                            }}
                                            style = {{width: '100%', height: '100%'}}
                                        />
                                    }
                                    {
                                        item.answerType == "TEXT" &&
                                        <View style = {{width: '100%', padding: 5}}>
                                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, textAlign: 'center', color: '#000000'}]}>{item.answer}</Text>
                                        </View>
                                    }
                                    {
                                        item.answerType == "AUDIO" && item.answer != "" &&
                                        <View style = {{width: '100%', height: '100%'}}>
                                            <View style = {{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, justifyContent: 'center', alignItems: 'center'}}>
                                                <Image style = {{width: '80%', height: '100%', resizeMode: 'contain'}} source = {require("../assets/images/logo.png")}></Image>
                                            </View>
                                            <VideoPlayer
                                                ref={ref => this._audio[index] = ref}
                                                // videoWidth={height * 0.7}
                                                // videoHeight={height * 0.7}
                                                disableFullscreen
                                                autoplay
                                                video={{uri: item.answer}}
                                                onLoad={() => {
                                                    this._audio[index].seek(0);
                                                    this._audio[index].pause();
                                                }}
                                                onPlayPress={() => {
                                                    this._audio[index].resume();
                                                }}
                                                style = {{width: '100%', height: '100%'}}
                                            />
                                        </View>
                                    }
                                    </View>
                                </View>
                                )
                            }
                            </View>
                        
                        </View>
                    </ScrollView>
                    {/* <View style = {{width: '100%', height: 40, marginBottom: isIphoneX ? 45 : 20, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 40, borderWidth: 1, borderColor: '#808080', justifyContent: 'center', alignItems: 'center'}}  onPress = {() => this.props.navigation.navigate("SendEmailScreen")}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, color: '#2AB7CA'}]}>OK</Text>
                        </TouchableOpacity>
                    </View> */}
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