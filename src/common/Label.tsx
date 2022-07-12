import React from 'react'
import styled from 'styled-components'

import { Label as LabelPrimitive } from '@radix-ui/react-label'

const StyledLabel = styled(LabelPrimitive)<{
  $isFullWidth?: boolean
}>`
  display: ${({ $isFullWidth }) => ($isFullWidth ? 'block' : 'inline-block')};
  width: ${({ $isFullWidth }) => $isFullWidth && '100%'};
`

StyledLabel.displayName = 'Label'

export { StyledLabel as Label }
