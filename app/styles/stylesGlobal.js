
//
//  
//  Tarma
//  Copyright © 2020 Water Flower(waterflower12591@gmail.com). All rights reserved. 
//

import {
    Dimensions, 
    Platform,
} from 'react-native';


const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export const stylesGlobal = {
    left_color_bar: {
        width: 10,
        height: '100%',
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // zIndex: 100
    },
    left_color_bar_first: {
        width: '100%',
        height: '20%',
        backgroundColor: '#2AB7CA'
    },
    left_color_bar_second: {
        width: '100%',
        height: '8%',
        backgroundColor: '#FE4A49'
    },
    left_color_bar_third: {
        width: '100%',
        height: '8%',
        backgroundColor: '#FECA66'
    },
    left_color_bar_forth: {
        width: '100%',
        height: '8%',
        backgroundColor: '#0C9DB0'
    },
    left_color_bar_fifth: {
        width: '100%',
        flex: 1,
        backgroundColor: '#2AB7CA'
    },
    general_font_style: {
        fontSize: 14,
        color: '#000000'
    },
    intro_button: {
        width: '80%', 
        height: '100%', 
        borderRadius: 40, 
        borderWidth: 1, 
        borderColor: '#000000', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    mission_shadow_view: {
        flex: 1, 
        width: '90%', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: 20, 
        marginBottom: isIphoneX ? 45 : 20, 
        borderRadius: 10, 
        shadowColor: '#808080',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 7,
        shadowOpacity: 0.3,
        backgroundColor: '#ffffff',
        elevation: 10,
        padding: 10,
    },
    mission_color_view: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        alignItems: 'center',
        padding: 20
        
    },
    mission_avatar_image: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    mission_camera_container_view: {
        width: 80,
        height: 80,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mission_button: {
        width: '100%',
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    }
}