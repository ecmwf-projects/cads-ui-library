import React from 'react'
import { render, screen } from '@testing-library/react'

import { Label } from '../../src'

describe('<Label/>', () => {
  it('renders with associated input', () => {
    render(
      <>
        <Label>name</Label>
        <input id='name' />
      </>
    )

    screen.getByRole('label')
  })

  it('renders non full width', () => {
    render(<Label>the label</Label>)

    expect(screen.getByRole('label')).toHaveStyle({
      display: 'inline-block'
    })
  })

  it('renders full width', () => {
    render(<Label $isFullWidth={true}>the label</Label>)

    expect(screen.getByRole('label')).toHaveStyle({
      display: 'block',
      width: '100%'
    })
  })
})
