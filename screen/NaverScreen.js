import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';

//redux쓴 naverScreen
function BookItem(props) {
    return (
        <TouchableOpacity style={[styles.bookItemStyle, { paddingLeft: '3%' }]} onPress={props.onPress}>
            <Image style={{ width: 100, height: 130 }} source={{ uri: props.image || 'http://sign.kedui.net/rtimages/n_sub/no_detail_img.gif' }}></Image>
            <View style={{ flexDirection: 'column', width: 235, paddingLeft: '5%' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{props.title} </Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginTop: '20%' }}>
                        <TouchableOpacity onPress={props.onPressStar}>
                            <Entypo name={props.selectedStar ? 'aircraft-take-off' : 'aircraft-landing'} size={30} color={props.selectedStar ? '#ff6666' : 'gray'} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'column', marginLeft: '30%' }}>
                        <Text style={{ fontSize: 14, color: '#666666' }}> {props.publisher} </Text>
                        <Text style={{ fontSize: 14, color: '#666666' }}>{props.author} 저 </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13, textDecorationLine: 'line-through' }}>{props.price}</Text>
                            <Text style={{ fontSize: 14 }}> => {props.discount} 원 </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

class NaverScreen extends Component {
    key = 'javascript';
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
        }
    }

    componentDidMount() {
        this.fetchBooks().then(items => {
            this.props.dispatch({
                type: 'LOADED_ITEMS',
                //item자체를 store로 관리!
                //data라는 변수로 item의 값을 넘김!
                data: items || []
            });
        });
    }

    fetchBooks(page = 1) {
        const display = 10;
        const start = display * (page - 1) + 1;
        var query = this.key;

        //네이버 책 API 가져오는 부분
        return fetch(`https://openapi.naver.com/v1/search/book.json?query=${query}&display=${display}&start=${start}`, {
            headers: {
                'X-Naver-Client-Id': 'vTiJhVKTgkFtmAOe1aRw',
                'X-Naver-Client-Secret': 'KNnOp1CgQd'
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log('#', query, responseJson.items);
                return responseJson.items;
            })
            .catch(error => {
                console.error(error);
            });
    }
    render() {
        let bookItemsWithSelected = this.props.data.map((book) => {
            return {
                ...book,
                //왼쪽은 true, false / 오른족은 key, value 값 들어있는애 
                selectedStar: this.props.selected[book.isbn]
            }
        });
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                        style={[styles.input, { marginTop: '10%', marginBottom: '2%' }]}
                        placeholder="책 제목을 입력하십시오."
                        onChangeText={(text) => {
                            //아무것도 안적었을 때 undefined의 값으로 검색!!
                            this.key = text || 'undefined'
                            this.fetchBooks().then(items => {
                                //connect를 쓰면 dispatch라는 함수가 자동으로 넘어옴!
                                //ACTION을 생성하는 부분. 정의하는 부분 X => 정의하지 않아도 생성이 됨
                                this.props.dispatch({
                                    type: 'LOADED_ITEMS',
                                    data: items || []
                                });
                            });
                        }}
                    >
                    </TextInput>
                    <TouchableOpacity
                        style={{
                            borderRadius: 5, backgroundColor: '#000033', width: '13%', height: 40,
                            marginTop: '8%', alignItems: 'center', marginLeft: '2%', paddingTop: '1.3%'
                        }}
                        onPress={() => { this.props.navigation.navigate('MyModal') }} >
                        <MaterialCommunityIcons name="barcode" color="white" size={30} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    //bookItemsWithSelected 라고 쓴 이유는 flatlist의 prop이 바뀌어야 render가 다시 되니까.
                    //근데 이럴 경우에 extraData라고 써서 render에 영향을 미칠만한 아이를 넘겨서 render를 다시 하게 할 수 있음
                    data={bookItemsWithSelected}
                    //{item}인 이유는 item의 값이 object 값으로 넘어오니까! 
                    renderItem={({ item }) =>
                        <BookItem {...item}
                            //버튼을 눌렀을 때 selected - state 값을 바꿔주는 역할! 
                            //dispatch => 생성한 ACTION을 reducer한테 전달하는 아이! 
                            //Action을 전달하면 reducer가 실행되고 그 후 store가 바뀜
                            onPressStar={() => {
                                this.props.dispatch({
                                    type: 'PRESS_STAR_BTN',
                                    //item 자체를 넘겨야 item.isbn을 index.js에서 사용 가능함
                                    data: item
                                });
                            }}
                            //버튼 누르면 detail 화면으로 이동하고, 그 때 item.link의 값을 넘겨줌!!
                            onPress={() => { this.props.navigation.navigate('detail', { itemId: item.link }) }}
                        />
                    }
                    ItemSeparatorComponent={() => (
                        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: 'black', marginLeft: 10, marginRight: 10 }} />
                    )}
                    keyExtractor={(item, index) => item.isbn + index}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => {
                        this.setState({
                            isRefreshing: true
                        })
                        setTimeout(() => {
                            this.setState({
                                isRefreshing: false
                            })
                        }, 2000);
                    }}
                />
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        //여기 selected는 key, value 값이 들어가 있는 것! 한꺼번에 가져와야함!
        selected: state.selected,
        data: state.data
    }
}
export default connect(mapStateToProps)(NaverScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bookItemStyle: {
        padding: 10,
        width: 370,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '80%',
        height: 30,
        paddingLeft: 10,
        borderColor: 'black',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: "gray",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0,
        },
        marginTop: 5,
        marginBottom: 5,
    }
})