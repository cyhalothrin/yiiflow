<?php

namespace cyhalothrin\yiiflow\components;

use Flow\File;
use Yii;
use yii\web\BadRequestHttpException;


class UploadAction extends Action
{

    /**
     * @inheritdoc
     */
    public function run()
    {
        $file = new File($this->flowConfig);

        if (Yii::$app->request->isGet) {
            if ($file->checkChunk() === false) {
                /* @var $response yii\web\Response */
                $response = Yii::$app->response;
                $response->setStatusCode(204);
            }
            return;
        } else {
            if ($file->validateChunk() === false) {
                throw new BadRequestHttpException();
            }

            $file->saveChunk();
        }

        $dir = $this->flowConfig->getTempDir();
        $tempName = uniqid('flow_', true);
        if ($file->validateFile() && $file->save($dir . DIRECTORY_SEPARATOR . $tempName)) {
            return [
                'tempName' => $tempName,
            ];
        }
    }
}
