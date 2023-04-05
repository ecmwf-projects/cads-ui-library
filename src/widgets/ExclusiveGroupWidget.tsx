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
  TFormConfiguration extends Record<string | 'type' | 'name', unknown>
>(
  formConfiguration: TFormConfiguration[],
  name: string
) => unknown
const getExclusiveGroupChildren: GetExclusiveGroupChildren = (
  formConfiguration,
  name
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
    >((prevValue, currentValue) => {
      prevValue[currentValue] = () => <p>FIXME</p>

      return prevValue
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
