import dialogPolyfill from "dialog-polyfill";

import type { DialogElementExtended, ModalCloseDetail, ModalOpenDetail, VanillaModalOptions } from "./types";

export class VanillaModal {
  private settings: Required<VanillaModalOptions>;
  private clickHandler: (e: MouseEvent) => void;
  private keydownHandler: (e: KeyboardEvent) => void;
  private optionsCache = new WeakMap<HTMLDialogElement, Required<VanillaModalOptions>>();
  private observers = new Map<HTMLDialogElement, MutationObserver>();

  constructor(options: VanillaModalOptions = {}) {
    const defaults: Required<VanillaModalOptions> = {
      modalOpenClass: "is-open",
      disableScroll: true,
      closePreviousOnOpen: true,
      animate: false,
      animationTimeout: 300,
      closeOnEscape: true,
      closeOnBackdropClick: true,
      returnFocus: true,
      type: "dialog",
      onOpen: () => {},
      onClose: () => {},
    };

    this.settings = { ...defaults, ...options };
    this.clickHandler = this.handleClick.bind(this);
    this.keydownHandler = this.handleKeydown.bind(this);
    this.init();
  }

  // ─── Инициализация ───────────────────────────────────────────────────────────

  private init(): void {
    document.addEventListener("click", this.clickHandler);
    document.addEventListener("keydown", this.keydownHandler, true);
  }

  private handleClick(e: MouseEvent): void {
    const target = e.target as Element;

    const opener = target.closest<HTMLElement>("[data-modal-open]");
    if (opener) {
      e.preventDefault();
      const selector = opener.dataset.modalOpen;
      if (selector) this.openModal(selector, opener);
      return;
    }

    const toggler = target.closest<HTMLElement>("[data-modal-toggle]");
    if (toggler) {
      e.preventDefault();
      const selector = toggler.dataset.modalToggle;
      if (selector) this.toggle(selector, toggler);
      return;
    }

    const modal = target.closest<DialogElementExtended>("dialog");
    if (!modal) return;

    const options = this.getModalOptions(modal);
    const isCloseButton = !!target.closest("[data-modal-close]");
    const isBackdropClick = options.closeOnBackdropClick && target === modal;

    if (isCloseButton || isBackdropClick) {
      this.closeModal(modal);
    }
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (e.key !== "Escape") return;

    const activeModal = this.openModals.at(-1);
    if (!activeModal) return;

    e.preventDefault();
    e.stopPropagation();

    const options = this.getModalOptions(activeModal);
    if (options.closeOnEscape) {
      this.closeModal(activeModal);
    }
  }

  // ─── Вспомогательные ─────────────────────────────────────────────────────────

  private getModal(modal: HTMLDialogElement | string): DialogElementExtended | null {
    if (modal instanceof HTMLDialogElement) return modal as DialogElementExtended;
    if (typeof modal === "string") return document.querySelector<DialogElementExtended>(modal);
    return null;
  }

  private lockBody(disableScroll: boolean): void {
    if (disableScroll) {
      document.body.style.overflow = "hidden";
    }
  }

  private unlockBody(disableScroll: boolean): void {
    if (disableScroll) {
      requestAnimationFrame(() => {
        if (this.openModals.length === 0) {
          document.body.style.overflow = "";
        }
      });
    }
  }

  private dispatch<T>(el: HTMLDialogElement, eventName: string, detail: T): void {
    el.dispatchEvent(new CustomEvent<T>(eventName, { bubbles: true, cancelable: true, detail }));
  }

  private closeWithAnimation(
    el: DialogElementExtended,
    options: Required<VanillaModalOptions>,
    onFinish?: () => void,
  ): void {
    let settled = false;

    const finish = (): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      this.unlockBody(options.disableScroll);
      el.close();
      onFinish?.();
    };

    el.addEventListener("transitionend", finish, { once: true });
    el.addEventListener("animationend", finish, { once: true });

    const timer = setTimeout(finish, options.animationTimeout);
  }

  private observeModalOptions(el: HTMLDialogElement): void {
    if (this.observers.has(el)) return;

    const observer = new MutationObserver(() => {
      this.optionsCache.delete(el);
    });

    this.observers.set(el, observer);

    observer.observe(el, {
      attributes: true,
      attributeFilter: [
        "data-modal-animate",
        "data-modal-animation-timeout",
        "data-modal-no-escape",
        "data-modal-no-backdrop-close",
        "data-modal-no-scroll-lock",
        "data-modal-no-return-focus",
        "data-modal-type",
      ],
    });
  }

  private getModalOptions(el: HTMLDialogElement): Required<VanillaModalOptions> {
    const cached = this.optionsCache.get(el);
    if (cached) return cached;

    this.observeModalOptions(el);

    const d = (el as HTMLElement).dataset;
    const options = {
      ...this.settings,
      animate: "modalAnimate" in d ? true : this.settings.animate,
      animationTimeout:
        "modalAnimationTimeout" in d
          ? Number(d.modalAnimationTimeout) || this.settings.animationTimeout
          : this.settings.animationTimeout,
      closeOnEscape: "modalNoEscape" in d ? false : this.settings.closeOnEscape,
      closeOnBackdropClick: "modalNoBackdropClose" in d ? false : this.settings.closeOnBackdropClick,
      disableScroll: "modalNoScrollLock" in d ? false : this.settings.disableScroll,
      returnFocus: "modalNoReturnFocus" in d ? false : this.settings.returnFocus,
      type: "modalType" in d ? (d.modalType === "dialog" ? "dialog" : "panel") : this.settings.type,
    };

    this.optionsCache.set(el, options);
    return options;
  }

  // ─── Публичное API ───────────────────────────────────────────────────────────

  get openModals(): HTMLDialogElement[] {
    return [...document.querySelectorAll<HTMLDialogElement>("dialog[open]")];
  }

  openModal(modal: HTMLDialogElement | string, trigger: Element | null = null): void {
    const el = this.getModal(modal);
    if (!el) {
      console.warn(`[VanillaModal] Modal not found:`, modal);
      return;
    }

    if (el.open) return;

    if (typeof el.showModal !== "function") {
      dialogPolyfill.registerDialog(el);
    }

    const options = this.getModalOptions(el);

    if (options.closePreviousOnOpen) {
      this.closeActiveModal();
    }

    el.__trigger = trigger;

    if (!el.__cancelBound) {
      el.addEventListener("cancel", (e: Event) => {
        e.preventDefault();
      });
      el.__cancelBound = true;
    }

    this.lockBody(options.disableScroll);

    const isBlocking = !options.type || options.type === "dialog";
    if (isBlocking) {
      el.showModal();
    } else {
      el.show();
    }
    void el.offsetHeight;
    requestAnimationFrame(() => {
      el.classList.add(options.modalOpenClass);
    });

    this.dispatch<ModalOpenDetail>(el, "modal:open", { trigger });
    this.settings.onOpen(el, trigger);
  }

  closeModal(modal: HTMLDialogElement | string): void {
    const el = this.getModal(modal);
    if (!el) {
      console.warn(`[VanillaModal] Modal not found:`, modal);
      return;
    }

    if (!el.open) return;

    const trigger = el.__trigger ?? null;
    const options = this.getModalOptions(el);

    el.classList.remove(options.modalOpenClass);

    const returnFocusToTrigger = (): void => {
      if (options.returnFocus && el.__trigger instanceof HTMLElement) {
        el.__trigger.focus();
        el.__trigger = null;
      }
    };

    if (options.animate) {
      this.closeWithAnimation(el, options, returnFocusToTrigger);
    } else {
      this.unlockBody(options.disableScroll);
      el.close();
      returnFocusToTrigger();
    }

    this.dispatch<ModalCloseDetail>(el, "modal:close", { trigger });
    this.settings.onClose(el, trigger);
  }

  closeActiveModal(): void {
    const active = this.openModals.at(-1);
    if (active) this.closeModal(active);
  }

  toggle(modal: HTMLDialogElement | string, trigger: Element | null = null): void {
    const el = this.getModal(modal);
    if (!el) return;
    el.open ? this.closeModal(el) : this.openModal(el, trigger);
  }

  isOpen(modal: HTMLDialogElement | string): boolean {
    const el = this.getModal(modal);
    if (!el) return false;
    return el.open;
  }

  destroy(): void {
    this.openModals.forEach((el) => this.closeModal(el));
    this.observers.forEach((o) => o.disconnect());
    document.removeEventListener("click", this.clickHandler);
    document.removeEventListener("keydown", this.keydownHandler, true);
    this.unlockBody(this.settings.disableScroll);
  }
}
