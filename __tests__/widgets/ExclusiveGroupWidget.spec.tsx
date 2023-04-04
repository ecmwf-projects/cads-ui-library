import React from 'react'
import { render, screen } from '@testing-library/react'

import { ExclusiveGroupWidget } from '../../src'

describe('<ExclusiveGroupWidget/>', () => {
  it('renders', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Geographical area',
      help: null,
      name: 'area_group',
      required: true,
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
        childGetter={{
          global: () => <p>global</p>,
          area: () => <p>area</p>
        }}
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
      required: true,
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
      required: true,
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
        childGetter={{
          invalid: () => <p>hi</p>
        }}
      />
    )
  })
})
