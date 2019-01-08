import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import PureChart from 'react-native-pure-chart';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { ImagePicker, Permissions } from 'expo';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
class LogoTitle extends React.Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name='ios-construct' color='white' size={25} />
                <Text style={{ color: 'white', fontSize: 20 }}>  My Page  </Text>
                <Ionicons name='ios-construct' color='white' size={25} />
            </View>
        );
    }
}

export default class SettingScreen extends React.Component {
    static navigationOptions = {
        headerTitle: <LogoTitle />,
        headerStyle: {
            backgroundColor: '#ff6666',
        }
    }
    state = {
        isDateTimePickerVisible: false,
        image: null,
    };
    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
    _handleDatePicked = (date) => {
        this._hideDateTimePicker();
        var day = moment(date);
        this.setState({
            day: day
        })
        // var strr = date + '';
        // var str = strr.split(' ');
        // this.setState({
        //     day: str
        // })
    };
    render() {
        let { image } = this.state;
        let sampleData = [
            {
                value: 50,
                label: '엄마',
                color: '#ED484E',
            }, {
                value: 40,
                label: '태희',
                color: '#F2C23A'
            }, {
                value: 25,
                label: '대환',
                color: '#4EA78E'
            }

        ]
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this._pickImage}>
                    <View style={{
                        width: 150, height: 150, borderRadius: 50, backgroundColor: '#CCCCCC',
                        justifyContent: 'center', alignItems: 'center'
                    }} >
                        <SimpleLineIcons name='user' color='white' size={100} style={{ position: 'absolute' }} />
                        {image &&
                            <Image source={{ uri: image }} style={{ width: 150, height: 150, borderRadius: 45 }} />}
                        <View style={{
                            position: 'absolute', left: 120, top: 115, borderWidth: StyleSheet.hairlineWidth, borderColor: 'black',
                            backgroundColor: 'white', opacity: 0.8, width: 30, height: 30, borderRadius: 15,
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Ionicons name="ios-camera" size={25} color="black"></Ionicons>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', height: 40, marginTop: 20 }}>
                    <Text style={{ fontSize: 18 }}>생일 : </Text>
                    <TouchableOpacity onPress={this._showDateTimePicker}>
                        {(this.state.day) ?
                            <Text style={{ fontSize: 18 }}>{this.state.day.format('YYYY[년] MM[월] DD[일]')}</Text>
                            //<Text style={{ fontSize: 15 }}>{this.state.day[3]}년 {this.state.day[1]} {this.state.day[2]}. {this.state.day[0]}</Text>
                            : <Text style={{ fontSize: 18 }}>생일을 입력하십시오</Text>
                        }
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <View style={{ marginTop: 50 }}>
                    <PureChart data={sampleData} type='pie' />
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    }
});
