import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import StyledComponentsRegistry from './component';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const [dream, setDream] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // Track if the client has finished rendering

  useEffect(() => {
    setIsHydrated(true); // Set isHydrated to true when the client has finished rendering
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
    try {
      const response = await axios.post(
        '/api/dream',
        { dream },
        { timeout: 60000 },
      );
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const SessionComponent = () => {
    const { data: session } = useSession();
    if (session) {
      return (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      );
    }

    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
  };

  return (
    <Layout>
      <ConfigProvider locale={zhCN}>
        <div className="container">
          {isHydrated && ( // Render the component only if the client has finished rendering
            <SessionComponent />
          )}

          {isHydrated && (
            <StyledComponentsRegistry
              dream={dream}
              setDream={setDream}
              handleSubmit={handleSubmit}
              response={response}
              isLoading={isLoading}
              loadingTexts={loadingTexts}
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
          height: 100vh;
          padding-top: 20px;
          overflow-y: auto;
        }
      `}</style>
    </Layout>
  );
}
