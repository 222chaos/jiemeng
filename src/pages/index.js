import { useState, useEffect } from 'react';
import { Layout, ConfigProvider, Drawer, Table, Button } from 'antd';
import axios from 'axios';
import zhCN from 'antd/lib/locale/zh_CN';
import StyledComponentsRegistry from './component';
import { useSession } from 'next-auth/react';
import { preProcessFile } from 'typescript';

const utf8Decoder = new TextDecoder('utf-8');

export default function Home() {
  const [dream, setDream] = useState('');
  const [responseText, setResponseText] = useState('');
  const [weatherText, setWeatherText] = useState();
  const [futureWeatherText, setFutureWeatherText] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [dreamHistory, setDreamHistory] = useState([]);
  const [dreamData, setDreamData] = useState([]);
  useEffect(() => {
    setIsHydrated(true);

    fetch('/api/storage', { method: 'GET' })
      .then((response) => response.json())
      .then((responseData) => {
        setDreamData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const location = `${longitude},${latitude}`;

      try {
        const response = await fetch('/api/weather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({ location }),
        });

        const reader = response.body.getReader();

        const process = ({ done, value: chunk }) => {
          if (done) {
            console.log('Stream finished');
            return;
          }
          const decodedChunk = new TextDecoder().decode(chunk);
          setFutureWeatherText(decodedChunk);
          if (
            decodedChunk.startsWith(
              '{"status":"1","count":"1","info":"OK","infocode":"10000","lives":[{"province"',
            )
          ) {
            setWeatherText(decodedChunk);
          }

          return reader.read().then(process);
        };

        await process(await reader.read());
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  const loadingTexts = [
    'Loading...',
    '正在询问周公...',
    '正在翻阅梦书...',
    '好运正在路上...',
    'Loading 101% ...',
    '慢工出细活，久久方为功...',
    '周公正在解读梦境，请稍候...',
    '加载中，请稍候...',
    '卖力加载中...',
    'O.o ...',
    '马上就要写完咯...',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseText('');
    let tempText = '';

    try {
      await fetch('/api/dream', {
        method: 'POST',
        body: JSON.stringify({ dream }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status !== 200) return;
          const reader = response.body.getReader();

          return reader.read().then(function process({ done, value: chunk }) {
            if (done) {
              console.log('Stream finished');
              return;
            }
            setResponseText((responseText) => {
              return responseText + utf8Decoder.decode(chunk, { stream: true });
            });

            tempText += utf8Decoder.decode(chunk, { stream: true });
            console.log(
              'Received data chunk',
              utf8Decoder.decode(chunk, { stream: true }),
            );

            return reader.read().then(process);
          });
        })
        .catch(console.error);

      setDreamHistory((dreamHistory) => [
        ...dreamHistory,
        { dream, response: tempText },
      ]);
      console.log('111');
      const response2 = await axios.post(
        `/api/storage`,
        {
          dream,
          response: tempText,
          username: session?.user?.name,
        },
        { timeout: 10000 },
      );
      console.log('123123');
      console.log('response2', response2.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (record) => {
    // 从 record 中获取 id
    const id = record.id;

    // 发送 PUT 请求来更新数据状态为 false
    fetch(`/api/storage`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status: false }), // 更新为 false
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Record updated') {
          // 更新成功后，刷新数据或从前端中移除该项
          // 这取决于你的需求，你可以选择刷新整个数据或只是将该项从前端移除
          // 这里只是一个示例
          const updatedData = dreamData.map((item) => {
            if (item.id === id) {
              return { ...item, status: false };
            }
            return item;
          });
          setDreamData(updatedData);
        }
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Layout style={{ backgroundColor: '#fffbe9' }}>
      <ConfigProvider locale={zhCN}>
        <div className="container">
          {isHydrated && (
            <StyledComponentsRegistry
              dream={dream}
              setDream={setDream}
              handleSubmit={handleSubmit}
              response={responseText}
              isLoading={isLoading}
              loadingTexts={loadingTexts}
              weatherText={weatherText}
              futureWeatherText={futureWeatherText}
              open={open}
              showDrawer={showDrawer}
              onClose={onClose}
              dreamHistory={dreamHistory}
              handleDelete={handleDelete}
              dreamData={dreamData}
            />
          )}
        </div>
      </ConfigProvider>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background-color: #fffbe9;
          overflow-y: auto;
          height: 100vh;
        }
      `}</style>
    </Layout>
  );
}
