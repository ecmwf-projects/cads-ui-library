/* istanbul ignore file */
/* See cypress/component/StringListWidget.cy.tsx */
import React, { useRef } from 'react'

import { Checkbox, Label, WidgetTooltip } from '../index'

import 'core-js/actual/set/intersection.js'
import 'core-js/actual/set/difference.js'

import {
  Actions,
  ActionButton,
  Fieldset,
  InputGroup,
  InputsGrid,
  LabelWrapper,
  Legend,
  Widget,
  WidgetActionsWrapper,
  WidgetHeader,
  WidgetTitle,
  Error,
  ReservedSpace
} from './Widget'

import {
  isDisabled,
  getPermittedBulkSelection,
  isAllSelected,
  useBypassRequired,
  useWidgetSelection
} from '../utils'

declare global {
  interface Set<T> {
    intersection(other: Set<T>): Set<T>
    difference(other: Set<T>): Set<T>
  }
}

export interface StringListWidgetDetails {
  columns: number
  id: number
  labels: {
    [value: string]: string
  }
  values: string[]
  default?: string[]
}

export interface StringListWidgetConfiguration {
  type: 'StringListWidget'
  name: string
  label: string
  help?: string | null
  required: boolean
  details: StringListWidgetDetails
}

type StringListWidgetProps = {
  configuration: StringListWidgetConfiguration
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

const groupIntersectsSelection = (values: string[], selection: string[]) => {
  return new Set(values).intersection(new Set(selection)).size
}

const getAllValues = (labels: StringListWidgetDetails['labels']) => {
  return Object.keys(labels)
}

const StringListWidget = ({
  configuration,
  constraints,
  fieldsetDisabled,
  labelAriaHidden = true,
  bypassRequiredForConstraints
}: StringListWidgetProps) => {
  const fieldSetRef = useRef<HTMLFieldSetElement>(null)
  const { details, label, help, name, required } = configuration
  const { columns, labels, default: defaultValue } = details

  const { selection, setSelection } = useWidgetSelection(name)

  const bypassed = useBypassRequired(
    fieldSetRef,
    bypassRequiredForConstraints,
    constraints
  )

  React.useEffect(() => {
    if (defaultValue) {
      setSelection(prevState => ({
        ...prevState,
        [name]: [...prevState[name].concat(defaultValue)]
      }))
    }
  }, [defaultValue, name])

  if (!configuration) return null

  const allValues = getAllValues(labels)

  const isChecked = (selection: string[], value: string) => {
    if (!Array.isArray(selection)) return
    return Boolean(selection.find(sel => sel === value))
  }

  return (
    <Widget data-stylizable='widget'>
      <WidgetHeader>
        <WidgetActionsWrapper data-stylizable='widget-action-wrapper'>
          <WidgetTitle
            htmlFor={name}
            data-stylizable='widget-title'
            aria-hidden={labelAriaHidden}
          >
            {label}
          </WidgetTitle>
          <div {...(fieldsetDisabled && { inert: '' })}>
            <Actions data-stylizable='widget string-list actions'>
              {constraints?.length === 0 ||
              isAllSelected({
                availableSelection: allValues,
                constraints,
                currentSelection: selection[name]
              }) ? null : (
                <ActionButton
                  type='button'
                  aria-label={`Select all ${label}`}
                  onClick={ev => {
                    ev.preventDefault()

                    setSelection(prevState => {
                      return {
                        ...prevState,
                        [name]: getPermittedBulkSelection({
                          constraints,
                          availableSelection: allValues
                        })
                      }
                    })
                  }}
                >
                  Select all
                </ActionButton>
              )}
              {groupIntersectsSelection(allValues, selection[name]) ? (
                <ActionButton
                  type='button'
                  aria-label={`Clear all ${label}`}
                  onClick={ev => {
                    ev.preventDefault()

                    setSelection(prevState => {
                      return {
                        ...prevState,
                        [name]: []
                      }
                    })
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
      <ReservedSpace>
        {!bypassed && required && !selection[name]?.length ? (
          <Error>At least one selection must be made</Error>
        ) : null}
      </ReservedSpace>
      <Fieldset name={name} ref={fieldSetRef} disabled={fieldsetDisabled}>
        <Legend>{label}</Legend>
        <InputsGrid
          columns={columns}
          data-stylizable='widget inputs-grid string-list-grid'
        >
          {details.values.map(value => {
            return (
              <InputGroup
                key={value}
                disabled={isDisabled({ constraints, key: label })}
              >
                <Checkbox
                  rootProps={{
                    checked: isChecked(selection[name], value),
                    disabled: isDisabled({ constraints, key: value }),
                    onCheckedChange: checked => {
                      if (checked) {
                        return setSelection(prevState => ({
                          ...prevState,
                          [name]: [...prevState[name], value]
                        }))
                      }

                      return setSelection(prevState => ({
                        ...prevState,
                        [name]: prevState[name].filter(val => val !== value)
                      }))
                    },
                    id: `${name}_${value}`,
                    value: value,
                    name
                  }}
                />
                <LabelWrapper
                  disabled={isDisabled({ constraints, key: value })}
                >
                  <Label htmlFor={`${name}_${value}`}>
                    {details.labels[value]}
                  </Label>
                </LabelWrapper>
              </InputGroup>
            )
          })}
        </InputsGrid>
      </Fieldset>
    </Widget>
  )
}

export { getAllValues }
export { StringListWidget }
