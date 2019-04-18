import CKEditor from "react-ckeditor-component";
import * as React from 'react';

interface Props {
    content: string;
    onChange(s: string): void
}

export class Editor extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
        this.state = {
            content: this.props.content,
        }
    }

    onChange = (evt: any) => {
        const newContent = evt.editor.getData();
        this.props.onChange(newContent);
        this.setState({
            content: newContent
        })
    }

    render() {
        return (
            <CKEditor
                scriptUrl={`${process.env.PUBLIC_URL}/ckeditor/ckeditor.js`}
                content={this.props.content}
                events={{
                    "change": this.onChange
                }}
            />
        )
    }
}