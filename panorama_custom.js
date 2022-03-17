ymaps.ready(function () {
    // Для начала проверим, поддерживает ли плеер браузер пользователя.
    if (!ymaps.panorama.isSupported()) {
        // Если нет, то ничего не будем делать.
        return;
    }

    // Сначала описываем уровни масштабирования панорамного изображения.
    // Для этого заводим класс, реализующий интерфейс IPanoramaTileLevel.
    // Параметрами конструктора будут шаблон URL тайлов и размер уровня.
    function TileLevel (urlTemplate, imageSize) {
        this._urlTemplate = urlTemplate;
        this._imageSize = imageSize;
    }

    ymaps.util.defineClass(TileLevel, {
        getTileUrl: function (x, y) {
            // Определяем URL тайла для переданных индексов.
            return this._urlTemplate.replace('%c', y + '-' + x);
        },

        getImageSize: function () {
            return this._imageSize;
        }
    });

    // Теперь описываем панораму.
    function Panorama () {
        ymaps.panorama.Base.call(this);
        // Наша панорама будет содержать два уровня масштабирования
        // панорамного изображения: низкого и высокого качества.
        this._tileLevels = [
            new TileLevel('tiles/yandex_office_lq/%c.jpg', [512, 256]),
            new TileLevel('tiles/yandex_office_hq/%c.jpg', [16896, 3712])
        ];
    }

    // Наследуем класс панорамы от ymaps.panorama.Base, который частично
    // реализует IPanoramaTileLevel за нас.
    ymaps.util.defineClass(Panorama, ymaps.panorama.Base, {
        getPosition: function () {
            // Панорама будет располагаться в начале координат...
            return [0, 0, 0];
        },

        getCoordSystem: function () {
            // ...декартовой системы.
            return ymaps.coordSystem.cartesian;
        },

        getAngularBBox: function () {
            // Область, которую занимает панорама на панорамной сфере.
            // В нашем случае это будет вся сфера.
            return [
                0.5 * Math.PI,
                2 * Math.PI,
                -0.5 * Math.PI,
                0
            ];
        },

        getTileSize: function () {
            // Размер тайлов, на которые нарезано изображение.
            return [512, 512];
        },

        getTileLevels: function () {
            return this._tileLevels;
        }
    });

    // Теперь создаем плеер с экземпляром нашей панорамы.
    //var player = new ymaps.panorama.Player('player', new Panorama());
	
	var myMap = new ymaps.Map('map', {
            center: [55.798558, 49.105041],
            zoom: 10,
			controls: ['geolocationControl','routeButtonControl']
        }, {
            searchControlProvider: 'yandex#search'
        }),
		
		control = myMap.controls.get('routeButtonControl');

		// Зададим координаты пункта отправления с помощью геолокации.
		control.routePanel.geolocate('from');

		// Откроем панель для построения маршрутов.
		control.state.set('expanded', true),

        myPlacemark = new ymaps.Placemark([55.798558, 49.105041], {
            panoLayer: 'yandex#panorama'
        }, {
            preset: 'islands#nightIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        }),

        myPlacemark1 = new ymaps.Placemark([55.791201, 49.122318], {
            panoLayer: 'yandex#panorama'
        }, {
            preset: 'islands#nightIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        }),

		myPlacemark2 = new ymaps.Placemark([55.798615, 49.100745], {
				panoLayer: 'yandex#panorama'
			}, {
				preset: 'islands#nightIcon',
				openEmptyBalloon: true,
				balloonPanelMaxMapArea: 0
		}),

		myPlacemark3 = new ymaps.Placemark([55.809993, 49.099254], {
				panoLayer: 'yandex#airPanorama'
			}, {
				preset: 'islands#redIcon',
				openEmptyBalloon: true,
				balloonPanelMaxMapArea: 0
		}),

		myPlacemark4 = new ymaps.Placemark([55.812953, 49.108202], {
				panoLayer: 'yandex#panorama'
			}, {
				preset: 'islands#nightIcon',
				openEmptyBalloon: true,
				balloonPanelMaxMapArea: 0
		}),
		
		myPlacemark5 = new ymaps.Placemark([55.792043, 49.122108], {
				panoLayer: 'yandex#panorama'
			}, {
				preset: 'islands#nightIcon',
				openEmptyBalloon: true,
				balloonPanelMaxMapArea: 0
		});
		
		home = new ymaps.Placemark([55.744074, 49.183684], {
			},{
				preset: 'islands#redIcon',
				openEmptyBalloon:true,
				balloonPanelMaxMapArea:0
		})

	// Функция, устанавливающая для метки макет содержимого ее балуна.
    function setBalloonContentLayout (placemark, panorama) {
        // Создание макета содержимого балуна.
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="panorama" style="width:256px;height:156px"/>', {
                // Переопределяем функцию build, чтобы при формировании макета
                // создавать в нем плеер панорам.
                build: function () {
                    // Сначала вызываем метод build родительского класса.
                    BalloonContentLayout.superclass.build.call(this);
                    // Добавляем плеер панорам в содержимое балуна.
                    this._openPanorama();
                },
                // Аналогично переопределяем функцию clear, чтобы удалять
                // плеер панорам при удалении макета с карты.
                clear: function () {
                    this._destroyPanoramaPlayer();
                    BalloonContentLayout.superclass.clear.call(this);
                },
                // Добавление плеера панорам.
                _openPanorama: function () {
                    if (!this._panoramaPlayer) {
                        // Получаем контейнер, в котором будет размещаться наша панорама.
                        var el = this.getParentElement().querySelector('#panorama');
                        this._panoramaPlayer = new ymaps.panorama.Player(el, new Panorama())
                    }
                },
                // Удаление плеера панорамы.
                _destroyPanoramaPlayer: function () {
                    if (this._panoramaPlayer) {
                        this._panoramaPlayer.destroy();
                        this._panoramaPlayer = null;
                    }
                }
            });
        // Устанавливаем созданный макет в опции метки.
        placemark.options.set('balloonContentLayout', BalloonContentLayout);
    }

    // В этой функции выполняем проверку на наличие панорамы в данной точке.
    // Если панорама нашлась, то устанавливаем для балуна макет с этой панорамой,
    // в противном случае задаем для балуна простое текстовое содержимое.
    function requestForPanorama (e) {
        var placemark = e.get('target'),
            // Координаты точки, для которой будем запрашивать панораму.
            coords = placemark.geometry.getCoordinates(),
            // Тип панорамы (воздушная или наземная).
            panoLayer = placemark.properties.get('panoLayer');

        placemark.properties.set('balloonContent', "Идет проверка на наличие панорамы...");

        // Запрашиваем объект панорамы.
        ymaps.panorama.locate(coords, {
            layer: panoLayer
        }).then(
            function (panoramas) {
                if (panoramas.length) {
                    // Устанавливаем для балуна макет, содержащий найденную панораму.
                    setBalloonContentLayout(placemark, panoramas[0]);
                } else {
                    // Если панорам не нашлось, задаем
                    // в содержимом балуна простой текст.
                    placemark.properties.set('balloonContent', "Для данной точки панорамы нет.");
                }
            },
            function (err) {
                placemark.properties.set('balloonContent',
                    "При попытке открыть панораму произошла ошибка: " + err.toString());
            }
        );
    }
	
	 // Функция, устанавливающая для метки макет содержимого ее балуна.
    function setBalloonContentLayout2 (placemark, panorama) {
        // Создание макета содержимого балуна.
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="panorama" style="width:256px;height:156px"/>', {
                // Переопределяем функцию build, чтобы при формировании макета
                // создавать в нем плеер панорам.
                build: function () {
                    // Сначала вызываем метод build родительского класса.
                    BalloonContentLayout.superclass.build.call(this);
                    // Добавляем плеер панорам в содержимое балуна.
                    this._openPanorama();
                },
                // Аналогично переопределяем функцию clear, чтобы удалять
                // плеер панорам при удалении макета с карты.
                clear: function () {
                    this._destroyPanoramaPlayer();
                    BalloonContentLayout.superclass.clear.call(this);
                },
                // Добавление плеера панорам.
                _openPanorama: function () {
                    if (!this._panoramaPlayer) {
                        // Получаем контейнер, в котором будет размещаться наша панорама.
                        var el = this.getParentElement().querySelector('#panorama');
                        this._panoramaPlayer = new ymaps.panorama.Player(el, panorama, {
                            controls: ['panoramaName']
                        });
                    }
                },
                // Удаление плеера панорамы.
                _destroyPanoramaPlayer: function () {
                    if (this._panoramaPlayer) {
                        this._panoramaPlayer.destroy();
                        this._panoramaPlayer = null;
                    }
                }
            });
        // Устанавливаем созданный макет в опции метки.
        placemark.options.set('balloonContentLayout', BalloonContentLayout);
    }

    // В этой функции выполняем проверку на наличие панорамы в данной точке.
    // Если панорама нашлась, то устанавливаем для балуна макет с этой панорамой,
    // в противном случае задаем для балуна простое текстовое содержимое.
    function requestForPanorama2 (e) {
        var placemark = e.get('target'),
            // Координаты точки, для которой будем запрашивать панораму.
            coords = placemark.geometry.getCoordinates(),
            // Тип панорамы (воздушная или наземная).
            panoLayer = placemark.properties.get('panoLayer');

        placemark.properties.set('balloonContent', "Идет проверка на наличие панорамы...");

        // Запрашиваем объект панорамы.
        ymaps.panorama.locate(coords, {
            layer: panoLayer
        }).then(
            function (panoramas) {
                if (panoramas.length) {
                    // Устанавливаем для балуна макет, содержащий найденную панораму.
                    setBalloonContentLayout2(placemark, panoramas[0]);
                } else {
                    // Если панорам не нашлось, задаем
                    // в содержимом балуна простой текст.
                    placemark.properties.set('balloonContent', "Для данной точки панорамы нет.");
                }
            },
            function (err) {
                placemark.properties.set('balloonContent',
                    "При попытке открыть панораму произошла ошибка: " + err.toString());
            }
        );
    }
	
	function init() {
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
				myPlacemark5,
				myPlacemark1,
                myPlacemark,
                myPlacemark2,
				myPlacemark3,
				myPlacemark4
            ],
            params: {
                //Тип маршрутизации - пешеходная маршрутизация.
                routingMode: 'pedestrian'
            }
        }, {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true
        });

		// Добавляем мультимаршрут на карту.
		myMap.geoObjects.add(multiRoute);
		
		var geolocation = ymaps.geolocation;
		// Сравним положение, вычисленное по ip пользователя и
		// положение, вычисленное средствами браузера.
		geolocation.get({
			provider: 'yandex',
			mapStateAutoApply: true
		}).then(function (result) {
			// Красным цветом пометим положение, вычисленное через ip.
			result.geoObjects.options.set('preset', 'islands#redCircleIcon');
			result.geoObjects.get(0).properties.set({
				balloonContentBody: 'Мое местоположение'
			});
			myMap.geoObjects.add(result.geoObjects);
		});

		geolocation.get({
			provider: 'browser',
			mapStateAutoApply: true
		}).then(function (result) {
			// Синим цветом пометим положение, полученное через браузер.
			// Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
			result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
			myMap.geoObjects.add(result.geoObjects);
		});
		
		// Создадим элемент управления "Пробки".
		var trafficControl = new ymaps.control.TrafficControl({ state: {
            // Отображаются пробки "Сейчас".
            providerKey: 'traffic#actual',
            // Начинаем сразу показывать пробки на карте.
            trafficShown: true
        }});
		// Добавим контрол на карту.
		myMap.controls.add(trafficControl);
		// Получим ссылку на провайдер пробок "Сейчас" и включим показ инфоточек.
		trafficControl.getProvider('traffic#actual').state.set('infoLayerShown', true); 
		
		rt1 = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
				home,
				myPlacemark5
            ],
            params: {
                //Тип маршрутизации - пешеходная маршрутизация.
                routingMode: 'pedestrian'
            }
        }, {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true
        });
		
		rt2 = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
				myPlacemark4,
				home
            ],
            params: {
                //Тип маршрутизации - пешеходная маршрутизация.
                routingMode: 'pedestrian'
            }
        }, {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true
        });
		
		// Собираем по линии для каждой нитки маршрута.
		//const firstAnimatedLine = rt1.getRoutes().toArray()
		//  .map(route => new ymaps.Polyline(routeToLineString(route)));
		  
		// Собираем по линии для каждой нитки маршрута.
		//const secondAnimatedLine = rt2.getRoutes().toArray()
		//  .map(route => new ymaps.Polyline(routeToLineString(route)));
		var firstAnimatedLine = new ymaps.AnimatedLine([
        [55.744074, 49.183684],
		[55.744306, 49.181825],
		[55.744320, 49.180033],
		[55.744551, 49.180011],
		[55.744200, 49.173744],
		[55.744200, 49.173744],
		[55.747147, 49.163726],
		[55.755502, 49.164233],
		[55.764527, 49.160633],
		[55.776893, 49.146288],
		[55.786737, 49.125035],
		[55.787353, 49.124569],
		[55.788663, 49.121676],
		[55.788663, 49.121676],
		[55.788663, 49.121676],
        [55.792043, 49.122108]
    ], {}, {
        // Задаем цвет.
        strokeColor: "#ED4543",
        // Задаем ширину линии.
        strokeWidth: 5,
        // Задаем длительность анимации.
        animationTime: 4000
    });
    var secondAnimatedLine = new ymaps.AnimatedLine([
		[55.812953, 49.108202],
		[55.811881, 49.102929],
		[55.803309, 49.101950],
		[55.800718, 49.102408],
		[55.793988, 49.108316],
		[55.789817, 49.116688],
		[55.787355, 49.121851],
		[55.786737, 49.125035],
		[55.776893, 49.146288],
		[55.764527, 49.160633],
		[55.755502, 49.164233],
		[55.747147, 49.163726],
		[55.744200, 49.173744],
		[55.744200, 49.173744],
		[55.744551, 49.180011],
		[55.744320, 49.180033],
		[55.744306, 49.181825],
        [55.744074, 49.183684]
    ], {}, {
        strokeColor: "#1E98FF",
        strokeWidth: 5,
        animationTime: 4000
    });
		
		  
		// Добавляем линии на карту.
		myMap.geoObjects.add(firstAnimatedLine);
		myMap.geoObjects.add(secondAnimatedLine);
		
		// Создаем метки.
    var firstPoint = new ymaps.Placemark([55.744074, 49.183684], {}, {
        preset: 'islands#redRapidTransitCircleIcon'
    });
    var secondPoint = new ymaps.Placemark([55.792043, 49.122108], {}, {
        preset: 'islands#blueMoneyCircleIcon'
    });
    var thirdPoint = new ymaps.Placemark([55.812953, 49.108202], {}, {
        preset: 'islands#blackZooIcon'
    });
		
		// Функция анимации пути.
		function playAnimation() {
			// Убираем вторую линию.
			secondAnimatedLine.reset();
			// Добавляем первую метку на карту.
			myMap.geoObjects.add(firstPoint);
			// Анимируем первую линию.
			firstAnimatedLine.animate()
				// После окончания анимации первой линии добавляем вторую метку на карту и анимируем вторую линию.
				.then(function() {
					//myMap.geoObjects.add(secondPoint);
					return secondAnimatedLine.animate();
				})
				// После окончания анимации второй линии добавляем третью метку на карту.
				.then(function() {
					//myMap.geoObjects.add(thirdPoint);
					// Добавляем паузу после анимации.
					return ymaps.vow.delay(null, 2000);
				})
				// После паузы перезапускаем анимацию.
				.then(function() {
					// Удаляем метки с карты.
					myMap.geoObjects.remove(firstPoint);
					//myMap.geoObjects.remove(secondPoint);
					//myMap.geoObjects.remove(thirdPoint);
					// Убираем вторую линию.
					secondAnimatedLine.reset();
					// Перезапускаем анимацию.
					playAnimation();
				});
		}
		// Запускаем анимацию пути.
		playAnimation();
	}
	
	myPlacemark.events.once('balloonopen', requestForPanorama);
	myPlacemark1.events.once('balloonopen', requestForPanorama);
	myPlacemark2.events.once('balloonopen', requestForPanorama);
	myPlacemark3.events.once('balloonopen', requestForPanorama);
	myPlacemark4.events.once('balloonopen', requestForPanorama);
	myPlacemark5.events.once('balloonopen', requestForPanorama);

	myMap.geoObjects.add(myPlacemark);
	myMap.geoObjects.add(myPlacemark1);
	myMap.geoObjects.add(myPlacemark2);
	myMap.geoObjects.add(myPlacemark3);
	myMap.geoObjects.add(myPlacemark4);
	myMap.geoObjects.add(myPlacemark5);
	
	ymaps.ready(['AnimatedLine']).then(init);
	//ymaps.ready(init);
	
});


