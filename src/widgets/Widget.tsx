import React from 'react'
import styled from 'styled-components'
import { BaseButton } from '../index'

/**
 * Common building blocks for all widgets. Inheritors in webportal can override styles
 * by targeting data-stylizable attributes.
 * .
 */
const Widget = styled.div`
  margin-bottom: 1em;
  padding: 1.875em;

  [inert],
  [inert] * {
    opacity: 0.5;
    pointer-events: none;
    cursor: default;
    user-select: none;
  }
`

const WidgetHeader = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-bottom: 1em;
`

const WidgetTitle = styled.label`
  font-weight: 700;
  margin: unset;
`

const Fieldset = styled.fieldset`
  all: unset;
  display: block;
  width: 100%;
`

const Legend = styled.legend`
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  width: 1px;
  height: 1px;
  white-space: nowrap;
`

const InputGroup = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  gap: 0.5em;
  padding-bottom: 0.2em;

  button {
    &[data-disabled] {
      background-color: #fff;
      border: 1px solid #bcc0cc;
      svg {
        color: #9599a6;
      }
    }
  }
`

const LabelWrapper = styled.div<{ disabled?: boolean }>`
  color: ${({ disabled }) => (disabled ? '#bcc0cc' : 'inherit')};
`

const InputsGrid = styled.div<{ columns: number }>`
  display: flex;
  flex-flow: column;
  gap: 1em;

  @media (min-width: 769px) {
    display: grid;
    grid-template-columns: ${({ columns }) => `repeat(${columns}, auto)`};
    row-gap: 1em;
  }
`
const WidgetActionsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 1em;
`

const Error = ({ children }: { children: React.ReactNode }) => {
  return <StyledText role='alert'>{children}</StyledText>
}

const StyledText = styled.span`
  display: block;
  color: #f44336;
`

const ReservedSpace = styled.div`
  min-height: 1.25em;
  margin-bottom: 2em;
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 150px;
  gap: 1em;
`

const ActionButton = styled(BaseButton)`
  all: unset;
  cursor: pointer;
  color: #25408f;
  text-decoration: underline;
`

export {
  Actions,
  ActionButton,
  Fieldset,
  InputGroup,
  InputsGrid,
  LabelWrapper,
  Legend,
  Error,
  ReservedSpace,
  Widget,
  WidgetActionsWrapper,
  WidgetHeader,
  WidgetTitle
}
