import React from 'react'
import styled from 'styled-components'

import { CheckIcon } from '@radix-ui/react-icons'

import {
  Checkbox as CheckboxPrimitive,
  Indicator as IndicatorPrimitive
} from '@radix-ui/react-checkbox'

import type {
  CheckboxProps,
  CheckboxIndicatorProps
} from '@radix-ui/react-checkbox'

type Props = {
  rootProps?: CheckboxProps
  indicatorProps?: CheckboxIndicatorProps
  children?: React.ReactNode
}

const Checkbox = ({ rootProps, indicatorProps, children }: Props) => {
  return (
    <StyledCheckbox {...rootProps}>
      <StyledIndicator {...indicatorProps}>
        {children || <CheckIcon />}
      </StyledIndicator>
    </StyledCheckbox>
  )
}

const StyledCheckbox = styled(CheckboxPrimitive)`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  background-color: #ffffff;
  border: 1px solid #9599a6;
  border-radius: 2px;

  &[data-state='checked'] {
    background-color: #25408f;
  }
`

const StyledIndicator = styled(IndicatorPrimitive)`
  all: unset;
  width: 1em;
  height: 1em;

  svg {
    color: #ffffff;
  }
`

export { Checkbox }
