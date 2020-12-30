
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
    BackHandler
} from 'react-native';

import {stylesGlobal} from '../styles/stylesGlobal';
import LocalizeString from '../assets/languages/strings';
import ImagePicker from 'react-native-image-picker';
import * as Global from "../Global/Global";
import {writeFile, readFile, readFileAssets, copyFile, readDir, exists, mkdir, unlink, DocumentDirectoryPath, DownloadDirectoryPath, LibraryDirectoryPath} from 'react-native-fs';
import ProgressIndicator from "../components/ProgressIndicator";
import KeepAwake from 'react-native-keep-awake';
import base64 from 'react-native-base64'

var RNFS = require('react-native-fs');

import logoImage from '../assets/images/logo.png'

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

// const MkdirOptions = {
//     NSURLIsExcludedFromBackupKey?: boolean // iOS only
// };

export default class CreateNameScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            name: "",
            selected_image: "",
            name_image_array: [],
            image_saved_path: DocumentDirectoryPath + Global.image_saved_path,

            new_image: false,

            percentage_done: 0,
        }
    }

    UNSAFE_componentWillMount = async() => {

        BackHandler.addEventListener('hardwareBackPress', () => {return true});

        mkdir(DocumentDirectoryPath + Global.file_temp_path, null)
            .then((res) => {
                
            })
            .catch((error) => {

            })

        var folder_exist = false;
        await exists(this.state.image_saved_path)
        .then((res) => {
            folder_exist = res;
            
        })
        .catch((error) => {

        })

        if(folder_exist) {
            readDir(this.state.image_saved_path)
            .then((res) => {
                var name_image_array = [];
                                
                for(var i = 0; i < res.length; i ++) {
                    var prefix =  "";
                    if(Platform.OS == "android") {
                        prefix = "file://";
                    }
                    name_image_array.push({
                        file_url: prefix + this.state.image_saved_path + res[i].name,
                        selected: false
                    })
                }
                this.setState({
                    name_image_array: name_image_array
                })
            })
            .catch((error) => {
                console.log(error);
                // Alert.alert("Warning!", "");
            })
        } else {
            mkdir(this.state.image_saved_path, null)
            .then((res) => {
                
            })
            .catch((error) => {

            })
            
        }
        
    }

    showImagePicker = async() => {
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

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({
                    selected_image: response.uri,
                    new_image: true
                })
                var name_image_array = this.state.name_image_array;
                for(var i = 0; i < name_image_array.length; i ++) {
                    name_image_array[i].selected = false
                }
                name_image_array.unshift({
                    file_url: response.uri,
                    selected: true,
                })
                this.setState({
                    name_image_array: name_image_array,
                    // name: ""
                })
            }
        });
    }

    setNamefromImage = async(index) => {
        var name_image_array = this.state.name_image_array;
        var filelocalurl_part = name_image_array[index].file_url.split('/');
        var filename_part = filelocalurl_part[filelocalurl_part.length - 1].split(".");
        var filename = "";
        for(var i = 0; i < filename_part.length - 1; i ++) {
            filename += filename_part[i]
        }
        var gamename_part = filename.split("___");
        var game_name = "";
        if(gamename_part.length > 1) {
            game_name = gamename_part[gamename_part.length - 1].replace("---", " ");
        } else {
            game_name = "";
        }       
        for(var i = 0; i < name_image_array.length; i ++) {
            if(i == index) {
                name_image_array[i].selected = true;
            } else {
                name_image_array[i].selected = false;
            }
        }
        this.setState({
            name: game_name,
            selected_image: name_image_array[index].file_url,
            name_image_array: name_image_array,
            new_image: false
        })
        
    }

    delete_savedImage = async(index) => {
        var name_image_array = this.state.name_image_array;
        unlink(name_image_array[index].file_url)
        .then(() => {
            name_image_array.splice(index, 1);
            this.setState({
                name_image_array: name_image_array
            })
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
            console.log(err.message);
        });
        
    }

    onContinue = async() => {
        Keyboard.dismiss();
        if(this.state.name.length < 3) {
            Alert.alert("Warning!", "Name or Nickname have to be at least 3 characters");
            return;
        }
      
        var filename = Date.now()+ "___" + this.state.name.replace(" ", "---") + ".png";

        if(this.state.selected_image != "") {

            var uploadBegin = (response) => {
                
            };
            
            var uploadProgress = (response) => {
                var percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
                this.setState({
                    percentage_done: percentage
                })
                console.log('UPLOAD IS ' + percentage + '% DONE!');
            };
            
            var files = [];
            var filepath = "";
            
            if(this.state.new_image) {
                await copyFile(this.state.selected_image, DocumentDirectoryPath + Global.image_saved_path + filename)
                .then((res) => {
                    filepath = DocumentDirectoryPath + Global.image_saved_path + filename;
                })
                .catch((error) => {
                    Alert.alert("Warning!", "Error occured. Please try again.");
                })
            } else {
                if(Platform.OS == "android") {
                    filepath = this.state.selected_image.replace("file://", "");
                }
            }
            
            files = [
                {
                    name: "image",
                    filename: filename,
                    filepath: filepath,
                    filetype: 'image/png'
                }
            ];
            
            this.setState({
                loading: true
            })

            await RNFS.uploadFiles({
                toUrl: Global.BASE_URL + 'index.php/profileImage',
                files: files,
                method: 'POST',
                fields: {
                    'gameAuthToken': Global.gameAuthToken,
                    // 'name': base64.encode(this.state.name)
                },
                begin: uploadBegin,
                progress: uploadProgress
            }).promise.then(response => {
                console.log(response);
                if (response.statusCode == 200) {
                    var responseData = JSON.parse(response.body);
                    
                    if(responseData.success) {
                        this.send_profile_name(responseData.profileImage);
                        // Global.playerAuthToken = responseData.playerAuthToken;
                        // Global.gamestart_time = responseData.gameStartTimestamp;
                        // Global.game_image_path = this.state.selected_image;
                        // Global.game_name = this.state.name;

                        // this.props.navigation.navigate("IntroFirstScreen");

                    } else {
                        var error_text = responseData.error_text;
                        if(error_text == null) {
                            error_text = "";
                        }
                        Alert.alert("Warning!", error_text);
                    }
                } else {
                    console.log('SERVER ERROR');
                }
            })
            .catch((err) => {
                if(err.description === "cancelled") {
                    // cancelled by user
                }
                console.log("1111111" + err);
            });
        } else {

            let params = new FormData();
            params.append("gameAuthToken", Global.gameAuthToken);
            params.append("name", base64.encode(this.state.name));
            if(this.state.selected_image != "") {
                params.append('image', {
                    uri: this.state.selected_image,
                    type: 'image/png',
                    name: filename + '.png'
                });
            }

            this.setState({
                loading: true
            })
            await fetch(Global.BASE_URL + 'index.php/profile', {
                method: "POST",
                header: {'Content-Type': 'text/html; charset=UTF-8'},
                body: params,
            })
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                console.log(responseData);
                if(responseData.success) {
                    Global.playerAuthToken = responseData.playerAuthToken;
                    Global.gamestart_time = responseData.gameStartTimestamp;
                    Global.game_image_path = this.state.selected_image;
                    Global.game_name = this.state.name;
                    if(this.state.new_image) {
                        copyFile(this.state.selected_image, DocumentDirectoryPath + Global.image_saved_path + filename)
                        .then((res) => {
                            
                            this.props.navigation.navigate("IntroFirstScreen");
                        })
                        .catch((error) => {
                            Alert.alert("Warning!", "Error occured. Please try again.");
                        })
                    } else {
                        this.props.navigation.navigate("IntroFirstScreen");
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
                console.log(error + " 00000 ")
                Alert.alert("Warning!", "Network error");
            });
        }
        this.setState({
            loading: false
        })
    }

    send_profile_name = async(image_name) => {
        let params = new FormData();
        params.append("gameAuthToken", Global.gameAuthToken);
        params.append("name", this.state.name);
        params.append("image", image_name);
        
        await fetch(Global.BASE_URL + 'index.php/profile', {
            method: "POST",
            header: {'Content-Type': 'text/html; charset=UTF-8'},
            body: params,
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            if(responseData.success) {
                Global.playerAuthToken = responseData.playerAuthToken;
                Global.gamestart_time = responseData.gameStartTimestamp;
                Global.game_image_path = this.state.selected_image;
                Global.game_name = this.state.name;

                this.props.navigation.navigate("IntroFirstScreen");
            } else {
                
                var error_text = responseData.error_text;
                if(error_text == null) {
                    error_text = "";
                }
                Alert.alert("Warning!", error_text);
            }
        })
        .catch(error => {
            console.log(error + " 00000 ")
            Alert.alert("Warning!", "Network error");
        });
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
                <KeyboardAvoidingView style = {styles.main_container}>
                    <View style = {{width: '100%', height: '25%', justifyContent: 'center', alignItems: 'center'}}>
                        <Image style = {{width: '100%', height: 50, resizeMode: 'contain'}} source = {require("../assets/images/logo.png")}/>
                    </View>
                    <View style = {{flex: 1, width: '100%'}}>
                        <View style = {{width: '100%', alignItems: 'center'}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 20, color: '#2AB7CA'}]}>Player/Group Name</Text>
                            <View style = {styles.input_component}>
                                {/* <Text style = {[stylesGlobal.general_font_style, {fontSize: 16}]}>Your name</Text> */}
                                <TextInput style = {[styles.input_style, stylesGlobal.general_font_style]} placeholder = {"enter name or nickname"} onChangeText = {(text) => this.setState({name: text})} onSubmitEditing = {() => this.onContinue()}>{this.state.name}</TextInput>
                            </View>
                            <View style = {styles.input_component}>
                                {/* <Text style = {[stylesGlobal.general_font_style, {fontSize: 16}]}>Game code</Text> */}
                                <TouchableOpacity style = {{width: '80%', height: 40, flexDirection: 'row', borderRadius: 20, borderColor: '#000000', borderWidth: 1, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.showImagePicker()}>
                                    <Text style = {[stylesGlobal.general_font_style, {color: '#2AB7CA', fontSize: 16}]}>ADD IMAGE</Text>
                                    <Image style = {{width: 25, height: 25, resizeMode: 'contain', tintColor: '#2AB7CA', marginLeft: 10}} source = {require("../assets/images/mission_camera.png")}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style = {{width: '100%', alignItems: 'center', marginTop: 30}}>
                            <TouchableOpacity style = {{width: '80%', height: 40, borderRadius: 20, borderColor: '#000000', borderWidth: 1, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.onContinue()}>
                                <Text style = {[stylesGlobal.general_font_style, {color: '#2AB7CA', fontSize: 16}]}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    {
                        this.state.name_image_array.length > 0 &&
                        <View style = {{width: '100%', alignItems: 'center', marginTop: 20}}>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 24,}]}>OR</Text>
                            <Text style = {[stylesGlobal.general_font_style, {fontSize: 18, textAlign: 'center', color: '#7A7A7A', marginTop: 5}]}>Choose from previous</Text>
                        </View>
                    }
                        <View style = {{width: '100%', marginTop: 20}}>
                            <ScrollView style = {{height: 150}} horizontal = {true}>
                            {
                                this.state.name_image_array.map((item, index) => 
                                <View key = {index} style = {{height: '100%', aspectRatio: 0.8, justifyContents: 'center', alignItems: 'center'}}>
                                    <TouchableOpacity style = {[stylesGlobal.mission_shadow_view, {height: '100%', padding: 5, marginTop: 0, marginBottom: 0}]} 
                                        onPress = {() => this.setNamefromImage(index)}
                                        onLongPress = {() => this.delete_savedImage(index)}
                                    >
                                        <View style = {[stylesGlobal.mission_color_view, {padding: 0, backgroundColor: '#FED766', overflow: 'hidden'}]}>
                                            <Image style = {{width: '100%', height: '100%', resizeMode: 'cover'}} source={{uri: item.file_url}}></Image>
                                        {
                                            item.selected &&
                                            <View style = {{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10}}>
                                                <Image style = {{width: 40, height: 40, resizeMode: 'contain'}} source={require("../assets/images/check_circle.png")}></Image>
                                            </View>
                                        }
                                            
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                )
                            }
                            </ScrollView>
                        </View>
                    </View>
                    
                </KeyboardAvoidingView>
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
});