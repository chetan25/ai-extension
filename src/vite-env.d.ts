/// <reference types="vite/client" />

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runtime: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contextMenus: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scripting: any;
  }
}
