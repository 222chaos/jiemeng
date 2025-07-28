import { Drawer, Spin } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

const PAGE_SIZE = 7;

const DreamHistoryDrawer = ({ open, showDrawer, onClose, handleDelete }) => {
  const actionRef = useRef();

  const fetchLocalDreams = async (params) => {
    const { current = 1, pageSize = PAGE_SIZE, dream } = params;
    const savedData = localStorage.getItem('dreamData');
    let allData = savedData ? JSON.parse(savedData) : [];

    // 简单过滤
    if (dream) {
      allData = allData.filter((item) => item.dream.includes(dream));
    }

    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    const pageData = allData.slice(start, end);

    return {
      data: pageData,
      total: allData.length,
      success: true,
    };
  };

  return (
    <div>
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="close-button" onClick={onClose}>
              返回
            </button>
          </div>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        width={1300}
        forceRender={true}
      >
        <ProTable
          search={{ filterType: 'query', labelWidth: 'auto' }}
          request={fetchLocalDreams}
          actionRef={actionRef}
          columns={[
            {
              title: '梦境',
              dataIndex: 'dream',
              key: 'dream',
              width: 250,
            },
            {
              title: '解梦结果',
              dataIndex: 'response',
              key: 'response',
              width: 1000,
            },
            {
              title: '操作',
              valueType: 'option',
              width: 75,
              hideInSearch: true,
              render: (_, record) => (
                <a
                  key="delete"
                  onClick={() => {
                    handleDelete(record);
                    actionRef.current?.reload();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  删除
                </a>
              ),
            },
          ]}
          rowKey="id"
          pagination={{
            defaultPageSize: PAGE_SIZE,
          }}
        />
      </Drawer>
      <button className="history-button" onClick={showDrawer}>
        历史
      </button>

      <style jsx>{`
        .history-button {
          position: absolute;
          top: 10px;
          right: 240px;
          height: 40px;
          padding: 10px 20px;
          background-color: rgba(255, 255, 255, 0.6);
          color: rgba(0, 0, 0, 0.75);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .close-button {
          padding: 8px 16px;
          background-color: #ffffff;
          color: #333333;
          border: 1px solid #cccccc;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .history-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default DreamHistoryDrawer;
