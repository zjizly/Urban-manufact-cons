declare module 'react-data-export' {
    import * as React from 'react';
    
    interface EsProps<T>{
        data: T[],
        name: string
    }

    interface EcProps{
        label: string,
        value: any
    }

    interface EfProps{
        element?: JSX.Element;
        filename?: string;
    }

    export default class ReactExport extends React.Component{

        static ExcelFile: typeof ExcelFile;
        
    }

    class ExcelFile extends React.Component<EfProps,any>{
        
        static ExcelSheet: typeof ExcelSheet;
        static ExcelColumn: typeof ExcelColumn;

    }

    class ExcelSheet<T> extends React.Component< EsProps<T>, {} > {}

    class ExcelColumn extends React.Component< EcProps, {} >{}


  }