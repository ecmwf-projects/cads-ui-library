import React from 'react'
import styled from 'styled-components'

import { Except } from 'type-fest'

import {
  Accordion as AccordionPrimitive,
  Item as AccordionItemPrimitive,
  Header as AccordionHeaderPrimitive,
  Trigger as AccordionTriggerPrimitive,
  Content as AccordionContentPrimitive
} from '@radix-ui/react-accordion'

import { ChevronDownIcon } from '@radix-ui/react-icons'

import type {
  AccordionSingleProps,
  AccordionItemProps
} from '@radix-ui/react-accordion'

type Props = {
  rootProps: Except<AccordionSingleProps, 'type'>
  itemProps: AccordionItemProps & { trigger: () => React.ReactNode }
  children: React.ReactNode
}

/**
 * An uncontrolled AccordionSingle component.
 */
const AccordionSingle = ({ rootProps, itemProps, children }: Props) => {
  const { trigger, ...restOfItemProps } = itemProps

  return (
    <StyledRoot
      {...rootProps}
      type='single'
      data-stylizable='accordion-single'
      collapsible
    >
      <AccordionItemPrimitive {...restOfItemProps}>
        <StyledHeader>
          <StyledTrigger data-stylizable='accordion-single-trigger'>
            {trigger()}
            <StyledChevron />
          </StyledTrigger>
        </StyledHeader>
        <AccordionContentPrimitive>{children}</AccordionContentPrimitive>
      </AccordionItemPrimitive>
    </StyledRoot>
  )
}

const StyledRoot = styled(AccordionPrimitive)`
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 1.0625em;
`

const StyledHeader = styled(AccordionHeaderPrimitive)`
  all: unset;
  display: flex;
`

const StyledTrigger = styled(AccordionTriggerPrimitive)`
  all: unset;
  color: #39393a;
  cursor: pointer;
  display: flex;
  flex: 1;
  font-family: inherit;
  font-weight: 400;
  font-size: 1.125em;
  line-height: 22px;
  justify-content: space-between;
  margin-top: 0 !important;

  &[data-state='open'] {
    svg {
      transform: rotate(180deg);
    }

    margin-bottom: 0.75em;
  }
`

const StyledChevron = styled(ChevronDownIcon)``
export { AccordionSingle }
