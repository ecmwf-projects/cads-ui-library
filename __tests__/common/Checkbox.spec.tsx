import React from 'react'
import { render, screen } from '@testing-library/react'

import { Checkbox } from '../../src'

describe('<Checkbox/>', () => {
  it('renders child when checked', () => {
    render(
      <Checkbox
        rootProps={{
          checked: true
        }}
      >
        ✓
      </Checkbox>
    )

    screen.getByText('✓')
  })
})
