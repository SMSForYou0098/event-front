import React, { useEffect } from 'react'
import { Map, Marker } from 'pigeon-maps'

// Custom marker component with count
const CustomMarker = ({ count, color }) => (
  <div style={{
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    backgroundColor: color,
    borderRadius: '50%',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
  }}>
    {count}
  </div>
)

const UserMap = ({ users, locationData, loading, mapConfig }) => {

  // Group users by city and state to get coordinates
  const cityCoordinates = {}
  const stateCoordinates = {}
  
  users.forEach(user => {
    if (user.latitude && user.longitude) {
      if (user.locality) {
        cityCoordinates[user.locality] = [user.latitude, user.longitude]
      }
      if (user.state) {
        stateCoordinates[user.state] = [user.latitude, user.longitude]
      }
    }
  })

  if (loading) {
    return <div>Loading map...</div>
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <Map 
        defaultCenter={mapConfig.defaultCenter}
        defaultZoom={mapConfig.defaultZoom}
        height={mapConfig.height}
      >
        {/* City Markers */}
        {Object.entries(locationData.cities).map(([city, count], index) => (
          cityCoordinates[city] ? (
            <Marker
              key={`city-${index}`}
              width={30}
              anchor={cityCoordinates[city]}
              color="transparent"
            >
              <CustomMarker count={count} color="rgba(255, 99, 132, 0.8)" />
            </Marker>
          ) : null
        ))}

        {/* State Markers */}
        {Object.entries(locationData.states).map(([state, count], index) => (
          stateCoordinates[state] ? (
            <Marker
              key={`state-${index}`}
              width={40}
              anchor={stateCoordinates[state]}
              color="transparent"
            >
              <CustomMarker count={count} color="rgba(54, 162, 235, 0.8)" />
            </Marker>
          ) : null
        ))}
      </Map>

      {/* Legend */}
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        right: '20px',
        background: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: 'rgba(255, 99, 132, 0.8)', 
            marginRight: '5px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '10px'
          }}>
            12
          </div>
          <span>Cities</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: 'rgba(54, 162, 235, 0.8)', 
            marginRight: '5px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '10px'
          }}>
            8
          </div>
          <span>States</span>
        </div>
      </div>
    </div>
  )
}

export default UserMap