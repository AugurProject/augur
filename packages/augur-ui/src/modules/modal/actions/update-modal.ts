export const UPDATE_MODAL = "UPDATE_MODAL";

export function updateModal(modalOptions: any) {
  return { type: UPDATE_MODAL, data: { modalOptions } };
}
