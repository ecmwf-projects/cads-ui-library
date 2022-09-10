import React from 'react'
import { render, screen } from '@testing-library/react'

import { RadioGroup, RadioGroupItem, RadioIndicator } from '../../src'

describe('<RadioGroup/>', () => {
  it('renders', () => {
    const items = [
      {
        value: 'first'
      },
      { value: 'second' }
    ]

    render(
      <RadioGroup>
        {items.map(({ value }) => {
          return (
            <RadioGroupItem key={value} value={value}>
              <RadioIndicator />
            </RadioGroupItem>
          )
        })}
      </RadioGroup>
    )

    screen.getAllByRole('radio')
  })
})
