import { create } from 'zustand'
import type { Post } from '@/types/post-types'

interface PostViewState {
  viewingPost: boolean
  postData: Post | null
  setPost: (post: Post) => void
  clearPost: () => void
}

export const usePostViewStore = create<PostViewState>((set) => ({
  viewingPost: false,
  postData: null,
  setPost: (post) => set({ viewingPost: true, postData: post }),
  clearPost: () => set({ viewingPost: false, postData: null }),
}))