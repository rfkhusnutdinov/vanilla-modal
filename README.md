# VanillaModal

Лёгкий и настраиваемый плагин для модальных окон на чистом JavaScript с polyfill для нативного `<dialog>`.

**Особенности:**

- Минималистичный, без внешних зависимостей кроме `dialog-polyfill`.
- Адаптивная блокировка скролла страницы при открытом модальном окне.
- Автоматическое закрытие предыдущего модального окна.
- События `onOpen` и `onClose` для кастомной логики.

---

## Установка

```bash
npm install https://github.com/rfkhusnutdinov/vanilla-modal
```

## Использование в проекте

Базовый минимальный пример работы модального окна

```html
<button class="js-vanilla-modal-trigger" data-target="#modal">Открыть модальное окно</button>

<dialog class="js-vanilla-modal" id="modal" aria-labelledby="modal-title">
  <div>
    <!-- Обязательно добавить этот div чтобы правильно отрабатывало закрытие модального окна при нажатии вне контентной части  -->
    <button class="js-vanilla-modal-close" type="button" aria-label="Закрыть окно">&times;</button>
    <h2 id="modal-title">Заголовок</h2>
  </div>
</dialog>
```

```javascript
import VanillaModal from "vanilla-modal";
import "vanilla-modal/dist/css/style.css";

const modal = new VanillaModal({
  triggerSelector: ".js-vanilla-modal-trigger",
  triggerTargetAttribute: "data-target",
  modalSelector: ".js-vanilla-modal",
  modalCloseElementSelector: ".js-vanilla-modal-close",
  modalOpenClass: "is-open",
  diableScroll: true,
  closePreviousOnOpen: true,
  animate: false,
  onOpen: (modalEl, trigger) => {
    console.log(modalEl, triggerButton);
  },
  onClose: (modalEl) => {
    console.log(modalEl);
  },
});
```

Также можете стилизовать модальное окно под свои потребности, например:

```html
<dialog class="modal js-vanilla-modal" id="modal-styled" aria-labelledby="modal-styled-title">
  <div class="modal__content">
    <button class="modal__close-button js-vanilla-modal-close" type="button" aria-label="Закрыть окно">&times;</button>
    <h2 class="modal__title" id="modal-styled-title">Модальное окно со стилизацией</h2>
    <p class="model__text">Далеко-далеко за, словесными горами в стране гласных и согласных живут рыбные тексты.</p>
  </div>
</dialog>
```

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: unset;
  height: 100vh;
  height: 100dvh;
  max-height: unset;
  padding: 15px;
  margin: 0;
  overflow: auto;
  background-color: transparent;
  border: none;
  transition: background-color 0.3s ease;
}

.modal.is-open {
  background-color: rgba(0, 0, 0, 80%);
}

.modal.is-open .modal__content {
  transform: scale(1);
  opacity: 1;
}

.modal[open] {
  display: grid;
}

.modal::backdrop,
.modal + .backdrop {
  pointer-events: none;
  background: none;
}

.modal__content {
  background-color: white;
  max-width: 600px;
  width: 100%;
  padding: 50px;
  position: relative;
  transform: scale(0.9);
  opacity: 0;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal__close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  line-height: 32px;
  vertical-align: middle;
  background: none;
  font-size: 32px;
  border: none;
  cursor: pointer;
}

.modal__title {
  margin-bottom: 10px;
}

.modal__text {
  font-weight: 300;
}
```

Оба этих примера вы можете посмотреть в [Демо](https://rfkhusnutdinov.github.io/vanilla-modal/demos/)

## Опции

При создании нового экземпляра можно передать объект с опциями:

| Опция                     | Тип      | По умолчанию                | Описание                                              |
| ------------------------- | -------- | --------------------------- | ----------------------------------------------------- |
| triggerSelector           | string   | ".js-vanilla-modal-trigger" | Селектор триггера, открывающей модальное окно         |
| triggerTargetAttribute    | string   | "data-target"               | Атрибут триггера, открывающего модальное окно         |
| modalSelector             | string   | ".js-vanilla-modal"         | Селектор модального окна                              |
| modalCloseElementSelector | string   | ".js-vanilla-modal-close"   | Селектор элемента закрытия модального окна            |
| modalOpenClass            | string   | "is-open"                   | Класс, добавляемый при открытии модального окна       |
| disableScroll             | boolean  | true                        | Отключить скролл при открытии модального окна         |
| closePreviousOnOpen       | boolean  | true                        | Закрыть предыдущее модальное окно при открытии нового |
| animate                   | boolean  | false                       | Анимировать открытие/закрытие модального окна         |
| onOpen                    | function | ()=>{}                      | Колбэк при открытии: (modalEl, trigger) => {}         |
| onClose                   | function | ()=>{}                      | Колбэк при закрытии: (modalEl) => {}                  |

## Методы

```javascript
// Открыть модалку
modal.openModal("#myModal");

// Закрыть модалку
modal.closeModal("#myModal");

// Закрыть активное модальное окно
modal.closeActiveModal();
```
