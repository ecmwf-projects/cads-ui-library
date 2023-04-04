import React from 'react'
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
  childGetter: Record<string, () => JSX.Element>
}

const ExclusiveGroupWidget = ({
  configuration,
  childGetter
}: ExclusiveGroupWidgetProps) => {
  if (!configuration) return null

  const { type, name, label, help, children, details } = configuration

  if (type !== 'ExclusiveGroupWidget') return null

  if (!childGetter) return null

  const getDefault = () => {
    return details.default
  }

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
        <RadioGroup rootProps={{ defaultValue: getDefault() }}>
          {children.map(child => {
            if (!childGetter[child]) return null
            return (
              <Group key={child}>
                <RadioGroupItem value={child} id={child}>
                  <RadioIndicator />
                </RadioGroupItem>
                {childGetter[child]()}
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
`

export { ExclusiveGroupWidget }
