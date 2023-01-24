import React from 'react'
import styled from 'styled-components'

import {
  Root,
  Trigger,
  Value,
  Icon,
  Content,
  Viewport,
  Group,
  Item,
  ItemText,
  ItemIndicator,
  ScrollUpButton,
  ScrollDownButton
} from '@radix-ui/react-select'

import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons'

type Props<TOptions> = {
  /**
   * The options to display in the select.
   */
  options: TOptions
  /**
   * The aria-label for the trigger.
   */
  ariaLabel: string

  /**
   * The content that will be rendered when the select has no value.
   */
  placeholder: string
  /**
   * Event handler called when the value changes.
   */
  onChange: (value: string) => void

  /**
   * The id to associate this widget with its label.
   * See https://www.radix-ui.com/docs/primitives/components/select#labelling
   */
  id: string
  /**
   * The name of the select. Submitted with its owning form as part of a name/value pair.
   */
  name?: string

  /**
   * When true, prevents the user from interacting with select.
   */
  disabled?: boolean

  /**
   * When true, indicates that the user must select a value before the owning form can be submitted.
   */
  required?: boolean

  /**
   * The open state of the select when it is initially rendered.
   */
  defaultOpen?: boolean
  /**
   * The value of the select when initially rendered.
   */
  defaultValue?: string
  /**
   * The positioning mode to use, 'item-aligned' is the default and behaves by positioning content relative to the active item. 'popper' positions content in the same way as our other primitives, for example Popover or DropdownMenu.
   * Defaults to 'popper'.
   */
  position?: 'item-aligned' | 'popper'

  /**
   * The distance in pixels from the anchor. Only available when position is set to popper.
   */
  sideOffset?: number

  /**
   * Enables the scroll up control.
   */
  scrollUpOn?: boolean

  /**
   * Enables the scroll down control.
   */
  scrollDownOn?: boolean
}
/**
 * SingleSelect. An uncontrolled select component for displaying a single group options.
 */
const SingleSelect = <TOptions extends { id: number; label: string }[]>({
  options,
  ariaLabel,
  placeholder,
  onChange,
  id,
  name,
  disabled,
  required,
  defaultOpen,
  defaultValue,
  position,
  sideOffset,
  scrollUpOn,
  scrollDownOn
}: Props<TOptions>) => {
  if (!options?.length) return null
  return (
    <Root
      onValueChange={onChange}
      defaultOpen={defaultOpen}
      defaultValue={defaultValue}
      name={name}
      disabled={disabled}
      required={required}
    >
      <StyledTrigger id={id} aria-label={ariaLabel}>
        <Value
          placeholder={(() => (
            <StyledPlaceholder>{placeholder}</StyledPlaceholder>
          ))()}
        />
        <Icon>
          <ChevronDownIcon />
        </Icon>
      </StyledTrigger>
      <StyledContent position={position || 'popper'} sideOffset={sideOffset}>
        {scrollUpOn ? (
          <StyledScrollUpButton>
            <ChevronUpIcon />
          </StyledScrollUpButton>
        ) : null}
        <StyledViewport>
          <Group>
            {options.map(({ id, label }) => {
              return (
                <StyledItem value={String(id)} key={String(id)}>
                  <ItemText>{label}</ItemText>
                  <StyledIndicator />
                </StyledItem>
              )
            })}
          </Group>
        </StyledViewport>
        {scrollDownOn ? (
          <StyledScrollDownButton>
            <ChevronDownIcon />
          </StyledScrollDownButton>
        ) : null}
      </StyledContent>
    </Root>
  )
}

const StyledTrigger = styled(Trigger)`
  all: unset;

  display: inline-flex;
  gap: 3.125em;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #9599a6;
  border-radius: 4px;
  padding: 1em;
  background-color: #ffffff;

  &:hover,
  &:focus {
    background-color: #f0f2f7;
  }
`

const StyledPlaceholder = styled.span`
  color: #9599a6;
`

const StyledContent = styled(Content)`
  all: unset;

  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.35),
    0px 10px 20px -15px rgba(22, 23, 24, 0.2);

  width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
`

const StyledViewport = styled(Viewport)``

const StyledItem = styled(Item)`
  all: unset;

  display: flex;
  min-height: 25px;
  padding: 0.5em 0.5em 0.5em 1em;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  user-select: none;

  &[data-highlighted] {
    outline: none;
  }

  &:hover,
  &:focus {
    background-color: #f0f2f7;
  }
`

const StyledScrollUpButton = styled(ScrollUpButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  height: 25px;
  cursor: default;
`

const StyledScrollDownButton = styled(ScrollDownButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  height: 25px;
  cursor: default;
`

const StyledIndicator = styled(ItemIndicator)`
  position: absolute;
  left: 0;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

export { SingleSelect }
