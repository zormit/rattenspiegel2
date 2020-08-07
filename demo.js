import {EditorState, EditorView, basicSetup} from "@codemirror/next/basic-setup"
import {
    collab,
    sendableUpdates,
    receiveUpdates,
    getClientID,
    getSyncedVersion,
} from "@codemirror/next/collab"
import {linker} from "./linker.js"

let state = EditorState.create({
    doc: ``,
    extensions: [basicSetup, collab(), linker()],
})
let state2 = EditorState.create({
    doc: ``,
    extensions: [basicSetup, collab()],
})

let view = new EditorView({
    state: state,
    parent: document.querySelector("#editor"),
})
let view2 = new EditorView({
    state: state2,
    parent: document.querySelector("#editor2"),
})

class Server {
    constructor() {
        this.updates = []
        this.updateClientIDs = []
    }
    sendUpdates(version, updates, clientID) {
        if (version != this.updates.length) {
            return
        }

        updates.forEach((update) => {
            this.updates.push(update)
            this.updateClientIDs.push(clientID)
        })
    }
    stepsSince(version) {
        return {
            updates: this.updates.slice(version),
            clientIDs: this.updateClientIDs.slice(version),
        }
    }
}

let server = new Server()

function sync(v) {
    let myu = sendableUpdates(v.state)
    if (myu.length > 0) {
        server.sendUpdates(getSyncedVersion(v.state), myu, getClientID(v.state))
    }
    let u = server.stepsSince(getSyncedVersion(v.state))
    if (u.updates.length > 0) {
        let myUpdates = 0
        let myID = getClientID(v.state)
        u.clientIDs.forEach((id) => {
            if (id == myID) {
                myUpdates += 1
            }
        })
        v.dispatch(receiveUpdates(v.state, u.updates, myUpdates))
    }

    myu = sendableUpdates(v.state)
    if (myu.length > 0) {
        server.sendUpdates(getSyncedVersion(v.state), myu, getClientID(v.state))
    }
}

function syncBoth() {
    sync(view)
    sync(view2)
}

document.getElementById("editor").addEventListener("click", (event) => {
    let pos = view.posAtCoords({x: event.clientX, y: event.clientY})
    let domElement = view.domAtPos(pos)
    if (domElement.node?.parentElement?.className == "cm-zebralink") {
        let linkText = domElement.node?.data
        console.log("Clicked on " + linkText)
        document.location = "#" + linkText
    }
})

window.view = view
window.view2 = view2
window.sendableUpdates = sendableUpdates
window.receiveUpdates = receiveUpdates
window.getClientID = getClientID
window.getSyncedVersion = getSyncedVersion
window.sync = sync
window.syncBoth = syncBoth
window.linker = linker
