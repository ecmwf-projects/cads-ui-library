/* istanbul ignore file */
/* see cypress/component/StringListArrayWidget.cy.tsx **/
import React, { useRef } from 'react'
import { flushSync, render } from 'react-dom'
import { Trigger as AccordionTriggerPrimitive } from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useEventListener } from 'usehooks-ts'
import styled from 'styled-components'

import 'core-js/actual/set/intersection.js'
import 'core-js/actual/set/difference.js'

import { AccordionSingle, Checkbox, Label, WidgetTooltip } from '../index'

import {
  ActionButton,
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
  useWidgetSelection
} from '../utils'

declare global {
  interface Set<T> {
    intersection(other: Set<T>): Set<T>
    difference(other: Set<T>): Set<T>
  }
}

export interface StringListArrayWidgetGroupDetails {
  columns: number
  label: string
  labels: Record<string, string | undefined>
  values: string[]
}

export interface StringListArrayWidgetDetails {
  accordionGroups: boolean
  accordionOptions: {
    openGroups: string[]
    searchable: boolean
  }
  displayaslist: boolean
  groups:
    | StringListArrayWidgetGroupDetails[]
    | Pick<StringListArrayWidgetConfiguration, 'label' | 'details'>[]
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

/**
 * Default max nesting level allowed
 */
const MAX_NESTING_LEVEL = 1

/**
 * Function that extracts groups recursively according to nesting constraints.
 * Extracting the groups is used to select options in bulk.
 */
export const getGroups = (
  groups: StringListArrayWidgetConfiguration['details']['groups'],
  result: StringListArrayWidgetGroupDetails[] = [],
  currentNesting = 0,
  maxNesting = MAX_NESTING_LEVEL
) => {
  if (currentNesting > maxNesting) {
    return result
  }

  for (const group of groups) {
    if ('details' in group) {
      getGroups(
        group.details
          .groups as StringListArrayWidgetConfiguration['details']['groups'],
        result,
        currentNesting + 1,
        maxNesting
      )
    } else {
      result.push(group as StringListArrayWidgetGroupDetails)
    }
  }

  return result
}

/**
 * Function that determines whether a parent group should be rendered.
 * It is used in the case where a parent group has a child that in turn
 * is a parent child, if the group with options does not meet the nesting
 * constraints this function prevents the empty parent group from being rendered.
 */
export const shouldRenderParent = (
  group: Pick<StringListArrayWidgetConfiguration, 'label' | 'details'>,
  currentNesting = 0,
  maxNesting: number = MAX_NESTING_LEVEL
): boolean => {
  if ('details' in group) {
    for (const g of group.details.groups) {
      if ('details' in g) {
        return shouldRenderParent(g, currentNesting + 1, maxNesting)
      } else if (currentNesting >= maxNesting) {
        return false
      }
    }
  }

  if (currentNesting >= maxNesting) {
    return false
  }

  return true
}

const getAllValues = (groups: StringListArrayWidgetGroupDetails[]) => {
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

const getOwnGroupValues = (
  groups: StringListArrayWidgetGroupDetails[],
  groupLabel: string
) => {
  const ownGroup = groups.find(group => group.label === groupLabel)

  if (!ownGroup) return []

  return ownGroup.values
}

const getGroupSelection = (values: string[], selection: string[]) => {
  return [...new Set(values).intersection(new Set(selection))]
}

const groupIntersectsSelection = (values: string[], selection: string[]) => {
  return new Set(values).intersection(new Set(selection)).size
}

const isGroupAllSelected = ({
  availableSelection,
  ownConstraints,
  currentSelection
}: {
  availableSelection: string[]
  ownConstraints?: string[]
  currentSelection: string[]
}) => {
  if (!ownConstraints) {
    return (
      availableSelection.length ==
      groupIntersectsSelection(availableSelection, currentSelection)
    )
  }

  if (ownConstraints.length === 0) return true

  if (
    ownConstraints.length &&
    currentSelection.length > ownConstraints.length
  ) {
    return true
  }

  return ownConstraints.length === currentSelection.length
}

const getOwnConstraints = (
  values: string[],
  constraints: string[] | undefined
) => {
  return [...new Set(values).intersection(new Set(constraints || values))]
}

const getGroupPermittedBulkSelection = (
  availableSelection: string[],
  constraints?: string[]
) => {
  if (!constraints) return availableSelection
  return [...new Set(constraints).intersection(new Set(availableSelection))]
}

const getOpenedItem = (openGroups: string[], itemLabel: string) => {
  return (openGroups.includes(itemLabel) && itemLabel) || void 0
}

const isChecked = (selection: string[], value: string) => {
  if (!Array.isArray(selection)) return
  return Boolean(selection.find(sel => sel === value))
}

const getActiveSelectionsCounts = (
  name: string,
  groups: StringListArrayWidgetGroupDetails[],
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

/**
 * StringListArrayWidget: widget to render "accordionable" set of checkboxes.
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

  const allGroups = React.useMemo(() => getGroups(groups), [groups])

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

  const onActionButtonClick = React.useCallback(() => {
    if (bulkSelectionTriggerRef.current) {
      bulkSelectionTriggerRef.current.click()
    }
  }, [])

  if (!configuration) return null

  const allValues = getAllValues(allGroups)

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
            <Actions data-stylizable='widget string-listarray actions'>
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
                    ev.stopPropagation()
                    flushSync(() => {
                      setSelection(prevState => {
                        return {
                          ...prevState,
                          [name]: getPermittedBulkSelection({
                            constraints,
                            availableSelection: allValues
                          })
                        }
                      })
                    })

                    if (!bulkSelectionTriggerRef.current) return
                    bulkSelectionTriggerRef.current.click()
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
                    ev.stopPropagation()
                    flushSync(() => {
                      setSelection(prevState => {
                        return { ...prevState, [name]: [] }
                      })
                    })
                    if (!bulkSelectionTriggerRef.current) return
                    bulkSelectionTriggerRef.current.click()
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
      <ReservedSpace data-stylizable='widget string-listarray reserved-error-space'>
        {!bypassed && required && !selection[name]?.length ? (
          <Error>At least one selection must be made</Error>
        ) : null}
      </ReservedSpace>
      <Fieldset name={name} ref={fieldSetRef} disabled={fieldsetDisabled}>
        <Legend>{label}</Legend>

        <GroupRenderer
          name={name}
          allGroups={allGroups}
          groups={groups}
          selection={selection}
          constraints={constraints}
          accordionOptions={accordionOptions}
          renderActiveSelectionsCount={renderActiveSelectionsCount}
          nestingLevel={0}
          onActionButtonClick={onActionButtonClick}
          setSelection={setSelection}
        />
      </Fieldset>
    </Widget>
  )
}

interface GroupRendererProps {
  groups: StringListArrayWidgetConfiguration['details']['groups']
  name: string
  allGroups: StringListArrayWidgetGroupDetails[]
  selection: Record<string, string[]>
  constraints?: string[]
  accordionOptions: StringListArrayWidgetDetails['accordionOptions']
  renderActiveSelectionsCount?: boolean
  nestingLevel: number
  setSelection: (value: React.SetStateAction<Record<string, string[]>>) => void
  onActionButtonClick: VoidFunction
}
const GroupRenderer = ({
  groups,
  allGroups,
  name,
  selection,
  constraints,
  accordionOptions,
  nestingLevel,
  renderActiveSelectionsCount,
  setSelection,
  onActionButtonClick
}: GroupRendererProps) => {
  return (
    <>
      {nestingLevel <= MAX_NESTING_LEVEL &&
        groups.map(group => {
          if ('details' in group) {
            const g: Pick<
              StringListArrayWidgetConfiguration,
              'label' | 'details'
            > = group as any

            if (shouldRenderParent(group, nestingLevel, MAX_NESTING_LEVEL)) {
              return (
                <ParentGroup
                  group={g}
                  name={name}
                  accordionOptions={accordionOptions}
                  allGroups={allGroups}
                  selection={selection}
                  constraints={constraints}
                  key={g.label}
                  renderActiveSelectionsCount={renderActiveSelectionsCount}
                >
                  <GroupRenderer
                    name={name}
                    allGroups={allGroups}
                    groups={g.details.groups}
                    selection={selection}
                    constraints={constraints}
                    accordionOptions={accordionOptions}
                    renderActiveSelectionsCount={renderActiveSelectionsCount}
                    nestingLevel={nestingLevel + 1}
                    onActionButtonClick={onActionButtonClick}
                    setSelection={setSelection}
                  />
                </ParentGroup>
              )
            }
            return null
          }

          const g: StringListArrayWidgetGroupDetails = group as any
          if (!Object.keys(g.labels).length) return null

          const openedItem = getOpenedItem(accordionOptions.openGroups, g.label)

          return (
            <ChildGroup
              key={group.label}
              name={name}
              group={g}
              groups={allGroups}
              selection={selection}
              constraints={constraints}
              openedItem={openedItem}
              renderActiveSelectionsCount={renderActiveSelectionsCount}
              onActionButtonClick={onActionButtonClick}
              setSelection={setSelection}
            />
          )
        })}
    </>
  )
}

interface ParentGroupProps extends React.PropsWithChildren {
  group: Pick<StringListArrayWidgetConfiguration, 'label' | 'details'>
  name: string
  allGroups: StringListArrayWidgetGroupDetails[]
  selection: Record<string, string[]>
  constraints?: string[]
  accordionOptions: StringListArrayWidgetDetails['accordionOptions']
  renderActiveSelectionsCount?: boolean
}
const ParentGroup = ({
  accordionOptions,
  allGroups,
  group,
  name,
  selection,
  constraints,
  renderActiveSelectionsCount,
  children
}: ParentGroupProps) => {
  return (
    <Margin key={group.label}>
      <AccordionSingle
        rootProps={{
          defaultValue: getOpenedItem(accordionOptions.openGroups, group.label)
        }}
        itemProps={{
          value: group.label,
          customTrigger: () => (
            <StyledTrigger>
              <AccordionTrigger>
                <AccordionTriggerContent data-stylizable='widget string-listarray accordion-header'>
                  <AccordionTriggerHeader>{group.label}</AccordionTriggerHeader>

                  {renderActiveSelectionsCount
                    ? getActiveSelectionsCounts(
                        name,
                        allGroups,
                        group.label,
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
        {children}
      </AccordionSingle>
    </Margin>
  )
}

interface ChildGroupProps {
  name: string
  group: StringListArrayWidgetGroupDetails
  groups: StringListArrayWidgetGroupDetails[]
  selection: Record<string, string[]>
  constraints?: string[]
  openedItem?: string
  renderActiveSelectionsCount?: boolean
  setSelection: (value: React.SetStateAction<Record<string, string[]>>) => void
  onActionButtonClick: VoidFunction
}
const ChildGroup = ({
  name,
  group,
  groups,
  selection,
  constraints,
  openedItem,
  renderActiveSelectionsCount,
  setSelection,
  onActionButtonClick
}: ChildGroupProps) => {
  return (
    <Margin key={group.label}>
      <AccordionSingle
        rootProps={{ defaultValue: openedItem }}
        itemProps={{
          value: group.label,
          customTrigger: () => (
            <StyledTrigger>
              <AccordionTrigger>
                <AccordionTriggerContent data-stylizable='widget string-listarray accordion-header'>
                  <AccordionTriggerHeader>{group.label}</AccordionTriggerHeader>

                  {renderActiveSelectionsCount
                    ? getActiveSelectionsCounts(
                        name,
                        groups,
                        group.label,
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
        <Actions data-stylizable='widget string-listarray accordion-header actions'>
          {constraints?.length === 0 ||
          isGroupAllSelected({
            availableSelection: getOwnGroupValues(groups, group.label),
            ownConstraints: getOwnConstraints(
              getOwnGroupValues(groups, group.label),
              constraints
            ),
            currentSelection: getGroupSelection(
              getOwnGroupValues(groups, group.label),
              selection[name]
            )
          }) ? null : (
            <ActionButton
              type='button'
              aria-label={`Select all ${group.label}`}
              onClick={ev => {
                ev.stopPropagation()

                const values = getOwnGroupValues(groups, group.label)

                flushSync(() => {
                  setSelection(prevState => {
                    return {
                      ...prevState,
                      [name]: [
                        ...prevState[name],
                        ...getGroupPermittedBulkSelection(values, constraints)
                      ]
                    }
                  })
                })

                onActionButtonClick()
              }}
            >
              Select all
            </ActionButton>
          )}
          {groupIntersectsSelection(
            groups.find(group => group.label === group.label)?.values || [],
            selection[name]
          ) ? (
            <ActionButton
              type='button'
              aria-label={`Clear all ${group.label}`}
              onClick={ev => {
                ev.stopPropagation()

                const values = getOwnGroupValues(groups, group.label)

                flushSync(() => {
                  setSelection(prevState => {
                    const diff = new Set(prevState[name]).difference(
                      new Set(values)
                    )

                    return { ...prevState, [name]: [...diff] }
                  })
                })

                onActionButtonClick()
              }}
            >
              Clear all
            </ActionButton>
          ) : null}
        </Actions>
        <InputsGrid
          key={group.label}
          columns={group.columns}
          data-stylizable='widget inputs-grid string-listarray-grid'
        >
          {Object.keys(group.labels).map(label => {
            return (
              <InputGroup
                key={label}
                disabled={isDisabled({ constraints, key: label })}
              >
                <Checkbox
                  rootProps={{
                    checked: isChecked(selection[name], label),
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
                        [name]: prevState[name].filter(val => val !== label)
                      }))
                    },
                    id: `${group.label}_${label}`,
                    value: label,
                    name
                  }}
                />
                <LabelWrapper
                  disabled={isDisabled({ constraints, key: label })}
                >
                  <Label htmlFor={`${group.label}_${label}`}>
                    {group.labels[label]}
                  </Label>
                </LabelWrapper>
              </InputGroup>
            )
          })}
        </InputsGrid>
      </AccordionSingle>
    </Margin>
  )
}

const BulkSelectionTrigger = styled.input`
  display: none;
`

const ActiveSelections = styled.p`
  margin: 0 1.2em 0 auto;
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

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 150px;
  margin-top: -1em;
  gap: 1em;
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
  flex-flow: row nowrap;
  gap: 1em;
`

const Margin = styled.div`
  margin-bottom: 1em;
`

export { appendToFormData, getAllValues }
export { StringListArrayWidget }
