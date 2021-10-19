/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-08-24 17:38:31
 * @LastEditors: Liyb
 * @LastEditTime: 2021-10-17 21:57:04
 */
import React, { useState, createRef,useRef,useEffect  } from 'react';
import { Container, Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'antd/dist/antd';
import {Table} from 'antd'

import { SubstrateContextProvider, useSubstrate } from '../substrate-lib';
import { DeveloperConsole } from '../substrate-lib/components';

import AccountSelector from '../AccountSelector';
import Upgrade from '../Upgrade';
import Interactor from '../Interactor';
import Events from '../Events'
import { TxButton, TxGroupButton } from '../substrate-lib/components';
import Transfer from '../Transfer';
import {Query} from '../Query'

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const [hash,setHash] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const [interxType,setInterxType] = useState('EXTRINSIC');
  const [palletRpc,setPalletRpc] = useState('dandelion');
  const [callable,setCallable] = useState("getFileHash");
  const [type,setType] = useState('SIGNED-TX')
  const [paramFields,setParamFields] = useState([]);
  const [status, setStatus] = useState(null);
  const [result,setResult] = useState(null);
  const [infos,setInfos] = useState([])
  const [dataSource, setDataSource] = useState([]); 
  const [inputParams,setInputParams] = useState([])
  const buttonRef = useRef(null);
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);
  useEffect(()=>{
    console.log(status)
    if (status != null && status.indexOf('0x') > -1) {
      setInfos([...infos,status])
    }
  },[status])
  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate' + apiState);

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }
  const columns = [{
    title: 'user data',
    dataIndex: 'Hash',
    render: val => <a target="_blank" href={'https://gateway.dandelionwallet.com/ipfs/' + val}>{val}</a>
  }];
  const gainData = (data) =>{
    return new Promise(resolve =>{
      let resultInfo = []
      setInfos([])
      setInterxType('RPC')
      setCallable("getFileHash")
      setInputParams([{type: "AccountId",value:data}])
      setParamFields([{name: "owner", type: "AccountId", optional: false},{name: "at", type: "Hash", optional: true}])
      setType('RPC')
      setTimeout(() => {
        buttonRef.current.changeVal()
      }, 500);
      if (infos.length > 0) {
        resultInfo = infos[0].split(",")
        for(let i = 0; i < resultInfo.length;i++) {
          if(i === resultInfo.length - 1) {
            resultInfo[resultInfo.length - 1] =  resultInfo[resultInfo.length - 1].substring(1,resultInfo[resultInfo.length - 1].length - 1)
            break
          }
          resultInfo[i] = resultInfo[i].substr(1)
        }
        console.log('结果',resultInfo)
        resolve(resultInfo)
      }
    })
  }
  /* const gainData = (data) => {
    setInterxType('QUERY')
    setCallable("allProvesArray")
    setType('QUERY')
    setInfos([])
    let res = []
      console.log('数据',status)
      setTimeout(() => {
        let i = 1
        while (i < 100) {
          setInputParams([{type: "8",value:i.toString()}])
          setParamFields([{name: "8", type: "8", optional: false}])
          buttonRef.current.changeVal()
          if (status == null) break
          if (status.indexOf('0x00000') > -1) {
           break
          } 
          i++
        }
        console.log(infos)
      }, 1000)
  } */
  const contextRef = createRef();

  return (
    <div ref={contextRef}>
       <Sticky style={{marginBottom:"20px"}} context={contextRef}>
        <AccountSelector setAccountAddress={setAccountAddress} />
      </Sticky>
      <Container>
        <Grid stackable columns='equal'>
          <Grid.Row>
            <Query accountPair={accountPair} gainData = {gainData} setDataSource = {setDataSource} infos = {infos}/>
            <TxButton
            style = {{display: 'none'}} 
            setStatus={setStatus}
            accountPair={accountPair} 
            attrs={{ interxType, palletRpc, callable,inputParams, paramFields }}
            cRef = {buttonRef}
            hash={hash}
            label='Submit'
            type={type}
            color='blue'/>
            <Table style ={{ width:'50%' }} dataSource={dataSource} columns={columns} />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  );
}

export default function Index () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
