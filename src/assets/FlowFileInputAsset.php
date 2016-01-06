<?php

namespace cyhalothrin\yiiflow\assets;

use yii\web\AssetBundle;


class FlowFileInputAsset extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public $sourcePath = '@vendor/cyhalothrin/yiiflow/src/assets/dist';

    /**
     * @inheritdoc
     */
    public $depends = [
        'yii\web\JqueryAsset',
        'yii\bootstrap\BootstrapAsset',
        'cyhalothrin\yiiflow\assets\FlowJsAsset',
    ];

    /**
     * @inheritdoc
     */
    public function init()
    {
        $this->css[] = YII_DEBUG ? 'styles.css' : 'styles.min.css';
        $this->js[] = YII_DEBUG ? 'bundle.js' : 'bundle.min.js';
        $this->publishOptions['forceCopy'] = YII_DEBUG;
    }
}
