import { EditorView } from '@codemirror/view';
import { StyleSpec } from 'style-mod';

interface Spec {
  [selector: string]: StyleSpec;
}

export default function theme() {
  const spec: Spec = {
    '&': { background: '#FFF', height: '32em' },
    '&.cm-editor.cm-focused': { outline: 'none' },
    '.cm-content': { fontFamily: `'Fira Code', 'monospace', 'Noto Serif SC', serif` },
  };

  return EditorView.theme(spec);
}
