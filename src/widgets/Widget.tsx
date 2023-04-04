import React from 'react'
import styled from 'styled-components'

/**
 * Common building blocks for all widgets. Inheritors in webportal should override colors.
 */
const Widget = styled.div`
  margin-bottom: 1em;
  padding: 1.875em;
`

const WidgetHeader = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-bottom: 1em;
`

const WidgetTitle = styled.h4`
  font-weight: 700;
  margin: unset;
`

const Fieldset = styled.fieldset`
  all: unset;
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

const Input = styled.input``

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
  color: ${({ theme, disabled }) => (disabled ? '#bcc0cc' : 'inherit')};
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
  return <StyledText>{children}</StyledText>
}

const StyledText = styled.p`
  color: #f44336;
`

const ReservedSpace = styled.div`
  min-height: 1.25em;
  margin-bottom: 2em;
`

export {
  Fieldset,
  Input,
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
