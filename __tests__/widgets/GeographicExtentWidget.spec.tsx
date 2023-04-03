import React from 'react'
import { render, screen } from '@testing-library/react'

import { GeographicExtentWidget } from '../../src'

describe('<GeographicExtentWidget/>', () => {
  it('renders from configuration', () => {
    const configuration = {
      type: 'GeographicExtentWidget' as const,
      label: 'Area',
      name: 'area_group',
      help: null,
      details: {
        extentLabels: {
          e: 'East',
          n: 'North',
          s: 'South',
          w: 'West'
        },
        range: {
          e: 180,
          n: 90,
          s: -90,
          w: -180
        },
        default: {
          e: 180,
          n: 90,
          s: -90,
          w: -180
        }
      }
    }

    render(<GeographicExtentWidget configuration={configuration} />)

    screen.getByRole('group', { name: 'Area' })
    screen.getByLabelText('North')
    screen.getByLabelText('West')
    screen.getByLabelText('East')
    screen.getByLabelText('South')
  })
})
