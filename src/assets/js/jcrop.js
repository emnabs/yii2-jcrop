/* global ss, yii */

(function ($) {
    var jcrop_api;
    $.fn.cropper = function (options, ratio) {
        var $widget = $(this).closest('.cropper-widget');
        var $box = $widget.find('.square-block-box');
        var cropper = {
            $widget: $widget,
            $box: $box,
            $thumbnail: $widget.find('.jcrop-thumbnail'),
            $photo_field: $widget.find('.photo-field'),
            $upload_new_photo: $widget.find('.upload-new-photo'),
            $new_photo_area: $widget.find('.new-photo-area'),
            $cropper_label: $widget.find('.cropper-label'),
            $cropper_buttons: $widget.find('.cropper-buttons'),
            $width_input: $widget.find('.width-input'),
            $height_input: $widget.find('.height-input'),
            uploader: null,
            reader: null,
            selectedFile: null,
            init: function () {
                cropper.initPreview();
                cropper.reader = new FileReader();
                cropper.reader.onload = function (e) {
                    //清除已上传的缓存数据
                    cropper.clearOldImg();
                    var originalImage = new Image();
                    originalImage.src = e.target.result;
                    originalImage.onload = function () {
                        //已得到待裁切图片时，改变区域腾出空间显示
                        cropper.$cropper_label.addClass('hidden');
                        //初始化裁切内容
                        cropper.$new_photo_area.append('<img src="' + this.src + '"/>');
                        cropper.$img = cropper.$new_photo_area.find('img');

                        var position = cropper.computePosition(this.width, this.height);
                        cropper.$img.Jcrop({
                            aspectRatio: ratio,
                            setSelect: position,
                            boxWidth: cropper.$new_photo_area.width(),
                            boxHeight: cropper.$new_photo_area.height(),
                            keySupport: false,
                            trueSize: [this.width, this.height]
                        }, function () {
                            jcrop_api = this;
                            cropper.onWaitCrop();
                        });
                    };
                };

                var settings = $.extend({
                    button: [
                        cropper.$cropper_label,
                        cropper.$upload_new_photo
                    ],
                    dropzone: cropper.$box,
                    responseType: 'json',
                    noParams: true,
                    multipart: true,
                    onChange: function () {
                        if (cropper.selectedFile) {
                            cropper.selectedFile = null;
                            cropper.uploader._queue = [];
                        }
                        return true;
                    },
                    onSubmit: function () {
                        if (cropper.selectedFile) {
                            cropper.$cropper_buttons.find('button.crop-photo').addClass('hidden');
                            cropper.$box.addClass('cropping');
                            return true;
                        }
                        cropper.selectedFile = cropper.uploader._queue[0];
                        cropper.showError('');
                        cropper.reader.readAsDataURL(this._queue[0].file);
                        return false;
                    },
                    onComplete: function (filename, response) {
                        console.log('onComplete');
                        cropper.$box.removeClass('cropping');
                        cropper.$new_photo_area.addClass('hidden');
                        cropper.$thumbnail.removeClass('hidden');
                        if (!response['status']) {
                            cropper.showError(response['message']);
                            return;
                        }
                        cropper.showError('');
                        cropper.$thumbnail.attr({'src': response['imgurl']});
                        cropper.$photo_field.val(response['imgval']);
                        cropper.$cropper_buttons.find('button.recrop-photo').removeClass('hidden');
                        if ((typeof options.onCompleteJcrop !== "undefined") && (typeof options.onCompleteJcrop === "string")) {
                            eval('var onCompleteJcrop = ' + options.onCompleteJcrop);
                            onCompleteJcrop(filename, response);
                        }
                    },
                    onSizeError: function () {
                        cropper.showError(options['size_error_text']);
                    },
                    onExtError: function () {
                        cropper.showError(options['ext_error_text']);
                    }
                }, options);

                cropper.uploader = new ss.SimpleUpload(settings);

                cropper.$widget.on('click', '.delete-photo', function () {
                    cropper.deletePhoto();
                    cropper.$cropper_label.removeClass('hidden');
                    cropper.$cropper_buttons.find('button').addClass('hidden');
                }).on('click', '.crop-photo', function () {
                    //开始裁切
                    //获取裁切区域数据
                    var data = cropper.$img.data('Jcrop').tellSelect();
                    //绑定裁切提交参数
                    data[yii.getCsrfParam()] = yii.getCsrfToken();
                    data['width'] = cropper.$width_input.val();
                    data['height'] = cropper.$height_input.val();
                    if (cropper.uploader._queue.length) {
                        cropper.selectedFile = cropper.uploader._queue[0];
                    } else {
                        cropper.uploader._queue[0] = cropper.selectedFile;
                    }
                    //裁切上传
                    cropper.uploader.setData(data);
                    cropper.readyForSubmit = true;
                    cropper.uploader.submit();
                }).on('click', '.recrop-photo', function () {
                    cropper.changePreview(false);
                    $(this).addClass('hidden');
                    cropper.$cropper_buttons.find('button.crop-photo').removeClass('hidden');
                });
            },
            showError: function (error) {
                if (error === '') {
                    cropper.$widget.parents('.form-group').removeClass('has-error').find('.help-block').text('');
                } else {
                    cropper.$widget.parents('.form-group').addClass('has-error').find('.help-block').text(error);
                }
            },
            initPreview: function () {
                if (cropper.$photo_field.val()) {
                    cropper.changePreview(true);
                    cropper.$cropper_buttons.find('button.delete-photo').removeClass('hidden');
                }
            },
            computePosition: function (width, height) {
                var x1 = 0;
                var y1 = 0;
                var x2 = x1 + width;
                var y2 = y1 + height;
                if (width <= height) {
                    var cropHeight = width / ratio;
                    y1 = (height - cropHeight) / 2;
                    y2 = y1 + cropHeight;
                } else if (width > height) {
                    var cropWidth = height * ratio;
                    x1 = (width - cropWidth) / 2;
                    x2 = x1 + cropWidth;
                }
                return [x1, y1, x2, y2];
            },
            setProgress: function (value) {
                if (value) {
                    cropper.$cropper_buttons.find('button').removeClass('hidden');
                    cropper.$cropper_label.addClass('hidden');
                    cropper.$box.addClass('cropping');
                } else {
                    cropper.$box.removeClass('cropping');
                }
            },
            onWaitCrop: function () {
                //裁切准备就绪，等待裁切
                cropper.$cropper_label.addClass('hidden');
                //显示重新上传按钮
                cropper.$cropper_buttons.find('button.upload-new-photo').removeClass('hidden');
                //显示裁切按钮
                cropper.$cropper_buttons.find('button.crop-photo').removeClass('hidden');
                //显示裁切区域
                cropper.$new_photo_area.removeClass('hidden');
                //隐藏裁切预览区域
                cropper.$thumbnail.addClass('hidden');
                //隐藏重新裁切按钮
                cropper.$cropper_buttons.find('button.recrop-photo').addClass('hidden');
            },
            deletePhoto: function () {
                cropper.$photo_field.val('');
                cropper.$thumbnail.attr({'src': ''});
                cropper.clearOldImg();
            },
            changePreview: function (mode) {
                if (mode) {
                    cropper.$new_photo_area.addClass('hidden');
                    cropper.$thumbnail.removeClass('hidden');
                } else {
                    cropper.$new_photo_area.removeClass('hidden');
                    cropper.$thumbnail.addClass('hidden');
                }
            },
            clearOldImg: function () {
                if (cropper.$img) {
                    cropper.$img.data('Jcrop').destroy();
                    cropper.$img.remove();
                    cropper.$img = null;
                }
                cropper.$new_photo_area.removeClass('hidden');
                cropper.$thumbnail.addClass('hidden');
            }
        };
        cropper.init();
    };
})(jQuery);