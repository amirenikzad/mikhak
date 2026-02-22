import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Center, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { giveDir, giveText } from './MultiLanguages/HandleLanguage.jsx';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '../ui/accordion.jsx';
import { Radio, RadioGroup } from '../ui/radio.jsx';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({
                        location,
                        onChange,
                        selectable = true,
                        height = '490px',
                        width = '100%',
                        zoom = 5,
                        mapOptionsP = '2',
                      }) => {
  const iranCoordinates = location[0] ? location : [32.4279, 53.6880];
  const [value, setValue] = useState('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (selectable) {
          const { lat, lng } = e.latlng;

          onChange({ target: { name: 'long', value: lng } });
          onChange({ target: { name: 'lat', value: lat } });
        }
      },
    });

    return location === null ? null : (
      <Marker position={location}>
        {/* Optional: You can add a Popup to display the lat/lng */}
      </Marker>
    );
  };

  return (
    <>
      <MapContainer center={iranCoordinates} zoom={zoom} style={{ height: height, width: width }}>
        <TileLayer url={value} attribution="" />
        <LocationMarker />
      </MapContainer>

      <Box p={mapOptionsP}>
        <AccordionRoot collapsible>
          <AccordionItem>
            <AccordionItemTrigger cursor={'pointer'}>
              <Center as="span" flex="1" textAlign="left">
                <Text textAlign={giveDir() === 'rtl' ? 'right' : 'left'} fontWeight={'500'}>
                  {giveText(146)}
                </Text>
              </Center>
            </AccordionItemTrigger>
            <AccordionItemContent pb={4}>
              <RadioGroup onValueChange={(e) => setValue(e.value)} value={value} dir={'ltr'}>
                <Radio mr={4} value="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
                  OpenStreetMap
                </Radio>
                <Radio mr={4}
                       value="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}">
                  Esri (Satellite)
                </Radio>
                <Radio mr={4}
                       value="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}">
                  Esri (World Street Map)
                </Radio>
                <Radio mr={4} value="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png">
                  CartoDB (Light)
                </Radio>
                <Radio mr={4} value="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png">
                  CartoDB (Dark)
                </Radio>
              </RadioGroup>
            </AccordionItemContent>
          </AccordionItem>
        </AccordionRoot>
      </Box>
    </>
  );
};

export default MapComponent;
