import dialogPolyfill from "dialog-polyfill";

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

interface DialogElementExtended extends HTMLDialogElement {
  __cancelBound?: boolean;
}

export class VanillaModal {
  private settings: Required<VanillaModalOptions>;

  constructor(options: VanillaModalOptions = {}) {
    const defaults: Required<VanillaModalOptions> = {
      triggerSelector: ".js-vanilla-modal-trigger",
      triggerTargetAttribute: "data-target",
      modalSelector: ".js-vanilla-modal",
      modalCloseElementSelector: ".js-vanilla-modal-close",
      modalOpenClass: "is-open",
      disableScroll: true,
      closePreviousOnOpen: true,
      animate: false,
      onOpen: (_modalEl: HTMLDialogElement, _trigger: Element | null) => {},
      onClose: (_modalEl: HTMLDialogElement) => {},
    };
    this.settings = { ...defaults, ...options };
    this.init();
  }

  private init(): void {
    document.addEventListener("click", (e: PointerEvent) => {
      const target = e.target as Element;
      const trigger = target.closest(this.settings.triggerSelector);

      if (trigger) {
        e.preventDefault();
        return this.openModal(trigger.getAttribute(this.settings.triggerTargetAttribute), trigger);
      }

      const modal = target.closest(this.settings.modalSelector);
      if (!modal) return;

      if (target === modal || target.closest(this.settings.modalCloseElementSelector)) {
        return this.closeModal(modal as HTMLDialogElement);
      }
    });
  }

  private getModal(modal: Element | string | null): DialogElementExtended | null {
    if (modal instanceof Element) return modal as DialogElementExtended;
    if (typeof modal === "string") return document.querySelector<DialogElementExtended>(modal);
    return null;
  }

  private lockBody(): void {
    if (this.settings.disableScroll) {
      document.body.style.overflow = "hidden";
    }
  }

  private unlockBody(): void {
    if (this.settings.disableScroll) {
      requestAnimationFrame(() => {
        if (!document.querySelector("dialog[open]")) {
          document.body.style.overflow = "";
        }
      });
    }
  }

  openModal(modal: Element | string | null, trigger: Element | null = null): void {
    const el = this.getModal(modal);
    if (!el) {
      console.warn(`Modal not found: ${modal}`);
      return;
    }

    if (typeof el.showModal !== "function") {
      dialogPolyfill.registerDialog(el);
    }

    if (this.settings.closePreviousOnOpen) {
      this.closeActiveModal();
    }

    this.lockBody();

    if (!el.__cancelBound) {
      el.addEventListener("cancel", (e: Event) => {
        e.preventDefault();
        this.closeModal(el);
      });
      el.__cancelBound = true;
    }

    el.showModal();

    requestAnimationFrame(() => {
      el.classList.add(this.settings.modalOpenClass);
    });

    this.settings.onOpen?.(el, trigger);
  }

  closeModal(modal: Element | string): void {
    const el = this.getModal(modal);
    if (!el) {
      console.warn(`Modal not found: ${modal}`);
      return;
    }

    el.classList.remove(this.settings.modalOpenClass);

    if (this.settings.animate) {
      requestAnimationFrame(() => {
        el.addEventListener(
          "transitionend",
          () => {
            this.unlockBody();
            el.close();
          },
          { once: true },
        );
      });
    } else {
      this.unlockBody();
      el.close();
    }

    this.settings.onClose?.(el);
  }

  closeActiveModal(): void {
    const activeModal = document.querySelector<HTMLDialogElement>("dialog[open]");
    if (activeModal) {
      this.closeModal(activeModal);
    }
  }
}
