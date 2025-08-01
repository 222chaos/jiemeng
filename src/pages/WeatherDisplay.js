import React, { useState } from 'react';
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaCloudShowersHeavy,
  FaSnowflake,
  FaSmog,
  FaQuestionCircle,
  FaCloudMoon,
  FaCloudSun,
  FaCloudSunRain,
  FaWind,
  FaBolt,
  FaMoon,
} from 'react-icons/fa';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const WeatherDisplay = ({ weatherText, futureWeatherText }) => {
  const getWeatherIcon = (weather) => {
    switch (weather) {
      case '小雨':
        return <FaCloudRain color="#69c" />;
      case '中雨':
        return <FaCloudRain color="#4682B4" />;
      case '大雨':
        return <FaCloudShowersHeavy color="#1E90FF" />;
      case '暴雨':
        return <FaCloudShowersHeavy color="#00008B" />;
      case '特大暴雨':
        return <FaCloudShowersHeavy color="#000080" />;

      case '小雪':
        return <FaSnowflake color="#ADD8E6" />;
      case '中雪':
        return <FaSnowflake color="#87CEFA" />;
      case '大雪':
        return <FaSnowflake color="#FFFFFF" />;
      case '暴雪':
        return <FaSnowflake color="#FFFFFF" />;
      case '晴':
        return <FaSun color="orange" />;
      case '多云':
        return <FaCloud />;
      case '阴':
        return <FaCloudMoon />;
      case '雷阵雨':
        return <FaBolt color="#FFD700" />;
      case '雨夹雪':
        return <FaCloudSunRain />;
      case '雾':
      case '霾':
        return <FaSmog />;
      case '大风':
        return <FaWind />;
      case '夜间晴':
        return <FaMoon />;
      default:
        return <FaQuestionCircle />;
    }
  };

  const formatWeatherText = (weatherText) => {
    try {
      if (!weatherText) {
        return '';
      }

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
          <span style={{ margin: '0 5px' }}></span>
          {temperature}°C
          <span style={{ margin: '0 5px' }}></span>
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
      if (!futureWeatherText) {
        return '';
      }

      const parsedData = JSON.parse(futureWeatherText);

      if (
        parsedData &&
        parsedData.forecasts &&
        parsedData.forecasts.length > 0
      ) {
        const { city, casts } = parsedData.forecasts[0];

        const formattedText = casts.slice(1).map((cast, index) => {
          const { dayweather, nightweather, daytemp, nighttemp } = cast;

          const today = new Date();
          const futureDate = new Date(today);
          futureDate.setDate(today.getDate() + index + 1);

          const dayWeatherIcon = getWeatherIcon(dayweather);

          return (
            <div key={index}>
              <div>{index + 1 === 1 && '明天'}</div>
              <div>{index + 1 === 2 && '后天'}</div>
              <div>{index + 1 === 3 && '大后天'}</div>

              <div>{dayWeatherIcon}</div>
              <div>{dayweather}</div>
              <div>{`${nighttemp} - ${daytemp}°`}</div>
            </div>
          );
        });

        return formattedText;
      } else {
        return '';
      }
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
  const [tomorrow, dayaftertomorrow, thedayaftertomorrow] =
    formattedFutureWeatherText;

  return (
    <>
      <label
        htmlFor="weatherText"
        style={{
          position: 'fixed',
          top: '10px',
          right: '20px',
          width: '200px',
          height: '40px',
          overflow: 'auto',
          border: 'none',
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          color: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {formattedWeatherText ? (
          formattedWeatherText
        ) : (
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 24, color: 'rgba(0,0,0,0.65)' }}
                spin
              />
            }
          />
        )}
      </label>

      <div
        style={{
          display: 'flex',
          position: 'fixed',
          top: showFutureWeather ? '60px' : '160px',
          right: '20px',
          width: '200px',
          height: '100px',
          overflow: 'auto',
          border: 'none',
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          opacity: showFutureWeather ? 1 : 0,
          transition: 'top 0.3s, opacity 0.3s',
          color: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {tomorrow ? (
          <div style={{ flex: 1 }}>{tomorrow}</div>
        ) : (
          <div style={{ flex: 1 }}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: 'rgba(0,0,0,0.65)' }}
                  spin
                />
              }
            />
          </div>
        )}
        {dayaftertomorrow ? (
          <div style={{ flex: 1 }}>{dayaftertomorrow}</div>
        ) : (
          <div style={{ flex: 1 }}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: 'rgba(0,0,0,0.65)' }}
                  spin
                />
              }
            />
          </div>
        )}
        {thedayaftertomorrow ? (
          <div style={{ flex: 1 }}>{thedayaftertomorrow}</div>
        ) : (
          <div style={{ flex: 1 }}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: 'rgba(0,0,0,0.65)' }}
                  spin
                />
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherDisplay;
