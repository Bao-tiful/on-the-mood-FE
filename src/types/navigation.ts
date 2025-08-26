export type RootStackParamList = {
  // Auth screens
  Entrance: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Onboarding: undefined;
  Withdraw: undefined;
  PasswordUnlockPage: undefined;
  
  // Main tab screens
  Home: undefined;
  MyPage: undefined;
  
  // Content screens
  DetailPage: {
    noteData?: string;
    editableData?: boolean;
  };
  EditPage: {
    selectedDate?: string;
    existingNote?: string;
  };
  
  // Profile screens
  PasswordPage: undefined;
  WithdrawPage: undefined;
};

export type TabParamList = {
  Home: undefined;
  MyPage: undefined;
};