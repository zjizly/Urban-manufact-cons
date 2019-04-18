declare module 'react-ckeditor-component' {
    import * as React from 'react';

    export interface CkEditorProps {
        activeClass?: string,
        content: string,
        events: {
            change: (e: React.ChangeEvent<HTMLInputElement>) => void
        },
        scriptUrl?: string,
    }

    export default class CkEditor extends React.Component<CkEditorProps> {
    }
}