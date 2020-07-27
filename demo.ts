import {EditorState, EditorView, basicSetup} from "@codemirror/next/basic-setup"
import {collab, sendableUpdates, receiveUpdates} from "@codemirror/next/collab"

let state = EditorState.create({doc: `Hallo Welt!`, extensions: [basicSetup, collab()]})

state = state.update({changes: {from:0, insert:"A"}}).state
;(window as any).view = new EditorView({state, parent: document.querySelector("#editor")!})
;(window as any).sendableUpdates = sendableUpdates
;(window as any).receiveUpdates = receiveUpdates
