import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BaseButton } from '../../src'

describe('<BaseButton/>', () => {
  it('renders non full width', () => {
    render(<BaseButton>click me</BaseButton>)

    expect(screen.getByText(/click me/i)).toHaveStyle({
      display: 'inline-block'
    })
  })

  it('renders full width', () => {
    render(<BaseButton isFullWidth={true}>click me</BaseButton>)

    expect(screen.getByText(/click me/i)).toHaveStyle({
      display: 'block',
      width: '100%'
    })
  })

  it('handles click', async () => {
    userEvent.setup()

    const mockHandleClick = jest.fn()

    render(
      <BaseButton isFullWidth={true} onClick={mockHandleClick}>
        click me
      </BaseButton>
    )

    await userEvent.click(screen.getByText(/click me/i))
  })
})
