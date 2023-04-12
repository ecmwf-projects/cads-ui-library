import React from 'react'
import { expect } from '@jest/globals'

import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { StringChoiceWidget } from '../../src'

import { getStringChoiceWidgetConfiguration } from '../factories'

describe('<StringChoiceWidget/>', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('renders from form configuration', () => {
    render(
      <StringChoiceWidget
        configuration={getStringChoiceWidgetConfiguration()}
      />
    )
    screen.getByRole('group', { name: 'Format' })
    screen.getByLabelText('GRIB')
    screen.getByLabelText('NetCDF (experimental)')
  })

  it('handles change', async () => {
    userEvent.setup()
    render(
      <StringChoiceWidget
        configuration={getStringChoiceWidgetConfiguration()}
      />
    )
    // @ts-ignore FIXME
    expect(screen.getByLabelText('GRIB')).toBeChecked()

    await userEvent.click(screen.getByLabelText('NetCDF (experimental)'))
    // @ts-ignore FIXME
    expect(screen.getByLabelText('GRIB')).not.toBeChecked()
    // @ts-ignore FIXME
    expect(screen.getByLabelText('NetCDF (experimental)')).toBeChecked()
  })

  it('enforces constraints', () => {
    render(
      <StringChoiceWidget
        configuration={getStringChoiceWidgetConfiguration()}
        constraints={['netcdf']}
      />
    )

    // @ts-ignore FIXME
    expect(screen.getByLabelText('GRIB')).toBeDisabled()
  })

  it('hydrate its selection from local storage', () => {
    userEvent.setup()

    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: {
          id: 'reanalysis-era5-single-levels'
        },
        inputs: {
          time: ['00:00'],
          format: 'netcdf'
        }
      })
    )

    render(
      <StringChoiceWidget
        configuration={getStringChoiceWidgetConfiguration()}
      />
    )

    // @ts-ignore FIXME
    expect(screen.getByLabelText('NetCDF (experimental)')).toBeChecked()
  })
})
