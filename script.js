window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '﹖';

    let places = staticLoadPlaces();
    renderPlaces(places);
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

        setModel(models[modelIndex], model);

        model.setAttribute('animation-mixer', '');

        document.querySelector('button[data-action="change"]').addEventListener('click', function () {
            var entity = document.querySelector('[gps-entity-place]');
            modelIndex++;
            var newIndex = modelIndex % models.length;
            setModel(models[newIndex], entity);
        });

        scene.appendChild(model);
    });
}

function staticLoadPlaces() {
    return [
        {    
            name: 'Pokèmon',
            location: {
                lat: 22.998487, 
                lng: 120.220098,
            },
        },
		{
			name: 'Pokèmon1',
            location: {
                lat: 22.998505, 
                lng: 120.219764,
            },
		},
		{
			name: 'Pokèmon2',
            location: {
                lat: 22.9988081,
                lng: 120.2194029,
            },
		},
		{
			name: 'Pokèmon3',
            location: {
                lat: 22.9988081,
                lng: 120.2194029,
            },
		},
		{
			name: 'Pokèmon4',
            location: {
                lat: 23.008384, 
                lng: 120.217914,
            },
		},
		{
			name: 'Pokèmon5',
            location: {
                lat: 22.998632, 
                lng: 120.220109,
            },
		},
		{
			name: 'Pokèmon6',
            location: {
                lat: 22.9988238,
                lng: 120.2202326,
            },
		},
		{
			name: 'Pokèmon7',
            location: {
                lat: 23.008376,
                lng: 120.217925,
            },
		},
    ];
}

var models = [
    {
        url: '/pic-01.png',
        scale: '0.5 0.5 0.5',
        info: '全站儀',
        rotation: '0 180 0',
    },
    {
        url: '/20201110153200.jpg',
        scale: '1 0.2 0.2',
        rotation: '0 180 0',
        info: '測量系',
    },
    /*{
        url: './assets/dragonite/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Dragonite, Lv. 99, HP 150/150',
    },*/
];

var modelIndex = 0;
var setModel = function (model, entity) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
        entity.setAttribute('position', model.position);
    }

    entity.setAttribute('src-model', model.url);

    const div = document.querySelector('.instructions');
    div.innerText = model.info;
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

        setModel(models[modelIndex], model);

        model.setAttribute('animation-mixer', '');

        document.querySelector('button[data-action="change"]').addEventListener('click', function () {
            var entity = document.querySelector('[gps-entity-place]');
            modelIndex++;
            var newIndex = modelIndex % models.length;
            setModel(models[newIndex], entity);
        });

        scene.appendChild(model);
    });
}