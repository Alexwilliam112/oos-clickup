import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      user_id: null,
      setUserId: (id) => set({ user_id: id }),
      clearUserId: () => set({ user_id: null }),
    }),
    {
      name: 'user-store', // key penyimpanan di localStorage
    }
  )
)
