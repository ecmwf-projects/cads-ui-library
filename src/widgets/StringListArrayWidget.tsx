import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'

import { AccordionSingle, Checkbox, Label, WidgetTooltip } from '../index'

import {
  InputGroup,
  InputsGrid,
  LabelWrapper,
  Fieldset,
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
  useWidgetSelection,
  ClearAll,
  SelectAll
} from '../utils'

export interface StringListArrayWidgetDetails {
  accordionGroups: boolean
  accordionOptions: {
    openGroups: string[]
    searchable: boolean
  }
  displayaslist: boolean
  groups: {
    columns: number
    label: string
    labels: Record<string, string | undefined>
    values: string[]
  }[]
  id: number
}

export interface StringListArrayWidgetConfiguration {
  type: 'StringListArrayWidget'
  name: string
  label: string
  help?: string | null
  required: boolean
  details: StringListArrayWidgetDetails
}

interface StringListArrayWidgetProps {
  configuration: StringListArrayWidgetConfiguration
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

const getAllValues = (
  groups: StringListArrayWidgetConfiguration['details']['groups']
) => {
  return groups.map(group => Object.keys(group.labels)).flat()
}

const appendToFormData = (
  formData: FormData,
  {
    currentSelection,
    name
  }: { currentSelection: Record<string, string[]>; name: string },
  constraints?: string[]
) => {
  const allValues = formData.getAll(name)

  if (constraints) {
    for (const selection of currentSelection[name]) {
      if (!allValues.includes(selection) && constraints.includes(selection)) {
        formData.append(name, selection)
      }
    }
    return formData
  }

  for (const selection of currentSelection[name]) {
    if (!allValues.includes(selection)) {
      formData.append(name, selection)
    }
  }

  return formData
}

/**
 *
 * StringListArrayWidget renders a list of accordions, where each accordion contains checkboxes.
 *
 * Note: Closed radix-ui accordions do not render any children. This makes impossible to trigger a change event when the accordion is closed, or to include the current selection for closed accordions. To work around this, we employ two approaches:
 *
 * - by intercepting the formdata event we directly inject the current selection into the FormData object
 *
 * - To cover the case where a user selected or deselected all the checkboxes of a group of closed accordions, we programmatically click the input BulkSelectionTrigger. This triggers the change event that the parent form later intercepts.
 */
const StringListArrayWidget = ({
  configuration,
  constraints,
  fieldsetDisabled,
  labelAriaHidden
}: StringListArrayWidgetProps) => {
  const {
    details: { groups, accordionOptions },
    label,
    help,
    name,
    required
  } = configuration

  const { selection, setSelection } = useWidgetSelection(name)
  const bulkSelectionTriggerRef = useRef<HTMLInputElement>(null)
  const fieldSetRef = useRef<HTMLFieldSetElement>(null)

  // TODO: test with a functional test
  /* istanbul ignore next */
  useEffect(() => {
    if (!fieldSetRef?.current?.form) return
    const form = fieldSetRef.current.form

    const formDataListener = (ev: FormDataEvent) => {
      const { formData } = ev

      appendToFormData(
        formData,
        {
          currentSelection: selection,
          name
        },
        constraints
      )
    }

    form.addEventListener('formdata', formDataListener)

    return () => {
      form.removeEventListener('formdata', formDataListener)
    }
  }, [selection, name, constraints])

  if (!configuration) return null

  const getOpenedItem = (openGroups: string[], itemLabel: string) => {
    return (openGroups.includes(itemLabel) && itemLabel) || void 0
  }

  const allValues = getAllValues(groups)

  return (
    <Widget data-stylizable='widget'>
      <WidgetHeader>
        <WidgetActionsWrapper data-stylizable='widget-action-wrapper'>
          <WidgetTitle
            htmlFor={name}
            data-stylizable='widget-title'
            aria-hidden={labelAriaHidden || true}
          >
            {label}
          </WidgetTitle>
          <BulkSelectionTrigger
            aria-hidden={true}
            type='checkbox'
            ref={bulkSelectionTriggerRef}
            id='bulkSelectionTrigger'
          />
          <div {...(fieldsetDisabled && { inert: '' })}>
            {constraints?.length === 0 ? null : isAllSelected({
                availableSelection: allValues,
                constraints,
                currentSelection: selection[name]
              }) ? (
              <ClearAll
                fieldset={name}
                handleAction={state => {
                  setSelection(state)
                  // TODO: test with a functional test
                  /* istanbul ignore next */
                  if (!bulkSelectionTriggerRef.current) return
                  /* istanbul ignore next */
                  bulkSelectionTriggerRef.current.click()
                }}
              />
            ) : (
              <SelectAll
                fieldset={name}
                handleAction={state => {
                  setSelection(state)
                  // TODO: test with a functional test
                  /* istanbul ignore next */
                  if (!bulkSelectionTriggerRef.current) return
                  /* istanbul ignore next */
                  bulkSelectionTriggerRef.current.click()
                }}
                values={getPermittedBulkSelection({
                  constraints,
                  availableSelection: allValues
                })}
              />
            )}
          </div>
        </WidgetActionsWrapper>
        <WidgetTooltip
          helpText={help || null}
          triggerAriaLabel={`Get help for ${label}`}
        />
      </WidgetHeader>
      <ReservedSpace>
        {required && !selection[name]?.length ? (
          <Error>At least one selection must be made</Error>
        ) : null}
      </ReservedSpace>
      <Fieldset name={name} ref={fieldSetRef} disabled={fieldsetDisabled}>
        <Legend>{label}</Legend>
        {groups.map(({ label: groupLabel, columns, labels }) => {
          if (!Object.keys(labels).length) return null
          return (
            <Margin key={groupLabel}>
              <AccordionSingle
                rootProps={{
                  defaultValue: getOpenedItem(
                    accordionOptions.openGroups,
                    groupLabel
                  )
                }}
                itemProps={{
                  value: groupLabel,
                  trigger: () => (
                    <AccordionTrigger>{groupLabel}</AccordionTrigger>
                  )
                }}
              >
                <InputsGrid key={groupLabel} columns={columns}>
                  {Object.keys(labels).map(label => {
                    return (
                      <InputGroup
                        key={label}
                        disabled={isDisabled({ constraints, key: label })}
                      >
                        <Checkbox
                          rootProps={{
                            checked: Boolean(
                              selection[name].find(sel => sel === label)
                            ),
                            disabled: isDisabled({ constraints, key: label }),
                            onCheckedChange: checked => {
                              if (checked) {
                                return setSelection(prevState => ({
                                  ...prevState,
                                  [name]: [...prevState[name], label]
                                }))
                              }

                              return setSelection(prevState => ({
                                ...prevState,
                                [name]: prevState[name].filter(
                                  val => val !== label
                                )
                              }))
                            },
                            id: `${groupLabel}_${label}`,
                            value: label,
                            name
                          }}
                        />
                        <LabelWrapper
                          disabled={isDisabled({ constraints, key: label })}
                        >
                          <Label htmlFor={`${groupLabel}_${label}`}>
                            {labels[label]}
                          </Label>
                        </LabelWrapper>
                      </InputGroup>
                    )
                  })}
                </InputsGrid>
              </AccordionSingle>
            </Margin>
          )
        })}
      </Fieldset>
    </Widget>
  )
}

const BulkSelectionTrigger = styled.input`
  display: none;
`

const AccordionTrigger = styled.h5`
  font-size: 1.125rem;
  font-weight: 700;
  margin: unset;
  margin-bottom: 1.125em;
`

const Margin = styled.div`
  margin-bottom: 1em;
`

export { appendToFormData, getAllValues }
export { StringListArrayWidget }
