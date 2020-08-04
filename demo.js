import {EditorState, EditorView, basicSetup} from "@codemirror/next/basic-setup"
import {
    collab,
    sendableUpdates,
    receiveUpdates,
    getClientID,
    getSyncedVersion,
} from "@codemirror/next/collab"
//import io from "socket.io-client"

//const socket = io()

/*socket.on("updates", (updates, clientIDs) => {
    console.log(updates)
    console.log(clientIDs)

    let myUpdates = 0
    clientIDs.forEach((id) => {
        if (id == getClientID(view.state)) {
            myUpdates += 1
        }
    })
    console.log(myUpdates)
    let transaction = receiveUpdates(view.state, updates, 0)
    //view.setState(transaction.state)
    view.dispatch(transaction)
})*/

let state = EditorState.create({
    doc: ``,
    extensions: [basicSetup, collab()],
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

//view.dispatch(view.state.update({changes: {from: 0, insert: "A"}}))
//view2.dispatch(view2.state.update({changes: {from: 0, insert: "B"}}))

class Server {
    constructor() {
        this.updates = []
        // identifizieren, woher.
        this.updateClientIDs = []
    }
    sendUpdates(version, updates, clientID) {
        if (version != this.updates.length) {
            console.log("reject")
            return
        }

        // Apply and accumulate new updates
        updates.forEach((update) => {
            //this.doc = update.apply(this.doc).doc
            this.updates.push(update)
            this.updateClientIDs.push(clientID)
        })
    }
    stepsSince(version) {
        console.log("requested since " + version)
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
        console.log(myUpdates)
        v.dispatch(
                // returns transformation
                receiveUpdates(v.state, u.updates, myUpdates))
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

/*
setInterval(() => {
console.log("SYNCING!")
    sync(view)
    sync(view2)
}, 1000)
//*/

// this.update(n, s => s.update({changes: {from: pos, insert: text}, selection: {anchor: pos + text.length}}))

/*
view.dispatch({changes: {from:0, insert:'abcd'}, selection: {anchor: 4}})
sync(view)
sync(view2)
sync(view)
sync(view2)
//reicht das???

view2.dispatch({changes: {from:0, to: 4, insert:'c'}, selection: {anchor: 1}})
view.dispatch({changes: {from:4, insert:'e'}, selection: {anchor: 5}})
//view2.dispatch({changes: {from:0, to: 4, insert:'c'}})
// */


/*setInterval(() => {
}, 120)*/

window.view = view
window.view2 = view2
window.sendableUpdates = sendableUpdates
window.receiveUpdates = receiveUpdates
window.getClientID = getClientID
window.getSyncedVersion = getSyncedVersion
window.sync = sync
window.syncBoth = syncBoth

/*setInterval(() => {
    socket.emit("request-updates", getSyncedVersion(view.state))
    let updates = sendableUpdates(view.state)
    if (updates.length > 0) {
        socket.emit("updates", getSyncedVersion(view.state), getClientID(view.state), updates)
    }
}, 1000)*/
