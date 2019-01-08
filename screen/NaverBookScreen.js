import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

//redux 안쓰고 그냥 state 형태

//component로 따로 빼두면 class 형태이지만, 한 곳에서 할 때는 함수 형태로 빼는 것
//이 function에서 props를 받아서 쓸 때에는 BookItem(props)로 해야 
//그 class에서 this의 의미는 class이기 때문에 class.this의 형태가 됨.
//이거와 같은 형태로 적기 위해서 BookItem(props)의 형태로 적는 것
function BookItem(props) {
    return (
        <TouchableOpacity style={[styles.bookItemStyle, { paddingLeft: '3%' }]} onPress={props.onPress}>
            <Image style={{ width: 100, height: 130 }} source={{ uri: props.image || 'http://sign.kedui.net/rtimages/n_sub/no_detail_img.gif' }}></Image>
            <View style={{ flexDirection: 'column', width: 235, paddingLeft: '5%' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{props.title} </Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginTop: '20%' }}>
                        <TouchableOpacity onPress={props.onPressStar}>
                            //bookItemsWithSelected 여기서 selected까지 넣은 값을 items로 사용하고 있고! 
                            //BookItem을 사용하는 곳에서 ...items를 통해서 selected를 뿌려줌!
                            <Entypo name={props.selected ? 'aircraft-take-off' : 'aircraft-landing'} size={30} color={props.selected ? 'red' : 'gray'} />
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

// State의 값을 바꾸면 render가 다시 호출된다!
// 그런데 render 안에 있는 기본 속성들은 자신이 다시 그릴지 안그릴지를 결정할 수 있는 권한이 있다.
// 기본 속성들은 자신이 다시 render 여부를 결정할 때는 자신의 prop이 바뀌어야 render된다!
// 즉, data의 prop을 바꿔야지 render가 다시 되기 때문에 bookItemsWithSelected라는 속성을 쓰는 것! 
class App extends Component {
    //key값을 state값으로 줘도 되지만 onChangeText={(text) => { this.key = text }}
    //이 부분에서 setState를 써서 rendering 할 필요가 없기 때문에 그냥 key 값을 주는 것
    //state값으로 쓰면 key가 바뀌었을 때 render가 되고, 서버에 다녀와서 또 다시 render가 되기 때문에 이중 render
    //key는 서버에 다녀와서 그 값을 가지고 render를 하는거기 때문에, render 두번 할 필요가 없움!!
    key = 'javascript';
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            //정의를 해줘야하는 이유! => map이라는 함수를 사용하는데 data가 없는 상태에서 map함수를 사용해버리면
            //에러가 나기 때문에 빈 함수를 지정해줘야함!! -> bookItemsWithSelected 여기서 에러 발생!!!
            data: [],
            selected: {
                // 저장 형태
                //'213123123' : false
            },
            isRefreshing: false
        }
    }

    componentDidMount() {
        //fetch 서버에 갔다오는 함수 - 비동기로 해야됨
        //then에다가 성공할 때의 함수, catch 실패했을 때 실행할 함수
        //this를 써놓은 함수를 부르는 곳이 this를 나타내는 것! 즉, componentDidMount()를 부르는 곳이 this를 나타냄
        this.fetchBooks().then(items => {
            this.setState({
                //data가 배열값. items도 배열
                data: items
            })
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
            //promise 알아보기
            //fetch에 대한 성공값이 then에 들어감. 
            //then안에서 fetch에 대한 응답값이 response. 그 response를 json 형태로 변환시키는것
            //그런데 json()자체도 비동기로 실행되는 함수이기 때문에 then이 필요함
            .then(response => response.json())
            //json()한 것에 대한 값인 responseJson이 나오는 것
            //그 값이 items로 나오는 것 -> 배열 형태 -> 0번째 배열 안의 object 형태로 저장되어 있는 것!
            .then(responseJson => {
                console.log('#', query, responseJson.items);
                return responseJson.items;
            })
            //첫번째 then에서 실패하면 두번째 then에 실패를 넘겨주고 결국 catch값으로 넘어오게 되는 것!
            //정확히 말하면 json().then().catch() 여기서의 catch!!!
            .catch(error => {
                console.error(error);
            });
    }
    render() {
        //이걸 사용하는 이유! FlatList data 부분에 바로 안하는 이유!
        //FlatList에서 props가 바뀌어야 render가 되는데 그걸 안하면 render가 안될 수도 있기 때문에
        //props 바꿔주기 위해서 함수를 사용해서 render 되게 만듬!
        let bookItemsWithSelected = this.state.data.map((book) => {
            return {
                ...book,
                selected: this.state.selected[book.isbn]
            }
        });
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                        style={[styles.input, { marginTop: '10%', marginBottom: '2%' }]}
                        placeholder="책 제목을 입력하십시오."
                        //key 부분이 사용자가 입력한 텍스트가 들어가는 공간 

                        //아래 onChange와 다르게 key 값이 state가 아니기 때문에
                        //동기식으로 key가 진행됨! 비동기가 아니라 바로 값이 나오는 형태 
                        //아래는 state에 key가 들어가 있어서 비동기!
                        onChangeText={(text) => {
                            //아무것도 안적었을 때 undefined의 값으로 검색!!
                            this.key = text || 'undefined'
                            this.fetchBooks().then(items => {
                                this.setState({
                                    //data가 배열값. items도 배열
                                    //or 연산 => items 값이 잘 들어가있으면 앞의 값을 입력
                                    //items값이 undefined나 false나 그런 값들이 들어가면 뒤의 값을 입력
                                    data: items || []
                                })
                            });
                        }}

                    //setState는 비동기이기 때문에 key값 바꿔준 후에 다시 함수를 실행하기 해야함!
                    //setState한 후에 콤마 찍으면 callBack함수 적을 수 있게 나옴! -> 비동기 다시 실행시키면 됨
                    /*onChangeText={(text) => { 
                        this.setState({
                            key: text
                        }, ()=>{
                            this.fetchBooks().then(items => {
                            this.setState({
                                //data가 배열값. items도 배열
                                data:items
                            })
                        })
                    }); 
                    }}*/
                    >
                    </TextInput>
                    <TouchableOpacity
                        style={{
                            borderRadius: 5, backgroundColor: '#000033', width: '13%', height: 40,
                            marginTop: '8%', alignItems: 'center', marginLeft: '2%', paddingTop: '1.3%'
                        }}
                        onPress={() => { this.props.navigation.navigate('MyModal') }}
                    >
                        <MaterialCommunityIcons name="barcode" color="white" size={30} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={bookItemsWithSelected}
                    renderItem={({ item }) =>
                        <BookItem {...item}
                            //버튼을 눌렀을 때 selected - state 값을 바꿔주는 역할! 
                            onPressStar={() => {
                                this.setState({
                                    selected: {
                                        //selected 값을 먼저 뿌리고 선택한 아이템의 isbn 값을 키 값
                                        //그 아이템이 true였으면 false, false였으면 true 이런식으로 바뀜!!
                                        ...this.state.selected,
                                        [item.isbn]: !this.state.selected[item.isbn]
                                    }
                                });
                            }}
                            //버튼 누르면 detail 화면으로 이동하고, 그 때 item.link의 값을 넘겨줌!!
                            onPress={() => { this.props.navigation.navigate('detail', { itemId: item.link }) }}
                        />
                    }
                    ItemSeparatorComponent={() => (
                        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: 'black' }} />
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
            </View >
        );
    }
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bookItemStyle: {
        height: 150,
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
//items[0]을 출력하면 객체 형태로 나옴! 즉, 배열 안에 객체 형태로 저장되어 있는 것
// {
//   "author": "에반 버차드",
//   "description": "더 나은 자바스크립트 코드를 만드는 최선의 방법
// 리팩토링 자바스크립트!코드의 기본 품질이 좋지 않으면 항상 버그와 성능 문제가 생긴다. 버그는 마술처럼 사라지지 않고, 또 다른 버그를 만들기도 한다. 이 책은 자바스크립트의 품질에 집중해 더 나은 코드를 만들기 위한 최선의 방법들을 소개한다. 코드... ",
//   "discount": "32400",
//   "image": "https://bookthumb-phinf.pstatic.net/cover/140/491/14049175.jpg?type=m1&udate=20181011",
//   "isbn": "1160505896 9791160505894",
//   "link": "http://book.naver.com/bookdb/book_detail.php?bid=14049175",
//   "price": "36000",
//   "pubdate": "20181012",
//   "publisher": "길벗",
//   "title": "리팩토링 자바스크립트 (지저분한 자바 스크립트 코드에서 벗어나자!)",
// }