export type LaunchMessage = {
  type: 'LAUNCH',
  width: number;
  height: number;
  tabId: number;
}

export type StartObservingMessage = {
  type: 'START_OBSERVING',
  windowId: number,
}