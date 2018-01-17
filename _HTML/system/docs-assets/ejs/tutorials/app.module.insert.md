{@link app.module.insert} - Подключение текстового контента из внешних файлов"

Вставка текстового файла из папки `Media` в код разметки

Если вы используете `app.data.WezomCMS`
тогда будут вставлен код `php` метода [`file_get_contents`](http://php.net/manual/ru/function.file-get-contents.php)

Если нет, тогда метод служит оберткой
родному методу плагина [gulp-ejs-monster - include](https://github.com/dutchenkoOleg/gulp-ejs-monster#localsinclude-filepath--object)

Пример вставки

```ejs
<style><%- app.module.insert('assets/css/critical/index.css') %></style>
```

_Результат `app.data.WezomCMS // true`_
 
```php
<style><?php echo file_get_contents( ROOT . 'Media/assets/css/critical/index.css' ) ?></style>
```

_Результат `app.data.WezomCMS // false`_

```markup
<style>html{position:relative}...</style>
```

Если файл остутствует - будет ошибка

При `WezomCMS` - вы увидете их браузере, после отработки php кода
При отключеном `WezomCMS - в терминале и `push` уведемолния c предупреждениями


----

### {@link app.module.insert.fromDist}

Вставка из папки `dist` в код разметки

Пример вставки

```ejs
<%- app.module.insert.fromDist('./hidden/php-translations-script.php'); %>
```

_Результат `app.data.WezomCMS // true`_

```php
<?php echo file_get_contents( './hidden/php-translations-script.php' ); ?>
```

_Результат `app.data.WezomCMS // false`_

```markup
<script>
	;(function(window) {
		if (window.jsTranslations) {
			return;
		}
		...
</script>
```
