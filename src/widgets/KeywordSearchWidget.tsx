import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { AccordionSingle, Checkbox, Label } from '../index'

export type KeywordCategory = {
  label: string
  groups: Record<string, number>
}

export interface KeywordSearchWidgetProps {
  categories: KeywordCategory[]

  /**
   * Keyword change handlers. Invoked when the user selects/deselects a keyword.
   */
  onKeywordSelection?: (params: URLSearchParams) => void
}

type Selections = Record<string, string[]>

/**
 * KeywordSearchWidget. Widget to handle faceted search.
 * This widget is not configurable, and is intended to be used inside a form.
 */
const KeywordSearchWidget = ({
  categories,
  onKeywordSelection
}: KeywordSearchWidgetProps) => {
  /**
   * Keep track of the selected keywords. This is used to preserve the selections when the accordion are closed and subsequently opened.
   */
  const [selections, setSelections] = useState<Selections>({})
  const formRef = useRef(null)

  useEffect(() => {
    setSelections({})
  }, [categories])

  if (!categories?.length) return null

  const getSelectedKeywordsAsQueryParams = (selections: FormData) => {
    const searchParams = new URLSearchParams()

    for (const [category, keyword] of selections.entries()) {
      if (typeof keyword === 'string') {
        searchParams.append(category, keyword)
      }
    }

    return searchParams
  }

  const isDefaultChecked = (category: string, keyword: string) => {
    return selections[category]?.includes(keyword)
  }

  const handlePreserveSelections = (selections: FormData) => {
    const selection = [...selections.entries()].reduce<Selections>(
      (prevValue, currentValue) => {
        const [name, value] = currentValue

        if (typeof value !== 'string') return prevValue

        if (prevValue[name]) {
          prevValue[name] = [...prevValue[name], value]

          return prevValue
        }

        prevValue[name] = [value]

        return prevValue
      },
      {}
    )

    return setSelections(selection)
  }

  return (
    <form
      ref={formRef}
      onChange={ev => {
        const formData = new FormData(ev.currentTarget)
        onKeywordSelection?.(getSelectedKeywordsAsQueryParams(formData))
        handlePreserveSelections(formData)
      }}
    >
      {categories.map(category => {
        const { label: categoryLabel } = category

        return (
          <Group key={categoryLabel}>
            <AccordionSingle
              rootProps={{
                defaultValue: categoryLabel,
                collapsible: true,
                onValueChange: () => {
                  if (!formRef.current) return
                  handlePreserveSelections(new FormData(formRef.current))
                }
              }}
              itemProps={{
                value: categoryLabel,
                trigger: () => (
                  <AccordionTrigger>{categoryLabel}</AccordionTrigger>
                )
              }}
            >
              <Body>
                {Object.entries(category.groups).map(([name, count]) => {
                  return (
                    <InputGroup key={name}>
                      <Keyword>
                        <Checkbox
                          rootProps={{
                            defaultChecked: isDefaultChecked(
                              categoryLabel,
                              name
                            ),
                            name: categoryLabel,
                            id: name,
                            value: name
                          }}
                        />
                        <Label htmlFor={name}>{name}</Label>
                      </Keyword>
                      <Count>{count}</Count>
                    </InputGroup>
                  )
                })}
              </Body>
            </AccordionSingle>
          </Group>
        )
      })}
    </form>
  )
}

const Group = styled.div`
  margin-bottom: 1em;

  [data-stylizable='accordion-single'] {
    box-shadow: unset;
    padding: unset;
    margin: unset;
  }

  [data-stylizable='accordion-single-trigger'] {
    padding: 0.5em;
  }
`

const AccordionTrigger = styled.h5`
  all: unset;
  color: #75787b;
  font-size: 16px;
  font-weight: 700;
  width: 100%;
`

const Body = styled.div`
  padding: 1.0625em;
`

const InputGroup = styled.div`
  display: flex;
  gap: 0.5em;
  margin-bottom: 1em;
  justify-content: space-between;

  /**
  Checkbox style.
   */
  button {
    background-color: inherit;
  }

  &:has(button[data-state='checked']) {
    label {
      font-weight: 700;
    }
  }
`

const Keyword = styled.div`
  display: flex;
  gap: 0.5em;
`

const Count = styled.span`
  color: #9599a6;
`

export { KeywordSearchWidget }
