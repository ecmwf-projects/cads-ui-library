import React from 'react'
import { Error } from './Widget'

export const RequiredErrorMessage = () => {
  return (
    <Error data-error='required'>At least one selection must be made</Error>
  )
}
