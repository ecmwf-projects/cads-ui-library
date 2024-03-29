/* istanbul ignore file */
/* See cypress/component/StringChoiceWidget.cy.tsx */
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

import { useReadLocalStorage, useEventListener } from 'usehooks-ts'

import {
  Label,
  RadioGroup,
  RadioGroupItem,
  RadioIndicator,
  WidgetTooltip
} from '../index'
import {
  Actions,
  ActionButton,
  InputsGrid,
  LabelWrapper,
  Widget,
  Fieldset as BaseFieldset,
  Legend,
  ReservedSpace,
  WidgetActionsWrapper,
  WidgetHeader,
  WidgetTitle
} from './Widget'

import { isDisabled, useBypassRequired } from '../utils'
import { RequiredErrorMessage } from './RequiredErrorMessage'

export interface StringChoiceWidgetDetails {
  columns: number
  labels: {
    [value: string]: string
  }
  values: string[]
  default?: string[]
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
  /**
   * When true, bypass the required attribute if all options are made unavailable by constraints.
   */
  bypassRequiredForConstraints?: boolean
}

const StringChoiceWidget = ({
  configuration,
  constraints,
  fieldsetDisabled,
  labelAriaHidden = true,
  bypassRequiredForConstraints
}: StringChoiceWidgetProps) => {
  const fieldSetRef = useRef<HTMLFieldSetElement>(null)
  const [selection, setSelection] = useState<string[] | undefined>([])
  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs: { [k: string]: string[] }
  }>('formSelection')
  /**
   * Cache persisted selection, so we don't need to pass it as an effect dependency.
   */
  const persistedSelectionRef = useRef(persistedSelection)

  const bypassed = useBypassRequired(
    fieldSetRef,
    bypassRequiredForConstraints,
    constraints
  )

  const { details, label, help, name, required } = configuration
  const {
    details: { columns }
  } = configuration
  /**
   * Hydrate the widget selection from local storage, if present.
   * useEffect is necessary to prevent SSR hydration mismatches.
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

  /**
   * Handle form Clear all
   */
  const documentRef = useRef<Document>(
    typeof window !== 'undefined' ? document : null
  )
  useEventListener(
    'formAction',
    ev => {
      if (!('detail' in ev)) return
      if (!('type' in ev.detail)) return
      if (ev.detail.type !== 'clearAll') return

      setSelection([])
    },
    documentRef
  )

  if (!configuration) return null

  const [defaultValue] = selection || []

  const requiredError = !bypassed && required && !selection?.length

  return (
    <Widget data-stylizable='widget' data-widget-required={requiredError}>
      <WidgetHeader>
        <WidgetActionsWrapper data-stylizable='widget-action-wrapper'>
          <WidgetTitle
            data-stylizable='widget-title'
            htmlFor={name}
            aria-hidden={labelAriaHidden}
          >
            {label}
          </WidgetTitle>
          <div {...(fieldsetDisabled && { inert: '' })}>
            <Actions data-stylizable='widget string-choice actions'>
              {selection?.length ? (
                <ActionButton
                  type='button'
                  aria-label={`Clear all ${label}`}
                  onClick={ev => {
                    ev.preventDefault()
                    setSelection([])
                  }}
                >
                  Clear all
                </ActionButton>
              ) : null}
            </Actions>
          </div>
        </WidgetActionsWrapper>
        <WidgetTooltip
          helpText={help || null}
          triggerAriaLabel={`Get help for ${label}`}
        />
      </WidgetHeader>
      <ReservedSpace data-stylizable='widget string-choice reserved-error-space'>
        <RequiredErrorMessage show={requiredError} />
      </ReservedSpace>
      <Fieldset name={name} ref={fieldSetRef} disabled={fieldsetDisabled}>
        <Legend>{label}</Legend>
        <RadioGroup
          rootProps={{
            name,
            value: defaultValue || '',
            onValueChange: value => setSelection([value])
          }}
        >
          <InputsGrid
            columns={columns}
            data-stylizable='widget inputs-grid string-choice-grid'
          >
            {details.values.map(value => {
              return (
                <Radio key={value}>
                  <RadioGroupItem
                    id={value}
                    value={value}
                    disabled={isDisabled({ constraints, key: value })}
                  >
                    <RadioIndicator />
                  </RadioGroupItem>
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

export { StringChoiceWidget }
