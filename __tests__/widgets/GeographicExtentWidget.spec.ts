/**
 * Unit tests for GeographicExtentWidget validation.
 */
import { expect } from '@jest/globals'

import { isWithinRange } from '../../src'

describe('<GeographicExtentWidget/>', () => {
  describe('Validation', () => {
    it('validates North edge', () => {
      const range = { n: 90, e: 180, s: -90, w: -180 }

      /**
       * Reject North less than South.
       * TODO: this should produce "South edge must be less than North edge"
       */
      expect(
        isWithinRange({
          name: 'area',
          fieldName: 'area_n',
          value: '-17',
          fields: {
            area_n: '-17',
            area_e: '180',
            area_s: '-16',
            area_w: '-181'
          },
          range
        })
      ).toBeFalsy()

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
          value: '11',
          fields: {
            area_n: '11',
            area_e: '180',
            area_s: '10',
            area_w: '-179'
          },
          range
        })
      ).toBeTruthy()
    })

    it('validates South edge', () => {
      const range = { n: 90, e: 180, s: -90, w: -180 }

      /**
       * Reject South greater than North.
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
       * West greater than East.
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
    })
  })
})
