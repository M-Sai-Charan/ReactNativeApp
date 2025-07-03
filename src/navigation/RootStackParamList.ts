// src/navigation/RootStackParamList.ts
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Team: { eventId: string, eventTeams:any };
  Invoice: {
    eventId: string;
    invoice: {
      amount: number;
      paid: boolean;
      paidOn?: string;
      mode?: string;
    };
    date: string;
    type: string;
  };
  Feedback: { eventId: string };
  Gallery:undefined;
  LivePhotoBooth: undefined;
  Profile:undefined;
};
