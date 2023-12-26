import React from 'react'
import { Error } from './Widget'

export const RequiredErrorMessage = ({ show = false }: { show?: boolean }) => {
  if (!show) {
    return null
  }

  return (
    <Error data-error='required'>At least one selection must be made</Error>
  )
}
