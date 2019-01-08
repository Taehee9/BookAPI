//Reducer가 여러개 일 때 합쳐주는 부분
import { combineReducers } from "redux";

//state 뒤에 있는 부분이 초기값 집어넣는 부분. 
const reducer = (state = { data: [], selected: {} }, action) => {
    //console.warn("Changes are not persisted to disk");
    //setState는 바뀐 값들만 덮어쓰는 거라면 reducer는 전체 값이 덮어씌워짐!
    switch (action.type) {
        //case 뒷 부분이 action.type의 이름들! -> ACTION 이름!

        //data자체를 불러올 때 !
        case 'LOADED_ITEMS':
            return {
                //전체 값이 덮어씌워지기 때문에 이 state 값을 나열해야함!
                ...state,
                //action.data => 앞부분에서 넘어온 item의 값 부분 
                data: action.data
            }
        //즐겨찾기 버튼 눌렀을 때 
        case 'PRESS_STAR_BTN':
            return {
                ...state,
                //selected가 key, value 값
                selected: {
                    //전체 값이 덮어씌워지니까 그동안의 selected 값을 불러오기
                    ...state.selected,
                    [action.data.isbn]: !state.selected[action.data.isbn]
                }
            }

        // case 'TOGGLE_BOOK':
        // //action.book이 이미 추가 되었는지
        // //find라는 애가 첫번째 배열을 (state.selectedBooks) book에 넘겨서 그 함수를 실행!
        // //조건이 찾아지면 멈추는 것 ! 즉, 하나만 찾는 것이 find!!
        // const sameBook = state.selectedBooks.find((book)=>{
        //     //action.book.isbn에 있는 book은 dispatch해서 넘겨준 book
        //     //앞의 book은 배열에서 넘어온 book
        //     return book.isbn === action.book.isbn;
        // })
        // if(sameBook){
        //    //기존꺼 빼주고
        //     return {
        //         ...state,
        //         selectedBooks : state.selectedBooks.filter((book)=>{
        //             return book.isbn !== action.book.isbn;
        //         })
        //     }
        // }else{   //기존 것이 없어서 새로 추가해줘야한다면! 
        //     return {
        //         ...state,
        //         selectedBooks:[
        //             ...state.selectedBooks,
        //             action.book
        //         ]
        //     }
        // }
    }
    return state;
};

export default reducer;
