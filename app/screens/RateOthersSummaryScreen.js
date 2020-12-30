
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

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class RateOthersSummaryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contents_text: "people will get a chance to rank your creation, mean whille relax and rank the other candidates",
        }
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {return true});
        this.initListener = this.props.navigation.addListener('focus', this.init_data.bind(this));

        
    }

    init_data = async() => {
        await fetch(Global.BASE_URL + 'index.php/summary/?gameAuthToken=' + Global.gameAuthToken + '&playerAuthToken=' + Global.playerAuthToken, {
            method: "GET",
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            console.log("summary")
            console.log(responseData)
            if(responseData.success) {
                
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


    get_result = async() => {
        
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
                    <View style = {{flex: 1, width: '100%', alignItems: 'center', marginTop: isIphoneX ? 60 : 25}}>
                        <Image style = {{width: 50, height: 50, resizeMode: 'contain'}} source = {require("../assets/images/cup_circle.png")}/>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 20}]}>OK GREAT,</Text>
                        <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, marginTop: 5}]}>THESE ARE YOUR RANKING</Text>
                        
                        <View style = {{width: '100%', flexDirection: 'row', justifyContents: 'center', alignItems: 'center', marginTop: 50}}>
                            <View style = {{width: '33%', alignItems: 'center', justifyContent: 'center'}}>
                                <View style = {{width: '100%', aspectRatio: 0.8, justifyContents: 'center', alignItems: 'center'}}>
                                    <View style = {[stylesGlobal.mission_shadow_view, {height: '100%', padding: 5, marginTop: 0, marginBottom: 0}]}>
                                        <View style = {[stylesGlobal.mission_color_view, {padding: 0, backgroundColor: '#FED766', overflow: 'hidden'}]}>
                                            <Image style = {{width: '100%', height: '100%', resizeMode: 'cover'}} source={require("../assets/images/temp.png")}></Image>
                                            <View style = {{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center', alignItems: 'center'}}>
                                                <Image style = {{width: '30%', aspectRatio: 1, resizeMode: 'contain'}} source = {require("../assets/images/mission_number1.png")}></Image>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style = {{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                    <StarRating
                                        disabled={true}
                                        emptyStarColor = {'#cacaca'}
                                        fullStarColor = {'#FED766'}
                                        halfStarEnabled = {true}
                                        maxStars={5}
                                        starSize = {15}
                                        rating={4.5}
                                    />
                                </View>
                            </View>
                            <View style = {{width: '33%', alignItems: 'center', justifyContent: 'center'}}>
                                <View style = {{width: '100%', aspectRatio: 0.8, justifyContents: 'center', alignItems: 'center'}}>
                                    <View style = {[stylesGlobal.mission_shadow_view, {height: '100%', padding: 5, marginTop: 0, marginBottom: 0}]}>
                                        <View style = {[stylesGlobal.mission_color_view, {padding: 0, backgroundColor: '#FED766', overflow: 'hidden'}]}>
                                            <Image style = {{width: '100%', height: '100%', resizeMode: 'cover'}} source={require("../assets/images/temp.png")}></Image>
                                            <View style = {{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center', alignItems: 'center'}}>
                                                <Image style = {{width: '30%', aspectRatio: 1, resizeMode: 'contain'}} source = {require("../assets/images/mission_number2.png")}></Image>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style = {{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                    <StarRating
                                        disabled={true}
                                        emptyStarColor = {'#cacaca'}
                                        fullStarColor = {'#FED766'}
                                        halfStarEnabled = {true}
                                        maxStars={5}
                                        starSize = {15}
                                        rating={5}
                                    />
                                </View>
                            </View>
                            <View style = {{width: '33%', alignItems: 'center', justifyContent: 'center'}}>
                                <View style = {{width: '100%', aspectRatio: 0.8, justifyContents: 'center', alignItems: 'center'}}>
                                    <View style = {[stylesGlobal.mission_shadow_view, {height: '100%', padding: 5, marginTop: 0, marginBottom: 0}]}>
                                        <View style = {[stylesGlobal.mission_color_view, {padding: 0, backgroundColor: '#FED766', overflow: 'hidden'}]}>
                                            <Image style = {{width: '100%', height: '100%', resizeMode: 'cover'}} source={require("../assets/images/temp.png")}></Image>
                                            <View style = {{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center', alignItems: 'center'}}>
                                                <Image style = {{width: '30%', aspectRatio: 1, resizeMode: 'contain'}} source = {require("../assets/images/mission_number3.png")}></Image>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style = {{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                    <StarRating
                                        disabled={true}
                                        emptyStarColor = {'#cacaca'}
                                        fullStarColor = {'#FED766'}
                                        halfStarEnabled = {true}
                                        maxStars={5}
                                        starSize = {15}
                                        rating={3}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style = {{width: '100%', height: 40, marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 40, borderWidth: 1, borderColor: '#808080', justifyContent: 'center', alignItems: 'center'}}  onPress = {() => this.props.navigation.navigate("YourRankScreen")}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, color: '#2AB7CA'}]}>OK</Text>
                        </TouchableOpacity>
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