import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

class MapMain extends React.Component {

    state = {
      zoom: 11,
      friendsCoordinates: [],
    } 

    render() {
    const position = [this.props.lat, this.props.lng]
    const pinU = renderToStaticMarkup(<i id="user" class="fas fa-map-pin"></i>)
    const pinF = renderToStaticMarkup(<i id="friend" class="fas fa-map-pin"></i>)
    const pointer = renderToStaticMarkup(<i id="place" class="fas fa-map-marker-alt"></i>);
    const place = divIcon({
      html: pointer,
    });
    const personU = divIcon({
      html: pinU,
    });
    const personF = divIcon({
      html: pinF,
    });

    return (
    <div style={{textAlign: "center", marginBottom: "20px"}}>
      <Map center={position} zoom={this.state.zoom} 
      style={{display: "inline-block", height: "450px", width: "800px", border:"2px solid #EB5E55", borderRadius: "25px"}}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker zIndexOffset={1000} icon={personU} position={position}>
          <Popup>
            You are near {this.context.currentLocation}
          </Popup>
        </Marker>

        {this.props.restaurants !== undefined? 
          this.props.restaurants.map(result => {
          return <Marker icon={place} key={result.id} position={[result.coordinates.latitude,result.coordinates.longitude]}><Popup>
            <div className="popup">
              <h4>{result.name}</h4>
              <img className="popup-image" src={result.image_url}/>
              <p>{result.location.display_address.join(', ')}</p>
              <p>{result.display_phone}</p>
              <p>Rating <strong>{result.rating}</strong></p>
              <p>Price Range <strong>{result.price}</strong></p>
            </div>
            </Popup></Marker>
          }):null  
        }

        {this.props.friends !== undefined? 
          this.props.friends.map(result => {
          return <Marker icon={personF} key={"test"} position={[result.lat,result.long]}><Popup>
            <div className="popup">
              <h3>{result.name}</h3>
              <img className="popup-image" src={result.image} alt={result.name}/>
              <p>{result.address}</p>
            </div>
            </Popup></Marker>
          }):null  
        }

      </Map>
    </div>
    )
    }

}

export default MapMain