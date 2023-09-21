import {
  getGroups,
  shouldRenderParent
} from '../../src/widgets/NestedStringListArrayWidget'
import { StringListArrayWidgetConfiguration } from '../../src/widgets/StringListArrayWidget'

import { getNestedStringListArrayWidgetConfiguration } from '../factories'

describe('<NestedStringListArrayWidget />', () => {
  describe('getGroups', () => {
    it('returns groups recursively with only two levels of nesting', () => {
      const { groups } = getNestedStringListArrayWidgetConfiguration().details

      const result = getGroups(groups)

      expect(result).toHaveLength(4)
    }),
      it('returns groups recursively without nesting limit', () => {
        const { groups } = getNestedStringListArrayWidgetConfiguration().details

        const result = getGroups(groups, [], 0, 10)

        expect(result).toHaveLength(6)
      })
  }),
    describe('shouldRenderParent', () => {
      it('should return true for groups without nesting', () => {
        const groups = getNestedStringListArrayWidgetConfiguration().details
          .groups as Pick<
          StringListArrayWidgetConfiguration,
          'label' | 'details'
        >[]

        const shouldRender = shouldRenderParent(groups[0])

        expect(shouldRender).toBeTruthy()
      })
      it('should return true for groups with only one nesting level', () => {
        const groups = getNestedStringListArrayWidgetConfiguration().details
          .groups as Pick<
          StringListArrayWidgetConfiguration,
          'label' | 'details'
        >[]

        const shouldRender = shouldRenderParent(groups[1])

        expect(shouldRender).toBeTruthy()
      })
      it('should return false for groups with more than one nesting level', () => {
        const groups = getNestedStringListArrayWidgetConfiguration().details
          .groups as Pick<
          StringListArrayWidgetConfiguration,
          'label' | 'details'
        >[]

        const shouldRender = shouldRenderParent(groups[3])

        expect(shouldRender).toBeFalsy()
      })
    })
})
