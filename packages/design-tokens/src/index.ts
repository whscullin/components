/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import {
  createShouldForwardProp,
  props,
} from '@styled-system/should-forward-prop'

import { lighten } from 'polished'
export const itemSelectedColor = (color: string) => lighten(0.04, color)

export const shouldForwardProp = createShouldForwardProp([...props])

export * from './system'
export * from './theme'
export * from './GlobalStyle'
export * from './GoogleFontsLoader'

// Provided for legacy color implementations
export { palette } from './legacy'

// Useful external utilities
export * from './utils/animations'
export * from './utils/omit'
export * from './utils/pick'
export { generateTheme } from './utils/theme'
export type { ThemeCustomizations } from './utils/theme'

export { transitions } from './tokens/transitions'
export * from './utils/helpers'
export { pickSpecifiableColors } from './utils/color/pickSpecifiableColors'
export {
  intentUIBlend,
  uiTransparencyBlend,
  generateIntentShade,
} from './utils/color/blend'
export { generatePressed, generateInteractive } from './utils/color/stateful'
