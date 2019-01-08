import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

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
class LogoTitle extends React.Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name='ios-bookmark' color='white' size={25} />
                <Text style={{ color: 'white', fontSize: 20 }}>  Favorite Book  </Text>
                <Ionicons name='ios-bookmark' color='white' size={25} />
            </View>
        );
    }
}
class FavoriteBookScreen extends Component {
    static navigationOptions = {
        headerTitle: <LogoTitle />,
        headerStyle: {
            backgroundColor: '#ff6666',
        }
    }
    render() {
        let bookItemsWithSelected = this.props.data.map((book) => {
            return {
                ...book,
                selectedStar: this.props.selected[book.isbn]
            }
        });
        //bookItemsWithSelected의 값들을 하나하나 book에 넣고 뒤에 함수를 실행시킨 다음
        //그 실행값이 true인 것들을 배열의 형태로 filteredList를 만드는 것!
        let filteredList = bookItemsWithSelected.filter((book) => {
            return book.selectedStar;
        })


        // let bookItemsWithSelected = this.state.bookItems.map((book) =>{
        //     return {
        //         ...book,
        //          //this.props.selectedBooks에 있는 값들을 하나하나 b에 넘기고 그 안에 있는 함수의 내용이 하나라도 찾아지면
        //          //끝남!! 왜냐면 그게 find의 목표니까!! 
        //         selected: this.props.selectedBooks.find((b) =>{
        //             return book.isbn === b.isbn;
        //         })
        //     }
        // });


        return (
            <View style={styles.container}>
                <FlatList
                    data={filteredList}
                    renderItem={({ item }) =>
                        <BookItem {...item}
                            //버튼을 눌렀을 때 selected - state 값을 바꿔주는 역할! 
                            onPressStar={() => {
                                //dispatch를 여기다가 직접 안쓰고 밑에 onPressStar이런식으로 뺀 다음에 여기다가 함수만 적을 수 있음!
                                this.props.onPressStar();
                            }}
                            //버튼 누르면 detail 화면으로 이동하고, 그 때 item.link의 값을 넘겨줌!!
                            onPress={() => { this.props.navigation.navigate('detail', { itemId: item.link }) }}
                        />
                    }
                    ItemSeparatorComponent={() => (
                        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: 'black' }} />
                    )}
                    keyExtractor={(item, index) => item.isbn + index}
                />
            </View>
        );
    }
}

//return 에 써져있는 onPressStar를 prop 으로 FavoritBookScreen에 넘겨주겟다!
//그 역할을 하는 아이가 connect 한 부분!! 
//그래서 위에서 FavoriteBookScreen에서 this.props.selected의 형태로 써먹을 수 있는 것! 
const mapDispatchToProps = (dispatch, state) => {
    return {
        onPressStar: () => {
            dispatch({
                type: 'PRESS_STAR_BTN'
            })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        selected: state.selected,
        data: state.data
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteBookScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookItemStyle: {
        height: 150,
        width: 370,
        flexDirection: 'row',
        alignItems: 'center'
    },
})