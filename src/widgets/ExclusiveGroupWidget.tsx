import React, { useState } from 'react'
import styled from 'styled-components'

import { Widget, WidgetHeader, WidgetTitle, Fieldset, Legend } from './Widget'
import {
  RadioGroup,
  RadioGroupItem,
  RadioIndicator,
  WidgetTooltip
} from '../index'
import { createWidget } from '../index'

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
   * A mapping between children names and their corresponding components.
   */
  childrenGetter: Record<string, (...props: any) => JSX.Element>
}

const ExclusiveGroupWidget = ({
  configuration,
  childrenGetter
}: ExclusiveGroupWidgetProps) => {
  const { type, name, label, help, children, details } = configuration

  const [selection, setSelection] = useState<string>(details.default)
  if (!configuration) return null

  if (type !== 'ExclusiveGroupWidget') return null

  if (!childrenGetter) return null

  return (
    <Widget data-stylizable='widget'>
      <WidgetHeader>
        <WidgetTitle data-stylizable='widget-title'>{label}</WidgetTitle>
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
            if (!childrenGetter[child]) return null
            return (
              <Group key={child}>
                <RadioGroupItem value={child} id={child}>
                  <RadioIndicator />
                </RadioGroupItem>
                {childrenGetter[child]({
                  fieldsetDisabled: child !== selection
                })}
              </Group>
            )
          })}
        </RadioGroup>
      </Fieldset>
    </Widget>
  )
}

/**
 * Given the complete form configuration, group the ExclusiveGroupWidget children, and return a mapping between children names and their corresponding components.
 */
type GetExclusiveGroupChildren = <
  TFormConfiguration extends Record<string | 'type' | 'name', unknown> // FIXME
>(
  formConfiguration: TFormConfiguration[],
  name: string,
  constraints?: Record<string, string[]>
) => Record<string, (...props: any) => JSX.Element> | undefined
const getExclusiveGroupChildren: GetExclusiveGroupChildren = (
  formConfiguration,
  name,
  constraints
) => {
  const thisExclusiveGroup = formConfiguration.find(
    configuration =>
      configuration.type === 'ExclusiveGroupWidget' &&
      configuration.name === name
  )

  if (
    thisExclusiveGroup &&
    'children' in thisExclusiveGroup &&
    Array.isArray(thisExclusiveGroup.children)
  ) {
    return thisExclusiveGroup.children.reduce<
      Record<string, (...props: any) => JSX.Element>
    >((childMap, childName) => {
      const childConfiguration = formConfiguration.find(
        configuration => configuration.name === childName
      )

      if (!childConfiguration) return childMap
      const childConstraints = constraints && constraints[childName]
      const widget = createWidget(childConfiguration, childConstraints)

      if (!widget) return childMap
      childMap[childName] = () => widget // FIXME allow props

      return childMap
    }, {})
  }
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
export { getExclusiveGroupChildren }
