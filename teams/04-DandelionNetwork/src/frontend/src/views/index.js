/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-09-08 20:10:26
 * @LastEditors: Liyb
 * @LastEditTime: 2021-09-09 16:36:54
 */
import React, { useRef } from 'react';
import { Carousel, Icon, Button } from 'antd';
import 'antd/dist/antd.css';
import './style/layout.css';
import { Route, withRouter } from 'react-router-dom';

export default function Index (props) {
  const card = useRef(null);
  const handleGoTo = () => {
    props.history.push('/page');
  };
  return (
    <div style={{ backgroundColor: 'black', width: '100%', height: '100vh' }}>
    <Icon type="left" className="arrow" onClick = {() => {
      card.current.prev();
    }} />
    <Icon type="right" className="arrow" style={{ right: '0px' }} onClick = {() => {
      card.current.next();
    }} />
    <div className="indexWord">welcome Dandelion NetWork</div>
    <div className="indexButton">
    <Button ghost size="large" shape="round" onClick={handleGoTo}>
        start
        <Icon type="right" />
    </Button>
    </div>
    <Carousel
      arrows
      autoplay
      ref = {card}
    >
      <div>
      <div className="carsouel1" ></div>
      </div>
      <div>
      <div className="carsouel2"></div>
      </div>
      <div>
      <div className="carsouel3"></div>
      </div>
    </Carousel>
  </div>
  );
}
