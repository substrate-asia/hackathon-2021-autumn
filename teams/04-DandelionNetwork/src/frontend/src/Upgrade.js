/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-08-24 17:38:31
 * @LastEditors: Liyb
 * @LastEditTime: 2021-10-10 21:59:40
 */
import React, { useState, MutableRefObject, useRef } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { Icon, Button, Input, Upload } from 'antd';

import '../src/views/style/layout.css';

const ipfsApi = require('ipfs-http-client');
const ipfs = ipfsApi.create({ host: 'ipfs.dandelionwallet.com', protocal: 'https' });
console.log(ipfs);

export default function Main (props) {
  const [status, setStatus] = useState('');
  const [proposal, setProposal] = useState({});
  const { accountPair } = props;
  const { getData } = props;
  const [strHash, setStrHassh] = useState('');
  const [strContent, setStrContent] = useState('');
  const inputEl = useRef(null);
  const [fileName, setfileName] = useState('');

  const bufferToHex = buffer => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleFileChosen = file => {
    const fileReader = new FileReader();
    fileReader.onloadend = e => {
      const content = bufferToHex(fileReader.result);
      setProposal(`0x${content}`);
    };

    fileReader.readAsArrayBuffer(file);
  };
  const beforeUpload = (file, fileList) => {
    console.log('fileList', file);
    this.fileName = file.name;
    this.file = file;
    return false;
  };
  const saveTextBlobOnIpfs = (reader) => {
    let ipfsId;
    console.log(reader);
    const buffer = Buffer.from(reader.result);
    ipfs.add(buffer).then(response => {
      console.log(response);
      ipfsId = response.path;
      setStrHassh(ipfsId);
      getData(ipfsId);
    });
  };
  const uploadIpfs = () => {
    /*  const ipfsContent = inputEl.current.input.defaultValue; */
    console.log('13', fileName);
    const reader = new window.FileReader();
    reader.onloadend = () => saveTextBlobOnIpfs(reader);
    reader.readAsArrayBuffer(fileName);
  };
  const Utf8ArrayToStr = (array) => {
    console.log(array);
    let out, i, len, c;
    let char2, char3;
    out = '';
    len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12:
        case 13:
        // 110x xxxx 10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
          break;
        default:
          break;
      }
    }
    return out;
  };
  return (
    <Grid.Column width={8} centered style={{ height: 250 }}>
      <h1>上传文件信息</h1>
      <Form>
        <Form.Field style={{ width: 500, height: 100 }}>
        <a href="javascript:;" className="file gradient">
        <Icon type="plus" className="Icon"/>
        <Input
            ref = {inputEl}
            id='file'
            style={{ width: '100px', height: '100px', opacity: 0 }}
            type='file'
            label='上传文件'
            value=""
            onChange = {(e) => {
              setfileName(e.target.files[0]);
            }}/*  */
        />
        </a>
        <p>{fileName.name}</p>
        <Button type="primary"
         style={{ width: 200, height: 50, borderRadius: 20, textAlign: 'center' }}
          onClick= { uploadIpfs }>
              UPLOAD
        </Button>
        <a target="_blank"
            href={'https://gateway.dandelionwallet.com/ipfs/' + strHash}>
            {strHash}
          </a>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}
