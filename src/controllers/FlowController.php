<?php

namespace cyhalothrin\yiiflow\controllers;

use yii\filters\ContentNegotiator;
use yii\web\Controller;
use yii\web\Response;


class FlowController extends Controller
{
    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'upload' => [
                'class' => 'cyhalothrin\yiiflow\components\UploadAction',
            ],
            'delete' => [
                'class' => 'cyhalothrin\yiiflow\components\DeleteAction',
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'verb' => [
                'class' => 'yii\filters\VerbFilter',
                'actions' => [
                    'delete' => ['post'],
                ],
            ],
            'access' => [
                'class' => 'yii\filters\AccessControl',
                'only' => ['upload', 'delete'],
                'rules' => [
                    [
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'negotiator' => [
                'class' => ContentNegotiator::className(),
                'only' => ['upload', 'delete'],
                'formats' => [
                    'application/json' => Response::FORMAT_JSON,
                ],
            ],
        ];
    }
}
