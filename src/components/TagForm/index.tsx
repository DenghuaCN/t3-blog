import { Fragment, useEffect, useMemo, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { HiCheck } from 'react-icons/hi'
import { HiChevronUpDown } from 'react-icons/hi2'

import type { Dispatch, SetStateAction } from 'react'

export type Tag = { id: string, name: string }
type TagFormProps = {
  tags: Tag[];
  selectedTags: Tag[];
  setSelectedTags: Dispatch<SetStateAction<Tag[]>>
}

export default function TagForm({ tags, setSelectedTags, selectedTags }: TagFormProps) {

  const [selected, setSelected] = useState(tags[0]) // 默认显示tags第一项
  const [query, setQuery] = useState('')

  /**
   * @description 标签模糊搜索，并节省计算
   */
  const filteredTag = useMemo<Tag[]>(() => {
    return (query === '') ? tags : tags.filter((tag) =>
      tag.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.toLowerCase().replace(/\s+/g, ''))
    )
  }, [query, tags])


  return (
    <Combobox value={selected} onChange={(tag) => {
      setSelected(tag)
      setSelectedTags((prev) => (
        Array.from(new Set([...prev, tag])) // 去重
      ))
    }}>
      <div className="relative mt-1 border-none">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm">
          <Combobox.Input
            className="w-full py-2 outline-none pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 border-red-500"
            displayValue={(tag: Tag) => tag.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredTag.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredTag.map((tag) => (
                <Combobox.Option
                  key={tag.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={tag}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {tag.name}
                      </span>

                      {/* 如果已选tags数组包含此tag，则显示checked标记 */}
                      {selectedTags.includes(tag) ? (
                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-gray-600'}`}>
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}
