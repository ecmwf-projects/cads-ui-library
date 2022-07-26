import React from 'react'
import styled from 'styled-components'

import {
  Provider as TooltipProvider,
  Tooltip as TooltipPrimitive,
  Trigger as TooltipTriggerPrimitive,
  Content as TooltipContentPrimitive,
  Arrow as TooltipArrowPrimitive
} from '@radix-ui/react-tooltip'

import type {
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps
} from '@radix-ui/react-tooltip'

type Props = {
  rootProps?: TooltipProps
  triggerProps?: TooltipTriggerProps & { child?: () => JSX.Element }
  contentProps: TooltipContentProps & { child?: () => JSX.Element }
}
/**
 * A tooltip to be used in conjunction with widgets.
 */
const Tooltip = ({ rootProps, triggerProps, contentProps }: Props) => {
  const { child: triggerChild, ..._triggerProps } = triggerProps || {}
  const { child: contentChild, ..._contentProps } = contentProps
  return (
    <TooltipPrimitive {...rootProps}>
      <TooltipTriggerPrimitive {..._triggerProps}>
        {triggerChild && triggerChild()}
      </TooltipTriggerPrimitive>
      <StyledContent {..._contentProps}>
        {contentChild && contentChild()}
      </StyledContent>
    </TooltipPrimitive>
  )
}

const StyledContent = styled(TooltipContentPrimitive)`
  border-radius: 8px;
  background-color: #ffffff;
  padding: 0.75em 1.25em 0.75em 1.25em;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0px 4px 6px -2px rgba(0, 0, 0, 0.05);
`
const StyledArrow = styled(TooltipArrowPrimitive)`
  fill: #ffffff;
`

export { TooltipProvider, Tooltip, StyledArrow as TooltipArrow }
