import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const mockRoutes = [
  {
    id: 1,
    veiculo: "Caminhão 01",
    origem: { lat: -23.55052, lng: -46.633308 },
    destino: { lat: -23.5733, lng: -46.6417 },
    paradas: [
      { lat: -23.5601, lng: -46.6443 },
      { lat: -23.5655, lng: -46.6358 },
    ],
    desvio: false,
  },
  {
    id: 2,
    veiculo: "Van 02",
    origem: { lat: -22.9068, lng: -43.1729 },
    destino: { lat: -22.9759, lng: -43.2268 },
    paradas: [
      { lat: -22.9103, lng: -43.2096 },
      { lat: -22.9437, lng: -43.1906 },
    ],
    desvio: true,
  },
];

function FleetControl() {
  const [directions, setDirections] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    if (selectedRoute && selectedRoute.desvio) {
      alert(`⚠️ Desvio detectado para o veículo ${selectedRoute.veiculo}!`);
    }
  }, [selectedRoute]);

  const calculateRoute = async (route) => {
    const directionsService = new window.google.maps.DirectionsService();

    const result = await directionsService.route({
      origin: route.origem,
      destination: route.destino,
      waypoints: route.paradas.map((parada) => ({
        location: parada,
        stopover: true,
      })),
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirections(result);
    setSelectedRoute(route);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ display: "flex" }}>
        {/* Lista de rotas */}
        <div style={{ width: "30%", padding: "10px", background: "#f4f4f4" }}>
          <h2>Controle de Frotas</h2>
          {mockRoutes.map((route) => (
            <div
              key={route.id}
              style={{
                marginBottom: "15px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <h3>{route.veiculo}</h3>
              <p>
                <strong>Origem:</strong> {route.origem.lat}, {route.origem.lng}
              </p>
              <p>
                <strong>Destino:</strong> {route.destino.lat},{" "}
                {route.destino.lng}
              </p>
              <button
                style={{
                  background: "#007BFF",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
                onClick={() => calculateRoute(route)}
              >
                Exibir Rota
              </button>
            </div>
          ))}
        </div>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: -23.55052, lng: -46.633308 }}
          zoom={12}
        >
          {directions && <DirectionsRenderer directions={directions} />}

          {selectedRoute &&
            selectedRoute.paradas.map((parada, index) => (
              <Marker key={index} position={parada} label={`${index + 1}`} />
            ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

export default FleetControl;
