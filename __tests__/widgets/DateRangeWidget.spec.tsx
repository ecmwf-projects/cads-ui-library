import React from 'react'

import { expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { DateValue, parseDate } from '@internationalized/date'

import {
  DateRangeWidget,
  getAvailableMonths,
  getAvailableYears,
  getDateLimits,
  getEndDateErrors,
  getInitialSelection,
  getStartDateErrors
} from '../../src'
import { getDateRangeWidgetConfiguration } from '../factories'

const mockIsDateUnavailable = (date: DateValue) => false

describe('<DateRangeWidget />', () => {
  describe('renders', () => {
    it('renders', () => {
      const configuration = getDateRangeWidgetConfiguration()

      render(<DateRangeWidget configuration={configuration} />)
    })
  })
  describe('getStartDateErrors', () => {
    it('should return "Date is not valid" error', () => {
      const date = parseDate('2023-03-20')
      const error = getStartDateErrors(
        date,
        date,
        date.toString(),
        date.toString(),
        (_date: DateValue) => _date.compare(date) === 0
      )

      expect(error).toBe('Date is not valid')
    })
    it('should return "Start date should be later than End date" error', () => {
      const startDate = parseDate('2023-03-20')
      const endDate = parseDate('2023-02-10')
      const error = getStartDateErrors(
        startDate,
        endDate,
        endDate.toString(),
        endDate.toString(),
        mockIsDateUnavailable
      )

      expect(error).toBe('Start date should be later than End date')
    })
    it('should return "Start date cannot exceed the deadline" error', () => {
      const startDate = parseDate('2023-03-20'),
        endDate = parseDate('2024-05-10'),
        maxDate = '2023-02-10',
        minDate = '2022-01-10'

      const error = getStartDateErrors(
        startDate,
        endDate,
        minDate,
        maxDate,
        mockIsDateUnavailable
      )

      expect(error).toBe(`Start date cannot exceed the deadline (2023-02-10)`)
    })
    it('should return "Start date cannot be set earlier than the minimum date" error', () => {
      const startDate = parseDate('2023-03-20'),
        endDate = parseDate('2024-05-10'),
        maxDate = '2024-12-10',
        minDate = '2024-01-10'

      const error = getStartDateErrors(
        startDate,
        endDate,
        minDate,
        maxDate,
        mockIsDateUnavailable
      )

      expect(error).toBe(
        `Start date cannot be set earlier than the minimum date (2024-01-10)`
      )
    })
  })
  describe('getEndDateErrors', () => {
    it('should return "Date is not valid" error', () => {
      const date = parseDate('2023-03-20')
      const error = getEndDateErrors(
        date,
        date,
        date.toString(),
        date.toString(),
        (_date: DateValue) => _date.compare(date) === 0
      )

      expect(error).toBe('Date is not valid')
    })
    it('should return "End date cannot be earlier than Start date" error', () => {
      const startDate = parseDate('2023-03-20')
      const endDate = parseDate('2023-02-10')
      const error = getEndDateErrors(
        startDate,
        endDate,
        endDate.toString(),
        endDate.toString(),
        mockIsDateUnavailable
      )

      expect(error).toBe('End date cannot be earlier than Start date')
    })
    it('should return "End date cannot exceed the deadline" error', () => {
      const startDate = parseDate('2023-03-20'),
        endDate = parseDate('2024-05-10'),
        maxDate = '2023-02-10',
        minDate = '2022-01-10'

      const error = getEndDateErrors(
        startDate,
        endDate,
        minDate,
        maxDate,
        mockIsDateUnavailable
      )

      expect(error).toBe(`End date cannot exceed the deadline (2023-02-10)`)
    })
    it('should return "End date cannot be set earlier than the deadline" error', () => {
      const startDate = parseDate('2023-03-20'),
        endDate = parseDate('2024-01-01'),
        maxDate = '2024-12-10',
        minDate = '2024-01-10'

      const error = getEndDateErrors(
        startDate,
        endDate,
        minDate,
        maxDate,
        mockIsDateUnavailable
      )

      expect(error).toBe(
        `End date cannot be set earlier than the deadline (2024-01-10)`
      )
    })
  })
  describe('getDateLimits', () => {
    it('should return date limits', () => {
      const startDate = parseDate('2023-03-20'),
        endDate = parseDate('2024-01-01'),
        maxDate = '2024-12-10',
        minDate = '2024-01-10'

      const { startMinDate, startMaxDate, endMinDate, endMaxDate } =
        getDateLimits(startDate, endDate, minDate, maxDate)

      expect(startMinDate?.toString()).toBe('2024-01-10')
      expect(startMaxDate?.toString()).toBe('2024-01-10')
      expect(endMinDate?.toString()).toBe('2023-03-20')
      expect(endMaxDate?.toString()).toBe('2024-12-10')
    })
    it('should return other date limits', () => {
      const startDate = parseDate('2023-03-20'),
        endDate = parseDate('2024-01-01'),
        maxDate = '2024-12-31',
        minDate = '2023-01-01'

      const { startMinDate, startMaxDate, endMinDate, endMaxDate } =
        getDateLimits(startDate, endDate, minDate, maxDate)

      expect(startMinDate?.toString()).toBe('2023-01-01')
      expect(startMaxDate?.toString()).toBe('2024-01-01')
      expect(endMinDate?.toString()).toBe('2023-03-20')
      expect(endMaxDate?.toString()).toBe('2024-12-31')
    })
  })
  describe('getAvailableYears', () => {
    it('Should return only one year', () => {
      const startDate = parseDate('2023-02-10'),
        endDate = parseDate('2023-03-20')
      const years = getAvailableYears(startDate, endDate)
      expect(years).toStrictEqual([2023])
    })
    it('Should return two years', () => {
      const startDate = parseDate('2023-02-10'),
        endDate = parseDate('2024-03-20')
      const years = getAvailableYears(startDate, endDate)
      expect(years).toStrictEqual([2023, 2024])
    })
    it('Should return only one year', () => {
      const startDate = parseDate('2023-02-10'),
        endDate = parseDate('2022-03-20')
      const years = getAvailableYears(startDate, endDate)
      expect(years).toStrictEqual([2023])
    })
  })
  describe('getAvailableMonths', () => {
    it('should return 12 months', () => {
      const date = parseDate('2023-03-20'),
        minDate = parseDate('2023-01-01'),
        maxDate = parseDate('2023-12-31')
      const months = getAvailableMonths(date, minDate, maxDate)
      expect(months).toHaveLength(12)
    })
    it('should return only 4 months', () => {
      const date = parseDate('2023-03-20'),
        minDate = parseDate('2023-03-01'),
        maxDate = parseDate('2023-06-30')
      const months = getAvailableMonths(date, minDate, maxDate)
      expect(months).toHaveLength(4)
      expect(months).toStrictEqual([3, 4, 5, 6])
    })
    it('should return only 6 months', () => {
      const date = parseDate('2024-03-20'),
        minDate = parseDate('2023-03-01'),
        maxDate = parseDate('2024-06-30')
      const months = getAvailableMonths(date, minDate, maxDate)
      expect(months).toHaveLength(6)
      expect(months).toStrictEqual([1, 2, 3, 4, 5, 6])
    })
  })
  describe('getInitialSelection', () => {
    it('should return parsed persisted value', () => {
      const persisted = {
        date_range: ['2023-11-03/2023-12-24']
      }
      const { start, end } = getInitialSelection('date_range', persisted)

      expect(start?.toString()).toStrictEqual('2023-11-03')
      expect(end?.toString()).toStrictEqual('2023-12-24')
    })
    it('should return undefined values', () => {
      const { start, end } = getInitialSelection('date_range')
      expect(start).toBeUndefined()
      expect(end).toBeUndefined()
    })
  })
})
