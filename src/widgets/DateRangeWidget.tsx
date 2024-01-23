/* istanbul ignore file */
import React from 'react'

import {
  RegisterOptions,
  UseFormRegisterReturn,
  UseFormReturn,
  FieldError
} from 'react-hook-form'
import styled from 'styled-components'
import { DateValue } from 'react-aria-components'
import {
  CalendarDate,
  parseDate,
  maxDate,
  minDate
} from '@internationalized/date'

import {
  Error,
  Fieldset,
  Legend,
  ReservedSpace,
  Widget,
  WidgetHeader,
  WidgetTitle
} from './Widget'
import { DateField } from '../common/DateField'
import { WidgetTooltip } from '../common/WidgetTooltip'
import { useBypassRequired, useWidgetSelection } from '../utils'
import { useReadLocalStorage } from 'usehooks-ts'

type ValidateDateFn = (
  startDate: CalendarDate,
  endDate: CalendarDate,
  minStart: CalendarDate,
  maxEnd: CalendarDate,
  isDateUnavailable: (date: DateValue) => boolean
) => string | undefined
export const getStartDateErrors: ValidateDateFn = (
  startDate,
  endDate,
  minStart,
  maxEnd,
  isDateUnavailable
) => {
  if (!startDate) {
    return 'Date is not valid'
  }

  if (!endDate) {
    return ''
  }

  if (startDate.compare(endDate) > 0) {
    return 'Start date should be later than End date'
  }

  if (startDate.compare(maxEnd) > 0) {
    return `Start date cannot exceed the deadline (${maxEnd.toString()})`
  }

  if (startDate.compare(minStart) < 0) {
    return `Start date cannot be set earlier than the minimum date (${minStart.toString()})`
  }

  if (isDateUnavailable(startDate)) {
    return `Date is not valid`
  }
}

export const getEndDateErrors: ValidateDateFn = (
  startDate,
  endDate,
  minStart,
  maxEnd,
  isDateUnavailable
) => {
  if (!endDate) {
    return 'Date is not valid'
  }

  if (!startDate) {
    return ''
  }

  if (endDate.compare(startDate) < 0) {
    return 'End date cannot be earlier than Start date'
  }

  if (endDate.compare(maxEnd) > 0) {
    return `End date cannot exceed the deadline (${maxEnd.toString()})`
  }

  if (endDate.compare(minStart) < 0) {
    return `End date cannot be set earlier than the deadline (${minStart.toString()})`
  }

  if (isDateUnavailable(endDate)) {
    return `Date is not valid`
  }
}

export const getDateLimits = (
  startDate: CalendarDate,
  endDate: CalendarDate,
  minStart: string,
  maxEnd: string
) => {
  const fMinStart = parseDate(minStart),
    fMaxEnd = parseDate(maxEnd)

  if (!fMinStart || !fMaxEnd || !startDate || !endDate) {
    return {}
  }

  const startMinDate = fMinStart,
    endMinDate = startDate
  let startMaxDate = endDate,
    endMaxDate = fMaxEnd

  if (startMinDate.compare(startMaxDate) > 0) {
    startMaxDate = maxDate(startDate, startMinDate)
  }

  if (endMaxDate.compare(endMinDate) < 0) {
    endMaxDate = minDate(endDate, endMaxDate)
  }

  return {
    startMinDate,
    endMinDate,
    startMaxDate,
    endMaxDate
  }
}

export const getAvailableYears = (
  minDate: CalendarDate,
  maxDate: CalendarDate
) => {
  const delta = maxDate.year - minDate.year

  if (maxDate.year === minDate.year || delta <= 0) {
    return [minDate.year]
  }

  return new Array(delta + 1).fill(0).map((_, i) => minDate.year + i)
}

export const getAvailableMonths = (
  date?: CalendarDate,
  minDate?: CalendarDate,
  maxDate?: CalendarDate
) => {
  if (!date || !minDate || !maxDate) {
    return []
  }

  if (date.year === minDate.year && date.year === maxDate.year) {
    const delta = maxDate.month - minDate.month + 1
    return delta >= 0
      ? new Array(delta).fill(0).map((_, i) => minDate.month + i)
      : [minDate.month]
  }

  if (date.year === minDate.year) {
    const delta = 12 - minDate.month + 1
    return delta >= 0
      ? new Array(delta).fill(0).map((_, i) => minDate.month + i)
      : [minDate.month]
  }

  if (date.year === maxDate.year) {
    const delta = maxDate.month
    return delta >= 0
      ? new Array(delta).fill(1).map((_, i) => i + 1)
      : [date.month]
  }

  return new Array(12).fill(1).map((_, i) => i + 1)
}

export const getInitialSelection = (
  name: string,
  selection?: Record<string, string[]>
) => {
  if (selection) {
    const firstEntry = selection[name]?.[0]
    if (firstEntry) {
      const [rawStart, rawEnd] = firstEntry.split('/')

      return {
        start: rawStart ? parseDate(rawStart) : undefined,
        end: rawEnd ? parseDate(rawEnd) : undefined
      }
    }
  }
  return {
    start: undefined,
    end: undefined
  }
}

const constraintValidator = (constraints?: string[]) => {
  if (constraints) {
    const parsedConstraints = constraints
      .map((date: string) =>
        date.includes('/') ? date.split('/') : [date, date]
      )
      .map(([start, end]) => [parseDate(start), parseDate(end)])
    return (date: DateValue) => {
      return !parsedConstraints.some(([start, end]) => {
        return date.compare(start) >= 0 && date.compare(end) <= 0
      })
    }
  }
  return (date: DateValue) => false
}

const validate = (
  value: string,
  configuration: DateRangeWidgetConfiguration,
  constraints: string[]
) => {
  const [strStart, strEnd] = value.split('/')
  let start, end
  const min = parseDate(configuration.details.minStart),
    max = parseDate(configuration.details.maxEnd)

  const errors: any = {}
  try {
    start = parseDate(strStart)
  } catch (err) {
    errors.start = 'Invalid date'
  }

  try {
    end = parseDate(strEnd)
  } catch (err) {
    errors.end = 'Invalid date'
  }

  if (errors.start || errors.end) {
    return errors
  }

  const cValidator = constraintValidator(constraints)

  const startError = getStartDateErrors(start!, end!, min, max, cValidator)
  const endError = getEndDateErrors(start!, end!, min, max, cValidator)

  if (startError) {
    errors.start = startError
  }

  if (endError) {
    errors.end = endError
  }
  return errors
}

export const registerDateField = (
  configuration: DateRangeWidgetConfiguration,
  constraints: string[],
  methods: UseFormReturn
): RegisterOptions => {
  return {
    onChange(evt) {
      methods.setValue(configuration.name, evt.target.value, {
        shouldValidate: true
      })
      methods.trigger(configuration.name)
    },
    required: { value: true, message: 'Please insert a value' },
    validate(value) {
      const errors = validate(value, configuration, constraints)
      methods.clearErrors(configuration.name)
      if (Object.keys(errors).length > 0) {
        let error
        if (errors.start && errors.end) {
          error = {
            type: 'both',
            message: `${errors.start}|${errors.end}`
          }
        } else if (errors.start) {
          error = {
            type: 'start',
            message: errors.start
          }
        } else if (errors.end) {
          error = {
            type: 'end',
            message: errors.end
          }
        }
        if (error) {
          methods.setError(configuration.name, error)
          return error.message
        }
        return false
      }
      return true
    }
  }
}

export interface DateRangeWidgetConfiguration {
  type: 'DateRangeWidget'
  help: string | null
  label: string
  name: string
  required: boolean
  details: {
    defaultStart: string
    defaultEnd: string
    minStart: string
    maxEnd: string
  }
}

interface DateRangeWidgetProps {
  configuration: DateRangeWidgetConfiguration
  bypassRequiredForConstraints?: boolean
  constraints?: string[]
  disabled?: boolean
  error?: FieldError
  register?: UseFormRegisterReturn
}

const DateRangeWidget = ({
  configuration,
  bypassRequiredForConstraints,
  constraints,
  disabled,
  register = {} as any,
  error
}: DateRangeWidgetProps) => {
  const fieldSetRef = React.useRef<HTMLFieldSetElement>(null)
  const fieldRef = React.useRef<HTMLInputElement>(null)
  const bypassed = useBypassRequired(
    fieldSetRef,
    bypassRequiredForConstraints,
    constraints
  )

  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs: Record<string, string[]>
  }>('formSelection')

  const persistedSelectionRef = React.useRef(persistedSelection)

  const { selection, setSelection } = useWidgetSelection(configuration.name)

  const [startDate, setStartDate] = React.useState(
    parseDate(configuration.details.defaultStart)
  )
  const [endDate, setEndDate] = React.useState(
    parseDate(configuration.details.defaultEnd)
  )

  React.useEffect(() => {
    const v = `${startDate?.toString()}/${endDate?.toString()}`
    setSelection(prev => ({
      ...prev,
      [configuration.name]: [v]
    }))
  }, [startDate, endDate])

  const notify = () => {
    const v = `${startDate?.toString()}/${endDate?.toString()}`

    if (fieldRef.current) {
      const setValue = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set
      const event = new Event('input', { bubbles: true })

      setValue?.call(fieldRef.current, v)
      fieldRef.current.dispatchEvent(event)
    }
  }

  React.useEffect(() => {
    const { start, end } = getInitialSelection(
      configuration.name,
      persistedSelectionRef.current?.inputs
    )
    setStartDate(d => start ?? d)
    setEndDate(d => end ?? d)
  }, [configuration])

  const isDateUnavailable = React.useMemo(
    () => constraintValidator(constraints),
    [constraints]
  )

  const { startMinDate, startMaxDate, endMinDate, endMaxDate } =
    React.useMemo(() => {
      return getDateLimits(
        startDate,
        endDate,
        configuration.details.minStart,
        configuration.details.maxEnd
      )
    }, [startDate, endDate, configuration.details])

  const startYears = React.useMemo(() => {
    return startMinDate && startMaxDate
      ? getAvailableYears(startMinDate, startMaxDate)
      : []
  }, [startMinDate, startMaxDate])

  const endYears = React.useMemo(() => {
    return endMinDate && endMaxDate
      ? getAvailableYears(endMinDate, endMaxDate)
      : []
  }, [endMinDate, endMaxDate])

  const startMonths = React.useMemo(
    () => getAvailableMonths(startDate, startMinDate, startMaxDate),
    [startDate, startMinDate, startMaxDate]
  )

  const endMonths = React.useMemo(
    () => getAvailableMonths(endDate, endMinDate, endMaxDate),
    [endDate, endMinDate, endMaxDate]
  )

  const { startError, endError } = React.useMemo(() => {
    if (error?.message) {
      if (error.message.includes('|')) {
        const [s, e] = error.message.split('|')
        return {
          startError: s,
          endError: e
        }
      } else {
        if (error.message.startsWith('Start')) {
          return {
            startError: error.message,
            endError: undefined
          }
        } else {
          return {
            startError: undefined,
            endError: error.message
          }
        }
      }
    }
    return {
      startError: undefined,
      endError: undefined
    }
  }, [error])

  return (
    <Widget data-stylizable='widget'>
      <WidgetHeader>
        <WidgetTitle
          htmlFor={configuration.name}
          data-stylizable='widget-title'
        >
          {configuration.label}
        </WidgetTitle>
        <WidgetTooltip
          helpText={configuration.help || null}
          triggerAriaLabel={`Get help about ${configuration.label}`}
        />
      </WidgetHeader>
      <ReservedSpace>
        {error && !bypassed && <Error>{error && 'Field no valid'}</Error>}
      </ReservedSpace>
      <Fieldset name={configuration.name} ref={fieldSetRef} disabled={disabled}>
        <Legend>{configuration.label}</Legend>
        <HiddenInput
          defaultValue={selection[configuration.name]}
          {...register}
          ref={ref => {
            register.ref?.(ref)
            ;(fieldRef.current as any) = ref
          }}
        />
        <Row>
          <DateField
            value={startDate}
            onChange={(val, source) => {
              setStartDate(val)
              if (source === 'calendar') {
                notify()
              }
            }}
            label='Start date'
            onBlur={notify}
            defaultValue={parseDate(configuration.details.defaultStart)}
            minStart={startMinDate}
            maxEnd={startMaxDate}
            error={startError}
            isDateUnavailable={isDateUnavailable}
            disabled={disabled}
            required={configuration.required}
            years={startYears}
            months={startMonths}
          />
          <DateField
            value={endDate}
            onChange={(val, source) => {
              setEndDate(val)
              if (source === 'calendar') {
                notify()
              }
            }}
            label='End date'
            onBlur={notify}
            defaultValue={parseDate(configuration.details.defaultEnd)}
            maxEnd={endMaxDate}
            minStart={endMinDate}
            error={endError}
            isDateUnavailable={isDateUnavailable}
            disabled={disabled}
            required={configuration.required}
            years={endYears}
            months={endMonths}
          />
        </Row>
      </Fieldset>
    </Widget>
  )
}

DateRangeWidget.displayName = 'DateField'

const Row = styled.div`
  width: auto;
  display: flex;
  flex-direction: row;
  justify-conten: flex-start;
  align-items: flex-start;
  gap: 1em;
`

const HiddenInput = styled.input`
  width: 0px;
  height: 0px;
  visibility: hidden;
`

export { DateRangeWidget }
