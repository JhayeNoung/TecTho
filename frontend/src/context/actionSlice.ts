import { StateCreator } from 'zustand'

export interface ActionSlice {
    actions: string[];
    updateActions: (actions: string[]) => void;
    addAction: (action: string) => void;
    removeAction: (action: string) => void;
}

export const createActionSlice: StateCreator<ActionSlice> = (set) => ({
    actions: [],
    updateActions: (actions) => {
        set({ actions: actions });
    },
    addAction: (action) => {
        set((state) => ({ actions: [...state.actions, action] }));
    },
    removeAction: (action) => {
        set((state) => ({ actions: state.actions.filter(a => a !== action) }));
    }
});