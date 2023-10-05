/**
 * Unit tests for FreeformInputWidget validation: string, integer and float values.
 */
import { expect } from '@jest/globals'

import { isDigitKey, isInteger, isFloat, keyDownHandler } from '../../src'

const asEvent = (key: string): React.KeyboardEvent<HTMLInputElement> => {
  return {
    key,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn()
  } as unknown as React.KeyboardEvent<HTMLInputElement>
}

describe('<FreeformInputWidget/>', () => {
  describe('Validation', () => {
    describe('Input validation', () => {
      it('accepts digit input', () => {
        expect(isDigitKey('1')).toBeTruthy()
        expect(isDigitKey('0')).toBeTruthy()
        expect(isDigitKey('9')).toBeTruthy()
      })

      it('accepts float input', () => {
        expect(isFloat('Delete')).toBeTruthy()
        expect(isFloat('Backspace')).toBeTruthy()
        expect(isFloat('ArrowLeft')).toBeTruthy()
        expect(isFloat('ArrowRight')).toBeTruthy()
        expect(isFloat('ArrowUp')).toBeTruthy()
        expect(isFloat('ArrowDown')).toBeTruthy()

        expect(isFloat('.')).toBeTruthy()
        expect(isFloat('0')).toBeTruthy()
        expect(isFloat('1')).toBeTruthy()
        expect(isFloat('9')).toBeTruthy()
      })

      it('accepts integer input', () => {
        expect(isInteger('Delete')).toBeTruthy()
        expect(isInteger('Backspace')).toBeTruthy()
        expect(isInteger('ArrowLeft')).toBeTruthy()
        expect(isInteger('ArrowRight')).toBeTruthy()
        expect(isInteger('ArrowUp')).toBeTruthy()
        expect(isInteger('ArrowDown')).toBeTruthy()

        expect(isInteger('1')).toBeTruthy()
        expect(isInteger('0')).toBeTruthy()
        expect(isInteger('9')).toBeTruthy()
      })

      it('rejects digit input', () => {
        expect(isDigitKey('a')).toBeFalsy()
        expect(isDigitKey('b')).toBeFalsy()
        expect(isDigitKey('A')).toBeFalsy()
      })

      it('rejects not int input', () => {
        expect(isInteger('.')).toBeFalsy()
        expect(isInteger('a')).toBeFalsy()
        expect(isInteger('_')).toBeFalsy()
      })

      it('rejects not float input', () => {
        expect(isFloat('a')).toBeFalsy()
        expect(isFloat('_')).toBeFalsy()
      })

      it('keyDownHandler works as expected', () => {
        const validator = keyDownHandler(isFloat)
        let ev = asEvent('A')
        expect(validator(ev))
        expect(ev.preventDefault).toBeCalled()

        ev = asEvent('2')
        expect(validator(ev))
        expect(ev.preventDefault).not.toBeCalled()
      })
    })
  })
})
