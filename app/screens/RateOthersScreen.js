
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
    FlatList
} from 'react-native';

import {stylesGlobal} from '../styles/stylesGlobal';
import StarRating from 'react-native-star-rating';
import Swiper from 'react-native-swiper';
import ProgressIndicator from "../components/ProgressIndicator";
import VideoPlayer from 'react-native-video-player';
import * as Global from "../Global/Global";
import {format_time} from '../utils/utils';
import KeepAwake from 'react-native-keep-awake';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class RateOthersScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            first_loading: false,
            intro_text: "Before you proceed take the time and understand that this text is not realy saying anything at all.",
            reminder_text: "Take a picture that fits the title: Coca Cola Taste of life or something like that, make sure the picture include one or more blue items",
            other_game_members_data: [],
            count_down_time: "00:00:00",

            remain_rating_star: 10,
        }

        this._video = [];
        this._videoBig = [];
        this._audio = [];
        this._audioBig = [];

        
    }

    UNSAFE_componentWillMount() {
        this.initListener = this.props.navigation.addListener('focus', this.init_data.bind(this));
    }

    init_data = async() => {
        this.setState({
            other_game_members_data: [],
            count_down_time: "00:00:00",
        }, () => {
            var difference_time = this.props.route.params.other_rating_timeLimit - Math.floor(Date.now() / 1000);
            if(difference_time < 0) {
                this.game_state();
                return;
            }
            var other_game_members_data = this.props.route.params.other_game_members_data;
            if(other_game_members_data == null) {
                Alert.alert("Warning!", "error occured in ranks");
                return;
            }
            for(var i = 0; i < other_game_members_data.length; i ++) {
                other_game_members_data[i].rating = 0;
                other_game_members_data[i].rate_disable = false;
            }
    
            other_game_members_data.push({answerType: "empty", rating: 0});
            
            console.log("rating screen//////////////")
            console.log("server response timelimit:" + this.props.route.params.other_rating_timeLimit + "    " + "current time:" + Date.now() / 1000)
            if(difference_time <= 0) {
                this.setState({
                    other_game_members_data: other_game_members_data,
                })
            } else {
                this.setState({
                    other_game_members_data: other_game_members_data,
                    count_down_time: format_time(difference_time)
                }, () => {
                    
                    this.timer = setInterval(() => {
                        difference_time -= 1;
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
    }

    componentDidMount() {
        this._video[0] && this._video[0].focus();
        this._videoBig[0] && this._videoBig[0].focus();
        this._audio[0] && this._audio[0].focus();
        this._audioBig[0] && this._audioBig[0].focus();
    }

    componentWillUnmount = () => {
        this.props.navigation.removeListener("focus");
    }

    onStarRatingPress = async(index, rating) => {
        var other_game_members_data = this.state.other_game_members_data;
        var total_rating = 0;
        for(var i = 0; i < other_game_members_data.length; i ++) {
            total_rating += other_game_members_data[i].rating;
        }
        if(total_rating + rating > 10) {
            Alert.alert("Warning!", "All rating scores sum have to be equal to 10");
            return;
        }
        
        if(total_rating + rating == 10) {
            for(var i = 0; i < other_game_members_data.length; i ++) {
                other_game_members_data[i].rate_disable = true;
            }
        }

        var rated_answer_count = 0
        for(var i = 0; i < other_game_members_data.length; i ++) {
            if(other_game_members_data[i].rating > 0) {
                rated_answer_count ++;
            }
        }
        console.log("rated answer count:::" + rated_answer_count + "  " + (other_game_members_data.length - 1))
        if(rated_answer_count == other_game_members_data.length - 2) {  /// last item is for summany(empty) so minus 2 for checking last item
            if(this.state.remain_rating_star > 5 && rating != 5) {
                Alert.alert("Warning!", "You have to rated with 5");
                return;
            }
            if(this.state.remain_rating_star <= 5 &&this.state.remain_rating_star != rating) {
                Alert.alert("Warning!", "All rating scores sum have to be equal to 10. You have to rated with " + this.state.remain_rating_star);
                return;
            }
        }
        
        other_game_members_data[index].rating = rating;
        other_game_members_data[index].rate_disable = true;
        this.setState({
            other_game_members_data: other_game_members_data,
            remain_rating_star: this.state.remain_rating_star - rating
        })

        this.setState({
            loading: true
        })
        let params = new FormData();
        params.append("gameAuthToken", Global.gameAuthToken);
        params.append("playerAuthToken", Global.playerAuthToken);
        params.append("voteTargetAuthToken ", other_game_members_data[index].voteTargetAuthToken);
        params.append("score", rating);
                
        await fetch(Global.BASE_URL + 'index.php/rank', {
            method: "POST",
            body: params
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            if(responseData.success) {
                this.refs.swiperview.scrollBy(1, true)
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
                    // if(responseData.gameState == "question") {
                    //     clearInterval(this.waiting_timer);
                    //     this.next_question();
                    // }
                    if(responseData.gameState == "results") {
                        clearInterval(this.waiting_timer);
                        this.setState({
                            loading: false
                        })
                        this.props.navigation.navigate("YourRankScreen");
                    } 
                    // else if(responseData.gameState == "completed") {
                    //     clearInterval(this.waiting_timer);
                    //     this.setState({
                    //         loading: false
                    //     })
                    //     this.props.navigation.navigate("YourRankScreen");
                    // } 
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


    renderTotalRate = ({item, index}) => {
        if(item.answerType == "empty") {
            return null;
        } else {
            return (
                <View key = {index} style = {{width: '33%', alignItems: 'center', justifyContent: 'center'}}>
                    <View style = {{width: '100%', aspectRatio: 0.8, justifyContents: 'center', alignItems: 'center'}}>
                        <View style = {[stylesGlobal.mission_shadow_view, {height: '100%', padding: 5, marginTop: 0, marginBottom: 0}]}>
                            <View style = {[stylesGlobal.mission_color_view, {padding: 0, backgroundColor: '#ffffff', overflow: 'hidden'}]}>
                            {
                                item.answerType == "IMAGE" &&
                                <Image style = {{width: '100%', height: '100%', resizeMode: 'contain', }} source = {{uri: item.answer}}></Image>
                            }
                            {
                                item.answerType == "VIDEO" &&
                                <VideoPlayer
                                    ref={(ref) => this._video[index] = ref}
                                    // videoWidth={height * 0.7}
                                    // videoHeight={height * 0.7}
                                    disableFullscreen
                                    autoplay = {true}
                                    pauseOnPress = {true}
                                    video={{uri: item.answer}}
                                    // resizeMode='cover'
                                    onLoad={() => {
                                        this._video[index].seek(0);
                                        this._video[index].pause();
                                    }}
                                    onPlayPress={() => {
                                        this._video[index].resume();
                                    }}
                                    style = {{width: '100%', height: '100%', }}
                                />
                            }
                            {
                                item.answerType == "AUDIO" &&
                                <View style = {{width: '100%', height: '100%'}}>
                                    <View style = {{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, top: 0}}>
                                        <Image style = {{width: '80%', height: '100%', resizeMode: 'contain'}} source = {require("../assets/images/logo.png")}></Image>
                                    </View>
                                    <VideoPlayer
                                        ref={ref => this._audio[index] = ref}
                                        // videoWidth={height * 0.7}
                                        // videoHeight={height * 0.7}
                                        disableFullscreen
                                        autoplay = {true}
                                        pauseOnPress = {true}
                                        video={{uri: item.answer}}
                                        // resizeMode='cover'
                                        onLoad={() => {
                                            this._audio[index].seek(0);
                                            this._audio[index].pause();
                                        }}
                                        onPlayPress={() => {
                                            this._audio[index].resume();
                                        }}
                                        style = {{width: '100%', height: '100%', }}
                                    />
                                </View>
                            }
                            {
                                item.answerType == "TEXT" &&
                                <View style = {{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                    <View style = {{width: '90%', padding: 5}}>
                                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 12, textAlign: 'center', color: '#000000'}]}>{item.answer}</Text>
                                    </View>
                                </View>
                            }
                                <View style = {{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style = {{width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: index % 3 == 1 ? '#2AB7CA' : index % 3 == 2 ? '#FE4A49' : '#FED766'}}>
                                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, textAlign: 'center', color: '#ffffff', fontWeight: 'bold'}]}>{index + 1}</Text>
                                    </View>
                                    {/* <Image style = {{width: '30%', aspectRatio: 1, resizeMode: 'contain'}} source = {require("../assets/images/mission_number1.png")}></Image> */}
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style = {{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                        <StarRating
                            disabled={true}
                            emptyStarColor = {'#cacaca'}
                            fullStarColor = {'#FED766'}
                            halfStarEnabled = {false}
                            maxStars={5}
                            starSize = {15}
                            rating={item.rating}
                        />
                    </View>
                </View>
            )
        }
    }

    render() {

        return (
            <View style = {styles.container} onStartShouldSetResponder = {() => Keyboard.dismiss()}>
                <Swiper 
                    ref = "swiperview"
                    loop = {false} 
                    dot = {<View style={{width: 0, height: 0,}}/>} activeDot = {<View style={{width: 0, height: 0,}}/>}
                >
                {
                    this.state.other_game_members_data.map((item, index) =>
                    <View key = {index} style = {{flex: 1}}>
                    {
                        item.answerType != "empty" &&
                        <View style = {styles.main_container}>
                            <View style = {{width: '100%', height: '100%', backgroundColor: '#000000',}}>
                                <View style = {{width: '100%', height: '100%', position: 'absolute', left: 0, right: 0, justifyContent: 'center', alignItems: 'center'}}>
                                {
                                    item.answerType == "IMAGE" &&
                                    <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {{uri: item.answer}}></Image>
                                }
                                {
                                    item.answerType == "VIDEO" &&
                                    <View style = {{width: '100%', height: '80%'}}>
                                        <VideoPlayer
                                            ref={ref => this._videoBig[index] = ref}
                                            // videoWidth={height * 0.7}
                                            // videoHeight={height * 0.7}
                                            disableFullscreen
                                            autoplay = {true}
                                            pauseOnPress = {true}
                                            video={{uri: item.answer}}
                                            // resizeMode='cover'
                                            onLoad={() => {
                                                this._videoBig[index].seek(0);
                                                this._videoBig[index].pause();
                                            }}
                                            onPlayPress={() => {
                                                this._videoBig[index].resume();
                                            }}
                                            style = {{width: '100%', height: '100%'}}
                                            thumbnail = {require("../assets/images/logo.png")}
                                        />
                                    </View>
                                }
                                {
                                    item.answerType == "TEXT" &&
                                    <View style = {{width: '90%', padding: 5}}>
                                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, textAlign: 'center', color: '#ffffff'}]}>{item.answer}</Text>
                                    </View>
                                }
                                {
                                    item.answerType == "AUDIO" &&
                                    <View style = {{width: '100%', height: '80%'}}>
                                        <View style = {{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, top: 0}}>
                                            <Image style = {{width: '80%', height: '100%', resizeMode: 'contain'}} source = {require("../assets/images/logo.png")}></Image>
                                        </View>
                                        <VideoPlayer
                                            ref={ref => this._audioBig[index] = ref}
                                            // videoWidth={height * 0.7}
                                            // videoHeight={height * 0.7}
                                            disableFullscreen
                                            autoplay = {true}
                                            pauseOnPress = {true}
                                            video={{uri: item.answer}}
                                            // resizeMode='cover'
                                            onLoad={() => {
                                                this._audioBig[index].seek(0);
                                                this._audioBig[index].pause();
                                            }}
                                            onPlayPress={() => {
                                                this._audioBig[index].resume();
                                            }}
                                            style = {{width: '100%', height: '100%'}}
                                            
                                        />
                                    </View>
                                }
                                </View>
                                <View style = {{flex: 1, alignItems: 'center'}}>
                                    <View style = {{width: '100%', alignItems: 'center', marginTop: isIphoneX ? 55 : 20}}>
                                        <TouchableOpacity style = {{position:'absolute', left: 10, top: 0}} 
                                            onPress = {() => {
                                                if(index == 0) {
                                                    this.props.navigation.goBack();
                                                } else {
                                                    this.refs.swiperview.scrollBy(-1, true)
                                                }
                                                
                                            }}
                                        >
                                            <Image style = {{width: 20, height: 20, tintColor: '#ffffff', resizeMode: 'contain'}} source = {require("../assets/images/back_icon.png")}></Image>
                                        </TouchableOpacity>
                                        <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        {
                                            this.state.other_game_members_data.map((subitem, subindex) =>
                                            <View key = {subindex}>
                                            {
                                                subindex == index &&
                                                <View style = {{width: 40, height: 40, marginLeft: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 40, backgroundColor: index % 3 == 0 ? '#2AB7CA' : index % 3 == 1 ? '#FE4A49' : '#FED766'}}>
                                                    <Text style = {[stylesGlobal.general_font_style, {color: '#ffffff', fontSize: 30, fontWeight: 'bold'}]}>{index + 1}</Text>
                                                </View>
                                            }
                                            {
                                                subindex != index &&
                                                <View style = {[styles.dot_style, {marginLeft: 15}]}/>
                                            }
                                            </View>
                                            )
                                        }
                                        </View>
                                        {/* <View style = {{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                                            <Text style = {[stylesGlobal.general_font_style, {color: '#ffffff', fontSize: 24,}]}>{item.profileName}</Text>
                                        </View> */}
                                    </View>
                                </View>
                                <View style = {{width: '100%', height: 40, flexDirection: 'row', marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image style = {{width: 50, height: 40, resizeMode: 'contain'}} source = {require("../assets/images/start_folder.png")}></Image>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#ffffff', fontWeight: 'bold', marginRight: 20}]}>{this.state.remain_rating_star}</Text>
                                    <StarRating
                                        disabled={item.rate_disable}
                                        emptyStarColor = {'#ffffff'}
                                        fullStarColor = {'#FED766'}
                                        // halfStarEnabled = {true}
                                        maxStars={5}
                                        rating={item.rating}
                                        selectedStar={(rating) => this.onStarRatingPress(index, rating)}
                                    />
                                </View>
                            </View>
                        </View>
                    }
                    {
                        item.answerType == "empty" && 
                        <View key = {index} style = {styles.main_container}>
                            <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: isIphoneX ? 60 : 25}}>
                                <Image style = {{width: 50, height: 50, resizeMode: 'contain'}} source = {require("../assets/images/cup_circle.png")}/>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 20}]}>OK GREAT,</Text>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 5}]}>THESE ARE YOUR RANKING</Text>
                                <FlatList 
                                    style = {{width: '100%'}}
                                    data = {this.state.other_game_members_data}
                                    extraData = {this.state}
                                    numColumns = {3}
                                    keyExtractor={(subitem, subindex) => subindex.toString()}
                                    renderItem = {( subitem, subindex ) => this.renderTotalRate(subitem, subindex)}
                                >
                                </FlatList>
                            </View>
                            <View style = {{width: '100%', height: 40, marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                <Image style = {{width: 25, height: 25, resizeMode: 'contain', tintColor: '#808080'}} source = {require("../assets/images/mission_timer.png")}></Image>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#808080', fontWeight: 'bold', marginLeft: 10}]}>{this.state.count_down_time}</Text>
                            </View>
                        </View>
                    }
                    </View>
                    )
                }
                    
                </Swiper>
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
    dot_style: {
        width: 10,
        height: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    skip_button: {
        position: 'absolute',
        right: 15,
        top: isIphoneX ? 40 : 15,
        zIndex: 10
        
    }
});