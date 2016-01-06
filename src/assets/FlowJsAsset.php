<?php

namespace cyhalothrin\yiiflow\assets;

use yii\web\AssetBundle;


class FlowJsAsset extends AssetBundle
{

    public $sourcePath = '@vendor/bower/flow.js/dist';

    /**
     * @inheritdoc
     */
    public function init()
    {
        $this->js[] = YII_DEBUG ? 'flow.js' : 'flow.min.js';
    }
}
