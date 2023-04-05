import React, { useState } from 'react'
import styled from 'styled-components'

import { Widget, WidgetHeader, WidgetTitle, Fieldset, Legend } from './Widget'
import {
  RadioGroup,
  RadioGroupItem,
  RadioIndicator,
  WidgetTooltip
} from '../index'

export interface ExclusiveGroupWidgetConfiguration {
  type: 'ExclusiveGroupWidget'
  name: string
  label: string
  help?: string | null
  children: string[]
  details: {
    default: string
  }
}

export interface ExclusiveGroupWidgetProps {
  configuration: ExclusiveGroupWidgetConfiguration
  /**
   * A mapping between child names and their given JSX representation.
   */
  childGetter: Record<string, (...props: any) => JSX.Element>
}

const ExclusiveGroupWidget = ({
  configuration,
  childGetter
}: ExclusiveGroupWidgetProps) => {
  const { type, name, label, help, children, details } = configuration

  const [selection, setSelection] = useState<string>(details.default)
  if (!configuration) return null

  if (type !== 'ExclusiveGroupWidget') return null

  if (!childGetter) return null

  return (
    <Widget id={name}>
      <WidgetHeader>
        <WidgetTitle>{label}</WidgetTitle>
        <WidgetTooltip
          helpText={help || null}
          triggerAriaLabel={`Get help about ${label}`}
        />
      </WidgetHeader>
      <Fieldset>
        <Legend>{label}</Legend>
        <RadioGroup
          rootProps={{
            value: selection,
            onValueChange: value => setSelection(value)
          }}
        >
          {children.map(child => {
            if (!childGetter[child]) return null
            return (
              <Group key={child}>
                <RadioGroupItem value={child} id={child}>
                  <RadioIndicator />
                </RadioGroupItem>
                {childGetter[child]({ fieldsetDisabled: child !== selection })}
              </Group>
            )
          })}
        </RadioGroup>
      </Fieldset>
    </Widget>
  )
}

const Group = styled.div`
  display: flex;
  flex-flow: row;
  gap: 1em;

  [data-stylizable='widget geographic-extent-widget'] {
    margin-top: unset;
    padding-top: unset;
  }

  [data-stylizable='widget'] {
    margin-top: unset;
    padding-top: unset;
    width: 100%;
  }

  [data-stylizable='widget-action-wrapper'] {
    align-items: flex-start;
  }

  fieldset[disabled] {
    input {
      background-color: #e6e9f2;
    }
  }

  &:has(fieldset[disabled]) {
    label {
      color: #bcc0cc;
    }
  }
`

export { ExclusiveGroupWidget }
