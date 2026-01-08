import { NavigatorScreenParams } from '@react-navigation/native'

export enum RootRoutes {
    AuthStack = 'AuthStack',
    MainTabs = 'MainTabs'
};

export enum AuthRoutes {
    Login = 'Login',
    SignUp = 'SignUp',
    ForgotPassword = 'ForgotPassword',
};

export enum MainRoutes {
    Home = 'Home',
    Explore = 'Explore',
    Notifications = 'Notifications',
    Message = 'Message',
    EventDetails = 'EventDetails',
    GroupDetails = 'GroupDetails',
    Calendar = 'Calendar',
    Profile = 'Profile',
    Group = 'Group',
}

export type RootStackParamList = {
    [RootRoutes.AuthStack]: NavigatorScreenParams<AuthStackParamList>;
    [RootRoutes.MainTabs]: NavigatorScreenParams<MainTabParamList>;
}

export type AuthStackParamList = {
    [AuthRoutes.Login]: undefined;
    [AuthRoutes.SignUp]: undefined;
    [AuthRoutes.ForgotPassword]: undefined;
};

export type MainTabParamList = {
    [MainRoutes.Home]: undefined;
    [MainRoutes.Explore]: undefined;
    [MainRoutes.Notifications]: undefined;
    [MainRoutes.Message]: undefined;
};

export type MainStackParamList = {
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    [MainRoutes.EventDetails]: { eventId: string },
    [MainRoutes.GroupDetails]: { groupId: string },
    [MainRoutes.Calendar]: undefined;
    [MainRoutes.Profile]: undefined;
    [MainRoutes.Group]: undefined;
}