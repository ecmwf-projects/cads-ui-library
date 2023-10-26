import React from 'react'

import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { GregorianCalendar, parseDate } from '@internationalized/date'
import { DateSegment } from '@react-stately/datepicker'

import {
  DateField,
  DateSelects,
  createCalendar,
  getMonthOptions,
  getYearOptions,
  sortDateSegments
} from '../../src'
import { DateValue } from 'react-aria-components'

describe('<DateField />', () => {
  describe('renders', () => {
    it('It renders', () => {
      render(
        <DateField
          defaultValue={parseDate('2023-03-02')}
          value={parseDate('2024-04-20')}
          label='Date input'
          onChange={console.log}
          error='Some error'
          isDateUnavailable={(date: DateValue) => false}
          maxEnd={parseDate('2025-03-20')}
          minStart={parseDate('2020-03-20')}
          name='date_field'
          required
        />
      )
    })
    it('It renders with year and month selectors', () => {
      render(
        <DateField
          defaultValue={parseDate('2023-03-02')}
          value={parseDate('2024-04-20')}
          label='Date input'
          onChange={console.log}
          error='Some error'
          isDateUnavailable={(date: DateValue) => false}
          maxEnd={parseDate('2025-03-20')}
          minStart={parseDate('2020-03-20')}
          name='date_field'
          required
          months={[1, 2, 3, 4]}
          years={[2023, 2024]}
        />
      )
    })
  })
  describe('createCalendar', () => {
    it('should return gregorian calendar', () => {
      const calendar = createCalendar('gregory')

      expect(calendar).toBeInstanceOf(GregorianCalendar)
    })
    it('should throw with other any other identifier', () => {
      expect(() => createCalendar('fake')).toThrow('Unsupported calendar fake')
    })
  })
  describe('sortDateSegments', () => {
    it('shoud return sorted segments in the format: YYYY / MM / dd', () => {
      const segments: DateSegment[] = [
        {
          type: 'day',
          isEditable: true,
          isPlaceholder: false,
          placeholder: 'dd',
          text: '25'
        },
        {
          type: 'literal',
          isEditable: false,
          isPlaceholder: true,
          placeholder: '/',
          text: '/'
        },
        {
          type: 'month',
          isEditable: true,
          isPlaceholder: false,
          placeholder: 'mm',
          text: '03'
        },
        {
          type: 'literal',
          isEditable: false,
          isPlaceholder: true,
          placeholder: '/',
          text: '/'
        },
        {
          type: 'year',
          isEditable: true,
          isPlaceholder: false,
          placeholder: 'yyyy',
          text: '2023'
        }
      ]

      const sorted = sortDateSegments(segments).map(s => s.type)

      expect(sorted).toStrictEqual([
        'year',
        'literal',
        'month',
        'literal',
        'day'
      ])
    })
  })
  describe('getYearOptions', () => {
    it('should return only the list of years', () => {
      const years = [2022, 2023, 2024]
      const date = parseDate('2023-03-20')

      const result = getYearOptions(years, date)

      expect(result).toStrictEqual([
        { id: '2022', label: '2022', disabled: false },
        { id: '2023', label: '2023', disabled: false },
        { id: '2024', label: '2024', disabled: false }
      ])
    })
    it('should return the list of years and the current year disabled', () => {
      const years = [2022, 2023, 2024]
      const date = parseDate('2021-03-20')

      const result = getYearOptions(years, date)

      expect(result).toStrictEqual([
        { id: '2022', label: '2022', disabled: false },
        { id: '2023', label: '2023', disabled: false },
        { id: '2024', label: '2024', disabled: false },
        { id: '2021', label: '2021', disabled: true }
      ])
    })
  })
  describe('getMonthOptions', () => {
    it('should return month options', () => {
      const months = [1, 2, 3, 4]

      const result = getMonthOptions(months)

      expect(result).toStrictEqual([
        { id: '1', label: 'January' },
        { id: '2', label: 'February' },
        { id: '3', label: 'March' },
        { id: '4', label: 'April' }
      ])
    })
  })
})

describe('<DateSelects />', () => {
  it('renders with months and years', () => {
    render(
      <DateSelects
        value={parseDate('2023-03-20')}
        onDateChange={console.log}
        months={[1, 2]}
        years={[2023]}
      />
    )
  })
})
