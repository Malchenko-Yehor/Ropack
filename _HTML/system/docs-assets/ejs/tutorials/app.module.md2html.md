{@link app.module.md2html} - Конвертация `markdown` в `html`
[Список доступных параметров конвертации](https://www.npmjs.com/package/marked#options-1)

Метод кэширует результат конвертации для каждого файла, пока текущая `gulp` задача в процессе,
чтобы при следующих обращениях вставлять сразу уже готовую html разметку

Если исходный файл изменить (дату модификации) - кэш будет сброшен
с новой конвертацией и сохранением результата

Пример `mds/test.md` файла

```markdown
# Header

Some text and [link](https://www.npmjs.com/package/marked)

- list item
- list item
```

Вызов метода

```ejs
<div class="wysiwyg">
    <%- app.module.md2html('mds/test.md') %>
</div>
```

Результат

```markup
<div class="wysiwyg">
    <h1>Header</h1>
    <p>Some text and <a href="https://www.npmjs.com/package/marked" target="_blank">link</a></p>
    <ul>
        <li>list item</li>
        <li>list item</li>
    </ul>
</div>
```
