import { create } from 'zustand'

interface PostViewState {
  viewingPost: boolean
  postData: any | null
  setPost: (post: any) => void
  clearPost: () => void
}

export const usePostViewStore = create<PostViewState>((set) => ({
  viewingPost: false,
  postData: null,
  setPost: (post) => set({ viewingPost: true, postData: post }),
  clearPost: () => set({ viewingPost: false, postData: null }),
}))