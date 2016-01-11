# Yiiflow

Иногда необходимо прикрепить большие файлы к форме, при этом запрос может отправляться очень долго, и сервер может отклонить запрос, по причине того что истекло время или размер файла превысил допустимый размер. Yiiflow позволяет загружать файлы на сервер и сохранить их после отправки формы. Использует [flow.js](https://github.com/flowjs/flow.js) для отправки файлов. Отображает прогресс загрузки файлов, с возможностью отмены. Сохранена совместимость с `yii\web\UploadedFile`.

## Установка

```
composer require cyhalothrin/yiiflow
```

## Настройка

В контейнере приложения необходимо зарегистрировать `Flow\ConfigInterface` и указать директорию сохранения временных файлов:

```php
class AppBootstrap implements yii\base\BootstrapInterface
{
    public function bootstrap($app)
    {
        \Yii::$container->set(
            'Flow\ConfigInterface',
            function () {
                $config = new Flow\Config();
                $config->setTempDir(Yii::getAlias('pathToChunksTempDir'));
                return $config;
            }
        );
    }
}
```

Подробнее о дополнительных настройках можно прочитать [тут](https://github.com/flowjs/flow-php-server).

## Использование

Для обработки загрузки файлов можно указать контроллер в конфигурации приложения:

```php
'controllerMap' => [
    'flow' => 'cyhalothrin\yiiflow\controllers\FlowController',
],
```

или указать `cyhalothrin\yiiflow\components\UploadAction` и `cyhalothrin\yiiflow\components\DeleteAction` в любом вашем контроллере в `actions()`.

Далее в форме установить виджет `\cyhalothrin\yiiflowFlowFileInput`:

```php
\cyhalothrin\yiiflowFlowFileInput::widget([
    'name' => 'file',
    'value' => $file, // необходимо восстанавливать значение
    'uploadAction' => ['/flow/upload'],
    'deleteAction' => ['/flow/delete'],
    'pluginOptions' => [
        'flowOptions' => [
            // конфигурация flow.js
        ],
    ],
]);
```

Для `ActiveForm`:

```php
$form->field($model, 'files')->widget('\cyhalothrin\yiiflowFlow\FileInput', [
    // config
]);
```

После отправки формы загруженные файлы можно получить привычным для Yii способом:

```php
$files = \cyhalothrin\yiiflow\UploadedFile::getInstancesByName('files');
```

или для модели:

```php
$model->files = \cyhalothrin\yiiflow\UploadedFile::getInstances($model, 'files');
```

**Обратите внимание:** методы для получения одного файла не работают, по крайней мере пока, но я не вижу в них смысла в контексте данного расширения.

Далее все операции по валидации и сохранению файлов идентичны для стандартного `yii\web\UploadedFile`.

### Очистка временных файлов

Фрагменты загружаемых файлов как и сами загруженные файлы хранятся в указанной в конфигурации директории. По каким-то причинам эти файлы могут быть не перемещены из этой директории, поэтому необходимо очищать ее. Для этого есть консольная команда, которую можно запускать через cron. Ее необходимо указать в конфигурации консольного приложения:

```php
'controllerMap' => [
    'cleaning' => 'cyhalothrin\yiiflow\commands\CleaningController',
],
```

И запустить:

```
php yii cleaning
```

По умолчанию удаляются файлы старше двух суток, но это можно изменить через `expirationTime` опцию контроллера.
