import styled from 'styled-components'

const Widget = styled.div`
  background-color: #ffffff;
  margin-bottom: 1em;
  padding: 1.875em;
`

const WidgetHeader = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-bottom: 2em;
`

const WidgetTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  margin: unset;
`

export { Widget, WidgetHeader, WidgetTitle }
