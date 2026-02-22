import { memo, useMemo, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Bold,
  Link,
  List,
  Table,
  Image,
  Indent,
  Italic,
  Heading,
  Mention,
  Paragraph,
  Underline,
  Autoformat,
  BlockQuote,
  Essentials,
  ImageStyle,
  MediaEmbed,
  ImageResize,
  IndentBlock,
  ImageUpload,
  ImageCaption,
  ImageToolbar,
  TableToolbar,
  CloudServices,
  ClassicEditor,
  InlineEditor,
  PictureEditing,
  PasteFromOffice,
  TableColumnResize,
  TextTransformation,
  Base64UploadAdapter,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

const FloatingLabelEditorJs = memo(function FloatingLabelEditorJs({
                                                                    name,
                                                                    onChange: onChangeEditor,
                                                                    dir,
                                                                    value,
                                                                    readOnly = true,
                                                                    editorType = 'classic',
                                                                    maxH = '500px',
                                                                    minH = '100px',
                                                                  }) {
  const editorRef = useRef(null);
  const EditorType = useMemo(() => {
    switch (editorType) {
      case 'classic':
        return ClassicEditor;
      case 'inline':
        return InlineEditor;
    }
  }, [editorType]);

  const handleEditorChange = () => {
    const data = editorRef.current?.getData();
    if (onChangeEditor) {
      onChangeEditor({
        target: {
          name,
          value: data,
        },
      });
    }
  };

  const configPlugins = useMemo(() => {
    // if (readOnly) return [];

    return [
      Autoformat,
      BlockQuote,
      Bold,
      CloudServices,
      Essentials,
      Heading,
      Image,
      ImageCaption,
      ImageResize,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      Base64UploadAdapter,
      Indent,
      IndentBlock,
      Italic,
      Link,
      List,
      MediaEmbed,
      Mention,
      Paragraph,
      PasteFromOffice,
      PictureEditing,
      Table,
      TableColumnResize,
      TableToolbar,
      TextTransformation,
      Underline,
    ];
  }, []);

  const configToolbar = useMemo(() => {
    // if (readOnly) return [];

    return [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'bold', 'italic', 'underline',
      '|',
      'link', 'uploadImage', 'insertTable', 'blockQuote', 'mediaEmbed',
      '|',
      'bulletedList', 'numberedList',
      '|',
      'outdent', 'indent',
    ];
  }, []);

  return (
    <div style={{ maxHeight: maxH, minHeight: minH, overflowY: 'auto' }}>
      <CKEditor editor={EditorType}
                data={value}
                disabled={readOnly}
                onChange={handleEditorChange}
                onReady={(editor) => {
                  editorRef.current = editor;

                  editor.editing.view.change((writer) => {
                    writer.setStyle(
                      "min-height",
                      "170px",
                      editor.editing.view.document.getRoot()
                    );
                  });
  
                }}
                config={{
                  licenseKey: 'GPL',
                  plugins: configPlugins,
                  toolbar: configToolbar,
                  language: {
                    ui: dir === 'rtl' ? 'ar' : 'en',
                    content: dir === 'rtl' ? 'ar' : 'en',
                  },
                  link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                  },
                  table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
                  },
                }} />
    </div>
  );
});

export default FloatingLabelEditorJs;
