/* istanbul ignore file */
import React from 'react'

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
import { useBypassRequired } from '../utils'
import { useReadLocalStorage } from 'usehooks-ts'

type ValidateDateFn = (
  startDate: CalendarDate,
  endDate: CalendarDate,
  minStart: string,
  maxEnd: string,
  isDateUnavailable: (date: DateValue) => boolean
) => string | undefined
export const getStartDateErrors: ValidateDateFn = (
  startDate,
  endDate,
  minStart,
  maxEnd,
  isDateUnavailable
) => {
  const fMinDate = parseDate(minStart),
    fMaxDate = parseDate(maxEnd)

  if (!startDate) {
    return 'Date is not valid'
  }

  if (!endDate) {
    return ''
  }

  if (!startDate) {
    return 'Start date is required'
  }

  if (startDate.compare(endDate) > 0) {
    return 'Start date should be above to End date'
  }

  if (startDate.compare(fMaxDate) > 0) {
    return `Start date cannot exceed the deadline (${fMaxDate.toString()})`
  }

  if (startDate.compare(fMinDate) < 0) {
    return `Start date cannot be set earlier than the minimum date (${fMinDate.toString()})`
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
  const fMinDate = parseDate(minStart),
    fMaxDate = parseDate(maxEnd)

  if (!endDate) {
    return 'Date is not valid'
  }

  if (!startDate) {
    return ''
  }

  if (!endDate) {
    return 'End date is required'
  }

  if (endDate.compare(startDate) < 0) {
    return 'End date cannot be earlier than Start date'
  }

  if (endDate.compare(fMaxDate) > 0) {
    return `End date cannot exceed the deadline (${fMaxDate.toString()})`
  }

  if (endDate.compare(fMinDate) < 0) {
    return `End date cannot be set earlier than the deadline (${fMinDate.toString()})`
  }

  if (isDateUnavailable(startDate)) {
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

  let startMinDate = fMinStart,
    startMaxDate = endDate,
    endMinDate = startDate,
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
  error?: string
}

const DateRangeWidget = ({
  configuration,
  bypassRequiredForConstraints,
  constraints,
  disabled,
  error
}: DateRangeWidgetProps) => {
  const fieldSetRef = React.useRef<HTMLFieldSetElement>(null)

  const bypassed = useBypassRequired(
    fieldSetRef,
    bypassRequiredForConstraints,
    constraints
  )

  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs: { [k: string]: string }
  }>('formSelection')

  const persistedSelectionRef = React.useRef(persistedSelection)

  const [startDate, setStartDate] = React.useState(
    parseDate(configuration.details.defaultStart)
  )
  const [endDate, setEndDate] = React.useState(
    parseDate(configuration.details.defaultEnd)
  )

  React.useEffect(() => {
    const getInitialSelection = () => {
      const inputs = persistedSelectionRef.current?.inputs

      if (inputs) {
        const start = inputs[`${configuration.name}_start`],
          end = inputs[`${configuration.name}_end`]

        return {
          startDate: start ? parseDate(start) : undefined,
          endDate: end ? parseDate(end) : undefined
        }
      }

      return {
        startDate: parseDate(configuration.details.defaultStart),
        endDate: parseDate(configuration.details.defaultEnd)
      }
    }

    const { startDate, endDate } = getInitialSelection()
    setStartDate(d => startDate ?? d)
    setEndDate(d => endDate ?? d)
  }, [configuration])

  const isDateUnavailable = React.useCallback(
    (date: DateValue) => {
      return Boolean(constraints?.find(d => parseDate(d).compare(date) === 0))
    },
    [constraints]
  )

  const startDateError = React.useMemo(
    () =>
      getStartDateErrors(
        startDate,
        endDate,
        configuration.details.minStart,
        configuration.details.maxEnd,
        isDateUnavailable
      ),
    [startDate, endDate, configuration.details, isDateUnavailable]
  )

  const endDateError = React.useMemo(
    () =>
      getEndDateErrors(
        startDate,
        endDate,
        configuration.details.minStart,
        configuration.details.maxEnd,
        isDateUnavailable
      ),
    [startDate, endDate, configuration.details, isDateUnavailable]
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

  return (
    <Widget data-stylizable='widget date-range-widget'>
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
        {error && !bypassed && <Error>{error}</Error>}
      </ReservedSpace>
      <Fieldset name={configuration.name} ref={fieldSetRef}>
        <Legend>{configuration.label}</Legend>
        <Row>
          <DateField
            value={startDate}
            onChange={setStartDate}
            name={`${configuration.name}_start`}
            label='Start date'
            error={startDateError}
            defaultValue={parseDate(configuration.details.defaultStart)}
            minStart={startMinDate}
            maxEnd={startMaxDate}
            isDateUnavailable={isDateUnavailable}
            disabled={disabled}
            required={configuration.required}
            years={startYears}
            months={startMonths}
          />
          <DateField
            value={endDate}
            onChange={setEndDate}
            name={`${configuration.name}_end`}
            label='End date'
            error={endDateError}
            defaultValue={parseDate(configuration.details.defaultEnd)}
            maxEnd={endMaxDate}
            minStart={endMinDate}
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

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-conten: space-between;
  align-items: center;
  gap: 1em;
`

export { DateRangeWidget }
