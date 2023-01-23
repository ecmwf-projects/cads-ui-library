import React from 'react'

import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons'

import {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Content,
  Viewport,
  Group,
  Label,
  Item,
  ItemText,
  ItemIndicator
} from '@radix-ui/react-select'

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
   * The select label group.
   */
  label?: string
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
}
/**
 * SingleSelect. An uncontrolled select component for displaying a single group options.
 */
const SingleSelect = <TOptions extends { value: string; label: string }[]>({
  options,
  ariaLabel,
  placeholder,
  onChange,
  name,
  disabled,
  required,
  label,
  defaultOpen,
  defaultValue,
  position
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
      <Trigger aria-label={ariaLabel}>
        <Value placeholder={placeholder} />
        <Icon>
          <ChevronDownIcon />
        </Icon>
      </Trigger>
      <Portal>
        <Content position={position || 'popper'}>
          <Viewport>
            <Group>
              {label ? <Label>{label}</Label> : null}
              {options.map(({ value, label }) => {
                return (
                  <Item value={value} key={value}>
                    <ItemText>{label}</ItemText>
                    <ItemIndicator>
                      <CheckIcon />
                    </ItemIndicator>
                  </Item>
                )
              })}
            </Group>
          </Viewport>
        </Content>
      </Portal>
    </Root>
  )
}

export { SingleSelect }
