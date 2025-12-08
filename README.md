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
  shouldLockBody: true,
  bodyLockClass: "is-lock",
  buttonSelector: ".js-vanilla-modal-trigger",
  modalSelector: ".js-vanilla-modal",
  modalCloseElementSelector: ".js-vanilla-modal-close",
  onOpen: (modalEl, triggerButton) => {
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
  display: grid;
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
  background-color: rgba(0, 0, 0, 80%);
  border: none;
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

| Опция                     | Тип      | По умолчанию                | Описание                                            |
| ------------------------- | -------- | --------------------------- | --------------------------------------------------- |
| shouldLockBody            | boolean  | true                        | Блокировать скролл страницы при открытой модалке    |
| bodyLockClass             | string   | "is-lock"                   | CSS-класс для body при блокировке                   |
| buttonSelector            | string   | ".js-vanilla-modal-trigger" | Селектор кнопки, открывающей модальное окно         |
| modalSelector             | string   | ".js-vanilla-modal"         | Селектор модального окна                            |
| modalCloseElementSelector | string   | ".js-vanilla-modal-close"   | Селектор элемента закрытия модалки                  |
| closePreviousOnOpen       | boolean  | true                        | Закрывать активную модалку при открытии новой       |
| onOpen                    | function | ()=>{}                      | Колбэк при открытии: (modalEl, triggerButton) => {} |
| onClose                   | function | ()=>{}                      | Колбэк при закрытии: (modalEl) => {}                |

## Методы

```javascript
// Открыть модалку
modal.openModal("#myModal");

// Закрыть модалку
modal.closeModal("#myModal");

// Закрыть активное модальное окно
modal.closeActiveModal();
```
