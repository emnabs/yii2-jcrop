<?php

namespace emhome\jcrop;

use Yii;
use emhome\jcrop\Asset;
use yii\base\InvalidConfigException;
use yii\helpers\Json;
use yii\widgets\InputWidget;

class Jcrop extends InputWidget {

    public $uploadParameter = 'file';
    public $width = 300;
    public $height = 200;
    public $uploadUrl;
    public $maxSize = 2097152;
    public $extensions = 'jpeg, jpg, png, gif';
    public $onCompleteJcrop;

    /**
     * @inheritdoc
     */
    public function init() {
        parent::init();
        self::registerTranslations();
        if ($this->uploadUrl === null) {
            throw new InvalidConfigException(Yii::t('jcrop', 'Missing Attribute', ['attribute' => 'uploadUrl']));
        } else {
            $this->uploadUrl = rtrim(Yii::getAlias($this->uploadUrl), '/') . '/';
        }
    }

    /**
     * @inheritdoc
     */
    public function run() {
        $this->registerClientAssets();
        return $this->render('widget', [
            'model' => $this->model,
            'widget' => $this
        ]);
    }

    /**
     * Register widget asset.
     */
    public function registerClientAssets() {
        $view = $this->getView();
        Asset::register($view);
        $settings = [
            'url' => $this->uploadUrl,
            'name' => $this->uploadParameter,
            'maxSize' => $this->maxSize / 1024,
            'allowedExtensions' => explode(', ', $this->extensions),
            'size_error_text' => Yii::t('jcrop', 'File Size Error', ['size' => $this->maxSize / (1024 * 1024)]),
            'ext_error_text' => Yii::t('jcrop', 'File Extension Error', ['formats' => $this->extensions]),
            'accept' => 'image/*',
        ];
        if ($this->onCompleteJcrop) {
            $settings['onCompleteJcrop'] = $this->onCompleteJcrop;
        }
        $view->registerJs('jQuery("#' . $this->options['id'] . '")
            .parent()
            .find(".new-photo-area")
            .cropper(' . Json::encode($settings) . ', ' . $this->ration . ');', $view::POS_END);
    }

    public function getRatio() {
        if ($this->height) {
            return $this->width / $this->height;
        }
        return 1;
    }

    /**
     * Register widget translations.
     */
    public static function registerTranslations() {
        if (!isset(Yii::$app->i18n->translations['jcrop']) && !isset(Yii::$app->i18n->translations['jcrop/*'])) {
            Yii::$app->i18n->translations['jcrop'] = [
                'class' => 'yii\i18n\PhpMessageSource',
                'basePath' => '@emhome/jcrop/messages',
                'forceTranslation' => true,
                'fileMap' => [
                    'jcrop' => 'jcrop.php'
                ]
            ];
        }
    }

}
