export type JwtToken = {
  id: string;
  user_role: "user" | "admin";
  phone: string;
};
