import { User } from "@prisma/client";

export interface validUser extends Omit<User, 'hashedPassword'> {}