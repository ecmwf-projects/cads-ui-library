import React from 'react'

import styled from 'styled-components'

import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@radix-ui/react-icons'
import {
  DatePicker,
  DateValue,
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover
} from 'react-aria-components'
import { CalendarDate } from '@internationalized/date'

import { Error, ReservedSpace } from '../widgets/Widget'

interface DateFieldProps {
  name: string
  label: string
  value: CalendarDate
  onChange(date: CalendarDate): void
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
    <DatePicker
      name={name}
      value={value}
      maxValue={maxEnd}
      minValue={minStart}
      defaultValue={defaultValue}
      isDisabled={disabled}
      granularity='day'
      isRequired={required}
      onChange={onChange}
      isDateUnavailable={isDateUnavailable}
    >
      <StyledLabel>{label}</StyledLabel>
      <StyledGroup>
        <StyledDateInput>
          {segment => <StyledDateSegment segment={segment} />}
        </StyledDateInput>
        <StyledInputButton isDisabled={disabled} data-trigger>
          <CalendarIcon width={24} height={24} />
        </StyledInputButton>
      </StyledGroup>
      <StyledReservedSpace>
        {error && <Error>{error}</Error>}
      </StyledReservedSpace>
      <StyledPopover>
        <StyledDialog>
          <StyledCalendar focusedValue={value}>
            <StyledCalendarHeader>
              {months && months.length > 0 && years && years.length > 0 ? (
                <DateSelects
                  value={value}
                  years={years}
                  months={months}
                  onDateChange={onChange}
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
    </DatePicker>
  )
}

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

interface DateSelectsProps {
  value: CalendarDate
  years: number[]
  months: number[]
  onDateChange(date: CalendarDate): void
}
const DateSelects = React.memo(
  ({ value, years, months, onDateChange }: DateSelectsProps) => {
    const yearOptions = React.useMemo(() => {
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
    }, [years, value])

    const monthOptions = React.useMemo(
      () =>
        months.map((m, i) => ({
          id: m.toString(),
          label: Months[m - 1]
        })),
      [months]
    )

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
)

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-conten: space-between;
  align-items: center;
  gap: 1em;
`

const StyledLabel = styled(Label)`
  font-size: 12px;
`
const StyledGroup = styled(Group)`
  display: flex;
  width: fit-content;
  align-items: center;
`
const StyledDateInput = styled(DateInput)`
  width: 100%;
  display: flex;
  padding: 18px 12px;
  border: 1px solid #9599a6;
  border-radius: 4px;
  min-width: 250px;
  white-space: nowrap;
  color: #999999;

  &[data-focus-within] {
    border-color: black;
    color: black;
    box-shadow: 0 0 0 1px black;
  }

  &:hover,
  &:focus,
  &:focus-within {
    background-color: #f0f2f7;
  }
`

const StyledReservedSpace = styled(ReservedSpace)`
  margin-top: 4px;
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
`

const StyledDateSegment = styled(DateSegment)`
  padding: 0 2px;
  font-variant-numeric: tabular-nums;
  text-align: end;
  color: var(--text-color);

  &[data-type='literal'] {
    padding: 0;
  }

  &[data-placeholder] {
    color: var(--text-color-placeholder);
    font-style: italic;
  }

  &:focus {
    color: var(--highlight-foreground);
    background: var(--highlight-background);
    outline: none;
    border-radius: 4px;
    caret-color: transparent;
  }

  &[data-invalid] {
    color: red;
  }

  &[data-disabled] {
    color: red;
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
