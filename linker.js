import {Extension} from "@codemirror/next/state"
import {
    Decoration,
    themeClass,
    EditorView,
    ViewPlugin,
    DecorationSet,
    ViewUpdate,
    WidgetType,
} from "@codemirror/next/view"
import {RangeSetBuilder} from "@codemirror/next/rangeset"

const baseTheme = EditorView.baseTheme({
    "zebralink@light": {color: "blue"},
})

class LinkWidget extends WidgetType {
    eq(otherValue) {
        return this.value.toLowerCase() == otherValue.toLowerCase()
    }
    toDOM() {
        let dom = document.createElement("a")
        dom.href = "https://codemirror.net"
        dom.textContent = this.value
        dom.contenteditable = true
        return dom
    }
}

const link = Decoration.mark({
    //widget: new LinkWidget("fuubar"),
    attributes: {class: themeClass("zebralink")},
})

function linkDeco(view) {
    let builder = new RangeSetBuilder()
    for (let {from, to} of view.visibleRanges) {
        let text = view.state.sliceDoc(from, to)
        let matches = text.matchAll(/(foobar|apple|pear)/g)
        //let matches = text.matchAll(/https?:\/\/[^ ]*/g)
        console.log(text)
        for (const match of matches) {
            builder.add(match.index, match.index + match[0].length, link)
        }
    }
    return builder.finish()
}

const showLink = ViewPlugin.fromClass(
    class {
        decorations

        constructor(view) {
            this.decorations = linkDeco(view)
        }

        update(update) {
            if (update.docChanged || update.viewportChanged)
                this.decorations = linkDeco(update.view)
        }
    },
).decorations()

export function linker() {
    return [baseTheme, [], showLink]
}
