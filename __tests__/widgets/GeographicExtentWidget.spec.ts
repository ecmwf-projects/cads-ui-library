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
          fields: {
            area_n: '500',
            area_e: '180',
            area_s: '-180',
            area_w: '-181'
          },
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
          fields: {
            area_n: '89',
            area_e: '180',
            area_s: '15',
            area_w: '-179'
          },
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
          fields: {
            area_n: '-95',
            area_e: '180',
            area_s: '-180',
            area_w: '-181'
          },
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
      ).toEqual('South edge must be less than North edge')

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
      ).toEqual('South edge must be less than North edge')

      /**
       * Reject South greater than North range.
       */
      expect(
        isWithinRange({
          name: 'area',
          fieldName: 'area_s',
          value: '95',
          fields: {
            area_n: '90',
            area_e: '180',
            area_s: '95',
            area_w: '-181'
          },
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
          fields: {
            area_n: '95',
            area_e: '180',
            area_s: '95',
            area_w: '-181'
          },
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
          fields: {
            area_n: '90',
            area_e: '180',
            area_s: '-180',
            area_w: '-181'
          },
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
          fields: {
            area_n: '15',
            area_e: '180',
            area_s: '11',
            area_w: '-179'
          },
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
          fields: {
            area_n: '11',
            area_e: '180',
            area_s: '12',
            area_w: '189'
          },
          range
        })
      ).toBeFalsy()

      /**
       * West less than its permitted range.
       */
      expect(
        isWithinRange({
          name: 'area',
          fieldName: 'area_w',
          value: '-181',
          fields: {
            area_n: '11',
            area_e: '180',
            area_s: '12',
            area_w: '-181'
          },
          range
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
          fields: {
            area_n: '11',
            area_e: '180',
            area_s: '12',
            area_w: '-179'
          },
          range
        })
      ).toBeTruthy()

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
      ).toEqual('West edge must be less than East edge')
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
          fields: {
            area_n: '11',
            area_e: '-179',
            area_s: '12',
            area_w: '-181'
          },
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
          fields: {
            area_n: '11',
            area_e: '250',
            area_s: '12',
            area_w: '-181'
          },
          range
        })
      ).toBeFalsy()
    })
  })
})
