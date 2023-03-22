window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '﹖';

    let places = staticLoadPlaces();
    renderPlaces(places);
};

function staticLoadPlaces() {
    return [
        {
			name: 'Pokèmon',
            location: {
                lat: 22.9986726,
                lng: 120.2178136,
            },
			name: 'Pokèmon1',
            location: {
                lat: 22.9886726,
                lng: 120.2078136,
            },
			name: 'Pokèmon2',
            location: {
                lat: 22.998652,
                lng: 120.218399,
            },
			name: 'Pokèmon3',
            location: {
                lat: 22.9987477,
                lng: 120.2190629,
            },
			name: 'Pokèmon4',
            location: {
                lat: 22.9986245,
                lng: 120.2199156,
            },
			name: 'Pokèmon5',
            location: {
                lat: 22.998800, 
                lng: 120.219826,
            },
        },
    ];
}

var models = [
    {
        url: 'D:/昊翰/成大三/專題/location-based-ar-tutorial/location-based-ar-tutoria/assets/magnemite/scene.gltf',
        scale: '0.5 0.5 0.5',
        info: 'Magnemite, Lv. 5, HP 10/10',
        rotation: '0 180 0',
    },
    {
        url: 'D:/昊翰/成大三/專題/location-based-ar-tutorial/location-based-ar-tutoria/assets/articuno/scene.gltf',
        scale: '0.2 0.2 0.2',
        rotation: '0 180 0',
        info: 'Articuno, Lv. 80, HP 100/100',
    },
    {
        url: 'D:/昊翰/成大三/專題/location-based-ar-tutorial/location-based-ar-tutoria/assets/dragonite/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Dragonite, Lv. 99, HP 150/150',
    },
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

    entity.setAttribute('gltf-model', model.url);

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