import {EditorState, EditorView} from "@codemirror/next/basic-setup"

let state = EditorState.create({doc: `Hallo Welt!`})

window.view = new EditorView({state, parent: document.querySelector("#editor")})
