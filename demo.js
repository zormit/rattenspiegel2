import { EditorState, EditorView } from "@codemirror/next/basic-setup";
let state = EditorState.create({ doc: `Hallo Welt!` });
let noState = 42;
window.view = new EditorView({ state, parent: document.querySelector("#editor") });
