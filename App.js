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
                    {/* <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
                    <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                    <Stack.Screen name="Verification" component={Verification} />
                    <Stack.Screen name="LandingSummary1" component={LandingSummary1} />
                    <Stack.Screen name="LandingSummary2" component={LandingSummary2} />

                    <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} /> */}
                    
                </Stack.Navigator>
            </NavigationContainer>

        )
    }
}
