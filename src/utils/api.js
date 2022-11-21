import axios from "axios";

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
    const url = 'http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList?ServiceKey=btg61%2BH2BcIymonQ260mu2Q1kkjD0WBSsdTdDScJd8OunwmGJvImYug6yIvJpZr%2BZ1oUsXYCLNZ5AXXzhvo9sQ%3D%3D&pageNo=1&numOfRows=100&cityCode=37050&nodeId=' + nodeId + '&_type=json';
    const { data } = await axios.get(url);
    let res = data;

    const totalCount = res.response.body.totalCount; // 도착 버스 수
    const newRes = res.response.body.items.item; // 도착 정보 영역
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

export const getTotalBus = async (routeid) =>{
  let totalCount = 0;
  try {
    const url = 'http://apis.data.go.kr/1613000/BusLcInfoInqireService/getRouteAcctoBusLcList?ServiceKey=btg61%2BH2BcIymonQ260mu2Q1kkjD0WBSsdTdDScJd8OunwmGJvImYug6yIvJpZr%2BZ1oUsXYCLNZ5AXXzhvo9sQ%3D%3D&pageNo=1&numOfRows=100&cityCode=37050&routeId=' + routeid + '&_type=json';
    const { data } = await axios.get(url);
    let res = data;

    totalCount = res.response.body.totalCount; // 운행 버스 수
  }
  catch (e) {
    console.log(e);
  }
  return totalCount;
}

export const getLocation = async (routeid) => {
  try {
    const url = 'http://apis.data.go.kr/1613000/BusLcInfoInqireService/getRouteAcctoBusLcList?ServiceKey=btg61%2BH2BcIymonQ260mu2Q1kkjD0WBSsdTdDScJd8OunwmGJvImYug6yIvJpZr%2BZ1oUsXYCLNZ5AXXzhvo9sQ%3D%3D&pageNo=1&numOfRows=100&cityCode=37050&routeId=' + routeid + '&_type=json';
    const { data } = await axios.get(url);
    let res = data;

    const totalCount = res.response.body.totalCount; // 운행 버스 수
    const newRes = res.response.body.items.item; // 정보 영역
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