import React from 'react'
import { render, screen } from '@testing-library/react'

import { Label } from '../../src'

describe('<Label/>', () => {
  it('renders with associated input', () => {
    render(
      <>
        <Label htmlFor='name'>name</Label>
        <input id='name' />
      </>
    )

    screen.getByLabelText('name')
  })

  it('renders non full width', () => {
    render(
      <>
        <Label htmlFor='name'>the label</Label>
        <input id='name' />
      </>
    )

    expect(screen.getByText('the label')).toHaveStyle({
      display: 'inline-block'
    })
  })

  it('renders full width', () => {
    render(
      <>
        <Label $isFullWidth={true} htmlFor='name'>
          the label
        </Label>
        <input id='name' />
      </>
    )

    expect(screen.getByText('the label')).toHaveStyle({
      display: 'block',
      width: '100%'
    })
  })
})
