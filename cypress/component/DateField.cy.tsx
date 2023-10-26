import { parseDate } from '@internationalized/date'
import { DateField } from '../../src'

describe('<DateField />', () => {
  it('it renders without year and month selector', () => {
    cy.mount(
      <DateField
        defaultValue={parseDate('2023-03-20')}
        value={parseDate('2023-03-20')}
        label='Date field'
        name='date_field'
        onChange={console.log}
      />
    )
  })
  it('it renders with year and month selector', () => {
    cy.mount(
      <DateField
        defaultValue={parseDate('2023-03-20')}
        value={parseDate('2023-03-20')}
        label='Date field'
        name='date_field'
        onChange={console.log}
        years={[2023]}
        months={[1, 2, 3]}
      />
    )
  })
  it('it renders correct amount of months', () => {
    cy.mount(
      <DateField
        defaultValue={parseDate('2023-03-20')}
        value={parseDate('2023-03-20')}
        label='Date field'
        name='date_field'
        onChange={console.log}
        years={[2023, 2024, 2025]}
        months={[1, 2, 3, 4, 5, 6]}
      />
    )

    cy.get('[data-trigger="true"]').click()
    cy.get('select').first().find('option').should('have.length', 6)
  })
  it('it renders correct amount of years', () => {
    cy.mount(
      <DateField
        defaultValue={parseDate('2023-03-20')}
        value={parseDate('2023-03-20')}
        label='Date field'
        name='date_field'
        onChange={console.log}
        years={[2023, 2024, 2025]}
        months={[1, 2, 3, 4, 5, 6]}
      />
    )

    cy.get('[data-trigger="true"]').click()
    cy.get('select').last().find('option').should('have.length', 3)
  })
})
