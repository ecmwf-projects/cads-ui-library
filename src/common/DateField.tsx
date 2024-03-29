import React from 'react'

import styled from 'styled-components'

import { CalendarIcon } from '@radix-ui/react-icons'
import {
  DatePicker,
  DateValue,
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Dialog,
  Group,
  Heading,
  Popover,
  DateFieldProps as AriaDateFieldProps,
  DateSegmentProps,
  Label
} from 'react-aria-components'
import {
  CalendarDate,
  GregorianCalendar,
  toCalendarDate
} from '@internationalized/date'
import {
  DateFieldState,
  DateSegment,
  useDateFieldState
} from '@react-stately/datepicker'
import { useLocale } from '@react-aria/i18n'
import { useDateField, useDateSegment } from '@react-aria/datepicker'

import { Error as WidgetError, ReservedSpace } from '../widgets/Widget'

const Months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const createCalendar = (identifier: string) => {
  switch (identifier) {
    case 'gregory':
      return new GregorianCalendar()
    default:
      throw new Error(`Unsupported calendar ${identifier}`)
  }
}
export const sortDateSegments = (segments: DateSegment[]) => {
  const literal = segments.find(s => s.type === 'literal')!
  const year = segments.find(s => s.type === 'year')!
  const month = segments.find(s => s.type === 'month')!
  const day = segments.find(s => s.type === 'day')!

  return [year, literal, month, literal, day]
}
export const getYearOptions = (years: number[], value: CalendarDate) => {
  const baseYears = years.map(y => ({
    id: y.toString(),
    label: y.toString(),
    disabled: false
  }))
  if (!baseYears.find(({ id }) => value.year.toString() === id)) {
    return baseYears.concat({
      id: value.year.toString(),
      label: value.year.toString(),
      disabled: true
    })
  }
  return baseYears
}
export const getMonthOptions = (months: number[]) => {
  return months.map((m, i) => ({
    id: m.toString(),
    label: Months[m - 1]
  }))
}
const DateFieldInner = (props: AriaDateFieldProps<CalendarDate>) => {
  const { locale } = useLocale()

  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar
  })

  const ref = React.useRef<HTMLDivElement>(null)
  const { fieldProps, labelProps } = useDateField(props, state, ref)

  const segments = React.useMemo(
    () => sortDateSegments(state.segments),
    [state.segments]
  )

  return (
    <StyledDateInput
      ref={ref}
      {...fieldProps}
      className={state.isInvalid ? 'invalid' : ''}
    >
      {segments.map((segment, i) => (
        <InnerDateSegment key={i} segment={segment} state={state} />
      ))}
    </StyledDateInput>
  )
}

const InnerDateSegment = ({
  segment,
  state
}: DateSegmentProps & { state: DateFieldState }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <StyledDateSegment {...segmentProps} ref={ref}>
      {segment.type === 'literal' ? '-' : segment.text}
    </StyledDateSegment>
  )
}

interface DateFieldProps {
  name?: string
  label: string
  value: CalendarDate
  onChange(date: CalendarDate, source: 'input' | 'calendar'): void
  onBlur?: VoidFunction
  defaultValue: CalendarDate
  minStart?: CalendarDate
  maxEnd?: CalendarDate
  isDateUnavailable?: (date: DateValue) => boolean
  error?: string
  disabled?: boolean
  required?: boolean
  years?: number[]
  months?: number[]
}
const DateField = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  defaultValue,
  minStart,
  maxEnd,
  isDateUnavailable,
  error,
  disabled,
  required,
  months,
  years
}: DateFieldProps) => {
  return (
    <StyledDatePicker
      className={'my-date-picker'}
      name={name}
      value={value}
      maxValue={maxEnd}
      minValue={minStart}
      defaultValue={defaultValue}
      isDisabled={disabled}
      granularity='day'
      onChange={val => onChange(toCalendarDate(val), 'calendar')}
      isRequired={required}
      shouldForceLeadingZeros
      onBlur={onBlur}
      isDateUnavailable={isDateUnavailable}
    >
      <StyledLabel>{label}</StyledLabel>
      <StyledGroup>
        <DateFieldInner
          aria-label={label}
          value={value}
          maxValue={maxEnd}
          minValue={minStart}
          isDateUnavailable={isDateUnavailable}
          onChange={v => onChange(v, 'input')}
          defaultValue={defaultValue}
          isDisabled={disabled}
          isRequired={required}
          shouldForceLeadingZeros
        />
        <StyledInputButton isDisabled={disabled} data-trigger>
          <CalendarIcon width={24} height={24} />
        </StyledInputButton>
      </StyledGroup>
      <StyledReservedSpace>
        {error && <WidgetError>{error}</WidgetError>}
      </StyledReservedSpace>
      <StyledPopover isNonModal>
        <StyledDialog>
          <StyledCalendar focusedValue={value}>
            <StyledCalendarHeader>
              {months && months.length > 0 && years && years.length > 0 ? (
                <DateSelects
                  value={value}
                  years={years}
                  months={months}
                  onDateChange={v => onChange(v, 'calendar')}
                />
              ) : (
                <StyledHeading />
              )}
            </StyledCalendarHeader>
            <StyledCalendarGrid>
              {date => <StyledCalendarCell date={date} />}
            </StyledCalendarGrid>
          </StyledCalendar>
        </StyledDialog>
      </StyledPopover>
    </StyledDatePicker>
  )
}

interface DateSelectsProps {
  value: CalendarDate
  years: number[]
  months: number[]
  onDateChange(date: CalendarDate): void
}
export const DateSelects = ({
  value,
  years,
  months,
  onDateChange
}: DateSelectsProps) => {
  const yearOptions = React.useMemo(
    () => getYearOptions(years, value),
    [years, value]
  )

  const monthOptions = React.useMemo(() => getMonthOptions(months), [months])

  const handleChange =
    (key: 'month' | 'year') =>
    ({
      target: { value: selectValue }
    }: React.ChangeEvent<HTMLSelectElement>) => {
      const newDate = value.set({ [key]: parseInt(selectValue) })
      onDateChange(newDate)
    }

  return (
    <Row>
      <select
        key={value.month}
        value={value.month}
        onChange={handleChange('month')}
      >
        {monthOptions.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
      <select
        key={value.year}
        value={value.year}
        onChange={handleChange('year')}
      >
        {yearOptions.map(({ id, label, disabled }) => (
          <option key={id} value={id} disabled={disabled}>
            {label}
          </option>
        ))}
      </select>
    </Row>
  )
}

DateField.displayName = 'DateField'

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-conten: flex-start;
  align-items: center;
  gap: 4em;
`

const StyledDatePicker = styled(DatePicker)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 285px;
`
const StyledLabel = styled(Label)`
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

const StyledGroup = styled(Group)`
  display: flex;
  width: fit-content;
  align-items: center;
`
const StyledDateInput = styled.div`
  all: unset;
  width: 100%;
  display: flex;
  color: #9599a6;
  border: 2px solid #9599a6;
  border-radius: 4px;
  padding: 1em;
  min-width: 250px;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  &.invalid {
    border-color: red;
  }
`

const StyledReservedSpace = styled(ReservedSpace)`
  margin-top: 4px;
  width: 100%;
  max-width: 100%;
`

const StyledBlankButton = styled(Button)`
  background: transparent;
  color: black;
  box-shadow: none;
  border: none;
  padding: 0px;
`

const StyledInputButton = styled(StyledBlankButton)`
  margin-left: -2.25rem;
  cursor: pointer;
`

const StyledDateSegment = styled.div`
  padding: 0 2px;
  font-variant-numeric: tabular-nums;
  text-align: end;
  color: inherit;

  &[data-type='literal'] {
    padding: 0;
  }

  &[data-placeholder] {
    font-style: italic;
  }

  &:focus {
    background-color: #3297fd;
    border-radius: 2px;
    color: white;
    outline: none;
    caret-color: black;
  }

  &[data-disabled] {
    color: #9599a6;
  }
`
const StyledPopover = styled(Popover)`
  overflow: auto;
  border: 1px solid #eaeaea;
  box-shadow: 0 8px 20px rgba(0 0 0 / 0.1);
  border-radius: 6px;
  background: white;
  padding: 1.25rem;

  @keyframes slide {
    from {
      transform: var(--origin);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &[data-placement='top'] {
    --origin: translateY(8px);
  }

  &[data-placement='bottom'] {
    --origin: translateY(-8px);
  }

  &[data-entering] {
    animation: slide 200ms;
  }

  &[data-exiting] {
    animation: slide 200ms reverse ease-in;
  }
`
const StyledDialog = styled(Dialog)``
const StyledCalendar = styled(Calendar)`
  width: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
`

const StyledCalendarHeader = styled.header`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1em;

  &[data-disabled] {
    border: none;
  }
`

const StyledHeading = styled(Heading)`
  margin: 0;
  text-align: center;
  font-size: 0.8rem;
  font-weight: normal;
  text-transform: uppercase;
`
const StyledCalendarGrid = styled(CalendarGrid)``
const StyledCalendarCell = styled(CalendarCell)`
  width: 2rem;
  line-height: 2rem;
  text-align: center;
  border-radius: 6px;
  cursor: default;
  outline: none;
  border: 2px solid var(--page-background);
  margin: -1px;

  &[data-outside-month] {
    display: none;
  }

  &[data-pressed] {
    background: #eaeaea;
  }

  &[data-focus-visible] {
    box-shadow: 0 0 0 2px var(--highlight-background);
  }

  &[data-selected] {
    background: red;
    color: white;
  }

  &[data-disabled] {
    color: #999999;
  }

  &[data-unavailable] {
    text-decoration: line-through;
    color: #999999;
  }

  &[data-invalid] {
    background: var(--invalid-color);
    color: red;
  }
`

export { DateField }
