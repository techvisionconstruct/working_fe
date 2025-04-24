declare global {
  interface Window {
    templateTourEndCallback?: () => void;
    templateTourCreateCallback?: () => void;
    proposalTourEndCallback?: () => void;
    proposalTourCreateCallback?: () => void;
  }
}