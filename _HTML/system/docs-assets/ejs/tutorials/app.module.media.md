{@link app.module.media} - компонент установки пути к медиа файлу.
В зависимости от `gulp` задачи и ее параметров заменяет пути
к директориям с медиа файлами - перед указаным путем подставляется переменная с нужным адресом

```js
// хост
paths.toMedia + 'assets/css/style.css' => '/Media/assets/css/style.css'
// инкубатор
paths.toMedia + 'assets/css/style.css' => 'media/assets/css/style.css'
```

Строка игнорируется и возвращается как есть, сразу, в следующих ситуациях:
- если путь уже содержить `php` код
- если путь к файлу абсолютный, начинается с `http://`, `https://` или `//`
- если строка - `base64` код, начинается с `data:`

```js
// регулярка для отлова игноров
const pattern = /^((http(s)?:)?\/\/|<\?php|data:)/i;
```

Компонент, по умолчанию, указывает версионирования файлов - третий аргумент `true`.
Версионирование представляет собой - запрос в адресе каждого файла с параметрами `URL?v=mtime`.

```js
app.module.media('assets/css/style.css'); // => /Media/assets/css/style.css?v=1505970375
```

Если в адресе уже есть другие ключи запроса, то они будут объединены

```js
app.module.media('assets/css/style.css?q=123'); // => /Media/assets/css/style.css?v=1505970375&q=123
// если выключить версионирование
app.module.media('assets/css/style.css?q=123', false, false); // => /Media/assets/css/style.css?q=123
```

Также если в адресе есть `#hash`, который по специкации URL схем - должен быть после запросов,
он будет отсортирован и добавлен в конец адреса.

```js
app.module.media('assets/svg/sprite.svg#icon-youtube'); // => /Media/assets/svg/sprite.svg?v=1505970375#icon-youtube
// если есть дополнительный запрос
app.module.media('assets/svg/sprite.svg?q=123#icon-youtube'); // => /Media/assets/svg/sprite.svg?v=1505970375&g=123#icon-youtube
// если выключить версионирование
app.module.media('assets/svg/sprite.svg#icon-youtube', false, false); // => /Media/assets/svg/sprite.svg#icon-youtube
```

#### _Включенный `app.data.WezomCMS`_

Компонент формирует строку `php` метода `\Core\HTML::media($file, $absolute = false, $version = true)`
Этот метод уже описан в WezomCMS и, соответсвено, будет работать согласно его механике.

На верстке, при открытии `_HTML/dist/`, WezomCMS не доступна,
поэтому в начале каждой страницы включена шапка с `php` кодом, для имитации работы cms.
Более подробно смотрите `_HTML/src/ejs/_widgets/head/php.ejs`

EJS код

```ejs
<link rel="stylesheet" href="<%- app.module.media('assets/css/style.css') %>">
<img alt src="<%- app.module.media('dev/images/placeholders/no-avatar.png') %>">
<video src="<%- app.module.media('dev/files/video.mp4') %>"></video>
<div style="background-image: url(<%- app.module.media('dev/images/bgs/main.jpg') %>);"></div>
```

Рузультат php

```php
<link rel="stylesheet" href="<?php echo \Core\HTML::media( 'assets/css/style.css', false, true ); ?>">
<img alt src="<?php echo \Core\HTML::media( 'dev/images/placeholders/no-avatar.png', false, true ); ?>">
<video src="<?php echo \Core\HTML::media( 'dev/files/video.mp4', false, true ); ?>"></video>
<div style="background-image: url(<?php echo \Core\HTML::media( 'dev/images/bgs/main.jpg'', false, true );"></div>
```

Результат в браузере

```markup
<link rel="stylesheet" href="/Media/assets/css/style.css?v=1505970375">
<img alt src="/Media/dev/images/placeholders/no-avatar.png?v=1505971024">
<video src="/Media/dev/files/video.mp4?v=1505965301"></video>
<div style="background-image: url(/Media/dev/images/bgs/main.jpg?v=1505939654); ?>);"></div>
```

Если файл не существует, будет `php` ошибка,
которую можно обнаружить только в браузере

``` ejs
<link rel="stylesheet" href="<%- app.module.media('css/demo.css') %>">
```

```php
<link rel="stylesheet" href="<?php echo \Core\HTML::media( 'css/demo.css', false, true ); ?>">
```

Браузер

```markup
<link rel="stylesheet" href="<!--error--><br />
<b>Warning</b>:  filemtime(): stat failed for ../../Media/css/demo.css in <b>Z:\home\wezom-bundle\www\_HTML\dist\index.php</b> on line <b>1</b><br />
<script language=JavaScript src='/denwer/errors/phperror_js.php'></script>/Media/css/demo.css?v=">
```

#### _Выключенный `app.data.WezomCMS`_

В этом случае компонент возвращает сразу строку с полным адресом.
Если версионирование включено, то компонент на основе `nodejs` модулей `fs` и `path`
получит информацию о дате модификации и добавить в адрес.

EJS код

```ejs
<link rel="stylesheet" href="<%- app.module.media('assets/css/style.css') %>">
<img alt src="<%- app.module.media('dev/images/placeholders/no-avatar.png') %>">
<video src="<%- app.module.media('dev/files/video.mp4') %>"></video>
<div style="background-image: url(<%- app.module.media('dev/images/bgs/main.jpg') %>);"></div>
```

Результат в html файле и браузере

```markup
<link rel="stylesheet" href="/Media/assets/css/style.css?v=1505970375">
<img alt src="/Media/dev/images/placeholders/no-avatar.png?v=1505971024">
<video src="/Media/dev/files/video.mp4?v=1505965301"></video>
<div style="background-image: url(/Media/dev/images/bgs/main.jpg?v=1505939654); ?>);"></div>
```

Такой метод будет работать дольше чем php, так как производятся опирации файловой системы для каждого файла,
Плюс в случае ошибок в путях или если файл отсутствует - Вы получите предупреждение об этом
но `gulp` задача не будет оставновлена

Предупреждение будет в терминале, а также будет вывод `push` уведомления

```shell
[09:10:25] warn
ENOENT: no such file or directory, stat 'C:\WebServers\home\wezom-bundle\www\Media\css\demo.css'
```
