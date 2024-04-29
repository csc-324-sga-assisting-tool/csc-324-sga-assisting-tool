import {DataModel, User} from '.';
import {FirestoreAuthModel} from './auth_model.firebase';
/*
AuthModel
*/

export interface IAuthModel {
  createUser(
    email: string,
    password: string,
    user: User,
    dm: DataModel
  ): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  getSignedInUser(): Promise<string>;
}

export const AuthModel = new FirestoreAuthModel();
