<?php

namespace cyhalothrin\yiiflow;

use yii\widgets\InputWidget;
use yii\helpers\Html;
use yii\helpers\Json;
use cyhalothrin\yiiflow\assets\FlowFileInputAsset;
use yii\helpers\Url;
use Yii;


class FlowFileInput extends InputWidget
{
    /**
     *
     * @var string
     */
    public $uploadAction;

    /**
     *
     * @var array
     */
    public $query;

    /**
     *
     * @var mixed
     */
    public $deleteAction;

    /**
     *
     * @var boolean
     */
    public $addCSRFToken = true;

    /**
     *
     * @var array
     */
    public $pluginOptions = [];

    /**
     * @inheritdoc
     */
    public function run()
    {
        $this->registerAssets();

        if ($this->name === null) {
            return Html::activeHiddenInput($this->model, $this->attribute, $this->options);
        }
        return Html::hiddenInput($this->name, $this->value, $this->options);
    }

    protected function registerAssets()
    {
        FlowFileInputAsset::register($this->view);
        $options = array_merge(
            $this->pluginOptions,
            [
                'deleteUrl' => Url::to($this->deleteAction),
                'flowOptions' => [
                    'target' => Url::to($this->uploadAction),
                ],
            ]
        );
        if ($this->addCSRFToken) {
            $options['flowOptions']['headers']['X-CSRF-Token'] = Yii::$app->request->csrfToken;
        }
        if (!empty($this->query)) {
            $options['flowOptions']['query'] = $this->query;
        }
        $options = Json::encode($options);
        $js = <<<SCRIPT
          $('#{$this->options['id']}').flowFileUpload($options);
SCRIPT;
        $this->view->registerJs($js);
    }
}
