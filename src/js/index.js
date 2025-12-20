import dialogPolyfill from "dialog-polyfill";

class VanillaModal {
  constructor(options = {}) {
    const defaults = {
      triggerSelector: ".js-vanilla-modal-trigger",
      triggerTargetAttribute: "data-target",
      modalSelector: ".js-vanilla-modal",
      modalCloseElementSelector: ".js-vanilla-modal-close",
      modalOpenClass: "is-open",
      disableScroll: true,
      closePreviousOnOpen: true,
      animate: false,
      onOpen: (modalEl, trigger) => {},
      onClose: (modalEl) => {},
    };

    this.settings = { ...defaults, ...options };

    this.#init();
  }

  #init() {
    document.addEventListener("click", (e) => {
      const target = e.target;

      const trigger = target.closest(this.settings.triggerSelector);
      if (trigger) {
        e.preventDefault();
        return this.openModal(trigger.getAttribute(this.settings.triggerTargetAttribute), trigger);
      }

      const modal = target.closest(this.settings.modalSelector);
      if (!modal) return;

      if (target === modal || target.closest(this.settings.modalCloseElementSelector)) {
        return this.closeModal(modal);
      }
    });
  }

  #getModal(modal) {
    if (modal instanceof Element) return modal;
    if (typeof modal === "string") return document.querySelector(modal);
    return null;
  }

  #lockBody() {
    if (this.settings.disableScroll) {
      document.body.style.overflow = "hidden";
    }
  }

  #unlockBody() {
    if (this.settings.disableScroll) {
      requestAnimationFrame(() => {
        if (!document.querySelector("dialog[open]")) {
          document.body.style.overflow = "";
        }
      });
    }
  }

  openModal(modal, trigger = null) {
    const el = this.#getModal(modal);
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

    this.#lockBody();

    if (!el.__cancelBound) {
      el.addEventListener("cancel", (e) => {
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

  closeModal(modal) {
    const el = this.#getModal(modal);
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
            this.#unlockBody();
            el.close();
          },
          { once: true },
        );
      });
    } else {
      this.#unlockBody();
      el.close();
    }

    this.settings.onClose?.(el);
  }

  closeActiveModal() {
    const activeModal = document.querySelector("dialog[open]");

    if (activeModal) {
      this.closeModal(activeModal);
    }
  }
}

export default VanillaModal;
