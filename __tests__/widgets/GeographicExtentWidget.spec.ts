/**
 * Unit tests for GeographicExtentWidget validation.
 */
import { expect } from '@jest/globals'

import {
  isWithinRange,
  isWestLessThanEast,
  isSouthLessThanNorth,
  isValidInput,
  toPrecision,
  stripMinus
} from '../../src'

describe('<GeographicExtentWidget/>', () => {
  describe('Validation', () => {
    describe('Input validation', () => {
      it('rejects invalid input', () => {
        expect(isValidInput({ code: 'KeyP' })).toBeFalsy()
        expect(isValidInput({ code: 'KeyN' })).toBeFalsy()
        expect(isValidInput({ code: 'Comma' })).toBeFalsy()
        expect(isValidInput({ code: 'Period', value: '.' })).toBeFalsy()
        expect(isValidInput({ code: undefined })).toBeFalsy()
      })

      it('accepts valid input', () => {
        expect(isValidInput({ code: 'Delete' })).toBeTruthy()
        expect(isValidInput({ code: 'Backspace' })).toBeTruthy()
        expect(isValidInput({ code: 'Backspace', value: '-' })).toBeTruthy()

        expect(isValidInput({ code: 'ArrowRight' })).toBeTruthy()
        expect(isValidInput({ code: 'Period', value: '-' })).toBeTruthy()
        expect(isValidInput({ code: 'Digit0', value: '.' })).toBeTruthy()
        expect(isValidInput({ code: 'ArrowRight', value: '.' })).toBeTruthy()

        expect(isValidInput({ code: 'Digit9', value: '-' })).toBeTruthy()

        expect(isValidInput({ code: 'Digit4' })).toBeTruthy()

        expect(isValidInput({ code: 'Digit8', value: '-.' })).toBeTruthy()

        expect(isValidInput({ code: 'ControlLeft' })).toBeTruthy()

        expect(isValidInput({ code: 'ControlRight' })).toBeTruthy()
      })

      it('converts to precision', () => {
        expect(toPrecision('99.17', 2)).toEqual('99.17')
        expect(toPrecision('99.171', 2)).toEqual('99.17')
        expect(toPrecision('99.1712', 3)).toEqual('99.171')
        expect(toPrecision('99.123456789', 5)).toEqual('99.12345')
      })

      it('strips out minus', () => {
        expect(stripMinus('--')).toEqual('-')
        expect(stripMinus('.99-')).toEqual('.99')
        expect(stripMinus('-.99')).toEqual('-.99')
        expect(stripMinus('9')).toEqual('9')
        expect(stripMinus('')).toEqual('')
      })
    })
    describe('Field validation', () => {
      it('validates North edge', () => {
        const range = { n: 90, e: 180, s: -90, w: -180 }

        /**
         * Reject North greater than its permitted range.
         */
        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_n',
            value: '500',
            range
          })
        ).toBeFalsy()

        /**
         * North within the permitted range.
         */
        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_n',
            value: '89',
            range
          })
        ).toBeTruthy()

        /**
         * Reject North less than South range.
         */
        expect(
          isWithinRange({
            name: 'area_1',
            fieldName: 'area_1_n',
            value: '-95',
            range
          })
        ).toBeFalsy()
      })

      it('validates South edge', () => {
        const range = { n: 90, e: 180, s: -90, w: -180 }

        /**
         * Reject South greater than, or equal to North.
         */
        expect(
          isSouthLessThanNorth({
            name: 'area',
            fieldName: 'area_s',
            value: '88',
            fields: {
              area_n: '-3',
              area_e: '180',
              area_s: '88',
              area_w: '-181'
            }
          })
        ).toBeFalsy()

        expect(
          isSouthLessThanNorth({
            name: 'area',
            fieldName: 'area_s',
            value: '88',
            fields: {
              area_n: '88',
              area_e: '180',
              area_s: '88',
              area_w: '-181'
            }
          })
        ).toBeFalsy()

        expect(
          isSouthLessThanNorth({
            name: 'area',
            fieldName: 'area_n',
            value: '88',
            fields: {
              area_n: '88',
              area_e: '180',
              area_s: '89',
              area_w: '-181'
            }
          })
        ).toBeFalsy()

        /**
         * Reject South greater than North range.
         */
        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_s',
            value: '95',
            range
          })
        ).toBeFalsy()

        /**
         * Reject South equal to North.
         */
        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_s',
            value: '95',
            range
          })
        ).toBeFalsy()

        /**
         * South less than its permitted range.
         */
        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_s',
            value: '-180',
            range
          })
        ).toBeFalsy()

        /**
         * South within the permitted range.
         */
        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_s',
            value: '90',
            range
          })
        ).toBeTruthy()

        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_s',
            value: '11',
            range
          })
        ).toBeTruthy()
      })

      it('validates West edge', () => {
        const range = { n: 90, e: 180, s: -90, w: -180 }

        /**
         * Reject West greater than East range.
         */
        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_w',
            value: '189',
            range
          })
        ).toBeFalsy()

        /**
         * West outside its permitted range.
         */
        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_w',
            value: '-181',
            range
          })
        ).toBeFalsy()

        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_w',
            value: '180',
            range: {
              e: 179.95,
              n: 89.95,
              s: -59.95,
              w: -179.95
            }
          })
        ).toBeFalsy()

        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_w',
            value: '-189',
            range: {
              e: 180,
              n: 90,
              s: -90,
              w: -180
            }
          })
        ).toBeFalsy()

        /**
         * West within the permitted range.
         */
        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_w',
            value: '-179',
            range
          })
        ).toBeTruthy()

        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_w',
            value: '-17',
            range: {
              e: 179.95,
              n: 89.95,
              s: -59.95,
              w: -179.95
            }
          })
        ).toBeTruthy()

        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_w',
            value: '-18',
            range: {
              e: 180,
              n: 90,
              s: -90,
              w: -180
            }
          })
        ).toBeTruthy()

        /**
         * Reject West greater than or equal to East.
         */

        expect(
          isWestLessThanEast({
            name: 'area',
            fieldName: 'area_w',
            value: '15',
            fields: {
              area_n: '2',
              area_e: '5',
              area_s: '12',
              area_w: '5'
            }
          })
        ).toBeFalsy()

        expect(
          isWestLessThanEast({
            name: 'area',
            fieldName: 'area_w',
            value: '5',
            fields: {
              area_n: '2',
              area_e: '5',
              area_s: '12',
              area_w: '5'
            }
          })
        ).toBeFalsy()

        expect(
          isWestLessThanEast({
            name: 'area',
            fieldName: 'area_e',
            value: '5',
            fields: {
              area_n: '2',
              area_e: '5',
              area_s: '12',
              area_w: '5'
            }
          })
        ).toBeFalsy()

        expect(
          isWestLessThanEast({
            name: 'area',
            fieldName: 'area_e',
            value: '5',
            fields: {
              area_n: '2',
              area_e: '5',
              area_s: '12',
              area_w: '15'
            }
          })
        ).toBeFalsy()
      })

      it('validates East edge', () => {
        const range = { n: 90, e: 180, s: -90, w: -180 }

        /**
         * East within permitted range
         */
        expect(
          isWithinRange({
            name: 'area_2',
            fieldName: 'area_2_e',
            value: '179',
            range
          })
        ).toBeTruthy()

        /**
         * Reject East less than West range.
         */
        expect(
          isWithinRange({
            name: 'area_2',
            fieldName: 'area_2_e',
            value: '-181',
            range
          })
        ).toBeFalsy()

        /**
         * Reject East greater than its permitted range.
         */
        expect(
          isWithinRange({
            name: 'area_2',
            fieldName: 'area_2_e',
            value: '250',
            range
          })
        ).toBeFalsy()

        expect(
          isWithinRange({
            name: 'area',
            fieldName: 'area_e',
            value: '166',
            range: {
              n: 180,
              w: 90,
              e: -180,
              s: -90
            }
          })
        ).toBeFalsy()
      })
    })
  })
})
