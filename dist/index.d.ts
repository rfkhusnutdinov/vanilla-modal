type ModalOpenDetail = {
    trigger: Element | null;
};
type ModalCloseDetail = {
    trigger: Element | null;
};
declare global {
    interface HTMLElementEventMap {
        "modal:open": CustomEvent<ModalOpenDetail>;
        "modal:close": CustomEvent<ModalCloseDetail>;
    }
}
type VanillaModalOptions = {
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
type DialogElementExtended = HTMLDialogElement & {
    __cancelBound?: boolean;
    __trigger?: Element | null;
};

declare class VanillaModal {
    private settings;
    private clickHandler;
    private keydownHandler;
    private optionsCache;
    private observers;
    constructor(options?: VanillaModalOptions);
    private init;
    private handleClick;
    private handleKeydown;
    private getModal;
    private lockBody;
    private unlockBody;
    private dispatch;
    private closeWithAnimation;
    private observeModalOptions;
    private getModalOptions;
    get openModals(): HTMLDialogElement[];
    openModal(modal: HTMLDialogElement | string, trigger?: Element | null): void;
    closeModal(modal: HTMLDialogElement | string): void;
    closeActiveModal(): void;
    toggle(modal: HTMLDialogElement | string, trigger?: Element | null): void;
    isOpen(modal: HTMLDialogElement | string): boolean;
    destroy(): void;
}

export { VanillaModal };
export type { DialogElementExtended, ModalCloseDetail, ModalOpenDetail, VanillaModalOptions };
