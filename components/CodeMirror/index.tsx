import React, { useRef, useEffect } from 'react';
import { basicSetup } from '@codemirror/basic-setup';
import { EditorState } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';
import markdownLang from './markdownLang';
import theme from './theme';

interface CodeMirrorProps {
  value: string;
  className?: string;
  onChange: (value: string) => void;
}

export default function CodeMirror(props: CodeMirrorProps) {
  const editorViewRef = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorView>();
  const { value } = props;

  const onChange = () => {
    return EditorView.updateListener.of((v: ViewUpdate) => {
      /*  */
      if (v.docChanged) {
        const doc = v.state.doc;
        props.onChange(doc.toString());
      }
    });
  };

  useEffect(() => {
    const height = editorViewRef.current?.clientHeight;

    const state = EditorState.create({
      doc: value,
      extensions: [basicSetup, markdownLang, onChange(), theme({ height })],
    });
    editor.current = new EditorView({ state, parent: editorViewRef.current ?? undefined });
    return () => {
      editor.current?.destroy();
    };
    // const state = EditorState.create({
    //   doc: "a ",
    //   extensions: [basicSetup]
    // });
    // const view = new EditorView({ state, parent: editorViewRef.current ?? undefined });
    // return () => {
    //   view.destroy();
    //   // editor.current.removeEventListener("input", log);
    // };
  }, []);

  useEffect(() => {
    const view = editor.current;
    if (view) {
      const currentValue = view.state.doc.toString();
      if (value !== currentValue) {
        view.dispatch(
          view.state.update({
            changes: {
              from: 0,
              to: currentValue.length,
              insert: props.value,
            },
          })
        );
      }
    }
  }, [value]);

  return <div className={props.className} ref={editorViewRef}></div>;
}
