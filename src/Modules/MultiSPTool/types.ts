import type { RouterInputs } from "../../utils/api";

export type SPInput = RouterInputs["punishments"]["createPunishment"];

export type CreateMultipleSPUserEntry = {
  id: string;
  name: string;
  sp: SPInput[];
};
