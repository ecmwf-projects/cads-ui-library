import { parseDate } from '@internationalized/date'
import { DateField } from '../../src'

describe('<DateField />', () => {
  it('test', () => {
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
  it('test 2', () => {
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
})
