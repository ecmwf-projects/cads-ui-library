/**
 * Unit tests for GeographicExtentWidget validation.
 */
import { expect } from '@jest/globals'

import {
  isWithinRange,
  isWestLessThanEast,
  isSouthLessThanNorth
} from '../../src'

describe('<GeographicExtentWidget/>', () => {
  describe('Validation', () => {
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
    })
  })
})
