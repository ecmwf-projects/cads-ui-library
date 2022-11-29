import React from 'react'
import { render, screen } from '@testing-library/react'

import { TextWidget } from '../../src'

describe('<TextWidget/>', () => {
  it('renders from configuration', () => {
    const configuration = {
      details: {
        id: 1,
        text: '<p>To obtain surface values of three dimensional (multi-level) variables, select the variable required and model level 60.</p>'
      },
      label: 'Surface data',
      name: 'surface_help',
      type: 'FreeEditionWidget' as const
    }

    render(<TextWidget configuration={configuration} />)

    screen.getByText('Surface data')
    screen.getByText(
      'To obtain surface values of three dimensional (multi-level) variables, select the variable required and model level 60.'
    )
  })

  it('does not render if wrong type', () => {
    const configuration = {
      details: {
        id: 1,
        text: '<p>To obtain surface values of three dimensional (multi-level) variables, select the variable required and model level 60.</p>'
      },
      label: 'Surface data',
      name: 'surface_help',
      // trick the compiler to accept wrong type
      type: 'Gibberish' as 'FreeEditionWidget'
    }

    render(<TextWidget configuration={configuration} />)

    expect(screen.queryByText('Surface data')).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        'To obtain surface values of three dimensional (multi-level) variables, select the variable required and model level 60.'
      )
    ).not.toBeInTheDocument()
  })
})
