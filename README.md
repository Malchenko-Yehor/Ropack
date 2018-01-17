# wezom-starter-template-default 9.2.0 (Заменить название на имя текущего проекта)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![happiness](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)
[![Happiness SCSS Style](https://cdn.rawgit.com/dutchenkoOleg/happiness-scss/master/badge.svg)](https://github.com/dutchenkoOleg/happiness-scss)

> :warning: _**Важно!!!**_  
> _Не удаляйте и не заменяйте этот файл_  
> _При необходимости дополните нужную информацию в конец файла_

> :warning: _**Важно!!!**_  
> _Не удаляйте `.gitignore`, который уже составлен для проекта верстки и программирования_  
> _Если нужно добавить пути для игнора - добавьте их вручную, не очищая имеющиеся записи_  

> :zap: Список задач от верстальщика - программисту, смотрите в [TODO-PHP.md](./TODO-PHP.md)

---

## Информация о проекте

- проект:
    - (вставить ссылку на проект worksection)
- задачи:
    - (вставить ссылки на задачи worksection)
- макеты:
    - (вставить ссылку макеты прототипов)
    - (вставить ссылку макеты дазайна)
- дополнительные материалы и источники:
    - (вставить ссылки)

---


## Информация по шаблону сборки

- [CHANGELOG шаблона сборки [wiki] =>](https://bitbucket.org/wezom/wezom-starter-template-default/wiki/CHANGELOG.md) (для верстальщика)
- [Преимущества и нововведния шаблона [wiki] =>](https://bitbucket.org/wezom/wezom-starter-template-default/wiki/benefits.md) (для всех)
- [API документация [inkubator] =>](http://inkubator.ks.ua/docs/wezom-starter-template-default/) (для всех)
- [Демонстрация шаблона сборки [wezom.net] =>](http://wstd.wezom.net/_HTML/dist/) (для всех)

---

## Основные ветки репозитория

1. `master` - основная ветка, которая используется для работы разработчиков
	- Вы также можете добавлять дополнительные ветки, такие как `dev`, `html`, `prog`, `test` и тд.  
1. `production` - ветка в которую выливается только итоговый проект, который оттестирован и проверен.  
С этой ветки уже выливается на основной хостинг готовый, собранный проект.


---

## Разработка проекта верстки

API документация по шаблону сборки  
http://inkubator.ks.ua/docs/wezom-starter-template-default/

Установите все локальные зависимости.

```
npm i
```

Для сборки проета Вам доступны `npm` скрипты:

- `npm run clear` - очистка папок с разметкой и папок с итоговыми медиа файлами.
- `npm run clear-media` - очистка папок с итоговыми медиа файлами `Media/assets`.
- `npm start / npm run start` - Стартовый проход по все задачам - в результате Вы получите все файлы (_в дев режиме_) - используйте ее при первом запуске, а также для полного построения всех файлов, к примеру после слияния веток.
- `npm run start-media` - Стартовый проход по все задачам, исключая разметку.
- `npm run dev` - Запуск сборки в _дев режиме_, со всеми вотчами, browser-sync и webpack'ом
- `npm run dev-media` - Запуск сборки в _дев режиме_, исключая разметку.
- `npm run prod` - Запуск сборки в _продакшн режиме_, со всеми вотчами, browser-sync и webpack'ом
- `npm run prod-media` - Запуск сборки в _продакшн режиме_, исключая разметку.
- `npm run critical` - Генерация критикал стилей. Все параметры по настройке генерации смотрите в `_HTML/critical.config.js`
- `npm test / npm run test` - Запуск линтеров по файлам скриптов и стилей
- `npm run test-media` - Запуск линтеров, исключая разметку.
- `npm run docs` - Генерация документации
- `npm run docs-media` - Генерация документации, исключая разметку.
- `npm run build` - Полное построение проекта верстки в продакшн режиме с первоначальным линтингом файлов.
- `npm run build-media` - Полное построение проекта, исключая разметку.
- `npm run pre-build` - Построение только новых и измененных файлов проекта верстки в продакшн режиме, без тестов и очистки предыдущих файлов.
- `npm run pre-build-media` - Тоже самое что и `pre-build`, только исключая задачи по разметке.
- `npm run todo` - Генерация To Do списка для программистов, на основе комментариве `@todo` в файлах разметки.

Также есть еще дополнительные npm скрипты  
Они специфичны и сдлены для более точечного применения и запуска.

Их список смотрите в `package.json`

> Для пользователей UNIX-систем - может потребоваться запуск от имени _root_ пользователя

```shell
# пример
$ sudo npm start
```

---

## Программная сборка верстки

#### Уставнока ПО

Установите Node.js (8.x+) вместе с npm (5.x+),  
если это ПО у Вас еще не стоит

#### Установка локальных зависимостей

Выполните установку локальных зависимостей текущего проекта,  
_если Вы еще не устанавливали их ранее_  
_или если Вам нужно обновить зависимости_

> ***ВАЖНО! Для установки используйтей команду*** `npm i --only=prod`  
> ***Таким образом вы установите только те модули, которые необходимы для построения проекта***
> 
> _Если Вам нужны будут все модули для разработки, используйте_ `npm i`  
> _НО! В таком случае объем папки node_modules - вырастет от ~180mb до ~550mb_

#### Получение итоговых файлов для программной сборки

Все итоговые файлы находятся в гит игноре.  
Чтобы получить актульные, итоговые, файлы - выполните построение проекта верстки

```shell
# построение всего проекта
npm run build

# построение проекта, исключая разметку
npm run build-media
```

Если при выполнении - задача падает на этапе тестирования:

- Сообщить отвественному верстальшику, чтобы он исправил.
- Если Вам срочно нужны исходные файлы, не смотря на ошибку тестирования, выполните  
	`npm run build-without-tests`  
	или `npm run build-media-without-tests` - построение исключая разметку

После выполнения построения проекта верстки  
Вы получите все актуальные, итоговые, файлы:

- `./_HTML/dist/` - разметка
- `./Media/assets/` - все дополнительные файлы, которые использует разметка.

> Все полученные файлы не нужно убирать с гитигнора  
> они будут всегда пересобираться заново!    
> Также не стоит их редактировать вручную.  


#### Обноление итоговых файлов для программной сборки

1. Получите изменения с репозитория `git pull original YOUR-BRANCH`  
1. Если нужно обновите зависимости `npm i --only=prod`  
1. Постройте заново все файлы проекта верстки `npm run build`

#### Построение только новых и измененных файлов

- `npm run pre-build` - Построение только новых и измененных файлов проекта верстки в продакшн режиме, без тестов и очистки предыдущих файлов.
- `npm run pre-build-media` - Тоже самое что и `pre-build`, только исключая задачи по разметке.

---

## Выгрузка разметки на тестовый хостинг


##### Первая выгрузка

После привязки и клонирования репозитория (SSH) на хостинге  
Подкючитесь к нему через терминал при помощи SFTP соединения.

Выполните установку зависимостей.  

***ВАЖНО! Всегда устанавливайте только продакшн зависимости на хостинге!!!***  
***Иначе объем папки node_modules - вырастет от ~180mb до ~550mb***

```shell
npm i --only=prod
```

##### Построение проекта верстки

```shell
# построение всего проекта
npm run build

# построение проекта, исключая разметку
npm run build-media
```

##### Обновление верстки

1. Получите изменения с репозитория `git pull original YOUR-BRANCH`  
1. Если нужно обновите зависимости `npm i --only=prod`  
1. Постройте заново все файлы проекта верстки `npm run build`

#### Построение только новых и измененных файлов

- `npm run pre-build` - Построение только новых и измененных файлов проекта верстки в продакшн режиме, без тестов и очистки предыдущих файлов.
- `npm run pre-build-media` - Тоже самое что и `pre-build`, только исключая задачи по разметке.

##### Добавление и отключение пароля для тестового сервака

_**Использовать только в том случае - если WezomCMS еще не привязана (или любое другое программное приложение), в которой есть возможность паролить сайт через админку**_

На этапе верстки Вы можете сами добавлять и отключать пароль.

_**ВАЖНО!!!** Если сайт при первой выгрузке не имеет пароля - Вам нужно его добавить самостоятельно!_

```shell
# добавить пароль
npm run wezomnet-set-password
```

Иногда нужно выполнить различные тесты и пароль - будет мешать.  
В таком случае:

1. снимаете пароль
1. тестируете
1. снова добавляете пароль

```shell
# отключить пароль
npm run wezomnet-unset-password
```

Эти комманды заменяют разные `.htaccess` файлы для пароля.  
___ПОСЛЕ программный сборки этот функционал ложится на приложение (WezomCMS или любое другое)___


---

## Выгрузка разметки на основной хостинг

> Для выгрузки на основной хостинг заказчика используем деплоер.  
> _По всем вопросам деплоера - обращатся к Евгению Ковалеву или его замам._


---
