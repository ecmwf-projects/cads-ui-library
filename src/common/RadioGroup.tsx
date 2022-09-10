import React from 'react'

import { Root, Indicator, Item } from '@radix-ui/react-radio-group'

import type { RadioGroupProps } from '@radix-ui/react-radio-group'

export type RadioProps = {
  rootProps?: RadioGroupProps
  children: React.ReactNode
}

const RadioGroup = ({ rootProps, children }: RadioProps) => {
  return <Root {...rootProps}>{children}</Root>
}

/**
 * We also export for convenience the set of baseline un-styled primitives that can be further customized in portals.
 */

const RadioIndicator = Indicator
const RadioGroupItem = Item

export { RadioGroup, RadioIndicator, RadioGroupItem }
