import React from 'react'
import styled from 'styled-components'

import {
  Accordion as AccordionPrimitive,
  Item as AccordionItemPrimitive,
  Header as AccordionHeaderPrimitive,
  Trigger as AccordionTriggerPrimitive,
  Content as AccordionContentPrimitive
} from '@radix-ui/react-accordion'

import { ChevronDownIcon } from '@radix-ui/react-icons'

type Props = {
  rootProps: {
    /**
     * The value of the accordion item to expand by default.
     * Must match itemProps.value.
     */
    defaultValue?: string
  }
  itemProps: { value: string; trigger: () => React.ReactNode }
  children: React.ReactNode
}

/**
 * An uncontrolled AccordionSingle component.
 */
const AccordionSingle = ({ rootProps, itemProps, children }: Props) => {
  return (
    <StyledRoot type='single' defaultValue={rootProps.defaultValue} collapsible>
      <AccordionItemPrimitive value={itemProps.value}>
        <StyledHeader>
          <StyledTrigger>
            {itemProps.trigger()}
            <StyledChevron />
          </StyledTrigger>
        </StyledHeader>
        <AccordionContentPrimitive>{children}</AccordionContentPrimitive>
      </AccordionItemPrimitive>
    </StyledRoot>
  )
}

const StyledRoot = styled(AccordionPrimitive)`
  background-color: #ffffff;
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
  background-color: transparent;
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
