declare module 'react-motion-drawer' {
  import * as React from 'react';

  export interface DrawerMenuProps {
    zIndex?: number; // z-index of the drawer default is 10000
    noTouchOpen?: boolean; // can a user pan to open
    noTouchClose?: boolean; // can a user pan to close
    onChange?: (open: boolean) => void; // called when the drawer is open
    drawerStyle?: React.CSSProperties; // additional drawer styles
    className?: string; // additional drawer className
    overlayClassName?: string; // additional overlay className
    config?: {
      stiffness: number;
      damping: number;
      precision: number
    }; // configuration of the react-motion animation
    open?: boolean; // states if the drawer is open
    width?: number | string; // width of the drawer
    height?: number | string; // height of the drawer
    handleWidth?: number; // width of the handle
    peakingWidth?: number; // width that the drawer peaks on press
    panTolerance?: number; // tolerance until the drawer starts to move
    right?: boolean; // drawer on the right side of the screen
    overlayColor?: string; // color of the overlay
    fadeOut?: boolean; // fade out
    offset?: number // offset
  }

  export default class DrawerMenu extends React.Component<DrawerMenuProps> {
  }
}