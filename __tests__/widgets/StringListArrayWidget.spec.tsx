import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TooltipProvider } from '@radix-ui/react-tooltip'

import {
  appendToFormData,
  getAllValues,
  StringListArrayWidget
} from '../../src/widgets/StringListArrayWidget'

import { getStringListArrayWidgetConfiguration } from '../factories'

describe('<StringListArrayWidget/>', () => {
  it('renders from configuration', () => {
    render(
      <TooltipProvider>
        <StringListArrayWidget
          configuration={getStringListArrayWidgetConfiguration()}
        />
      </TooltipProvider>
    )
    screen.getByRole('group', { name: 'Variable' })
    screen.getByLabelText('Soil temperature level 1')
    screen.getByLabelText('Soil temperature level 2')
    screen.getByLabelText('Lake ice temperature')
    screen.getByText('At least one selection must be made')
  })

  it('handles required', async () => {
    userEvent.setup()
    render(
      <TooltipProvider>
        <StringListArrayWidget
          configuration={getStringListArrayWidgetConfiguration()}
        />
      </TooltipProvider>
    )

    screen.getByText('At least one selection must be made')

    await userEvent.click(screen.getByLabelText('Lake ice temperature'))

    expect(
      screen.queryByText('At least one selection must be made')
    ).not.toBeInTheDocument()
  })

  it('enforces constraints', () => {
    const constraints = [
      '10m_v_component_of_wind',
      'sea_surface_temperature',
      'medium_cloud_cover',
      'forecast_logarithm_of_surface_roughness_for_heat'
    ]

    render(
      <TooltipProvider>
        <StringListArrayWidget
          configuration={getStringListArrayWidgetConfiguration()}
          constraints={constraints}
        />
      </TooltipProvider>
    )

    // Sampling only a couple of inputs for brevity.
    expect(screen.getByLabelText('Soil temperature level 1')).toBeDisabled()
    expect(screen.getByLabelText('Lake total layer temperature')).toBeDisabled()
  })
})

describe('<StringListArrayWidget/> utils', () => {
  it('returns all values from all groups', () => {
    const groups = [
      {
        columns: 2,
        label: 'Temperature',
        labels: {
          '2m_dewpoint_temperature': '2m dewpoint temperature',
          '2m_temperature': '2m temperature',
          skin_temperature: 'Skin temperature',
          soil_temperature_level_1: 'Soil temperature level 1',
          soil_temperature_level_2: 'Soil temperature level 2',
          soil_temperature_level_3: 'Soil temperature level 3',
          soil_temperature_level_4: 'Soil temperature level 4'
        },
        values: [
          '2m_dewpoint_temperature',
          '2m_temperature',
          'skin_temperature',
          'soil_temperature_level_1',
          'soil_temperature_level_2',
          'soil_temperature_level_3',
          'soil_temperature_level_4'
        ]
      },
      {
        columns: 2,
        label: 'Lakes',
        labels: {
          lake_bottom_temperature: 'Lake bottom temperature',
          lake_ice_depth: 'Lake ice depth',
          lake_ice_temperature: 'Lake ice temperature',
          lake_mix_layer_depth: 'Lake mix-layer depth',
          lake_mix_layer_temperature: 'Lake mix-layer temperature',
          lake_shape_factor: 'Lake shape factor',
          lake_total_layer_temperature: 'Lake total layer temperature'
        },
        values: [
          'lake_bottom_temperature',
          'lake_ice_depth',
          'lake_ice_temperature',
          'lake_mix_layer_depth',
          'lake_mix_layer_temperature',
          'lake_shape_factor',
          'lake_total_layer_temperature'
        ]
      }
    ]

    expect(getAllValues(groups)).toEqual([
      '2m_dewpoint_temperature',
      '2m_temperature',
      'skin_temperature',
      'soil_temperature_level_1',
      'soil_temperature_level_2',
      'soil_temperature_level_3',
      'soil_temperature_level_4',
      'lake_bottom_temperature',
      'lake_ice_depth',
      'lake_ice_temperature',
      'lake_mix_layer_depth',
      'lake_mix_layer_temperature',
      'lake_shape_factor',
      'lake_total_layer_temperature'
    ])
  })

  it('appends current selection to form data, excluding duplicates - w/o constraints', () => {
    const formData = new FormData()
    formData.append('variable', 'dust_aerosol_0.55-0.9um_mixing_ratio')
    formData.append('variable', 'ozone')

    expect([
      ...appendToFormData(formData, {
        currentSelection: {
          variable: [
            'vertical_velocity',
            'temperature',
            'charnock',
            'ozone',
            'dust_aerosol_0.55-0.9um_mixing_ratio'
          ]
        },
        name: 'variable'
      }).values()
    ]).toEqual([
      'dust_aerosol_0.55-0.9um_mixing_ratio',
      'ozone',
      'vertical_velocity',
      'temperature',
      'charnock'
    ])
  })

  it('appends current selection to form data, excluding duplicates - w constraints', () => {
    const formData = new FormData()
    formData.append('variable', 'dust_aerosol_0.55-0.9um_mixing_ratio')
    formData.append('variable', 'ozone')

    expect([
      ...appendToFormData(
        formData,
        {
          currentSelection: {
            variable: [
              'vertical_velocity',
              'temperature',
              'charnock',
              'dust_aerosol_0.55-0.9um_mixing_ratio'
            ]
          },
          name: 'variable'
        },
        // Permitted selection
        [
          'vertical_velocity',
          'temperature',
          'dust_aerosol_0.55-0.9um_mixing_ratio'
        ]
      ).values()
    ]).toEqual([
      'dust_aerosol_0.55-0.9um_mixing_ratio',
      'ozone',
      'vertical_velocity',
      'temperature'
    ])
  })
})
