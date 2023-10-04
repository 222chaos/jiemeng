import React, { useState } from 'react';
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaCloudShowersHeavy,
  FaSnowflake,
  FaSmog,
  FaQuestionCircle,
} from 'react-icons/fa';

const WeatherDisplay = ({ weatherText, futureWeatherText }) => {
  const getWeatherIcon = (weather) => {
    switch (weather) {
      case '晴':
        return <FaSun />;
      case '多云':
        return <FaCloud />;
      case '小雨':
        return <FaCloudRain />;
      case '大雨':
        return <FaCloudShowersHeavy />;
      case '大雪':
        return <FaSnowflake />;
      case '雾':
        return <FaSmog />;
      default:
        return <FaQuestionCircle />;
    }
  };

  // 在 formatWeatherText 函数中使用 getWeatherIcon
  const formatWeatherText = (weatherText) => {
    try {
      const { lives } = JSON.parse(weatherText);
      const {
        reporttime,
        city,
        province,
        weather,
        temperature,
        winddirection,
        windpower,
        humidity,
      } = lives[0];

      const weatherIcon = getWeatherIcon(weather);

      const formattedText = (
        <>
          {city}
          <> </>
          {temperature}°C
          <> </>
          {weatherIcon}
        </>
      );

      return formattedText;
    } catch (error) {
      console.error('Invalid weatherText JSON:', error);
      return '';
    }
  };

  const formatFutureWeatherText = (futureWeatherText) => {
    try {
      const { forecasts } = JSON.parse(futureWeatherText);
      const { city, casts } = forecasts[0];

      const formattedText = casts
        .slice(1)
        .map((cast, index) => {
          const { dayweather, nightweather, daytemp, nighttemp } = cast;

          const today = new Date();
          const futureDate = new Date(today);
          futureDate.setDate(today.getDate() + index + 1);

          let dateDescription;
          switch (index + 1) {
            case 1:
              dateDescription = '明天';
              break;
            case 2:
              dateDescription = '后天';
              break;
            case 3:
              dateDescription = '大后天';
              break;
            default:
              dateDescription = `${
                futureDate.getMonth() + 1
              }/${futureDate.getDate()}`;
              break;
          }

          return `${dateDescription}\n天气：${dayweather}\n ${nighttemp} - ${daytemp}°`;
        })
        .join('\n');

      return formattedText;
    } catch (error) {
      console.error('Invalid futureWeatherText JSON:', error);
      return '';
    }
  };

  const [showFutureWeather, setShowFutureWeather] = useState(false);

  const handleMouseEnter = () => {
    setShowFutureWeather(true);
  };

  const handleMouseLeave = () => {
    setShowFutureWeather(false);
  };

  const formattedWeatherText = formatWeatherText(weatherText);
  const formattedFutureWeatherText = formatFutureWeatherText(futureWeatherText);

  return (
    <>
      <label
        htmlFor="weatherText"
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          width: '200px',
          height: '40px',
          overflow: 'auto',
          border: '1px solid black',
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {formattedWeatherText}
      </label>
      {showFutureWeather && (
        <textarea
          value={formattedFutureWeatherText}
          readOnly
          style={{
            position: 'fixed',
            top: '180px',
            right: '10px',
            width: '320px',
            height: '160px',
            overflow: 'auto',
          }}
        />
      )}
    </>
  );
};

export default WeatherDisplay;
