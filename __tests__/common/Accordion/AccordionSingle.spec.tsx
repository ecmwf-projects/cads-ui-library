import React from 'react'
import { render, screen } from '@testing-library/react'

import { AccordionSingle } from '../../../src'

describe('<AccordionSingle/>', () => {
  it('renders', () => {
    render(
      <AccordionSingle
        rootProps={{
          defaultValue: 'the label',
          onValueChange: () => null,
          collapsible: true
        }}
        itemProps={{
          value: 'the label',
          trigger: () => 'the label'
        }}
      >
        the content
      </AccordionSingle>
    )

    screen.getByText('the label')
    screen.getByText('the content')
  })
})
