export type ModalOpenDetail = {
  trigger: Element | null;
};

export type ModalCloseDetail = {
  trigger: Element | null;
};

declare global {
  interface HTMLElementEventMap {
    "modal:open": CustomEvent<ModalOpenDetail>;
    "modal:close": CustomEvent<ModalCloseDetail>;
  }
}

export type VanillaModalOptions = {
  modalOpenClass?: string;
  disableScroll?: boolean;
  closePreviousOnOpen?: boolean;
  animate?: boolean;
  animationTimeout?: number;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  returnFocus?: boolean;
  type?: "dialog" | "panel";
  onOpen?: (modalEl: HTMLDialogElement, trigger: Element | null) => void;
  onClose?: (modalEl: HTMLDialogElement, trigger: Element | null) => void;
};

export type DialogElementExtended = HTMLDialogElement & {
  __cancelBound?: boolean;
  __trigger?: Element | null;
};

export {};
