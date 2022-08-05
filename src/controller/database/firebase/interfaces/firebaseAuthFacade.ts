import User from "../../../../model/v1/auth/user";

export default interface FirebaseAuthFacade {
  loginWithEmail(email: string, password: string): Promise<User>;

  //loginWithProvider(): Promise<User>;

  /**
   * Not secure in anyways but can be secured externally
   * @param email 
   * @param password 
   * @param redirectUrl 
   */
  registerWithEmail(email: string, password: string, redirectUrl?: string): Promise<void>;

  verifyApiKey(userId: string, apiKey: string): Promise<boolean>;

  reauthenticationWithEmail(email: string, password: string): Promise<User>;

  updatePassword(user: User, newPassword: string): void;
  
  updateUser(user: User): Promise<User>;
  
  deleteUser(uid: string, apiKey: string): Promise<void>;

  logout(user: User): void;
}