/**
 * Unit tests for GeographicExtentWidget validation.
 */
import { expect } from '@jest/globals'

import { isWithinRange } from '../../src'

describe('<GeographicExtentWidget/>', () => {
  describe('WIP Validation', () => {
    it('fails validation against range', function () {
      const range = { n: 90, e: 180, s: -90, w: -180 }

      expect(
        isWithinRange({
          name: 'area',
          field: 'area_n',
          value: '',
          fields: {
            area_n: '',
            area_e: '180',
            area_s: '-90',
            area_w: '-180'
          },

          range
        })
      ).toBeFalsy()

      expect(
        isWithinRange({
          name: 'area_1',
          field: 'area_1_n',
          value: '901',
          fields: {
            area_1_n: '901',
            area_1_e: '180',
            area_1_s: '-90',
            area_1_w: '-180'
          },
          range
        })
      ).toBeFalsy()

      expect(
        isWithinRange({
          name: 'area',
          field: 'area_n',
          value: '-901',
          fields: {
            area_n: '-901',
            area_e: '180',
            area_s: '-90',
            area_w: '-180'
          },
          range
        })
      ).toBeFalsy()

      expect(
        isWithinRange({
          name: 'area_1',
          field: 'area_1_n',
          value: '95',
          fields: {
            area_1_n: '95',
            area_1_e: '180',
            area_1_s: '-90',
            area_1_w: '-180'
          },
          range
        })
      ).toBeFalsy()
    })
  })
})
