import React from 'react'
import { render, screen } from '@testing-library/react'

import { SingleSelect, Label } from '../../src'

describe('Select components', () => {
  describe('<SingleSelect />', () => {
    it('renders', () => {
      render(
        <>
          <Label htmlFor='thematic-activity'>Thematic activity</Label>
          <SingleSelect
            options={[
              {
                id: 1,
                label:
                  'Policy support - support to EU policy or EU national or regional policy'
              },
              {
                id: 2,
                label: 'A'
              },
              {
                id: 3,
                label: 'BA'
              }
            ]}
            ariaLabel='Thematic activity'
            placeholder='Select an option ...'
            onChange={() => void 0}
            id='thematic-activity'
          />
        </>
      )

      screen.getByLabelText('Thematic activity')
    })

    it('fails gracefully', () => {
      render(
        // @ts-expect-error
        <SingleSelect
          ariaLabel='Thematic activity'
          placeholder='Select an option ...'
        />
      )
    })
  })
})
