import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [dream, setDream] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/dream",
        { dream },
        { timeout: 60000 }
      );
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">周公解梦</h1>
        <form onSubmit={handleSubmit}>
          <label>
            梦境内容：
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              className="input"
              placeholder="请输入梦境"
            />
          </label>
          <button type="submit" className="button">
            解梦
          </button>
        </form>
        {response && (
          <div className="response">
            <p>解梦结果：</p>
            <ReactMarkdown className="response-text">{response}</ReactMarkdown>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url("/980.jpg");
          background-size: 100% auto;
          background-repeat: no-repeat;
          height: 100vh;
        }

        .content {
          display: flex;
          justify-content: center; /* 将内容容器居中对齐 */
          align-items: center;
          flex-direction: column; /* 垂直布局 */
          padding: 12px;
          text-align: center;
          background-color: #f9f0e1;
          width: 90%;
          max-width: 400px;
        }

        .title {
          background-color: #f9f0e1;
        }

        .input {
          background-color: #f9f0e1;
          width: 90%; /* 调整输入框的宽度 */
          height: 150px;
          resize: vertical;
          padding: 8px;
          font-size: 16px;
        }

        .button {
          background-color: #f9f0e1;
          width: 100%;
          padding: 12px;
          font-size: 18px;
        }

        .response {
          margin-top: 20px;
          text-align: left;
        }

        .response-text {
          font-size: 16px;
          background-color: #f9f0e1;
          white-space: pre-line;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
}
