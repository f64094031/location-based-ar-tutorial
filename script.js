window.onload = () => {
     let places = staticLoadPlaces();
     renderPlaces(places);
};

function staticLoadPlaces() {
    return [
        {
            name: 'Magnemite',
            location: {
                lat: 22.9986726,
                lng: 120.2178136,
            }
			name: 'Magnemite1',
            location: {
                lat: 22.9886726,
                lng: 120.2078136,
            }
			name: 'Magnemite2',
            location: {
                lat: 22.998652,
                lng: 120.218399,
            }
			name: 'Magnemite3',
            location: {
                lat: 22.9987477,
                lng: 120.2190629,
            }
			name: 'Magnemite4',
            location: {
                lat: 22.9986245,
                lng: 120.2199156,
            }
			name: 'Magnemite5',
            location: {
                lat: 22.998800, 
                lng: 120.219826,
            }
        },
    ];
}

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        model.setAttribute('gltf-model', './assets/magnemite/scene.gltf');
        model.setAttribute('rotation', '0 180 0');
        model.setAttribute('animation-mixer', '');
        model.setAttribute('scale', '0.5 0.5 0.5');

        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        scene.appendChild(model);
    });
}