export type RootStackParamList = {
  // Auth screens
  Entrance: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  SuccessChangePassword: undefined;
  Onboarding: undefined;
  Withdraw: undefined;
  PasswordUnlockPage: undefined;

  // Main tab screens
  Home: undefined;
  MyPage: { currentTemperature?: number };

  // Content screens
  DetailPage: {
    noteData?: string;
    editableData?: boolean;
  };
  EditPage: {
    selectedDate?: string;
    noteData?: string;
    locationData?: string;
  };

  // Profile screens
  PasswordPage: { currentTemperature?: number };
  WithdrawPage: { currentTemperature?: number };
};

export type TabParamList = {
  Home: undefined;
  MyPage: undefined;
};
