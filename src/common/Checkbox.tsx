import React from 'react'
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
  children: React.ReactNode
}

const Checkbox = ({ rootProps, indicatorProps, children }: Props) => {
  return (
    <CheckboxPrimitive {...rootProps}>
      <IndicatorPrimitive {...indicatorProps}>{children}</IndicatorPrimitive>
    </CheckboxPrimitive>
  )
}

export { Checkbox }
