import React from 'react'
import { render, screen } from '@testing-library/react'

import { Badge, StatusBadge } from '../../src'

describe('<Badge/>', () => {
  it('renders', () => {
    render(<Badge variant='failed'>a text</Badge>)

    screen.getByText('a text')
  })
})

describe('<StatusBadge/>', () => {
  it('renders', () => {
    render(<StatusBadge styledVariant='successful'>a text</StatusBadge>)

    screen.getByText('a text')
  })
})
