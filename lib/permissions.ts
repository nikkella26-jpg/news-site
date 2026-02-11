import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  project: ["create", "share", "update", "delete"],
  user: ["create", "list", "update", "delete"],
  session: ["list", "delete"],
  impersonate: ["create", "list", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  project: ["create"],
});

export const admin = ac.newRole({
  project: ["create", "update", "delete"],
  user: ["create", "list", "update", "delete"],
  session: ["list", "delete"],
  impersonate: ["create", "list", "delete"],
});

export const editor = ac.newRole({
  project: ["create", "update", "delete"],
});

// Map the internal roles to the database values
export const roles = {
  USER: user,
  ADMIN: admin,
  EDITOR: editor,
};
