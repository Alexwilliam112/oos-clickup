import { create } from 'zustand'

export const useTaskStore = create((set) => ({
  fetchTasks: null,
  setFetchTasks: (fetchTasks) => set({ fetchTasks }),
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task }),
  initialValues: {},
  setInitialValues: (values) => set({ initialValues: values }),
  selectData: {},
  setSelectData: (data) => set({ selectData: data }),
}))

export const useDashboardStore = create((set) => ({
  tabValue: 'chart',
  setTabValue: (value) => set({ tabValue: value }),
}))
