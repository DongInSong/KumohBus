import { busStopTargetArrival, busStopArrival, buslocation, kakaomap } from "config/api"
import DOMParser from 'react-native-html-parser';

// 내림차순 정렬
function compareBy_DESC(key) {
  return function (a, b) {
    var x = parseInt(a[key]);
    var y = parseInt(b[key]);

    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  };
}

export const getArrivalData = async (nodeId) => {
  try {
    const res = await fetch(`${busStopArrival}` + nodeId);
    const resJson = await res.json();
    const totalCount = resJson.data.response.body.totalCount; // 도착 버스 수
    const newRes = resJson.data.response.body.items.item; // 도착 정보 영역
    console.log(totalCount);

    // 버스 1대 도착시 임시 배열로 생성 후 setData
    if (totalCount === 1) {
      console.log([newRes]);
      return [newRes];
    }

    // 1대 이상
    else if (totalCount > 1) {
      newRes.sort(compareBy_DESC('arrtime')); // 예정 시간 순 정렬
      console.log(newRes);
      return newRes
    }

    // 데이터 없음
    else {
      console.log('No DATA');
      return null;
    }

  } catch (e) {
    console.log(e);
  }
};

export const getTargetArrivalData = async (nodeId, routeId) => {
  try {
    const res = await fetch(`${busStopTargetArrival}` + nodeId + '/' + routeId);
    const resJson = await res.json();
    const totalCount = resJson.data.response.body.totalCount; // 도착 버스 수
    const newRes = resJson.data.response.body.items.item; // 도착 정보 영역

    // 버스 1대 도착시 임시 배열로 생성 후 setData
    if (totalCount === 1) {
      console.log([newRes]);
      return [newRes];
    }

    // 데이터 없음
    else {
      console.log('No DATA');
      return null;
    }

  } catch (e) {
    console.log(e);
  }
};

export const getTotalBus = async (routeid) => {
  let totalCount = 0;
  try {
    const res = await fetch(`${buslocation}` + routeid);
    const resJson = await res.json();
    totalCount = resJson.data.response.body.totalCount; // 운행 버스 수
  }
  catch (e) {
    console.log(e);
  }
  return totalCount;
};

export const getLocation = async (routeid) => {
  try {
    const res = await fetch(`${buslocation}` + routeid);
    const resJson = await res.json();
    const totalCount = resJson.data.response.body.totalCount; // 운행 버스 수
    const newRes = resJson.data.response.body.items.item; // 정보 영역
    console.log(totalCount);

    // 버스 1대 운행시 임시 배열로 생성 후 setData
    if (totalCount === 1) {
      console.log([newRes]);
      return [newRes];
    }

    // 1대 이상
    else if (totalCount > 1) {
      console.log(newRes);
      return newRes
    }

    // 데이터 없음
    else {
      console.log('No DATA');
      return null;
    }

  } catch (e) {
    console.log(e);
  }
};

export const kakaoMapLoader = async () => {
  try {

   const res = await fetch(`${kakaomap}`);
   const resText = await res.text();
   return resText;
  //   .then(response => response.text())
  //  .then((response) => {
  //     console.log(response);
  //      return response;
  //  })
  //  .catch(err => console.log(err))

  }
  catch (e) {
    console.log(e);
  }
}
