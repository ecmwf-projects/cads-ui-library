import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

import { useReadLocalStorage } from 'usehooks-ts'

import {
  Label,
  RadioGroup,
  RadioGroupItem,
  RadioIndicator as Indicator,
  WidgetTooltip
} from '../index'
import {
  InputsGrid,
  LabelWrapper,
  Widget,
  Fieldset as BaseFieldset,
  Legend,
  WidgetActionsWrapper,
  WidgetHeader,
  WidgetTitle
} from './Widget'

import { isDisabled } from '../utils'

export interface StringChoiceWidgetDetails {
  columns: number
  id: number
  labels: {
    [value: string]: string
  }
  values: string[]
  default: string[]
}

export interface StringChoiceWidgetConfiguration {
  type: 'StringChoiceWidget'
  name: string
  label: string
  help?: string | null
  required: boolean
  details: StringChoiceWidgetDetails
}

interface StringChoiceWidgetProps {
  configuration: StringChoiceWidgetConfiguration
  /**
   * Permitted selections for the widget.
   */
  constraints?: string[]
  /**
   * Whether the underlying fieldset should be functionally and visually disabled.
   */
  fieldsetDisabled?: boolean
  /**
   * Whether to hide the widget label from ARIA.
   */
  labelAriaHidden?: boolean
}

const StringChoiceWidget = ({
  configuration,
  constraints,
  fieldsetDisabled,
  labelAriaHidden
}: StringChoiceWidgetProps) => {
  const [selection, setSelection] = useState<string[]>([])
  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs: { [k: string]: string[] }
  }>('formSelection')
  /**
   * Cache persisted selection, so we don't need to pass it as an effect dependency.
   */
  const persistedSelectionRef = useRef(persistedSelection)

  const { details, label, help, name } = configuration
  const {
    details: { columns }
  } = configuration
  /**
   * Hydrate the widget selection from local storage, if present.
   * The useEffect is necessary to prevent SSR hydration mismatches.
   */
  useEffect(() => {
    const getInitialSelection = () => {
      if (
        persistedSelectionRef.current &&
        'inputs' in persistedSelectionRef.current
      ) {
        if (Array.isArray(persistedSelectionRef.current.inputs[name])) {
          return persistedSelectionRef.current.inputs[name]
        }

        return [persistedSelectionRef.current.inputs[name] as unknown as string]
      }

      return details.default
    }

    setSelection(getInitialSelection())
  }, [name, details])

  if (!configuration) return null

  const [defaultValue] = selection

  return (
    <Widget data-stylizable='widget'>
      <WidgetHeader>
        <WidgetActionsWrapper data-stylizable='widget-action-wrapper'>
          <WidgetTitle
            data-stylizable='widget-title'
            htmlFor={name}
            aria-hidden={labelAriaHidden || true}
          >
            {label}
          </WidgetTitle>
        </WidgetActionsWrapper>
        <WidgetTooltip
          helpText={help || null}
          triggerAriaLabel={`Get help for ${label}`}
        />
      </WidgetHeader>
      <Fieldset name={name} disabled={fieldsetDisabled}>
        <Legend>{label}</Legend>
        <RadioGroup
          rootProps={{
            name,
            value: defaultValue,
            onValueChange: value => setSelection([value])
          }}
        >
          <InputsGrid columns={columns}>
            {details.values.map(value => {
              return (
                <Radio key={value}>
                  <RadioItem
                    id={value}
                    value={value}
                    disabled={isDisabled({ constraints, key: value })}
                  >
                    <RadioIndicator />
                  </RadioItem>
                  <LabelWrapper
                    disabled={isDisabled({ constraints, key: value })}
                  >
                    <Label htmlFor={value}>{details.labels[value]}</Label>
                  </LabelWrapper>
                </Radio>
              )
            })}
          </InputsGrid>
        </RadioGroup>
      </Fieldset>
    </Widget>
  )
}

const Fieldset = styled(BaseFieldset)`
  div:last-child {
    margin-bottom: unset;
  }
  padding-top: 0.5em;
`

const Radio = styled.div`
  display: flex;
  gap: 0.5em;
  margin-bottom: 2em;
`

const RadioItem = styled(RadioGroupItem)`
  all: unset;
  background-color: #ffffff;
  border-radius: 100%;
  border: 1px solid #9599a6;
  height: 1em;
  width: 1em;

  &[data-disabled] {
    background-color: #ffffff;
    border: 1px solid #bcc0cc;
  }
`

const RadioIndicator = styled(Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: #ffffff;
    position: absolute;
    border-radius: 100%;
  }

  &::after {
    content: '';
    width: 16px;
    height: 16px;
    display: block;
    background-color: #25408f;
    border-radius: 100%;
  }
`

export { StringChoiceWidget }
