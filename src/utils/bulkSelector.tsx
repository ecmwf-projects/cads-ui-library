import React from 'react'
import styled from 'styled-components'

import { BaseButton } from '../index'

type Props = {
  fieldset: string
  handleAction: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  values?: string[]
}
const SelectAll = ({ fieldset, handleAction, values }: Props) => {
  if (!values) return null
  return (
    <>
      <ActionButton
        type='button'
        onClick={ev => {
          ev.stopPropagation()
          handleAction(prevState => ({ ...prevState, [fieldset]: values }))
        }}
      >
        Select all
      </ActionButton>
    </>
  )
}

const ClearAll = ({ fieldset, handleAction }: Props) => {
  return (
    <ActionButton
      type='button'
      onClick={ev => {
        ev.stopPropagation()
        handleAction(prevState => ({ ...prevState, [fieldset]: [] }))
      }}
    >
      Clear all
    </ActionButton>
  )
}

const ActionButton = styled(BaseButton)`
  all: unset;
  cursor: pointer;
  color: #25408f;
  text-decoration: underline;
`

export { ClearAll, SelectAll }
