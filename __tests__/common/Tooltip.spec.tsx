import React from 'react'
import { render, screen } from '@testing-library/react'

import { TooltipProvider, Tooltip } from '../../src'

describe('<Tooltip/>', () => {
  it('renders', () => {
    render(
      <TooltipProvider>
        <Tooltip
          triggerProps={{
            asChild: true,
            child: () => <p>the trigger</p>
          }}
          contentProps={{
            child: () => <p>the content</p>
          }}
        />
      </TooltipProvider>
    )

    screen.getByText('the trigger')
  })
})
