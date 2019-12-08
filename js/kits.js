; (function () {
  var kits = {};

  //生成[min,max]区间的随机整数
  /**
   * 
   * @param {Number} n 
   * @param {Number} m 
   */
  kits.randomInt = function (n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n);
  };

  // 生成RGB随机颜色
  kits.randomRGB = function () {
    function randomInt(n, m) {
      return Math.floor(Math.random() * (m - n + 1) + n);
    }
    // 生成3个随机整数
    var r = randomInt(0, 255);
    var g = randomInt(0, 255);
    var b = randomInt(0, 255);
    // 把三个随机整数拼接到rgb格式里面
    var color = "rgb(" + r + "," + g + "," + b + ")";
    return color;
  };

  // 生成16进制的随机颜色
  kits.randomColor = function () {
    function randomInt(n, m) {
      return Math.floor(Math.random() * (m - n + 1) + n);
    }
    var arr = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f"
    ];
    var color =
      "#" +
      arr[kits.randomInt(0, 15)] +
      arr[kits.randomInt(0, 15)] +
      arr[kits.randomInt(0, 15)] +
      arr[kits.randomInt(0, 15)] +
      arr[kits.randomInt(0, 15)] +
      arr[kits.randomInt(0, 15)];
    return color;
  };

  //生成所有日期
  kits.formatDate = function () {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var h = now.getHours();
    var mm = now.getMinutes();
    var s = now.getSeconds();
    return (
      y +
      "-" +
      patchZero(m) +
      "-" +
      patchZero(d) +
      " " +
      patchZero(h) +
      ":" +
      patchZero(mm) +
      ":" +
      patchZero(s)
    );
    function patchZero(v) {
      return v < 10 ? "0" + v : v;
    }
  };

  // 轻触 tap 事件函数的封装
  /**
   * 注册轻击操作的函数
   * @param { Element } element 绑定tap事件的元素
   * @param { Function } callback 事件处理程序
   * @param { Number } spanTime 轻击操作的时限
   * @param { Number } distance 轻击操作的距离
   * @returns { undefined }
   */
  kits.tap = function (element, callback, spanTime, distance) {
    spanTime = spanTime || 250;
    distance = distance || 50;
    // 定义变量记录点下的时间
    let startTime;
    // 定义变量，记录开始的点
    let startX, startY;
    // 注册触摸开始事件
    element.addEventListener("touchstart", function (e) {
      // 判断是否单指操作
      if (e.touches.length !== 1) {
        console.log("不是单指操作");
        return;
      }
      // 记录 点下的时间
      startTime = Date.now();
      // 记录开始的位置
      // console.log(e.touches[0]);
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    // 注册触摸结束事件
    element.addEventListener("touchend", function (e) {
      // 在触摸结束的事件里面，只能使用changedTouches，因为离开了屏幕，屏幕和元素都没有点了
      if (e.changedTouches.length !== 1) {
        console.log("不是单指操作");
        return;
      }
      // 判断 按下的时间
      // 得到松手的时间
      let endTime = Date.now();
      if (endTime - startTime > spanTime) {
        console.log("按下的时间太长了");
        return;
      }
      // 判断松手的位置
      let endX = e.changedTouches[0].clientX;
      let endY = e.changedTouches[0].clientY;
      // 这里判断距离，要忽略方向
      if (
        Math.abs(endX - startX) > distance ||
        Math.abs(endY - startY) > distance
      ) {
        console.log("滑动的太远了");
        return;
      }
      // 以上条件都不成立，就是一个tap操作了
      // 实现轻击操作的逻辑 - 轻击操作的逻辑是不一定的
      callback();
    });

    //本地存取
    /**
     * 
     * @param {String} key 用来存数据的
     * @param {object || Array} value 
     */
    kits.localStorage = function (key, value) {
      //存取操作
      if (value) {
        localStorage.setItem(nameSpace, JSON.stringify(value));
      }
      return (key && localStorage.getItem(key)) || null;
    };


    // 封装获取本地存储的数据，默认是返回数组
    /**
     * 
     * @param {变量} key 用来存数据的
     */
    kits.loadData = function (key) {
      let json = localStorage.setItem(key);
      return JSON.parse(json) || [];
    }
    // 封装数据存到本地
    /**
     * 
     * @param {String} key 
     * @param {object || Array} data 
     */
    kits.saveData = function (key, data) {
      let json = JSON.stringify(data);
      localStorage.setItem(key, json);
    }
  };
window.kits =kits;
})();