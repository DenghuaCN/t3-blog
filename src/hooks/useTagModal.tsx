import { create } from 'zustand';

type useTagFormStore = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const useTagModal = create<useTagFormStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true })
}))

export default useTagModal;