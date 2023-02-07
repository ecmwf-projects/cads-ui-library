import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { AccordionSingle, Checkbox, Label } from '../index'

export type KeywordCategory = {
  label: string
  groups: Record<string, number>
}

export interface KeywordSearchWidgetProps {
  categories: KeywordCategory[]

  /**
   * Keyword change handlers. Invoked when the user selects/deselects a keyword, with the selected keywords as an object.
   */
  onKeywordSelection?: (params: URLSearchParams) => void
}

type Selections = Record<string, string[]>

/**
 * KeywordSearchWidget. Widget to handle faceted search.
 * This widget is not configurable, and intended to be used inside a form.
 */
const KeywordSearchWidget = ({
  categories,
  onKeywordSelection
}: KeywordSearchWidgetProps) => {
  const [selections, setSelections] = useState<Selections>(() => {
    /**
     * Populate the initial state with a mapping between categories and empty arrays.
     */
    if (!categories?.length) return {}
    const entries = categories.map(({ label }) => [label, []])
    return Object.fromEntries(entries)
  })

  if (!categories?.length) return null

  const getSelectedKeywordsAsQueryParams = (selections: Selections) => {
    const searchParams = new URLSearchParams()

    for (const selection in selections) {
      if (selections[selection].length) {
        for (const keyword of selections[selection]) {
          searchParams.append(selection, keyword)
        }
      }
    }

    return searchParams
  }

  const isChecked = (categoryLabel: string, name: string) => {
    return selections[categoryLabel]?.includes(name)
  }

  return (
    <div>
      {categories.map(category => {
        const { label: categoryLabel } = category

        return (
          <Group key={categoryLabel}>
            <AccordionSingle
              rootProps={{
                defaultValue: categoryLabel,
                collapsible: true
              }}
              itemProps={{
                value: categoryLabel,
                trigger: () => (
                  <AccordionTrigger>{categoryLabel}</AccordionTrigger>
                )
              }}
            >
              <Body>
                {Object.entries(category.groups).map(([name, count]) => (
                  <InputGroup key={name}>
                    <Keyword>
                      <Checkbox
                        rootProps={{
                          checked: isChecked(categoryLabel, name),
                          onCheckedChange: checked => {
                            if (checked) {
                              return setSelections(prevState => {
                                const state = {
                                  ...prevState,
                                  [categoryLabel]: [
                                    ...prevState[categoryLabel],
                                    name
                                  ]
                                }

                                onKeywordSelection?.(
                                  getSelectedKeywordsAsQueryParams(state)
                                )

                                return state
                              })
                            }

                            return setSelections(prevState => {
                              const state = {
                                ...prevState,
                                [categoryLabel]: prevState[
                                  categoryLabel
                                ].filter(val => val !== name)
                              }

                              onKeywordSelection?.(
                                getSelectedKeywordsAsQueryParams(state)
                              )

                              return state
                            })
                          },
                          name,
                          id: name,
                          value: name
                        }}
                      />
                      <LabelWrapper
                        isBold={selections[categoryLabel]?.includes(name)}
                      >
                        <Label htmlFor={name}>{name}</Label>
                      </LabelWrapper>
                    </Keyword>
                    <Count>{count}</Count>
                  </InputGroup>
                ))}
              </Body>
            </AccordionSingle>
          </Group>
        )
      })}
    </div>
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
    background-color: #e6e9f2;
    padding: 0.5em;
    border-radius: 8px;
  }
`

const AccordionTrigger = styled.h5`
  all: unset;
  background-color: #e6e9f2;
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
`

const Keyword = styled.div`
  display: flex;
  gap: 0.5em;
`

const Count = styled.span`
  color: #9599a6;
`

const LabelWrapper = styled.div<{ isBold?: boolean }>`
  label {
    font-weight: ${props => (props.isBold ? '700' : '400')};
  }
`

export { KeywordSearchWidget }
