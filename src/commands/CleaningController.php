<?php

namespace cyhalothrin\yiiflow\commands;

use Flow\Uploader;
use yii\console\Controller;
use Flow\ConfigInterface;


class CleaningController extends Controller
{
    /**
     * @inheritdoc
     */
    public $defaultAction = 'remove-outdated-files';

    /**
     * @var int
     */
    public $expirationTime = 172800;

    /**
     *
     * @var ConfigInterface
     */
    protected $flowConfig;

    /**
     * @param string $id
     * @param \yii\base\Module $module
     * @param ConfigInterface $flowConfig
     * @param array $config
     */
    public function __construct($id, $module, ConfigInterface $flowConfig, $config = array())
    {
        $this->flowConfig = $flowConfig;
        parent::__construct($id, $module, $config);
    }

    public function actionRemoveOutdatedFiles()
    {
        Uploader::pruneChunks($this->flowConfig->getTempDir(), $this->expirationTime);
    }
}
