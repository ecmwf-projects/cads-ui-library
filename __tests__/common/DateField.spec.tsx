import { expect } from '@jest/globals'

import { GregorianCalendar } from '@internationalized/date'
import { createCalendar } from '../../src'

describe('<DateField>', () => {
  describe('createCalendar', () => {
    it('should return gregorian calendar', () => {
      const calendar = createCalendar('gregory')

      expect(calendar).toBeInstanceOf(GregorianCalendar)
    })
    it('should throw with other any other identifier', () => {
      expect(createCalendar('fake')).toThrowError('Unsupported calendar fake')
    })
  })
})
