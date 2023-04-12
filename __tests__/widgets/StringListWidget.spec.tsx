import React from 'react'
import { expect } from '@jest/globals'

import { screen, render } from '@testing-library/react'

import { TooltipProvider } from '@radix-ui/react-tooltip'

import {
  StringListWidget,
  getAllValues
} from '../../src/widgets/StringListWidget'

import { getStringListWidgetConfiguration } from '../factories'

describe('<StringListWidget/>', () => {
  it('renders from form configuration', () => {
    render(
      <TooltipProvider>
        <StringListWidget configuration={getStringListWidgetConfiguration()} />
      </TooltipProvider>
    )
    screen.getByRole('group', { name: 'Product type' })
    screen.getByLabelText('Monthly averaged reanalysis')
    screen.getByLabelText('Monthly averaged reanalysis by hour of day')
    screen.getByText('At least one selection must be made')
  })

  it('enforces constraints', () => {
    const constrains = ['monthly_averaged_reanalysis_by_hour_of_day']
    render(
      <TooltipProvider>
        <StringListWidget
          configuration={getStringListWidgetConfiguration()}
          constraints={constrains}
        />
      </TooltipProvider>
    )

    // @ts-ignore
    expect(screen.getByLabelText('Monthly averaged reanalysis')).toBeDisabled() // FIXME
  })
})

describe('<StringListWidget/> utils', () => {
  it('returns all values', () => {
    const labels = {
      ['monthly_averaged_reanalysis']: 'Monthly averaged reanalysis',
      ['monthly_averaged_reanalysis_by_hour_of_day']:
        'Monthly averaged reanalysis by hour of day'
    }

    expect(getAllValues(labels)).toEqual([
      'monthly_averaged_reanalysis',
      'monthly_averaged_reanalysis_by_hour_of_day'
    ])
  })
})
