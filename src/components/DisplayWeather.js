import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Weather from './Weather';

const DisplayWeather = () => {
    // const [latitude, setLatitude] = useState(null);
    // const [longitude, setLongitude] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [initDate, setInitDate] = useState(null);

    useEffect(() => {
        // window.navigator.geolocation.getCurrentPosition(
        //     position => {
        //         setLatitude(position.coords.latitude);
        //         setLongitude(position.coords.longitude);                
        //     },
        //     err => {
        //         console.log(err.message);
        //     }
        // );

        const getLocation = async () => {
            const { data } = await axios.get('http://www.7timer.info/bin/api.pl', {
                params: {
                    lon: 113.17,
                    lat: 23.09,
                    product: 'civil',
                    output: 'json'
                }
            });

            const newArray = [...data.dataseries];
            let updateArray = [];
            let sliceTo = 8;
    
            for (let i = 0; i < newArray.length; i++) {
                if (i % 8 === 0 || i === 0) {
                    updateArray = [...updateArray, newArray.slice(i, sliceTo)];
                    sliceTo += 8;
                };
            };
            setInitDate(data.init)
            setWeatherData(updateArray);
        };

        getLocation();

    }, []);

    return (
        <div className="display-weather">
            <div className="initial-date">
                { initDate ? initDate : 'Loading'}
            </div>
            <Weather 
                weatherData={weatherData} 
            />
        </div>
    );
};

export default DisplayWeather;