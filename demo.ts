import {EditorState, EditorView, basicSetup} from "@codemirror/next/basic-setup"
import {collab, sendableUpdates, receiveUpdates} from "@codemirror/next/collab"
import io from "socket.io-client"

const socket = io()

socket.on("updates", (updates) => {
    console.log(updates)
    let newState = receiveUpdates(view.state, updates, 1).state
    view.setState(newState)
})

let state = EditorState.create({doc: `Hallo Welt!`, extensions: [basicSetup, collab()]})

state = state.update({changes: {from:0, insert:"A"}}).state
let view = new EditorView({state, parent: document.querySelector("#editor")!})
;(window as any).view = view
;(window as any).sendableUpdates = sendableUpdates
;(window as any).receiveUpdates = receiveUpdates

setInterval(() => {
    socket.emit("updates", sendableUpdates(view.state))
}, 1000)
