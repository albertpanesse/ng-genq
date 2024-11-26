export * from "./auth.machine";
export * from "./file-manager.machine";

export interface IRootContext<T1, T2> {
  services: T1;
  context: T2; 
}