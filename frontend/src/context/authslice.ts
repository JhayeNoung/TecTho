import { StateCreator } from 'zustand'
import apiMovie from '@/services/api-movie';

interface AuthSlice {
    accessToken: string | null;
    email: string | null;
    updateAccessToken: (token: string) => void;
    updateEmail: (email: string) => void;
    logout: () => void;
    fetchAccessToken: () => Promise<void>;
}


export const authSlice: StateCreator<AuthSlice> = (set) => ({
    accessToken: null,
    email: null,
    updateAccessToken: (token) => {
        set({ accessToken: token }); // store the token in the state (or in-memory), not in the local storage
    },
    updateEmail: (email) => {
        set({ email: email }) // store the email in the state (or in-memory)
        localStorage.setItem("email", email); // store the email in the local storage
    },
    logout: () => {
        set({ accessToken: null, email: null }); // clear the token and email from the state (or in-memory)
        localStorage.removeItem("email"); // clear the email from the local storage
    },
    fetchAccessToken: async () => {
        try {
            const response = await apiMovie.post('users/refresh-token', null, { withCredentials: true });
            set({ accessToken: response.data });
        }
        catch (error: any) {
            console.error(error.response.data.error);
        }
    }
});