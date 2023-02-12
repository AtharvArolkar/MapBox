import React, { useState } from "react";

export default function AddMark({ mapContainer }) {
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const handleContextMenu = (e) => {
    setLng(e.lngLat.lng);
    setLat(e.lngLat.lat);
    setInputValue("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddMarker = () => {
    // Add the marker to the map
  };

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />
      {lng && lat ? (
        <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
          <input type="text" value={inputValue} onChange={handleInputChange} />
          <button onClick={handleAddMarker}>Add Marker</button>
        </div>
      ) : null}
    </div>
  );
}
