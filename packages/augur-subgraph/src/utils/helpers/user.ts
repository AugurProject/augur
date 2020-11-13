import { User } from "../../../generated/schema";

export function getOrCreateUser(
  id: String,
  createIfNotFound: boolean = true,
  save: boolean = true
): User {
  let user = User.load(id);

  if (user == null && createIfNotFound) {
    user = new User(id);

    if (save) {
      user.save();
    }
  }

  return user as User;
}
