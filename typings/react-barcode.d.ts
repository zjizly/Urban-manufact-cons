declare module 'react-barcode' {
  import * as React from 'react';

  interface ReactBarcodeProps {
    value: string;
    format?: 'auto' | 'EAN13' | 'UPC' | 'EAN8' | 'EAN5' | 'EAN2';
    width?: number;
    height?: number;
    displayValue?: boolean;
    text?: string;
    fontOptions?: 'bold' | 'italic' | 'bold italic';
    font?: string;
    textAlign?: 'left' | 'center' | 'right';
    textPosition?: 'top' | 'bottom';
    textMargin?: number;
    fontSize?: number;
    background?: string;
    lineColor?: string;
    margin?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    flat?: boolean;
  }

  export default class ReactBarcode extends React.Component<ReactBarcodeProps> {
  }
}