import React from 'react'
import { render, screen } from '@testing-library/react'

import { TooltipProvider, WidgetTooltip } from '../../src'

describe('WidgetTooltip', () => {
  it('does not violate accessibility', async () => {
    render(
      <TooltipProvider>
        <WidgetTooltip helpText='My help text' triggerAriaLabel='Get help' />
      </TooltipProvider>
    )

    screen.getByLabelText('Get help')
  })
})
