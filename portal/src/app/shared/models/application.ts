export default interface Application {
  id: string;
  name: string;
  user?: string;
  secret?: string;
  middlewareAdapter?: string;
}
