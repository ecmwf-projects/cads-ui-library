export const getStringListArrayWidgetConfiguration = () => {
  return {
    details: {
      accordionGroups: true,
      accordionOptions: {
        openGroups: ['Temperature', 'Lakes'],
        searchable: false
      },
      displayaslist: false,
      groups: [
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
      ],
      id: 1
    },
    help: null,
    label: 'Variable',
    name: 'variable',
    required: true,
    type: 'StringListArrayWidget' as const
  }
}

export const getGeographicExtentWidgetConfiguration = () => {
  return {
    type: 'GeographicExtentWidget' as const,
    label: 'Area',
    name: 'area',
    help: 'Select a sub region of the available area by providing its limit in latitude and longitude',
    details: {
      precision: 2,
      extentLabels: {
        n: 'North',
        w: 'West',
        e: 'East',
        s: 'South'
      },
      range: {
        s: -90,
        w: -180,
        n: 90,
        e: 180
      },
      default: {
        n: 90,
        w: -180,
        e: 180,
        s: -90
      }
    }
  }
}

export const getTextWidgetConfiguration = () => {
  return {
    details: {
      id: 1,
      text: '<p>To obtain surface values of three dimensional (multi-level) variables, select the variable required and model level 60.</p>'
    },
    label: 'Surface data',
    name: 'surface_help',
    type: 'FreeEditionWidget' as const
  }
}

export const getStringListWidgetConfiguration = () => {
  return {
    details: {
      columns: 2,
      id: 0,
      labels: {
        ['monthly_averaged_reanalysis']: 'Monthly averaged reanalysis',
        ['monthly_averaged_reanalysis_by_hour_of_day']:
          'Monthly averaged reanalysis by hour of day'
      },
      values: [
        'monthly_averaged_reanalysis',
        'monthly_averaged_reanalysis_by_hour_of_day'
      ]
    },
    help: null,
    label: 'Product type',
    name: 'product_type',
    required: true,
    type: 'StringListWidget' as const
  }
}

export const getStringChoiceWidgetConfiguration = () => {
  return {
    details: {
      columns: 2,
      default: ['grib'],
      id: 8,
      labels: {
        grib: 'GRIB',
        netcdf: 'NetCDF (experimental)'
      },
      values: ['grib', 'netcdf']
    },
    required: true,
    help: null,
    label: 'Format',
    name: 'format',
    type: 'StringChoiceWidget' as const
  }
}

export const getFreeformInputWidgetConfiguration = () => {
  return {
    type: 'FreeformInputWidget' as const,
    label: 'Freeform input',
    name: 'freeform_input',
    help: 'Enter a freeform input',
    details: {
      dtype: 'string' as const,
    },
    required: true,
  }
}
