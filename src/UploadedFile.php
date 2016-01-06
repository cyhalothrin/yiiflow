<?php

namespace cyhalothrin\yiiflow;

use Flow\ConfigInterface;
use Yii;
use yii\base\NotSupportedException;
use yii\helpers\FileHelper;
use yii\helpers\Json;
use yii\web\UploadedFile as BaseUploadedFile;


class UploadedFile extends BaseUploadedFile
{
    /**
     * @var ConfigInterface
     */
    protected $flowConfig;

    /**
     * @param ConfigInterface $flowConfig
     * @param array $config
     */
    public function __construct(ConfigInterface $flowConfig, $config = [])
    {
        $this->flowConfig = $flowConfig;
        parent::__construct($config);
    }

    /**
     * @inheritdoc
     */
    public function init()
    {
        $this->tempName = $this->flowConfig->getTempDir() . DIRECTORY_SEPARATOR . $this->tempName;
        $this->error = file_exists($this->tempName) ? UPLOAD_ERR_OK : UPLOAD_ERR_NO_FILE;
        if ($this->error === UPLOAD_ERR_OK) {
            $this->type = FileHelper::getMimeType($this->tempName);
            $this->size = filesize($this->tempName);
        }
    }

    /**
     * @inheritdoc
     */
    public static function getInstancesByName($name)
    {
        $data = Yii::$app->request->post($name);
        $results = [];
        if (empty($data)) {
            return $results;
        }
        $files = Json::decode($data);
        if (empty($files) || !is_array($files)) {
            return $results;
        }

        foreach ($files as $tempName => $name) {
            $results[] = Yii::createObject([
                'class' => static::className(),
                'name' => $name,
                'tempName' => $tempName,
            ]);
        }

        return $results;
    }

    /**
     * @inheritdoc
     */
    public function saveAs($file, $deleteTempFile = true)
    {
        if ($this->error === UPLOAD_ERR_OK) {
            $result = copy($this->tempName, $file);
            if ($deleteTempFile) {
                unlink($this->tempName);
            }
            return $result;
        }
        return false;
    }

    /**
     * @inheritdoc
     */
    public static function reset()
    {
        throw new NotSupportedException();
    }

    /**
     * @inheritdoc
     */
    public static function getInstance($model, $attribute)
    {
        throw new NotSupportedException();
    }

    /**
     * @inheritdoc
     */
    public static function getInstanceByName($name)
    {
        throw new NotSupportedException();
    }
}
