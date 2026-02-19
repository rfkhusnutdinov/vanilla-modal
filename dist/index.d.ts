interface VanillaModalOptions {
    triggerSelector?: string;
    triggerTargetAttribute?: string;
    modalSelector?: string;
    modalCloseElementSelector?: string;
    modalOpenClass?: string;
    disableScroll?: boolean;
    closePreviousOnOpen?: boolean;
    animate?: boolean;
    onOpen?: (modalEl: HTMLDialogElement, trigger: Element | null) => void;
    onClose?: (modalEl: HTMLDialogElement) => void;
}
declare class VanillaModal {
    private settings;
    constructor(options?: VanillaModalOptions);
    private init;
    private getModal;
    private lockBody;
    private unlockBody;
    openModal(modal: Element | string | null, trigger?: Element | null): void;
    closeModal(modal: Element | string): void;
    closeActiveModal(): void;
}

export { VanillaModal };
