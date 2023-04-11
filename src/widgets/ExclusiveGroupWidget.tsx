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

import type { GeographicExtentWidgetConfiguration } from '../widgets/GeographicExtentWidget'
import type { StringListWidgetConfiguration } from '../widgets/StringListWidget'
import type { StringListArrayWidgetConfiguration } from '../widgets/StringListArrayWidget'
import type { StringChoiceWidgetConfiguration } from '../widgets/StringChoiceWidget'
import type { TextWidgetConfiguration } from '../widgets/TextWidget'

export interface ExclusiveGroupWidgetConfiguration {
  type: 'ExclusiveGroupWidget'
  name: string
  label: string
  help?: string | null
  children: string[]
  details: {
    default: string
    information?: string
  }
}

type ChildrenGetter =
  | Record<string, (...props: any) => JSX.Element | null>
  | undefined // FIXME remove undefined

export interface ExclusiveGroupWidgetProps {
  configuration: ExclusiveGroupWidgetConfiguration
  /**
   * A mapping between children names and their corresponding components.
   */
  childrenGetter: ChildrenGetter
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
                  fieldsetDisabled: child !== selection,
                  inert: child !== selection
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
type GetExclusiveGroupChildren = (
  formConfiguration: FormConfiguration[],
  name: string,
  constraints?: Record<string, string[]>
) => ChildrenGetter
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
      Record<string, (...props: any) => JSX.Element | null>
    >((childMap, childName) => {
      const childConfiguration = formConfiguration.find(
        configuration => configuration.name === childName
      )

      if (!childConfiguration) return childMap
      const childConstraints = constraints && constraints[childName]
      const childWidget = createWidget(childConfiguration, childConstraints)

      childMap[childName] = props => childWidget(props)

      return childMap
    }, {})
  }
}

export type FormConfiguration =
  | ExclusiveGroupWidgetConfiguration
  | StringListArrayWidgetConfiguration
  | StringListWidgetConfiguration
  | StringChoiceWidgetConfiguration
  | GeographicExtentWidgetConfiguration
  | TextWidgetConfiguration

type IsChildOfExclusiveGroup = (
  widgetConfiguration: Exclude<
    FormConfiguration,
    ExclusiveGroupWidgetConfiguration
  >,
  formConfiguration: FormConfiguration[]
) => boolean
const isChildOfExclusiveGroup: IsChildOfExclusiveGroup = (
  widgetConfiguration,
  formConfiguration
) => {
  if (
    formConfiguration.find(configuration => {
      return (
        configuration.type === 'ExclusiveGroupWidget' &&
        configuration.children.includes(widgetConfiguration.name)
      )
    })
  ) {
    return true
  }

  return false
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
export { getExclusiveGroupChildren, isChildOfExclusiveGroup }
