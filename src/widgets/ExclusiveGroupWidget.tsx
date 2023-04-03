import React from 'react'
import styled from 'styled-components'

import { Widget, WidgetHeader, WidgetTitle, Fieldset, Legend } from './Widget'
import {
  Label,
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
}

const ExclusiveGroupWidget = ({ configuration }: ExclusiveGroupWidgetProps) => {
  if (!configuration) return null

  const { type, name, label, help, children, details } = configuration

  if (type !== 'ExclusiveGroupWidget') return null

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
        <RadioGroup>
          {children.map(child => {
            return (
              <Group key={child}>
                <RadioGroupItem value={child} id={child}>
                  <RadioIndicator />
                </RadioGroupItem>
                <div>the child instance</div>
              </Group>
            )
          })}
        </RadioGroup>
      </Fieldset>
    </Widget>
  )
}

const Group = styled.div``

export { ExclusiveGroupWidget }
