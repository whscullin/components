/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import { IconNames, iconNameList } from '@looker/icons'
import React, { createContext, ReactNode, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Icon, IconProps } from '../../../Icon'
import { Spinner } from '../../../Spinner'
import { Box } from '../../../Layout'
import { IconPlaceholder, ListItemDetail, ListItem } from '../../../List'
import { Heading, HeadingProps, Paragraph, Text } from '../../../Text'
import { useID } from '../../../utils'
import {
  ComboboxContext,
  ComboboxMultiContext,
  ComboboxMultiOption,
  ComboboxOption,
  ComboboxOptionIndicatorProps,
  ComboboxOptionIndicator,
  ComboboxOptionObject,
  ComboboxOptionText,
} from '../Combobox'
import { optionsHaveIcons, notInOptions } from './utils/options'
import { useWindowedOptions } from './utils/useWindowedOptions'

export const SelectOptionsContext = createContext({ hasIcons: false })

export type SelectOptionIcon = IconNames | IconProps['artwork']

export interface SelectOptionObject
  extends ComboboxOptionObject,
    Pick<ComboboxOptionIndicatorProps, 'indicator'> {
  description?: string | ReactNode
  /**
   * Supplementary element that appears right of the option's label
   */
  detail?: ReactNode
  /**
   * Icon shown to the left of the option label in the list and input when selected
   * Use an IconName, or inline svg for a custom icon
   */
  icon?: SelectOptionIcon
}

export interface SelectOptionGroupProps {
  options: SelectOptionObject[]
  label?: string | ReactNode
}

export type SelectOptionProps = SelectOptionObject | SelectOptionGroupProps

function isIconName(icon?: SelectOptionIcon): icon is IconNames {
  return typeof icon === 'string' && iconNameList.includes(icon)
}

export function getSelectOptionIconProps(icon: SelectOptionIcon) {
  return isIconName(icon) ? { name: icon } : { artwork: icon }
}

const StyledIcon = styled(Icon)`
  /* For proper alignment with option text and check icon */
  height: ${({ theme }) => theme.lineHeights.small};
`

interface OptionLayoutProps {
  option: SelectOptionObject
  scrollIntoView?: boolean
}

const OptionLayout = ({ option, scrollIntoView }: OptionLayoutProps) => {
  const { description, detail, icon, ...rest } = option
  const { hasIcons } = useContext(SelectOptionsContext)

  if (detail || hasIcons || description) {
    const iconToUse = icon ? (
      <StyledIcon
        size="small"
        mr="xsmall"
        color="text1"
        {...getSelectOptionIconProps(icon)}
        data-testid="option-icon"
      />
    ) : hasIcons ? (
      <IconPlaceholder size="small" data-testid="option-icon-placeholder" />
    ) : null

    return (
      <ComboboxOption {...rest} py="xxsmall" scrollIntoView={scrollIntoView}>
        {iconToUse}
        {description ? (
          <SelectOptionWithDescription description={description} {...rest} />
        ) : (
          <ComboboxOptionText />
        )}
        {detail && <ListItemDetail>{detail}</ListItemDetail>}
      </ComboboxOption>
    )
  }
  return <ComboboxOption {...rest} />
}

const MultiOptionLayout = ({ option, scrollIntoView }: OptionLayoutProps) => {
  const { description, detail, ...rest } = option
  if (description || detail) {
    return (
      <ComboboxMultiOption
        {...rest}
        py="xxsmall"
        scrollIntoView={scrollIntoView}
      >
        {description ? (
          <SelectOptionWithDescription description={description} {...rest} />
        ) : (
          <ComboboxOptionText />
        )}
        {detail && <ListItemDetail>{detail}</ListItemDetail>}
      </ComboboxMultiOption>
    )
  }
  return <ComboboxMultiOption {...rest} />
}

export function SelectOptionWithDescription({
  description,
}: SelectOptionObject) {
  return (
    <Box>
      <Heading
        fontFamily="body"
        fontSize="small"
        fontWeight="semiBold"
        pb="xxsmall"
      >
        <ComboboxOptionText />
      </Heading>
      <Paragraph color="subdued" fontSize="small">
        {description}
      </Paragraph>
    </Box>
  )
}

const SelectOptionGroupTitle = styled(Heading).attrs<HeadingProps>(
  ({
    color = 'subdued',
    fontFamily = 'body',
    fontSize = 'xxsmall',
    fontWeight = 'semiBold',
    px = 'xsmall',
    py = 'xxsmall',
  }) => ({
    color,
    fontFamily,
    fontSize,
    fontWeight,
    px,
    py,
  })
)<{ isMulti?: boolean }>`
  display: flex;
  padding-top: ${({ theme }) => theme.space.xxsmall};
`

export const SelectOptionGroup = ({
  options,
  label,
  isMulti,
}: SelectOptionGroupProps & { isMulti?: boolean }) => {
  const keyPrefix = useID(options.length.toString())
  return (
    <SelectOptionGroupContainer>
      {label && (
        <SelectOptionGroupTitle isMulti={isMulti}>
          <ComboboxOptionIndicator isMulti={isMulti} />
          {label}
        </SelectOptionGroupTitle>
      )}
      {options.map((option, index) => {
        const key = `${keyPrefix}-${index}`
        return isMulti ? (
          <MultiOptionLayout option={option} key={key} />
        ) : (
          <OptionLayout option={option} key={key} />
        )
      })}
    </SelectOptionGroupContainer>
  )
}

const SelectOptionGroupContainer = styled.div`
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.colors.ui2};
  border-top: 1px solid;
  padding: ${({ theme }) => theme.space.xsmall} 0;
  &:first-child,
  & + div {
    border-top: none;
  }
  &:last-child {
    border-bottom: none;
  }
`

export interface SelectOptionsBaseProps {
  /**
   * Options may be flat or grouped, label is option, without it the value is used
   */
  options?: SelectOptionProps[]
  /**
   * The user can type in the input (default false to mimic traditional select tag)
   */
  isFilterable?: boolean
  /**
   * Text to show when there are no available options
   * @default 'No options'
   */
  noOptionsLabel?: string
  /**
   * Render only the options visible in the scroll window
   */
  windowedOptions?: boolean
  /**
   * Add an on-the-fly option mirroring the typed text (use when isFilterable = true)
   * When `true`, notInOptions is used to show/hide and can be included in a custom function
   */
  showCreate?: boolean
  /**
   * Format the label of the on-the-fly create option (use with canCreate)
   * @default `Create ${inputText}`
   */
  formatCreateLabel?: (inputText: string) => ReactNode
  /**
   * Render a spinner in the list instead of any options
   * @default false
   */
  isLoading?: boolean
}

export interface SelectOptionsProps extends SelectOptionsBaseProps {
  isMulti?: boolean
}

export function SelectOptions({
  options,
  isFilterable,
  showCreate,
  formatCreateLabel,
  isMulti,
  noOptionsLabel = 'No options',
  windowedOptions,
  isLoading,
}: SelectOptionsProps) {
  const {
    start,
    end,
    before,
    after,
    scrollToFirst,
    scrollToLast,
  } = useWindowedOptions(windowedOptions, options, isMulti)
  const keyPrefix = useID(options?.length.toString())

  const hasIcons = useMemo(() => optionsHaveIcons(options), [options])

  if (isLoading) {
    return (
      <EmptyListItem mb={0} px="medium" py="xlarge">
        <Spinner size={30} aria-label="Loading" />
      </EmptyListItem>
    )
  }

  const optionsToRender = options && options.slice(start, end + 1)
  const OptionLayoutToUse = isMulti ? MultiOptionLayout : OptionLayout

  const noOptions = (
    <EmptyListItem mb={0} px="medium" py="xlarge">
      <Text color="subdued">{noOptionsLabel}</Text>
    </EmptyListItem>
  )

  const createOption = isFilterable && showCreate && (
    <SelectCreateOption
      options={options}
      formatLabel={formatCreateLabel}
      noOptions={noOptions}
      isMulti={isMulti}
      key="create"
    />
  )

  return (
    <SelectOptionsContext.Provider value={{ hasIcons }}>
      {options && scrollToFirst ? (
        <OptionLayoutToUse
          option={options[0] as SelectOptionObject}
          key={`${keyPrefix}-0`}
          scrollIntoView={true}
        />
      ) : null}
      {before}
      {optionsToRender && optionsToRender.length > 0
        ? [
            ...optionsToRender.map(
              (option: SelectOptionProps, index: number) => {
                const optionAsGroup = option as SelectOptionGroupProps
                // Keep key consistent if options are windowed
                const correctedIndex = index + start
                return optionAsGroup.options ? (
                  <SelectOptionGroup
                    key={correctedIndex}
                    {...optionAsGroup}
                    isMulti={isMulti}
                  />
                ) : (
                  <OptionLayoutToUse
                    option={option as SelectOptionObject}
                    key={`${keyPrefix}-${correctedIndex}`}
                  />
                )
              }
            ),
            createOption,
          ]
        : createOption || noOptions}
      {after}
      {options && scrollToLast ? (
        <OptionLayoutToUse
          option={options[options.length - 1] as SelectOptionObject}
          key={`${keyPrefix}-${options.length - 1}`}
          scrollIntoView
        />
      ) : null}
    </SelectOptionsContext.Provider>
  )
}

interface SelectCreateOptionProps {
  options?: SelectOptionProps[]
  noOptions: ReactNode
  formatLabel?: (inputText: string) => ReactNode
  isMulti?: boolean
}

function SelectCreateOption({
  options,
  noOptions,
  formatLabel,
  isMulti,
}: SelectCreateOptionProps) {
  const { data } = useContext(ComboboxContext)
  const { data: dataMulti } = useContext(ComboboxMultiContext)

  const inputValue = isMulti ? dataMulti.inputValue : data.inputValue
  const currentOptions = isMulti
    ? dataMulti.options
    : data.option
    ? [data.option]
    : []

  const shouldShow = useMemo(() => {
    return notInOptions(currentOptions, options, inputValue)
  }, [currentOptions, options, inputValue])

  if (!shouldShow || !inputValue) {
    if (!options || options.length === 0) return <>{noOptions}</>
    return null
  }

  const OptionComponent = isMulti ? ComboboxMultiOption : ComboboxOption

  return (
    <OptionComponent value={inputValue} highlightText={false} indicator={false}>
      {formatLabel ? formatLabel(inputValue) : `Create "${inputValue}"`}
    </OptionComponent>
  )
}

const EmptyListItem = styled(ListItem)`
  display: flex;
  justify-content: center;
`
