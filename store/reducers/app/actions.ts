export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';

export function toggleSidebar(open: boolean | undefined): PayloadAction<boolean | undefined> {
  return {
    type: TOGGLE_SIDEBAR,
    payload: open,
  }
}