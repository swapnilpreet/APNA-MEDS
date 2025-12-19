import {createSlice} from '@reduxjs/toolkit';

export const loaderSlice=createSlice({
    name:'loaders',
    initialState:{
        loading:false,
        showmodel:false
    },
    reducers:{
        SetLoader:(state,action)=>{
            state.loading=action.payload;
        },
        SetShowModel:(state,action)=>{
            state.showmodel=action.payload;
        }
    }
})

export const {SetLoader,SetShowModel}=loaderSlice.actions;
export default loaderSlice.reducer;