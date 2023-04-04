/**
 * Check API validated constraints for checkboxes. The given checkbox must be disabled if its value does not appear in the list of permitted selections.
 */
const isDisabled = ({
  key,
  constraints
}: {
  key: string
  constraints?: string[]
}) => {
  if (!constraints) return false

  return !constraints.includes(key)
}

/**
 * Get selection for Select all, taking constraints into account.
 */
const getPermittedBulkSelection = ({
  availableSelection,
  constraints
}: {
  availableSelection: string[]
  constraints?: string[]
}) => {
  if (!constraints) return availableSelection

  return constraints
}

/**
 * Check if every checkbox in the widget is selected, taking constraints into account.
 */
const isAllSelected = ({
  availableSelection,
  constraints,
  currentSelection
}: {
  availableSelection: string[]
  constraints?: string[]
  currentSelection: string[]
}) => {
  if (!constraints) {
    return availableSelection.length === currentSelection.length
  }

  /**
   * Handle empty constraints.
   */

  if (constraints.length === 0) return true
  /**
   * If there are constraints, and the current selection is greater than the constraints, this means that the user has triggered constraints after selecting all the available choices. In this case we show "Clear all".
   */
  if (constraints.length && currentSelection.length > constraints.length)
    return true

  return constraints.length === currentSelection.length
}
export { isDisabled, getPermittedBulkSelection, isAllSelected }
