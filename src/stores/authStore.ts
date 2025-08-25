import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: !!localStorage.getItem('isAuthenticated'),
  login: () => {
    localStorage.setItem('isAuthenticated', 'true'); // Lưu trạng thái vào localStorage
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('isAuthenticated'); // Xóa trạng thái khỏi localStorage
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
