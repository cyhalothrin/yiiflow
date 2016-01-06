<?php


namespace cyhalothrin\yiiflow\components;

use Flow\ConfigInterface;
use yii\base\Action as BaseAction;
use yii\web\Controller;


class Action extends BaseAction
{
    /**
     * @var ConfigInterface
     */
    protected $flowConfig;

    /**
     * @param string $id
     * @param Controller $controller
     * @param ConfigInterface $flowConfig
     * @param array $config
     */
    public function __construct($id, $controller, ConfigInterface $flowConfig, $config = [])
    {
        $this->flowConfig = $flowConfig;

        parent::__construct($id, $controller, $config);
    }
}
