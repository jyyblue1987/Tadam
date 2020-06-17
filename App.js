//
//  
//  Tarma
//  Copyright © 2020 Water Flower(waterflower12591@gmail.com). All rights reserved. 
//

import * as React from 'react';
import {Component} from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';


import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from './app/screens/SignInScreen';
import IntroFirstScreen from './app/screens/IntroFirstScreen';
import IntroSecondScreen from './app/screens/IntroSecondScreen';
import IntroThirdScreen from './app/screens/IntroThirdScreen';
import SummaryScreen from './app/screens/SummaryScreen';
import MissionFirstScreen from './app/screens/MissionFirstScreen';
import MissionSecondScreen from './app/screens/MissionSecondScreen';
import MissionThirdScreen from './app/screens/MissionThirdScreen';
import PictureCaptureScreen from './app/screens/PictureCaptureScreen';
import PictureCheckScreen from './app/screens/PictureCheckScreen';
import CreateSummaryScreen from './app/screens/CreateSummaryScreen';

const Stack = createStackNavigator();

export default class App extends Component {

    constructor(props) {
        super(props);
        
    }

    render() {
        return(
            <NavigationContainer>
                <Stack.Navigator 
                    initialRouteName = "SignInScreen"
                    screenOptions={({ route }) => ({
                        headerShown: false
                    })}
                    headerMode="none"
                >
                    <Stack.Screen name="SignInScreen" component={SignInScreen} />
                    <Stack.Screen name="IntroFirstScreen" component={IntroFirstScreen} />
                    <Stack.Screen name="IntroSecondScreen" component={IntroSecondScreen} />
                    <Stack.Screen name="IntroThirdScreen" component={IntroThirdScreen} />
                    <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
                    <Stack.Screen name="MissionFirstScreen" component={MissionFirstScreen} />
                    <Stack.Screen name="MissionSecondScreen" component={MissionSecondScreen} />
                    <Stack.Screen name="MissionThirdScreen" component={MissionThirdScreen} />
                    <Stack.Screen name="PictureCaptureScreen" component={PictureCaptureScreen} />
                    <Stack.Screen name="PictureCheckScreen" component={PictureCheckScreen} />
                    <Stack.Screen name="CreateSummaryScreen" component={CreateSummaryScreen} />
                </Stack.Navigator>
            </NavigationContainer>

        )
    }
}
