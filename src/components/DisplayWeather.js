import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Weather from './Weather';
import DisplayDate from './DisplayDate';
import './DisplayWeather.css';

const DisplayWeather = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [initDate, setInitDate] = useState(null);
    const [changeDay, setChangeDay] = useState(0);

    useEffect(() => {
        window.navigator.geolocation.getCurrentPosition(
            position => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);                
            },
            err => {
                console.log(err.message);
            }
        );

        const getLocation = async () => {
            const { data } = await axios.get('http://www.7timer.info/bin/api.pl', {
                params: {
                    lon: longitude,
                    lat: latitude,
                    product: 'civil',
                    output: 'json'
                }
            });

            // splitting data into 8x8 until I find a better solution

            const newArray = [...data.dataseries];

            const chunkedArray = newArray.reduce((accumulator, item, index) => { 
                const chunkIndex = Math.floor(index / 8);

                if (!accumulator[chunkIndex])
                    accumulator[chunkIndex] = []; // Begin new chunk

                accumulator[chunkIndex].push(item);

                return accumulator
            }, []);

            setInitDate(data.init)
            setWeatherData(chunkedArray);
        };

        if (longitude && latitude) {
            getLocation();
        };

    }, [longitude, latitude]);

    const onChangeDayNext = () => {
        if (changeDay < 7) {
            setChangeDay(changeDay + 1);
        };
    };

    const onChangeDayPrev = () => {
        if (changeDay > 0) {
            setChangeDay(changeDay - 1);
        };
    };

    return (
        <div className="display-weather">
            <div className="initial-date">
                <DisplayDate changeDay={changeDay} />
            </div>
            {
                changeDay > 0 ? 
                    <button
                        onClick={onChangeDayPrev}
                        className="change-prev"
                    >
                        &#8249;                       
                    </button>
                :   <div
                        className="empty-button-left"
                    ></div>
            }
            <Weather 
                weatherData={weatherData}
                changeDay={changeDay}
            />
            {
                    changeDay < 7 && weatherData ? <button
                        onClick={onChangeDayNext}
                        className="change-next"
                    >
                       &#8250;               
                    </button>
                :   <div
                        className="empty-button-right"
                    ></div>
            }
        </div>
    );
};

export default DisplayWeather;