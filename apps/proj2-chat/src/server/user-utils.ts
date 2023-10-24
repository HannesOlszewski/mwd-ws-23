import type { User } from "../shared/types";

/**
 * Represents a repository for user data.
 */
export class UserRepository {
  // Super safe way to store user data. Maps usernames to plain text passwords. :)
  private users: User[] = [
    { username: "admin", password: "admin" },
    { username: "user", password: "user" },
  ];

  /**
   * Returns an array of all users.
   * @returns An array of User objects.
   */
  public getUsers(): User[] {
    return this.users;
  }
}
