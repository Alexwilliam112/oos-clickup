'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useTemplateStore = create(
  devtools((set, get) => ({
    data: null,
    setData(data) {
      set({ data })
    },
  }))
)

export { useTemplateStore }
