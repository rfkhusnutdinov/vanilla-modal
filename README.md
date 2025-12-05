# VanillaModal

Лёгкий и настраиваемый плагин для модальных окон на чистом JavaScript с поддержкой polyfill для `<dialog>`.

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

```html
<button class="js-modal-trigger" data-target="#modal">Кнопка</button>

<dialog class="modal js-modal" id="modal">
  <div class="modal__wrapper">
    <div class="modal__content">
      <button class="modal__close-button js-modal-close-button" type="button" aria-label="Закрыть окно">&times;</button>
      <h2>Заголовок</h2>
      <p>
        Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. За безорфографичный однажды
        он большой деревни строчка ему алфавит! Буквоград даль грустный последний деревни своего, которой снова прямо
        своих заголовок?
      </p>
    </div>
  </div>
</dialog>
```

```javascript
import VanillaModal from "vanilla-modal";
import "vanilla-modal/dist/css/style.css";

const modal = new VanillaModal({
  shouldLockBody: true,
  bodyLockClass: "is-lock",
  buttonSelector: ".js-modal-trigger",
  modalSelector: ".js-modal",
  modalCloseButtonSelector: ".js-modal-close-button",
  onOpen: (modalEl, triggerButton) => {
    console.log(modalEl, triggerButton);
  },
  onClose: (modalEl) => {
    console.log(modalEl);
  },
});
```

## Опции

При создании нового экземпляра можно передать объект с опциями:

| Опция                    | Тип      | По умолчанию             | Описание                                            |
| ------------------------ | -------- | ------------------------ | --------------------------------------------------- |
| shouldLockBody           | boolean  | true                     | Блокировать скролл страницы при открытой модалке    |
| bodyLockClass            | string   | "is-lock"                | CSS-класс для body при блокировке                   |
| buttonSelector           | string   | ".js-modal-trigger"      | Селектор кнопки, открывающей модальное окно         |
| modalSelector            | string   | ".js-modal"              | Селектор модального окна                            |
| modalCloseButtonSelector | string   | ".js-modal-close-button" | Селектор кнопки закрытия модалки                    |
| closePreviousOnOpen      | boolean  | true                     | Закрывать активную модалку при открытии новой       |
| onOpen                   | function | ()=>{}                   | Колбэк при открытии: (modalEl, triggerButton) => {} |
| onClose                  | function | ()=>{}                   | Колбэк при закрытии: (modalEl) => {}                |

## Методы

```javascript
// Открыть модалку
modal.openModal("#myModal");

// Закрыть модалку
modal.closeModal("#myModal");

// Закрыть активное модальное окно
modal.closeActiveModal();
```
