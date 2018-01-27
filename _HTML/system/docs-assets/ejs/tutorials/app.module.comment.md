{@link app.module.comment} - Вставка комментария.

> Если происходит компиляция для `ftp` - коммента не будет  
> чтобы не увиличивать размер файла разметки

_Примеры:_

```ejs
<%- app.module.comment('Важная информация') %>
```

```markup
<!-- Важная информация -->
```

Комментарий в несколько строк

```ejs
<%- app.module.comment('Я не шучу!', 'Это действительно очень', 'важная информация'); %>
```

```markup
<!-- Я не шучу!
    Это действительно очень
    важная информация -->
```

Аргументы массивом

```ejs
<%- app.module.comment(['И так тоже', 'будет работать']); %>
```

```markup
<!-- И так тоже
    будет работать -->
```


----


#### {@link app.module.comment.php}

Вставка PHP комментария.
_Если ситаксис PHP отключен - будет HTML комментарий._

_Пример_

```ejs
<%- app.module.comment.php('Комментарий, которого не будет видно в браузере'); %>
```

```php
<?php /* Комментарий, которого не будет видно в браузере */ ?>
```


----


#### {@link app.module.comment.todo}

Вставка To Do комментария.

На основе таких комментариев - можно генирировать
список задач на программирования, а также различные редакторы и IDE
могут сканировать разметку на наличие таких задач

_Пример_

```ejs
<%- app.module.comment.todo('Этот пункт нужно выполнить'); %>
```

```ejs
<%- app.module.comment.todo('Этот пункт нужно выполнить', 'Действие первое...', 'Действие второе...'); %>
```

```markup
<!-- @TODO Этот пункт нужно выполнить
     Действие первое...
     Действие второе... -->
```

----


#### {@link app.module.comment.todoPhp}

Вставка To Do PHP комментария.
_Если ситаксис PHP отключен - будет To Do HTML комментарий_

_Пример_

```ejs
<%- app.module.comment.todoPhp('Комментарий, которого не будет видно в браузере'); %>
```

```php
<?php /* @TODO Комментарий, которого не будет видно в браузере */ ?>
```