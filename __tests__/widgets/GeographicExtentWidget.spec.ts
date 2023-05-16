/**
 * Unit tests for GeographicExtentWidget validation.
 */
import { expect } from '@jest/globals'

import { isWithinRange } from '../../src'

describe('<GeographicExtentWidget/>', () => {
  describe('Validation', () => {
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
            area_n: '11',
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
