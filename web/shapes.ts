export interface ColorInt {
  id: string;
  the_color: string;
  the_integer: number;
}
export interface PostEvent {
  body: string;
}


export interface Str_to_Obj {
  [key: string]: { [key: string]: string; };
}

export interface Str_to_Str_or_Num {
  [key: string]: string | number;
}

export interface Str_to_Int {
  [key: string]: number;
}

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    colors: {
      primary: {
        main: string;
      };
    };
  }
}