import { User } from "@prisma/client";
import { RouterOutputs } from "../../../../../utils/api";

// First dumbfuckery found, why can't I inferr the "user" type from RouterOutputs below???
export interface InferredFuckingUser {
  receivedPunishments: {
    approved: boolean;
  }[];
}

export function sortUsers(
  organization: RouterOutputs["organizations"]["getOrganizationUsersWithPunishmentData"]["organization"],
  direction: "asc" | "desc"
) {
  function unapprovedPunishments(user: InferredFuckingUser) {
    return user.receivedPunishments.filter((p) => !p.approved).length;
  }

  function sortUsers(a: InferredFuckingUser, b: InferredFuckingUser) {
    if (unapprovedPunishments(a) > unapprovedPunishments(b)) {
      return direction == "asc" ? 1 : -1;
    }

    if (unapprovedPunishments(b) > unapprovedPunishments(a)) {
      return direction == "asc" ? -1 : 1;
    } else return 0;
  }
  const sortedUsers = organization?.users.sort(sortUsers);

  return sortedUsers;
}
