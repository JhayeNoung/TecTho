import { create } from 'zustand';

import { createAuthSlice, AuthSlice } from './authslice';
import { createActionSlice, ActionSlice } from './actionSlice';

export const useUserStore = create<AuthSlice & ActionSlice>()((...a) => ({
    ...createAuthSlice(...a),
    ...createActionSlice(...a),
}));