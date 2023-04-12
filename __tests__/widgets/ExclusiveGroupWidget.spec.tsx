import React from 'react'
import { render, screen } from '@testing-library/react'

import {
  ExclusiveGroupWidget,
  getExclusiveGroupChildren,
  isChildOfExclusiveGroup
} from '../../src'

import {
  getStringListWidgetConfiguration,
  getGeographicExtentWidgetConfiguration,
  getStringChoiceWidgetConfiguration
} from '../factories'

describe('<ExclusiveGroupWidget/>', () => {
  it('renders', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Geographical area',
      help: null,
      name: 'area_group',
      children: ['global', 'area'],
      details: {
        default: 'global',
        information:
          'Valid latitude and longitude values are multiples of 0.05 degree.'
      }
    }

    const formConfiguration = [configuration]

    render(
      <ExclusiveGroupWidget
        configuration={configuration}
        childrenGetter={getExclusiveGroupChildren(
          formConfiguration,
          'area_group'
        )}
      />
    )

    screen.getByRole('group', { name: 'Geographical area' })
  })

  it('fails gracefully for missing childGetter', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Geographical area',
      help: null,
      name: 'area_group',
      children: ['global', 'area'],
      details: {
        default: 'global',
        information:
          'Valid latitude and longitude values are multiples of 0.05 degree.'
      }
    }

    // @ts-expect-error
    render(<ExclusiveGroupWidget configuration={configuration} />)
  })

  it('fails gracefully for missing child', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Geographical area',
      help: null,
      name: 'area_group',
      children: ['global', 'area'],
      details: {
        default: 'global',
        information:
          'Valid latitude and longitude values are multiples of 0.05 degree.'
      }
    }

    render(
      <ExclusiveGroupWidget
        configuration={configuration}
        childrenGetter={{
          invalid: () => <p>hi</p>
        }}
      />
    )
  })

  describe('<ExclusiveGroupWidget/> utils', () => {
    it('groups its children', () => {
      const widgetConfiguration = {
        type: 'ExclusiveGroupWidget' as const,
        label: 'Geographical area',
        help: null,
        name: 'area_group',
        children: ['global', 'global_1', 'area'],
        details: {
          default: 'global',
          information:
            'Valid latitude and longitude values are multiples of 0.05 degree.'
        }
      }

      const formConfiguration = [
        widgetConfiguration,
        getGeographicExtentWidgetConfiguration(),
        getStringListWidgetConfiguration(),
        getStringChoiceWidgetConfiguration(),
        {
          details: {
            id: 1,
            text: '<p>With this option selected the entire available area will be provided</p>'
          },
          label: 'Whole available region',
          name: 'global',
          type: 'FreeEditionWidget' as const
        },
        {
          details: {
            id: 1,
            text: '<p>With this option selected the entire available area will be provided</p>'
          },
          label: 'Whole available region 1',
          name: 'global_1',
          type: 'FreeEditionWidget' as const
        }
      ]

      expect(
        getExclusiveGroupChildren(formConfiguration, 'area_group')
      ).toEqual({
        global: expect.any(Function),
        global_1: expect.any(Function),
        area: expect.any(Function)
      })
    })

    it('returns true if child of exclusive group widget', () => {
      const formConfiguration = [
        {
          type: 'ExclusiveGroupWidget' as const,
          label: 'Geographical area',
          help: null,
          name: 'area_group',
          children: ['global', 'global_1', 'area'],
          details: {
            default: 'global',
            information:
              'Valid latitude and longitude values are multiples of 0.05 degree.'
          }
        },
        getGeographicExtentWidgetConfiguration(),
        getStringListWidgetConfiguration(),
        getStringChoiceWidgetConfiguration(),
        {
          details: {
            id: 1,
            text: '<p>With this option selected the entire available area will be provided</p>'
          },
          label: 'Whole available region',
          name: 'global',
          type: 'FreeEditionWidget' as const
        },
        {
          details: {
            id: 1,
            text: '<p>With this option selected the entire available area will be provided</p>'
          },
          label: 'Whole available region 1',
          name: 'global_1',
          type: 'FreeEditionWidget' as const
        }
      ]

      expect(
        isChildOfExclusiveGroup(
          {
            details: {
              id: 1,
              text: '<p>With this option selected the entire available area will be provided</p>'
            },
            label: 'Whole available region 1',
            name: 'global_1',
            type: 'FreeEditionWidget' as const
          },
          formConfiguration
        )
      ).toBeTruthy()

      expect(
        isChildOfExclusiveGroup(
          {
            details: {
              id: 1,
              text: '<p>With this option selected the entire available area will be provided</p>'
            },
            label: 'Whole available region',
            name: 'global',
            type: 'FreeEditionWidget' as const
          },
          formConfiguration
        )
      ).toBeTruthy()

      expect(
        isChildOfExclusiveGroup(
          getGeographicExtentWidgetConfiguration(),
          formConfiguration
        )
      ).toBeTruthy()
    })

    it('returns false if not child of exclusive group widget', () => {
      expect(
        isChildOfExclusiveGroup(
          {
            details: {
              id: 1,
              text: '<p>With this option selected the entire available area will be provided</p>'
            },
            label: 'Whole available region',
            name: 'global',
            type: 'FreeEditionWidget' as const
          },
          [
            {
              details: {
                id: 1,
                text: '<p>With this option selected the entire available area will be provided</p>'
              },
              label: 'Whole available region',
              name: 'global',
              type: 'FreeEditionWidget' as const
            },
            {
              type: 'ExclusiveGroupWidget' as const,
              label: 'Geographical area',
              help: null,
              name: 'area_group',
              children: ['not-mine'],
              details: {
                default: 'not-mine',
                information:
                  'Valid latitude and longitude values are multiples of 0.05 degree.'
              }
            }
          ]
        )
      ).toBeFalsy()
    })
  })
})
