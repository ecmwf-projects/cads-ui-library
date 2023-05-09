import React, { useRef } from 'react'
import { Trigger as AccordionTriggerPrimitive } from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useEventListener } from 'usehooks-ts'
import styled from 'styled-components'

import 'core-js/actual/set/intersection.js'

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
  useBypassRequired,
  useWidgetSelection,
  ClearAll,
  SelectAll
} from '../utils'

declare global {
  interface Set<T> {
    intersection(other: Set<T>): Set<T>
  }
}

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
  /**
   * When true, bypass the required attribute if all options are made unavailable by constraints.
   */
  bypassRequiredForConstraints?: boolean

  /**
   * When true, shows the active selection count for closed accordions.
   */
  renderActiveSelectionsCount?: boolean
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
 * StringListArrayWidget: widget to render accordionable set of checkboxes.
 */
const StringListArrayWidget = ({
  configuration,
  constraints,
  fieldsetDisabled,
  labelAriaHidden = true,
  bypassRequiredForConstraints,
  renderActiveSelectionsCount
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

  const bypassed = useBypassRequired(
    fieldSetRef,
    bypassRequiredForConstraints,
    constraints
  )

  /**
   * Closed radix-ui accordions do not render any children. This makes impossible to trigger a change event when the accordion is closed, or to include the current selection for closed accordions. To work around this, we employ two approaches:
   *
   * - by intercepting the formdata event we directly inject the current selection into the FormData object
   * - To cover the case where a user selects or deselects all the checkboxes of a group of closed accordions, we programmatically click the input BulkSelectionTrigger. This triggers the change event that the parent form later intercepts.
   */
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

  useEventListener('formdata', formDataListener)

  if (!configuration) return null

  const getOpenedItem = (openGroups: string[], itemLabel: string) => {
    return (openGroups.includes(itemLabel) && itemLabel) || void 0
  }

  const allValues = getAllValues(groups)

  const getActiveSelectionsCounts = (
    groups: StringListArrayWidgetConfiguration['details']['groups'],
    groupLabel: string,
    selection: Record<string, string[]>,
    constraints?: string[]
  ) => {
    const ownGroup = groups.find(group => group.label === groupLabel)

    if (ownGroup) {
      const activeSelections = [
        ...new Set(selection[name])
          .intersection(new Set(ownGroup.values))
          .intersection(new Set(constraints || selection[name]))
      ].length

      return activeSelections > 1 ? (
        <ActiveSelections data-stylizable='string-listarray-active-selections'>
          {activeSelections} selected items
        </ActiveSelections>
      ) : activeSelections == 1 ? (
        <ActiveSelections data-stylizable='string-listarray-active-selections'>
          {activeSelections} selected item
        </ActiveSelections>
      ) : null
    }
    return null
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
                  if (!bulkSelectionTriggerRef.current) return
                  bulkSelectionTriggerRef.current.click()
                }}
              />
            ) : (
              <SelectAll
                fieldset={name}
                handleAction={state => {
                  setSelection(state)
                  if (!bulkSelectionTriggerRef.current) return
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
      <ReservedSpace data-stylizable='widget string-listarray reserved-error-space'>
        {!bypassed && required && !selection[name]?.length ? (
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
                  customTrigger: () => (
                    <StyledTrigger>
                      <AccordionTrigger>
                        <AccordionTriggerContent data-stylizable='widget string-listarray accordion-header'>
                          <AccordionTriggerHeader>
                            {groupLabel}
                          </AccordionTriggerHeader>
                          {renderActiveSelectionsCount
                            ? getActiveSelectionsCounts(
                                groups,
                                groupLabel,
                                selection,
                                constraints
                              )
                            : null}
                        </AccordionTriggerContent>
                      </AccordionTrigger>
                      <ChevronDownIcon />
                    </StyledTrigger>
                  )
                }}
              >
                <InputsGrid
                  key={groupLabel}
                  columns={columns}
                  data-stylizable='widget inputs-grid string-listarray-grid'
                >
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

const ActiveSelections = styled.p`
  margin: 0 1.2em 0 0;
  color: #25408f;
`

const StyledTrigger = styled(AccordionTriggerPrimitive)`
  all: unset;
  color: #39393a;
  cursor: pointer;
  display: flex;
  flex: 1;
  font-family: inherit;
  font-weight: 400;
  font-size: 1.125em;
  line-height: 22px;
  justify-content: space-between;
  margin-top: 0 !important;

  &[data-state='open'] {
    svg {
      transform: rotate(180deg);
    }

    margin-bottom: 0.75em;

    ${ActiveSelections} {
      display: none;
    }
  }
`

const AccordionTrigger = styled.div`
  width: 100%;
`

const AccordionTriggerHeader = styled.h5`
  font-size: 1.125rem;
  font-weight: 700;
  margin: unset;
  margin-bottom: 1.125em;
`

const AccordionTriggerContent = styled.div`
  display: flex;
  justify-content: space-between;
`

const Margin = styled.div`
  margin-bottom: 1em;
`

export { appendToFormData, getAllValues }
export { StringListArrayWidget }
