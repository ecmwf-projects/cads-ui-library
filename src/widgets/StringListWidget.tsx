import React from 'react'

import { Checkbox, Label, WidgetTooltip } from '../index'

import {
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
  useWidgetSelection,
  ClearAll,
  SelectAll
} from '../utils'

export interface StringListWidgetDetails {
  columns: number
  id: number
  labels: {
    [value: string]: string
  }
  values: string[]
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
}

const getAllValues = (labels: StringListWidgetDetails['labels']) => {
  return Object.keys(labels)
}

const StringListWidget = ({
  configuration,
  constraints,
  fieldsetDisabled
}: StringListWidgetProps) => {
  const { details, label, help, name, required } = configuration
  const {
    details: { columns, labels }
  } = configuration

  const { selection, setSelection } = useWidgetSelection(name)

  if (!configuration) return null

  const allValues = getAllValues(labels)

  return (
    <Widget data-stylizable='widget'>
      <WidgetHeader>
        <WidgetActionsWrapper data-stylizable='widget-action-wrapper'>
          <WidgetTitle data-stylizable='widget-title' aria-hidden={true}>
            {label}
          </WidgetTitle>
          {constraints?.length === 0 ? null : isAllSelected({
              availableSelection: allValues,
              constraints,
              currentSelection: selection[name]
            }) ? (
            <ClearAll fieldset={name} handleAction={setSelection} />
          ) : (
            <SelectAll
              fieldset={name}
              handleAction={setSelection}
              values={getPermittedBulkSelection({
                constraints,
                availableSelection: allValues
              })}
            />
          )}
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
      <Fieldset name={name} disabled={fieldsetDisabled}>
        <Legend>{label}</Legend>
        <InputsGrid columns={columns}>
          {details.values.map(value => {
            return (
              <InputGroup
                key={value}
                disabled={isDisabled({ constraints, key: label })}
              >
                <Checkbox
                  rootProps={{
                    checked: Boolean(
                      selection[name]?.find(sel => sel === value)
                    ),
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
