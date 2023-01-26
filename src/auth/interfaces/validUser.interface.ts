import { User } from "@prisma/client";

export interface ValidUser extends Omit<User, 'hashedPassword'> {}