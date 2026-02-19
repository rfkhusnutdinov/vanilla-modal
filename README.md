# VanillaModal

Лёгкий и настраиваемый плагин для модальных окон на чистом JavaScript. Построен на нативном `<dialog>` с полифилом для старых браузеров.

[Documentation](https://rfkhusnutdinov.github.io/vanilla-modal/docs/)

- Нативный <dialog> + полифил `dialog-polyfill`.
- Блокировка скролла страницы
- Возврат фокуса на триггер
- Кастомные события (CustomEvent)
- Настройка через data-атрибуты
- Поддержка анимаций открытия/закрытия
- Блокирующий и не блокирующий режимы
- Автозакрытие предыдущего окна

## Установка

```bash
npm install https://github.com/rfkhusnutdinov/vanilla-modal
```

---

## Быстрый старт

### 1. Инициализация

```js
import { VanillaModal } from "vanilla-modal";

// Сброс стилей для dialog
import "vanilla-modal/css";

const modal = new VanillaModal({
  modalOpenClass: "is-open",
  disableScroll: true,
  animate: true,
  animationTimeout: 300,
});
```

### 2. HTML-разметка

Добавьте `data-modal-open` на кнопку и `id` на диалог:

```html
<!-- Кнопка-триггер -->
<button data-modal-open="#my-modal">Открыть</button>

<!-- Кнопка-переключатель -->
<button data-modal-toggle="#my-modal">Переключить</button>

<!-- Диалог -->
<dialog id="my-modal" aria-labelledby="modal-title">
  <div class="modal__content">
    <!-- Кнопка закрытия -->
    <button data-modal-close aria-label="Закрыть">&times;</button>
    <h2 id="modal-title">Заголовок</h2>
    <p>Содержимое модального окна.</p>
  </div>
</dialog>
```

> [!NOTE]
> Всегда оборачивайте содержимое в дочерний `div`. Клик непосредственно на `<dialog>` (область фона) определяется как клик на backdrop и закрывает окно.

---

## Опции конструктора

Все опции опциональны. Значения ниже — дефолтные.

| Опция                | Тип      | По умолчанию | Описание                                                                    |
| -------------------- | -------- | ------------ | --------------------------------------------------------------------------- |
| modalOpenClass       | string   | "is-open"    | CSS-класс, добавляемый на `<dialog>` при открытии                           |
| disableScroll        | boolean  | true         | Блокировать прокрутку страницы при открытом окне                            |
| closePreviousOnOpen  | boolean  | true         | Закрывать предыдущее открытое окно при открытии нового                      |
| animate              | boolean  | false        | Ждать завершения CSS-анимации перед скрытием `<dialog>`                     |
| animationTimeout     | number   | 300          | Максимальное время (мс) ожидания `animationend` / `transitionend`           |
| closeOnEscape        | boolean  | true         | Закрывать окно при нажатии Escape                                           |
| closeOnBackdropClick | boolean  | true         | Закрывать при клике на затемнённый фон (клик прямо на `<dialog>`)           |
| returnFocus          | boolean  | true         | Возвращать фокус на триггер-кнопку после закрытия                           |
| type                 | string   | "dialog"     | `"dialog"` — блокирующий (`showModal`), `"panel"` — не блокирующий (`show`) |
| onOpen               | function | () => {}     | Колбэк при открытии. Аргументы: `(modalEl, triggerEl)`                      |
| onClose              | function | () => {}     | Колбэк при закрытии. Аргументы: `(modalEl, triggerEl)`                      |

---

## Data-атрибуты

### На триггерах

| Атрибут                 | Описание                                       |
| ----------------------- | ---------------------------------------------- |
| data-modal-open="#id"   | Открыть модальное окно с указанным селектором  |
| data-modal-toggle="#id" | Переключить состояние окна (открыть / закрыть) |
| data-modal-close        | Закрыть ближайшее родительское модальное окно  |

### На элементе <dialog>

Переопределяют глобальные настройки для конкретного окна:

| Атрибут                      | Описание                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| data-modal-animate           | Включить режим анимированного закрытия                       |
| data-modal-animation-timeout | Переопределить таймаут анимации (мс)                         |
| data-modal-no-escape         | Запретить закрытие по клавише Escape                         |
| data-modal-no-backdrop-close | Запретить закрытие по клику на фон                           |
| data-modal-no-scroll-lock    | Не блокировать прокрутку для этого окна                      |
| data-modal-no-return-focus   | Не возвращать фокус на триггер после закрытия                |
| data-modal-type="panel"      | Открыть не блокирующим методом `show()` вместо `showModal()` |

```html
<dialog
  id="sidebar"
  data-modal-animate
  data-modal-animation-timeout="400"
  data-modal-no-backdrop-close
  data-modal-no-escape
  data-modal-type="panel"
>
  ...
</dialog>
```

---

## Публичные методы

| Метод                      | Описание                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| openModal(modal, trigger?) | Открыть окно. `modal` — CSS-селектор или `HTMLDialogElement`. `trigger` — элемент, на который вернётся фокус |
| closeModal(modal)          | Закрыть окно по селектору или элементу                                                                       |
| closeActiveModal()         | Закрыть последнее открытое модальное окно                                                                    |
| toggle(modal, trigger?)    | Переключить состояние окна                                                                                   |
| isOpen(modal)              | Вернуть `true`, если окно открыто                                                                            |
| openModals (getter)        | Массив всех открытых в данный момент `HTMLDialogElement`                                                     |
| destroy()                  | Закрыть все окна и отключить все обработчики событий                                                         |

```js
const modal = new VanillaModal();

// Открыть
modal.openModal("#my-modal");

// Закрыть
modal.closeModal("#my-modal");

// Проверить состояние
if (modal.isOpen("#my-modal")) {
  console.log("Открыто!");
}

// Получить все открытые окна
const all = modal.openModals; // → HTMLDialogElement[]

// Уничтожить плагин
modal.destroy();
```

---

## События

Плагин генерирует `CustomEvent` прямо на элементе `<dialog>`. Все события всплывают (`bubbles: true`).

| Событие     | detail                       | Когда                                 |
| ----------- | ---------------------------- | ------------------------------------- |
| modal:open  | { trigger: Element \| null } | После вызова `showModal()` / `show()` |
| modal:close | { trigger: Element \| null } | Перед закрытием (до анимации)         |

```js
const el = document.querySelector("#my-modal");

el.addEventListener("modal:open", (e) => {
  console.log("Открыто через:", e.detail.trigger);
});

el.addEventListener("modal:close", (e) => {
  console.log("Закрыто");
});
```

---

## Анимации

Используйте `@keyframes`, привязанные к атрибуту `[open]` — анимация стартует в тот же кадр, что и открытие диалога, без моргания. Для анимации закрытия включите опцию `animate: true` (или атрибут `data-modal-animate` на диалоге).

> [!WARNING]
> Для `transform`-анимаций на элементах с `position: absolute` используйте `@keyframes`, а не `transition`. Браузер не успевает зафиксировать начальное состояние при первом рендере диалога, и transition пропускается. Анимация `opacity` работает с transition без ограничений.

### Анимация затемнения фона

```css
.modal {
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.modal.is-open {
  background-color: rgba(0, 0, 0, 0.8);
}
```

### Анимация через opacity (простой вариант)

Для центральных модалок достаточно `opacity` — работает через `transition` без каких-либо проблем с браузерным layout:

```css
.modal__content {
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.modal.is-open .modal__content {
  opacity: 1;
  transform: scale(1);
}
```

### Анимация через @keyframes (для slide + opacity)

Для slide-анимаций на элементах с `position: absolute` используйте `@keyframes` — анимация стартует синхронно с открытием, без моргания. `transform` и `opacity` можно комбинировать в одном keyframe:

```css
/* Въезд — сразу при [open], без ожидания is-open */
.modal[open] .modal__content {
  animation: modal-slide-in 0.3s ease forwards;
}

/* Выезд — is-open убран, но [open] ещё есть */
.modal[open]:not(.is-open) .modal__content {
  animation: modal-slide-out 0.3s ease forwards;
}

/* Пример: въезд справа + fade */
@keyframes modal-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes modal-slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
```

---

## Направления анимации

Добавьте атрибут `data-modal-direction` на диалог. Каждое направление требует своего позиционирования `.modal__content` и соответствующих `@keyframes`.

### Позиционирование .modal\_\_content

Для left/right контент занимает всю высоту экрана с фиксированной шириной. Для top/bottom — всю ширину с автоматической высотой:

```css
/* ── Базовые стили .modal для всех направлений ──── */
[data-modal-direction] .modal__content {
  position: absolute;
  overflow-y: auto;
  background: #fff;
  padding: 40px;
}

/* ── right: панель справа, полная высота ─────────── */
[data-modal-direction="right"] {
  justify-content: flex-end;
}
[data-modal-direction="right"] .modal__content {
  top: 0;
  right: 0;
  width: 420px;
  max-width: 90vw;
  height: 100%;
}

/* ── left: панель слева, полная высота ───────────── */
[data-modal-direction="left"] {
  justify-content: flex-start;
}
[data-modal-direction="left"] .modal__content {
  top: 0;
  left: 0;
  width: 420px;
  max-width: 90vw;
  height: 100%;
}

/* ── bottom: панель снизу, полная ширина ─────────── */
[data-modal-direction="bottom"] {
  align-items: flex-end;
}
[data-modal-direction="bottom"] .modal__content {
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 80vh;
}

/* ── top: панель сверху, полная ширина ───────────── */
[data-modal-direction="top"] {
  align-items: flex-start;
}
[data-modal-direction="top"] .modal__content {
  top: 0;
  left: 0;
  width: 100%;
  max-height: 80vh;
}
```

### Keyframes с opacity для всех направлений

```css
/* ── Keyframes ──────────────────────────────────────────────────────── */
@keyframes modal-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes modal-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes modal-in-bottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes modal-in-top {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes modal-out-right {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
@keyframes modal-out-left {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
@keyframes modal-out-bottom {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}
@keyframes modal-out-top {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}

/* ── Въезд ──────────────────────────────────────────────────────────── */
.modal[open][data-modal-direction="right"] .modal__content {
  animation: modal-in-right 0.35s ease forwards;
}
.modal[open][data-modal-direction="left"] .modal__content {
  animation: modal-in-left 0.35s ease forwards;
}
.modal[open][data-modal-direction="bottom"] .modal__content {
  animation: modal-in-bottom 0.35s ease forwards;
}
.modal[open][data-modal-direction="top"] .modal__content {
  animation: modal-in-top 0.35s ease forwards;
}

/* ── Выезд ──────────────────────────────────────────────────────────── */
.modal[open]:not(.is-open)[data-modal-direction="right"] .modal__content {
  animation: modal-out-right 0.35s ease forwards;
}
.modal[open]:not(.is-open)[data-modal-direction="left"] .modal__content {
  animation: modal-out-left 0.35s ease forwards;
}
.modal[open]:not(.is-open)[data-modal-direction="bottom"] .modal__content {
  animation: modal-out-bottom 0.35s ease forwards;
}
.modal[open]:not(.is-open)[data-modal-direction="top"] .modal__content {
  animation: modal-out-top 0.35s ease forwards;
}
```

---

## Стилизация

Полный пример стилизованного диалога-боковой панели, въезжающей справа:

```html
<button data-modal-open="#modal-sidebar">Открыть панель</button>

<dialog
  class="modal"
  id="modal-sidebar"
  aria-labelledby="sidebar-title"
  data-modal-animate
  data-modal-animation-timeout="400"
  data-modal-direction="right"
>
  <div class="modal__content">
    <button class="modal__close" data-modal-close aria-label="Закрыть">&times;</button>
    <h2 id="sidebar-title">Боковая панель</h2>
    <p>Содержимое</p>
  </div>
</dialog>
```

```css
.modal {
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  height: 100dvh;
  max-width: unset;
  max-height: unset;
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
  overflow: hidden;
  transition: background-color 0.4s ease;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
}

.modal[open] {
  display: flex;
}

.modal.is-open {
  background-color: rgba(0, 0, 0, 0.8);
}

.modal::backdrop,
.modal + .backdrop {
  pointer-events: none;
  background: none;
}

.modal__content {
  position: relative;
  width: 400px;
  height: 100%;
  padding: 50px;
  background: #fff;
  overflow-y: auto;
}

.modal[open][data-modal-direction="right"] .modal__content {
  animation: modal-in-right 0.35s ease forwards;
}

.modal[open]:not(.is-open)[data-modal-direction="right"] .modal__content {
  animation: modal-out-right 0.35s ease forwards;
}

@keyframes modal-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes modal-out-right {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
```

```js
import { VanillaModal } from "vanilla-modal";
import "vanilla-modal/css";

const modal = new VanillaModal({
  onOpen: (el, trigger) => console.log("Открыто:", el.id),
  onClose: (el) => console.log("Закрыто:", el.id),
});
```

---

## Замечания

> [!NOTE]
> Backdrop-клик — определяется как клик непосредственно на `<dialog>`, а не на вложенный контент. Всегда оборачивайте содержимое в дочерний `div`.

> [!NOTE]
> **Клавиша Escape** перехватывается на стадии capture с `e.stopPropagation()`. Браузерное поведение по умолчанию полностью отменено — управление в руках плагина.

> [!TIP]
> **Разблокировка скролла** происходит через `requestAnimationFrame` и только если больше не осталось открытых модальных окон — корректно работает при стеке модалок.

> [!TIP]
> **Кеш настроек** хранится в `WeakMap` и инвалидируется автоматически через `MutationObserver` при изменении data-атрибутов на диалоге.

> [!NOTE]
> **Полифил** `dialog-polyfill` применяется автоматически, если браузер не поддерживает нативный `<dialog>`.
