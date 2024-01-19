import { create } from 'zustand';

type useUnsplashModal = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const useUnsplashModal = create<useUnsplashModal>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true })
}))

export default useUnsplashModal;