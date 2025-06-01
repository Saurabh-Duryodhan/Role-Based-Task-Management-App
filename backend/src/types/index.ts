export type PORT = number;
export const PORT: PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000; 