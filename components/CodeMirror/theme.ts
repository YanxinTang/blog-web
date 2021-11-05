import { EditorView } from '@codemirror/view';
import { StyleSpec } from 'style-mod';

interface Theme {
  height: number | undefined;
}

interface Spec {
  [selector: string]: StyleSpec;
}

export default function theme(options: Theme) {
  const spec: Spec = {
    '&': { background: '#FFF' },
    '&.cm-editor.cm-focused': { outline: 'none' },
    '.cm-content': { fontFamily: `'Fira Code', monospace` },
    '.cm-scroller': { height: '100%', overflow: 'auto' },
  }

  if (options.height) {
    spec['&']['height'] = `${options.height}px`;
  }

  return EditorView.theme(spec)
}


