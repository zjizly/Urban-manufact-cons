declare module 'qrcode.react' {
    import * as React from 'react';
  
    export interface QRCodeProps {
        value: string,
        size?: number,
        bgColor?: string,
        fgColor?: string,
        level?: string,
        renderAs?: "canvas" | "svg"
    }
  
    export default class QRCode extends React.Component<QRCodeProps> {
    }
  }