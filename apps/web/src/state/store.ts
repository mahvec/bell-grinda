import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GeneratedWorkout, UserProfile, WorkoutSession } from "@bellgrinda/domain";

type AppState = {
  hydrated: boolean;
  profile: UserProfile | null;
  preparedWorkout: GeneratedWorkout | null;
  activeSession: WorkoutSession | null;
};

const initialState: AppState = {
  hydrated: false,
  profile: null,
  preparedWorkout: null,
  activeSession: null
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<{ profile: UserProfile | null; activeSession: WorkoutSession | null }>) {
      state.profile = action.payload.profile;
      state.activeSession = action.payload.activeSession;
      state.hydrated = true;
    },
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
    setPreparedWorkout(state, action: PayloadAction<GeneratedWorkout | null>) {
      state.preparedWorkout = action.payload;
    },
    setActiveSession(state, action: PayloadAction<WorkoutSession | null>) {
      state.activeSession = action.payload;
    }
  }
});

export const { hydrate, setProfile, setPreparedWorkout, setActiveSession } = appSlice.actions;
export const store = configureStore({ reducer: { app: appSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
