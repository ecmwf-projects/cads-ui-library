import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { AccordionSingle, Checkbox, Label } from '../index'

export type KeywordCategory = {
  category: string
  groups: Record<string, number | null>
}

export interface KeywordSearchWidgetProps {
  categories: KeywordCategory[]

  /**
   * Default selections. This is used to control checkbox selections from the outside.
   */
  defaultSelections: Selections

  /**
   * Keyword change handlers. Invoked when the user selects/deselects a keyword.
   */
  onKeywordSelection?: (params: URLSearchParams) => void

  /**
   * The key used as the query parameter for the keyword search. Defaults to "kw".
   */
  keywordQueryParam?: string

  /**
   * A custom transformer for the query parameter. Defaults to using encodeURIComponent.
   */
  keywordQueryParamTransformer?: (category: string, keyword: string) => string

  /**
   * Optional intrinsic props for the wrapper form.
   */
  formProps?: JSX.IntrinsicElements['form']
}

type Selections = Record<string, string[]>

/**
 * KeywordSearchWidget. Widget to handle faceted search.
 * This widget is not configurable, and is intended to be used inside a form.
 */
const KeywordSearchWidget = ({
  categories,
  defaultSelections,
  onKeywordSelection,
  keywordQueryParam = 'kw',
  keywordQueryParamTransformer,
  formProps
}: KeywordSearchWidgetProps) => {
  /**
   * Keep track of the selected keywords. This is used to preserve selections when accordions are closed and subsequently opened.
   */
  const [selections, setSelections] = useState<Selections>(defaultSelections)

  useEffect(() => {
    /**
     * Reset available selections when the categories change. The following removes any selection that is no longer available.
     */
    const _selections = categories.reduce<Selections>(
      (nextState, keywordCategory) => {
        if (
          defaultSelections[keywordCategory?.category]?.length >
          selections[keywordCategory?.category]?.length
        ) {
          nextState[keywordCategory.category] = [
            ...new Set(defaultSelections[keywordCategory.category]),
            ...new Set(selections[keywordCategory.category])
          ]
          return nextState
        }

        nextState[keywordCategory.category] = [
          ...intersection(
            intersection(
              new Set(Object.keys(keywordCategory.groups)),
              new Set(selections[keywordCategory.category] || [])
            ),
            new Set(defaultSelections[keywordCategory.category])
          )
        ]

        return nextState
      },
      {}
    )

    setSelections(_selections)
  }, [defaultSelections, categories])

  if (!categories?.length) return null

  const getSelectedKeywordsAsQueryParams = (selections: Selections) => {
    const searchParams = new URLSearchParams()

    for (const selection in selections) {
      if (selections[selection].length) {
        for (const keyword of selections[selection]) {
          searchParams.append(
            keywordQueryParam,
            (keywordQueryParamTransformer &&
              keywordQueryParamTransformer(selection, keyword)) ||
              encodeURIComponent(`${selection}: ${keyword}`)
          )
        }
      }
    }

    return searchParams
  }

  const isChecked = (category: string, keyword: string) => {
    return selections[category]?.includes(keyword)
  }

  return (
    <form
      onChange={ev => {
        ev.stopPropagation()
        onKeywordSelection?.(getSelectedKeywordsAsQueryParams(selections))
      }}
      {...formProps}
    >
      {categories.map(cat => {
        const { category } = cat

        return (
          <Group key={category}>
            <AccordionSingle
              rootProps={{
                ...(Object.keys(defaultSelections).includes(category) && {
                  defaultValue: category
                })
              }}
              itemProps={{
                value: category,
                trigger: () => <AccordionTrigger>{category}</AccordionTrigger>
              }}
            >
              <Body>
                {Object.entries(cat.groups).map(([name, count]) => {
                  return (
                    <InputGroup key={name}>
                      <Keyword data-stylizable='keyword'>
                        <Checkbox
                          rootProps={{
                            checked: isChecked(category, name),
                            onCheckedChange: checked => {
                              if (checked) {
                                return setSelections(prevState => {
                                  return {
                                    ...prevState,
                                    [category]: [...prevState[category], name]
                                  }
                                })
                              }

                              return setSelections(prevState => {
                                return {
                                  ...prevState,
                                  [category]: prevState[category].filter(
                                    val => val !== name
                                  )
                                }
                              })
                            },

                            name: category,
                            id: name,
                            value: name
                          }}
                        />
                        <Label htmlFor={name}>{name}</Label>
                      </Keyword>
                      {count ? <Count>{count}</Count> : null}
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

const intersection = <TSetElement,>(
  setA: Set<TSetElement>,
  setB: Set<TSetElement>
) => {
  const _intersection = new Set<TSetElement>()
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}

const Group = styled.div`
  margin-bottom: 1em;

  [data-stylizable='accordion-single'] {
    box-shadow: unset;
    padding: unset;
    margin: unset;
  }

  [data-stylizable='accordion-single-trigger'] {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    padding-right: 0.5em;
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
