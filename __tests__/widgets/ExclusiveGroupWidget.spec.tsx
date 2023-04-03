import React from 'react'
import { render } from '@testing-library/react'

import { ExclusiveGroupWidget } from '../../src'

describe('<ExclusiveGroupWidget/>', () => {
  it('renders from configuration', () => {
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

    render(<ExclusiveGroupWidget configuration={configuration} />)
  })
})
