<?php

namespace cyhalothrin\yiiflow\components;

use yii\web\NotFoundHttpException;


class DeleteAction extends Action
{
    /**
     * 
     * @param string $filename
     */
    public function run($filename)
    {
        $filename = $this->flowConfig->getTempDir() . DIRECTORY_SEPARATOR . basename($filename);
        if (is_file($filename)) {
            unlink($filename);
        } else {
            throw new NotFoundHttpException();
        }
    }
}
