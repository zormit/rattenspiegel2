import {Extension} from "@codemirror/next/state"
import {Decoration, themeClass, EditorView, ViewPlugin, DecorationSet, ViewUpdate} from "@codemirror/next/view"
import {RangeSetBuilder} from "@codemirror/next/rangeset"

const baseTheme = EditorView.baseTheme({
    "zebralink@light": {color: "blue"}
})

const link = Decoration.mark({
  attributes: {class: themeClass("zebralink")}
})

function linkDeco(view) {
  let builder = new RangeSetBuilder()
  for (let {from, to} of view.visibleRanges) {
    let text = view.state.sliceDoc(from, to)
    let matches = text.matchAll(/foobar/g)
    console.log(text)
    for (const match of matches) {
        builder.add(match.index, match.index + match[0].length, link)
    }
  }
  return builder.finish()
}



const showLink = ViewPlugin.fromClass(class {
  decorations

  constructor(view) {
    this.decorations = linkDeco(view)
  }

  update(update) {
    if (update.docChanged || update.viewportChanged)
      this.decorations = linkDeco(update.view)
  }
}).decorations()


export function linker() {
  return [
    baseTheme,
    [],
    showLink
  ]
}
