import React from 'react'
import styled from 'styled-components'

import { Root, Indicator, Item } from '@radix-ui/react-radio-group'

import type { RadioGroupProps } from '@radix-ui/react-radio-group'

export type RadioProps = {
  rootProps?: RadioGroupProps
  children: React.ReactNode
}

const RadioGroup = ({ rootProps, children }: RadioProps) => {
  return <Root {...rootProps}>{children}</Root>
}

const RadioGroupItem = styled(Item)`
  all: unset;
  background-color: #fff;
  border-radius: 100%;
  border: 1px solid #9599a6;
  width: 1em;
  height: 1em;

  &[data-disabled] {
    background-color: #fff;
    border: 1px solid #bcc0cc;
  }
`
const RadioIndicator = styled(Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;

  &::before {
    content: '';
    width: 0.5em;
    height: 0.5em;
    background-color: #fff;
    position: absolute;
    border-radius: 100%;
  }

  &::after {
    content: '';
    width: 1em;
    height: 1em;
    display: block;
    background-color: #25408f;
    border-radius: 100%;
  }
`

/**
 * Baseline styled primitives that can be further customized in portals.
 */
export { RadioGroup, RadioGroupItem, RadioIndicator }
