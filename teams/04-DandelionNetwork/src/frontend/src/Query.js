/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-10-10 17:17:52
 * @LastEditors: Liyb
 * @LastEditTime: 2021-10-19 10:27:54
 */
/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-08-24 17:38:31
 * @LastEditors: Liyb
 * @LastEditTime: 2021-10-10 17:05:28
 */
import React, { useState } from 'react';
import { Grid, Image } from 'semantic-ui-react';
import { Input, Select, Table } from 'antd';
import Transfer from './Transfer';

import '../src/views/style/layout.css';

function Query (props) {
  const [status, setStatus] = useState('');
  const { accountPair } = props;
  const [src, setAddress] = useState('');
  const [hashValExact, setHashVal] = useState(['12312']);
  const { gainData } = props;
  const { setDataSource } = props;
  const infos = ['0x516d64427342706f755a5a7a4d7657686555595171776a70466a3273507445695964354b53707632666479455278', '0x516d63625231747747787a6367646868344e474b5039315338394a34586976796b41365645783350776a736a366b'];
  const { Search } = Input;
  const { Option } = Select;
  let dataSourceS = [];
  const queryInfo = (value) => {
    gainData(value).then(res => {
      convert(res);
    });
  };
  const convert = (val) => {
    const bytes = {};
    const hashVal = [];
    for (let i = 0; i < val.length; i++) {
      bytes[i] = [];
      for (let j = 1; 2 * j < val[i].length; j++) {
        bytes[i].push('0x' + val[i].substring(2 * j, 2 * j + 2));
      }
      hashVal.push(String.fromCharCode(...bytes[i]));
    }
    setHashVal(hashVal);
    console.log('图片地址', hashVal);
    dataSourceS = hashVal.map(item => {
      return {
        Hash: item
      };
    });
    setDataSource(dataSourceS);
  };
  const handleValue = (val) => {
    console.log(val);
    setAddress(val.item);
  };
  return (
    <Grid.Column width ={8} style={{ height: 250 }}>
      <h1>USER DATA</h1>
      <Search
        enterButton = "QUERY"
        placeholder="input account address"
        onSearch={queryInfo}
        style={{ width: 350, height: 50, borderRadius: 20 }}
      />
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <div style={{ width: '50%', marginBottom: '50px' }}>
        <Select style={{ width: '170%' }}
          onChange={handleValue}
        >
        {
          hashValExact.map((item, index) => {
            return <Option value={{ item }} key = {index}>{item}</Option>;
          })
        }
        </Select>
      </div>
      <div style={{ marginBottom: '30px', height: '100%', border: '1px solid black', justifyContent: 'center', display: 'flex' }}>
        <iframe style={{ width: '100%', height: '251px' }} src={'https://gateway.dandelionwallet.com/ipfs/' + src} title="preview"></iframe>
      </div>
      <Transfer accountPair={accountPair} />
      </div>
    </Grid.Column>

  );
}
export { Query };
