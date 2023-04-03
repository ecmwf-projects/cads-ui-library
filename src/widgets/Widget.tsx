import styled from 'styled-components'

/**
 * Common building blocks for all widgets. Inheritors in webportal should specify colors.
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

export { Widget, WidgetHeader, WidgetTitle, Fieldset, Legend, Input }
