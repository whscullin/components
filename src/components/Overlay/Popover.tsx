import { Placement } from 'popper.js'
import * as React from 'react'
import { Theme, withTheme } from '../../style'
import { Overlay } from './Overlay'
import { overlayBubbleWithContent } from './popover_utils'

export interface PopoverProps {
  content: React.ReactNode
  theme: Theme
  placement?: Placement
}

const InternalPopover: React.SFC<PopoverProps> = ({
  content,
  theme,
  placement,
  children,
}) => (
  <Overlay
    placement={placement}
    trigger="click"
    overlayContentFactory={overlayBubbleWithContent(
      content,
      theme.components.Popover.bubble
    )}
    backdrop
    backdropStyles={theme.components.Popover.backdrop}
  >
    {children}
  </Overlay>
)

export const Popover = withTheme(InternalPopover)
