
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
import StarRating from 'react-native-star-rating';
import Swiper from 'react-native-swiper'

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export default class RankAnswerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            intro_text: "Before you proceed take the time and understand that this text is not realy saying anything at all.",
            reminder_text: "Take a picture that fits the title: Coca Cola Taste of life or something like that, make sure the picture include one or more blue items",
            first_starCount: 2.5,
            second_starCount: 0,
            third_starCount: 3.5,
        }
    }

    UNSAFE_componentWillMount() {
        
    }

    onStarRatingPress(index, rating) {
        if(index == 1) {
            this.setState({
                first_starCount: rating
            });
        } else if(index == 2) {
            this.setState({
                second_starCount: rating
            });
        } else if(index == 3) {
            this.setState({
                third_starCount: rating
            });
        }
        
      }

    render() {
        return (
            <View style = {styles.container} onStartShouldSetResponder = {() => Keyboard.dismiss()}>
                <Swiper loop = {false} dot = {<View style={{width: 0, height: 0,}}/>} activeDot = {<View style={{width: 0, height: 0,}}/>}>
                    <View style = {styles.main_container}>
                        <ImageBackground style = {{width: '100%', height: '100%', resizeMode: 'cover',}} source = {require("../assets/images/temp.png")}>
                            <View style = {{flex: 1, alignItems: 'center'}}>
                                <View style = {{width: '100%', alignItems: 'center', marginTop: isIphoneX ? 55 : 20}}>
                                    <TouchableOpacity style = {{position:'absolute', left: 10, top: 0}} onPress = {() => this.props.navigation.goBack()}>
                                        <Image style = {{width: 20, height: 20, tintColor: '#ffffff', resizeMode: 'contain'}} source = {require("../assets/images/back_icon.png")}></Image>
                                    </TouchableOpacity>
                                    <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <Image style = {{width: 40, height: 40, resizeMode: 'contain'}} source = {require("../assets/images/mission_number1.png")}></Image>
                                        <View style = {[styles.dot_style, {marginLeft: 15}]}/>
                                        <View style = {[styles.dot_style, {marginLeft: 15}]}/>
                                    </View>
                                </View>
                            </View>
                            <View style = {{width: '100%', height: 40, flexDirection: 'row', marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center'}}>
                                <Image style = {{width: 50, height: 40, resizeMode: 'contain'}} source = {require("../assets/images/start_folder.png")}></Image>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#ffffff', fontWeight: 'bold', marginRight: 20}]}>30</Text>
                                <StarRating
                                    disabled={false}
                                    emptyStarColor = {'#ffffff'}
                                    fullStarColor = {'#FED766'}
                                    halfStarEnabled = {true}
                                    maxStars={5}
                                    rating={this.state.first_starCount}
                                    selectedStar={(rating) => this.onStarRatingPress(1, rating)}
                                />
                            </View>
                        </ImageBackground>
                    </View>
                    <View style = {styles.main_container}>
                        <ImageBackground style = {{width: '100%', height: '100%', resizeMode: 'cover',}} source = {require("../assets/images/temp.png")}>
                            <View style = {{flex: 1, alignItems: 'center'}}>
                                <View style = {{width: '100%', alignItems: 'center', marginTop: isIphoneX ? 55 : 20}}>
                                    <TouchableOpacity style = {{position:'absolute', left: 10, top: 0}} onPress = {() => this.props.navigation.goBack()}>
                                        <Image style = {{width: 20, height: 20, tintColor: '#ffffff', resizeMode: 'contain'}} source = {require("../assets/images/back_icon.png")}></Image>
                                    </TouchableOpacity>
                                    <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style = {[styles.dot_style, {marginRight: 15}]}/>
                                        <Image style = {{width: 40, height: 40, resizeMode: 'contain'}} source = {require("../assets/images/mission_number2.png")}></Image>
                                        <View style = {[styles.dot_style, {marginLeft: 15}]}/>
                                    </View>
                                </View>
                            </View>
                            <View style = {{width: '100%', height: 40, flexDirection: 'row', marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center'}}>
                                <Image style = {{width: 50, height: 40, resizeMode: 'contain'}} source = {require("../assets/images/start_folder.png")}></Image>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#ffffff', fontWeight: 'bold', marginRight: 20}]}>30</Text>
                                <StarRating
                                    disabled={false}
                                    emptyStarColor = {'#ffffff'}
                                    fullStarColor = {'#FED766'}
                                    halfStarEnabled = {true}
                                    maxStars={5}
                                    rating={this.state.second_starCount}
                                    selectedStar={(rating) => this.onStarRatingPress(2, rating)}
                                />
                            </View>
                        </ImageBackground>
                    </View>
                    <View style = {styles.main_container} onStartShouldSetResponder = {() => this.props.navigation.navigate("YourRankScreen")}>
                        <ImageBackground style = {{width: '100%', height: '100%', resizeMode: 'cover',}} source = {require("../assets/images/temp.png")}>
                            <View style = {{flex: 1, alignItems: 'center'}}>
                                <View style = {{width: '100%', alignItems: 'center', marginTop: isIphoneX ? 55 : 20}} onPress = {() => this.props.navigation.goBack()}>
                                    <TouchableOpacity style = {{position:'absolute', left: 10, top: 0}}>
                                        <Image style = {{width: 20, height: 20, tintColor: '#ffffff', resizeMode: 'contain'}} source = {require("../assets/images/back_icon.png")}></Image>
                                    </TouchableOpacity>
                                    <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style = {[styles.dot_style, {marginRight: 15}]}/>
                                        <View style = {[styles.dot_style, {marginRight: 15}]}/>
                                        <Image style = {{width: 40, height: 40, resizeMode: 'contain'}} source = {require("../assets/images/mission_number3.png")}></Image>
                                    </View>
                                </View>
                            </View>
                            <View style = {{width: '100%', height: 40, flexDirection: 'row', marginBottom: isIphoneX ? 45 : 20, justifyContent: 'center', alignItems: 'center'}}>
                                <Image style = {{width: 50, height: 40, resizeMode: 'contain'}} source = {require("../assets/images/start_folder.png")}></Image>
                                <Text style = {[stylesGlobal.general_font_style, {fontSize: 24, color: '#ffffff', fontWeight: 'bold', marginRight: 20}]}>30</Text>
                                <StarRating
                                    disabled={false}
                                    emptyStarColor = {'#ffffff'}
                                    fullStarColor = {'#FED766'}
                                    halfStarEnabled = {true}
                                    maxStars={5}
                                    rating={this.state.third_starCount}
                                    selectedStar={(rating) => this.onStarRatingPress(3, rating)}
                                />
                            </View>
                        </ImageBackground>
                    </View>
                </Swiper>
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