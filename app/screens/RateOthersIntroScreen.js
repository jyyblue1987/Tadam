
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
    BackHandler,
} from 'react-native';

import {stylesGlobal} from '../styles/stylesGlobal';
import ProgressIndicator from "../components/ProgressIndicator";
import * as Global from "../Global/Global";
import KeepAwake from 'react-native-keep-awake';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class RateOthersIntroScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            intro_text: "Before you proceed take the time and understand that this text is not realy saying anything at all.",
            reminder_text: "Take a picture that fits the title: Coca Cola Taste of life or something like that, make sure the picture include one or more blue items",
            other_game_members_data: [],
            other_rating_timeLimit: 0,
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

        this.waiting_timer = setInterval(async() => {
            await fetch(Global.BASE_URL + 'index.php/game/?gameAuthToken=' + Global.gameAuthToken, {
                method: "GET",
            })
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                if(responseData.success) {
                    if(responseData.gameState == "rank") {
                        clearInterval(this.waiting_timer);
                        this.get_ranks();
                    } else if(responseData.gameState == "completed") {
                        clearInterval(this.waiting_timer);
                        this.props.navigation.navigate("YourRankScreen");
                    } else {
                        
                    }
                } else {
                    clearInterval(this.waiting_timer);
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

    get_ranks = async() => {
        await fetch(Global.BASE_URL + 'index.php/ranks?gameAuthToken=' + Global.gameAuthToken + '&playerAuthToken=' + Global.playerAuthToken, {
            method: "GET",
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            console.log("rating intro screen")
            console.log(responseData)
            if(responseData.success) {
                this.setState({
                    other_game_members_data: responseData.ranks,
                    other_rating_timeLimit: responseData.timeLimit
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

    componentWillUnmount = () => {
        this.props.navigation.removeListener("focus");
    }

    rate_screen = () => {
        this.props.navigation.navigate("RateOthersScreen", {other_game_members_data: this.state.other_game_members_data, other_rating_timeLimit: this.state.other_rating_timeLimit})
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
                    <ImageBackground style = {{width: '100%', height: '100%', resizeMode: 'cover',}} blurRadius={Platform.OS == 'ios' ? 20 : 5} source = {require("../assets/images/temp.png")}>
                        <View style = {{flex: 1, alignItems: 'center'}}>
                            <View style = {{width: '80%', alignItems: 'center', marginTop: isIphoneX ? 55 : 20}}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: "#ffffff", textAlign: 'center'}]}>NOW LET'S RANK OTHERS</Text>
                                <Text style = {[stylesGlobal.general_font_style, {marginTop: 10, fontSize: 18, textAlign: 'center', color: "#ffffff"}]}>{this.state.intro_text}</Text>
                            </View>
                            <View style = {{width: '100%', height: 200, alignItems: 'center', justifyContent: 'center'}}>
                                <Image style = {{width: '100%', height: '50%', resizeMode: 'contain'}} source = {require("../assets/images/start_folder.png")}></Image>
                                <Text style = {[stylesGlobal.general_font_style, {marginTop: 10, fontSize: 18, textAlign: 'center', color: "#FED766", fontWeight: 'bold'}]}>Use 10 Stars from your wallet</Text>
                            </View>
                            <View style = {{width: '90%', alignItems: 'center', }}>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, textAlign: 'center', color: "#ffffff", fontWeight: 'bold'}]}>Mission Reminder:</Text>
                                <View style = {{width: '90%', borderRadius: 10, borderWidth: 2, borderColor: '#ffffff', padding: 10}}>
                                    <Text style = {[stylesGlobal.general_font_style, {fontSize: 16, textAlign: 'center', color: "#ffffff"}]}>{this.state.reminder_text}</Text>
                                </View>
                            </View>
                        </View>
                        <View style = {{width: '100%', height: 40, marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 40, borderWidth: 1, borderColor: '#ffffff', justifyContent: 'center', alignItems: 'center'}} 
                                onPress = {() => this.rate_screen()}>
                                <View style = {{width: '100%', height: 40, borderRadius: 40, opacity: 0.4, backgroundColor: '#000000', position: 'absolute', left: 0, top: 0}}/>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, color: '#2AB7CA'}]}>ALRIGHT!</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
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