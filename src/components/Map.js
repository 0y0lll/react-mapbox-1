import React, { useRef, useEffect } from "react"
import ReactDOM from "react-dom"

// mapboxgl
import mapboxgl from "mapbox-gl"
import Marker from "../components/Marker"

// api
// import fetchFakeData from "../api/fetchFakeData"

// mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoibGFiMDIxIiwiYSI6ImQwMjdmMDlhNzBmMTRmYTY3MDFhZjZiYmNkZDI0MWRhIn0.L5TmPocGj72LszJ3mDOAiQ';

const Map = () => {
	// map container
	const mapContainerRef = useRef(null)

	// set lng lat
	// const [lng, setLng] = React.useState(0)
	// const [lat, setLat] = React.useState(0)
	const [zoom, setZoom] = React.useState(1.5)
	
	const [coord, setCoord] = React.useState([])

	// Initialize map when component mounts
	useEffect(() => {
		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/lab021/ckjrwhpwu6dwd19ulrbzq3h00',
			zoom: 2,
			center: [129.4363333, 36.11155],
			minZoom: 1,
			attributionControl: false,
			localIdeographFontFamily: 'Roboto, Noto Sans CJK, Arial, sans-serif',
			doubleClickZoom: false,
			crossSourceCollisions: false,
		})

		// Add navigation control (the +/- zoom buttons)
		// map.addControl(new mapboxgl.NavigationControl(), 'top-right')
		map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }));
		map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }));
		map.dragRotate.disable();

		map.on('load', () => {
			// add the data source for new a feature collection with no features
			// map.addSource("random-points-data", {
			// 	type: "geojson",
			// 	data: {
			// 		type: "FeatureCollection",
			// 		features: [],
			// 	},
			// })
			// // now add the layer, and reference the data source above by name
			// map.addLayer({
			// 	id: "random-points-layer",
			// 	source: "random-points-data",
			// 	type: "symbol",
			// 	layout: {
			// 		// full list of icons here: https://labs.mapbox.com/maki-icons
			// 		"icon-image": "bakery-15", // this will put little croissants on our map
			// 		"icon-padding": 0,
			// 		"icon-allow-overlap": true,
			// 	},
            // })
            
			map.addSource("point-marker", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: [],
				},
			})
			// now add the layer, and reference the data source above by name
			map.addLayer({
				id: "point-marker-layer",
				source: "point-marker",
				type: "symbol",
				layout: {
					// full list of icons here: https://labs.mapbox.com/maki-icons
					"icon-image": "bakery-15", // this will put little croissants on our map
					"icon-padding": 0,
					"icon-allow-overlap": true,
				},
			})
		})

		map.on("mousemove", (e) => {
			const lng = e.lngLat.wrap().lng.toFixed(5)
			const lat = e.lngLat.wrap().lat.toFixed(5)

			// setLng(lng)
			// setLat(lat)
			
			setCoord([lng, lat])

			// setLng(map.getCenter().lng.toFixed(4));
			// setLat(map.getCenter().lat.toFixed(4));
		})

		map.on("moveend", async () => {
			setZoom(map.getZoom().toFixed(2))

            // ----- random marker -----
			// // get center coordinates
			// const { lng, lat } = map.getCenter()
			// // fetch new data
			// const results = await fetchFakeData({
			// 	longitude: lng,
			// 	latitude: lat,
			// })
			// console.log(results.features)
			// // iterate through the feature collection and append marker to the map for each feature
			// results.features.forEach((result) => {
			// 	const id = result.properties.id
			// 	const geometry = result.geometry
			// 	// create marker node
			// 	const markerNode = document.createElement("div")
			// 	ReactDOM.render(<Marker id={id} />, markerNode)
			// 	// add marker to map
			// 	new mapboxgl.Marker(markerNode)
			// 		.setLngLat(geometry.coordinates)
			// 		.addTo(map)
            // })            

			// // update "random-points-data" source with new data
			// // all layers that consume the "random-points-data" data source will be updated automatically
            // map.getSource("random-points-data").setData(results)
            // ----- random marker -----
		})

		map.on('click', (e) => {            
            const lngLat = [e.lngLat.wrap().lng, e.lngLat.wrap().lat]
            
            const data = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [lngLat[0], lngLat[1]]
                    },
                }]
            }
            
			const markerNode = document.createElement('div')
			ReactDOM.render(<Marker />, markerNode)
            new mapboxgl.Marker(markerNode)
                .setLngLat(lngLat)
                .addTo(map);

            map.getSource('point-marker').setData(data);
		})

		// Clean up on unmount
		return () => map.remove()
	}, [])

	return (
		<div>
			<div className="toggle-component position-absolute">
				<div className="mouse-pointer bg-white rounded-lg shadow-sm d-flex align-items-center px-2 py-3">
					<div className="col-4 px-0">LON: {coord[0]}</div>
					<div className="col-4 px-0">LAT: {coord[1]}</div>
					<div className="col-4 px-0">Zoom: {zoom}</div>
				</div>
			</div>
			<div className="map-container" ref={mapContainerRef} />
		</div>
	)
}

export default Map
