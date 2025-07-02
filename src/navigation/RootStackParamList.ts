// src/navigation/RootStackParamList.ts
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  EventDetails: { eventId: string };
  Team: { eventId: string };
  Invoice: { eventId: string };
  Feedback: { eventId: string };
};
