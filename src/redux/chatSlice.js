import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        currentUser: null
    },
    reducers: {
        sendMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        clearChat : (state,action)=>{
            state.messages = []
        }

    }
});

export const { sendMessage, setCurrentUser ,clearChat} = chatSlice.actions;
export default chatSlice.reducer;