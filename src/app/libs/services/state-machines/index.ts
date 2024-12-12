export * from "./auth.machine";
export * from "./file-explorer.machine";

export interface IRootContext<T1, T2> {
  services: T1;
  context: T2; 
}