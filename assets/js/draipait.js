define([], function () {
  CONST = {
    edgeLen: 25,
    angle: 15
  };
  function drawPaint() {
    this.init = function (canvas) {
      this.outerParams = {
        rect: {}, // 用于设置矩形颜色、粗细、倒角
        circle: {}, // 圆颜色、粗细
        line: {}, // 线颜色、粗细
        arrow: {}, // 箭头颜色、粗细
        straight: {} // 直线的颜色粗细
      };
      this.isLine = false;
      this.isArrow = false;
      this.isRect = false;
      this.isCircle = false;
      this.isStraight = false;
      this.isSrect = false;
      this.flag = 0;
      this.lock = false; //鼠标是否在被拖动
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d'); //canvas对象
      this.w = this.canvas.width; //画布的宽
      this.h = this.canvas.height; //画布的高
      this.touch = ("createTouch" in document); //判定是否为手持设备
      this.StartEvent = this.touch ? "touchstart" : "mousedown";
      this.MoveEvent = this.touch ? "touchmove" : "mousemove";
      this.EndEvent = this.touch ? "touchend" : "mouseup";
      this.clickDrag = [];
      this.lineX = [];
      this.lineY = [];
      this.beginPoint = {}; //箭头
      this.stopPoint = {};
      this.storage = {}; // 圆起点坐标
      this.rect = {}; // 矩形起点坐标
      this.straight = {}; // 线起点坐标
      this.srect = {};// 菱形坐标
      this.polygonVertex = [];
      // 画布重绘数据存放地址，（坐标，颜色，粗细）
      this.status = {
        lineArr: [],
        arrowArr: [],
        circleArr: [],
        rectArr: [],
        straightArr: [],
        data: [],
        dataArr: []
      };

      // 存储发向后台的坐标数据,可根据接口进行整改（根据业务增加校验规则--全局参数）
      this.requestDatas = {
        straightData: [], // 线
        rectData: [],    // 矩形
        srectData: []    // 不规则四边形
      };

      this.recoverData = {
        straightArr: [],
        dataArr: [],
        rectArr: []
      };

      this.trail = [];
      this.trailReurn = [];
      this.rois = {};
      // this.selectOptions = [];
    };

    this.chooseRect = function () {
      if (this.status.data.length == 0) {
        this.isLine = false;
        this.isArrow = false;
        this.isRect = true;
        this.isCircle = false;
        this.isStraight = false;
        this.isSrect = false;
      }
    };

    this.chooseStraight = function () {
      if (this.status.data.length == 0) {
        this.isLine = false;
        this.isArrow = false;
        this.isRect = false;
        this.isCircle = false;
        this.isStraight = true;
        this.isSrect = false;
      }
    };

    this.chooseCircle = function () {
      this.isLine = false;
      this.isArrow = false;
      this.isRect = false;
      this.isCircle = true;
      this.isStraight = false;
      this.isSrect = false;
    };

    this.chooseLine = function () {
      this.isLine = true;
      this.isArrow = false;
      this.isRect = false;
      this.isCircle = false;
      this.isStraight = false;
      this.isSrect = false;
    };

    this.chooseArrow = function () {
      this.isLine = false;
      this.isArrow = true;
      this.isRect = false;
      this.isCircle = false;
      this.isStraight = false;
      this.isSrect = false;
    };
    this.allFalse = function () {
      if (this.status.data.length == 0) {
        this.isLine = false;
        this.isArrow = false;
        this.isRect = false;
        this.isCircle = false;
        this.isStraight = false;
        this.isSrect = true;
      }
    };

    this.chooseClear = function (refresh) {
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.status.rectArr = [];  // 清空页面中的矩形
      this.status.arrowArr = [];
      this.status.circleArr = [];
      this.status.lineArr = [];
      this.status.straightArr = [];
      this.status.dataArr = [];
      this.trail = [];
      this.trailReurn = [];
      if (refresh) {
        refresh();
      }
    };

    // 用于向父界面传递数据
    // this.byValue = function (trail) {
    //   var drawValue = {
    //     trail: trail
    //   }
    //   return drawValue;
    // }

    this.bind = function () {
      // this.img();
      // 当前this指向外层对象
      var t = this;
      // 鼠标按下事件所执行的操作
      this.canvas['on' + t.StartEvent] = function (e) {
        var touch = t.touch ? e.touches[0] : e;
        //记录点击的坐标点
        t.lock = true;
        var _x = touch.offsetX;
        var _y = touch.offsetY;
        if (t.isRect) {
          t.rect.x = _x;
          t.rect.y = _y;
        } else if (t.isStraight) {
          t.straight.x = _x;
          t.straight.y = _y;
        } else if (t.isCircle) {
          t.storage.x = _x;
          t.storage.y = _y;
        } else if (t.isLine) {
          t.movePoint(_x, _y);
          t.drawPoint(t.lineX, t.lineY, t.clickDrag, t.outerParams.line.lineWidth, t.outerParams.line.color);
        } else if (t.isArrow) {
          t.beginPoint.x = _x;
          t.beginPoint.y = _y;

        }
      };
      // 鼠标移动事件绘制图形
      this.canvas['on' + t.MoveEvent] = function (e) {
        if (t.isSrect) {
          var touch = t.touch ? e.touches[0] : e;
          var _x0 = touch.offsetX;
          var _y0 = touch.offsetY;
          t.clear();
          t.redrawAll();
          if (t.flag == 1) {
            t.drawStraight(t.srect.x, t.srect.y, _x0, _y0, t.outerParams.straight.color, t.outerParams.straight.lineWidth);
          }


        }
        if (t.lock) {
          if (t.isRect) {
            t.rect.width = Math.abs(t.rect.x - e.offsetX);
            t.rect.height = Math.abs(t.rect.y - e.offsetY);
            if (t.rect.x > e.offsetX) {
              t.rect.realX = e.offsetX
            } else {
              t.rect.realX = t.rect.x
            }
            if (t.rect.y > e.offsetY) {
              t.rect.realY = e.offsetY
            } else {
              t.rect.realY = t.rect.y
            }
            t.clear();
            t.redrawAll();
            if (t.rect.width > 4 && t.rect.height > 2) {
              t.drawRect(t.rect.realX, t.rect.realY, t.rect.width, t.rect.height, t.outerParams.rect.radius, t.outerParams.rect.color, t.outerParams.rect.lineWidth);
            }
          } else if (t.isStraight) {

            t.straight.offsetX = e.offsetX;
            t.straight.offsetY = e.offsetY;
            t.clear();

            t.redrawAll();
            if (Math.abs(t.straight.x - t.straight.offsetX) > 6 || Math.abs(t.straight.y - t.straight.offsetY) > 6) {
              t.straightArrow(t.straight.x, t.straight.y, t.straight.offsetX, t.straight.offsetY, t.outerParams.straight.color, t.outerParams.straight.lineWidth);
            }

          } else if (t.isCircle) {
            if (t.storage.x > e.offsetX) {
              var pointX = t.storage.x - Math.abs(t.storage.x - e.offsetX) / 2;
            } else {
              pointX = Math.abs(t.storage.x - e.offsetX) / 2 + t.storage.x;
            }
            if (t.storage.y > e.offsetY) {
              var pointY = t.storage.y - Math.abs(t.storage.y - e.offsetY) / 2;
            } else {
              pointY = Math.abs(t.storage.y - e.offsetY) / 2 + t.storage.y;
            }
            var lineX = Math.abs(t.storage.x - e.offsetX) / 2;
            var lineY = Math.abs(t.storage.y - e.offsetY) / 2;
            t.clear();
            t.redrawAll();
            t.drawEllipse(pointX, pointY, lineX, lineY, t.outerParams.circle.lineWidth, t.outerParams.circle.color);

          } else if (t.isLine) {
            t.movePoint(e.offsetX, e.offsetY, true);
            t.drawPoint(t.lineX, t.lineY, t.clickDrag, t.lineWidth, t.outerParams.line.color);
          } else if (t.isArrow) {
            t.stopPoint.x = e.offsetX;
            t.stopPoint.y = e.offsetY;
            t.clear();
            t.redrawAll();
            t.arrowCoord(t.beginPoint, t.stopPoint, t.outerParams.arrow.range);
            t.sideCoord();
            t.drawArrow(t.outerParams.arrow.color);

          }
        }
      };
      // 鼠标离开事件所执行的操作
      this.canvas['on' + t.EndEvent] = function (e) {
        if (t.isRect) {
          if (t.rect.width > 4 && t.rect.height > 2) {
            t.drawFont(t.trail.length + 1, t.rect.x, t.rect.y);
            t.status.rectArr.push({
              realX: t.rect.realX,
              realY: t.rect.realY,
              width: t.rect.width,
              height: t.rect.height,
              radius: t.outerParams.rect.radius,
              color: t.outerParams.rect.color,
              lineWidth: t.outerParams.rect.lineWidth,
              num: t.trail.length + 1
            });

            t.requestDatas.rectData.push({
              x0y0: t.rect.realX + ',' + t.rect.realY,
              x1y1: t.rect.realX + ',' + (t.rect.realY + t.rect.height),
              x2y2: t.rect.realX + t.rect.width + ',' + (t.rect.realY + t.rect.height),
              x3y3: t.rect.realX + t.rect.width + ',' + t.rect.realY
            });
            t.trail.push('a');
            // t.selectOptions.push({id: t.trail.length, label: t.trail.length});
            if (t.trail.length != 0) {
              var i = t.trail.length - 1;
              if (t.trail[i] == 'a') {
                t.rois[i] = [(t.rect.realX / 1080) + ',' + (t.rect.realY / 600),
                  (t.rect.realX / 1080) + ',' + ((t.rect.realY + t.rect.height) / 600),
                  ((t.rect.realX + t.rect.width) / 1080) + ',' + ((t.rect.realY + t.rect.height) / 600),
                  ((t.rect.realX + t.rect.width) / 1080) + ',' + ((t.rect.realY) / 600)];
              }
            }
            t.rect = {};
          }
        } else if (t.isSrect) {
          t.flag = 1;
          t.srect.x = e.offsetX;
          t.srect.y = e.offsetY;
          t.status.data.push({a: t.srect.x, b: t.srect.y});
          t.requestDatas.srectData.push(t.srect.x + ',' + t.srect.y);
          // 已优化，去掉重复添加的六组数据。
          if (t.status.data.length > 1) {
            if (t.status.data.length === 2) {
              t.iteration(0)
            }
            else if (t.status.data.length === 3) {
              t.iteration(1)
            }
            else if (t.status.data.length === 4) {
              t.iteration(2)
            }
            else if (t.status.data.length === 5) {
              t.iteration(3)
            }
          }

          if (t.status.data.length == 5) {
            t.drawFont(t.trail.length + 1, t.status.data[4].a, t.status.data[4].b);

            var pointX = Math.abs(t.status.data[0].a - t.status.data[4].a) > 4;
            var pointY = Math.abs(t.status.data[0].b - t.status.data[4].b) > 4;

            if (pointX || pointY) {
              t.status.dataArr.splice(t.status.dataArr.length - 4, t.status.dataArr.length);
            } else {

              t.trail.push('c');
              // t.selectOptions.push({id: t.trail.length, label: t.trail.length});

              if (t.trail.length != 0) {
                var i = t.trail.length - 1;
                if (t.trail[i] == 'c') {
                  t.rois[i] = [(t.status.data[0].a / 1080) + ',' + (t.status.data[0].b / 600),
                    (t.status.data[1].a / 1080) + ',' + (t.status.data[1].b / 600),
                    (t.status.data[2].a / 1080) + ',' + (t.status.data[2].b / 600),
                    (t.status.data[3].a / 1080) + ',' + (t.status.data[3].b / 600)];
                }
              }

            }
            t.flag = 2;
            t.status.data = [];
            t.requestDatas.srectData.pop();
          }

        } else if (t.isStraight) {

          if (Math.abs(t.straight.x - t.straight.offsetX) > 6 || Math.abs(t.straight.y - t.straight.offsetY) > 6) {
            t.drawFont(t.trail.length + 1, t.straight.x, t.straight.y);
            t.status.straightArr.push({
              x: t.straight.x,
              y: t.straight.y,
              offsetX: t.straight.offsetX,
              offsetY: t.straight.offsetY,
              color: t.outerParams.straight.color,
              lineWidth: t.outerParams.straight.lineWidth,
              num: t.trail.length + 1
            });

            t.requestDatas.straightData.push({
              x0y0: t.straight.x + ',' + t.straight.y,
              x1y1: t.straight.offsetX + ',' + t.straight.offsetX
            });

            t.trail.push('b');
            // t.selectOptions.push({id: t.trail.length, label: t.trail.length});

            if (t.trail.length != 0) {
              var j = t.trail.length - 1;
              if (t.trail[j] == 'b') {
                t.rois[j] = [(t.straight.x / 1080) + ',' + (t.straight.y / 600), (t.straight.offsetX / 1080) + ',' + (t.straight.offsetY / 600)];
              }
            }
            t.straight = {};
          }


        } else if (t.isCircle) {
          if (t.storage.x > e.offsetX) {
            var pointX = t.storage.x - Math.abs(t.storage.x - e.offsetX) / 2;
          } else {
            pointX = Math.abs(t.storage.x - e.offsetX) / 2 + t.storage.x;
          }
          if (t.storage.y > e.offsetY) {
            var pointY = t.storage.y - Math.abs(t.storage.y - e.offsetY) / 2;
          } else {
            pointY = Math.abs(t.storage.y - e.offsetY) / 2 + t.storage.y;
          }
          var lineX = Math.abs(t.storage.x - e.offsetX) / 2;
          var lineY = Math.abs(t.storage.y - e.offsetY) / 2;
          t.status.circleArr.push({
            x: pointX,
            y: pointY,
            a: lineX,
            b: lineY,
            color: t.outerParams.circle.color,
            lineWidth: t.outerParams.circle.lineWidth
          });
          t.storage = {};
        } else if (t.isLine) {
          t.status.lineArr.push({
            x: t.lineX,
            y: t.lineY,
            clickDrag: t.clickDrag,
            lineWidth: t.outerParams.line.lineWidth,
            color: t.outerParams.line.color
          });
          t.lineX = [];
          t.lineY = [];
          t.clickDrag = [];
        } else if (t.drawArrow) {
          var tempObj = {
            beginPoint: t.beginPoint,
            stopPoint: {
              x: e.offsetX,
              y: e.offsetY
            },
            range: t.outerParams.arrow.range,
            color: t.outerParams.arrow.color
          };
          t.status.arrowArr.push(tempObj);
          t.beginPoint = {};
        }
        t.lock = false;
      }
    };

    this.iteration = function (num) {
      for (var i = num; i < this.status.data.length - 1; i++) {
        this.status.dataArr.push({
          a: this.status.data[i].a,
          b: this.status.data[i].b,
          c: this.status.data[i + 1].a,
          d: this.status.data[i + 1].b,
          color: this.outerParams.straight.color,
          lineWidth: this.outerParams.straight.lineWidth,
          num: num == 3 ? this.trail.length + 1 : ''
        });
      }
    };

    this.movePoint = function (x, y) {
      this.lineX.push(x);
      this.lineY.push(y);
      this.clickDrag.push(y);
    };

    this.drawPoint = function (x, y, clickDrag, lineWidth, color) {
      for (var i = 0; i < x.length; i++) //循环数组
      {
        this.ctx.beginPath();
        if (clickDrag[i] && i) {
          this.ctx.moveTo(x[i - 1], y[i - 1]);
        } else {
          this.ctx.moveTo(x[i] - 1, y[i]);
        }
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = color;
        this.ctx.lineTo(x[i], y[i]);
        this.ctx.closePath();
        this.ctx.stroke();
      }
    };

    this.getRadian = function (beginPoint, stopPoint) {
      this.angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math.PI * 180;
    };

    this.arrowCoord = function (beginPoint, stopPoint, range) {
      this.polygonVertex[0] = beginPoint.x;
      this.polygonVertex[1] = beginPoint.y;
      this.polygonVertex[6] = stopPoint.x;
      this.polygonVertex[7] = stopPoint.y;
      this.getRadian(beginPoint, stopPoint);
      this.polygonVertex[8] = stopPoint.x - CONST.edgeLen * Math.cos(Math.PI / 180 * (this.angle + range));
      this.polygonVertex[9] = stopPoint.y - CONST.edgeLen * Math.sin(Math.PI / 180 * (this.angle + range));
      this.polygonVertex[4] = stopPoint.x - CONST.edgeLen * Math.cos(Math.PI / 180 * (this.angle - range));
      this.polygonVertex[5] = stopPoint.y - CONST.edgeLen * Math.sin(Math.PI / 180 * (this.angle - range));
    };

    this.sideCoord = function () {
      var midpoint = {};
      midpoint.x = (this.polygonVertex[4] + this.polygonVertex[8]) / 2;
      midpoint.y = (this.polygonVertex[5] + this.polygonVertex[9]) / 2;
      this.polygonVertex[2] = (this.polygonVertex[4] + midpoint.x) / 2;
      this.polygonVertex[3] = (this.polygonVertex[5] + midpoint.y) / 2;
      this.polygonVertex[10] = (this.polygonVertex[8] + midpoint.x) / 2;
      this.polygonVertex[11] = (this.polygonVertex[9] + midpoint.y) / 2;
    };

    this.drawArrow = function (color) {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(this.polygonVertex[0], this.polygonVertex[1]);
      this.ctx.lineTo(this.polygonVertex[2], this.polygonVertex[3]);
      this.ctx.lineTo(this.polygonVertex[4], this.polygonVertex[5]);
      this.ctx.lineTo(this.polygonVertex[6], this.polygonVertex[7]);
      this.ctx.lineTo(this.polygonVertex[8], this.polygonVertex[9]);
      this.ctx.lineTo(this.polygonVertex[10], this.polygonVertex[11]);
      this.ctx.closePath();
      this.ctx.fill();
    };

    this.createRect = function (x, y, width, height, radius, color, type, lineWidth) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y + radius); // 把路径移到指定地点不创建线条(起点坐标)

      this.ctx.lineTo(x, y + height - radius); // 添加一个新点，然后在画布中创建从该点到最后指定点的线条 （绘制直线段坐标点）
      this.ctx.quadraticCurveTo(x, y + height, x + radius, y + height); // 创建二次贝尔曲线

      this.ctx.lineTo(x + width - radius, y + height);
      this.ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);

      this.ctx.lineTo(x + width, y + radius);
      this.ctx.quadraticCurveTo(x + width, y, x + width - radius, y);

      this.ctx.lineTo(x + radius, y);
      this.ctx.quadraticCurveTo(x, y, x, y + radius);

      this.ctx[type + 'Style'] = color;
      this.ctx.lineWidth = lineWidth;
      this.ctx.closePath();
      this.ctx[type]();
    };
    this.drawRect = function (realX, realY, width, height, radius, color, lineWidth) {
      this.createRect(realX, realY, width, height, radius, color, 'stroke', lineWidth);
    };

    this.drawStraight = function (x, y, offsetX, offsetY, color, lineWidth) {
      var type = "stroke";
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx[type + 'Style'] = color;
      this.ctx.lineWidth = lineWidth;
      this.ctx[type]();
    };

    this.straightArrow = function (x, y, offsetX, offsetY, color, lineWidth) {
      var theta = 30,
      headlen = 10;
  // 计算角度和两箭头的坐标
  var angle = Math.atan2(y - offsetY, x - offsetX)*180/Math.PI,
      angle1 = (angle + theta)*Math.PI/180,
      angle2 = (angle - theta)*Math.PI/180,
      topX = headlen*Math.cos(angle1),
      topY = headlen*Math.sin(angle1),
      botX = headlen*Math.cos(angle2),
      botY = headlen*Math.sin(angle2);

      var type = "stroke";
      this.ctx.save();
      this.ctx.beginPath();
      var arrowX = x - topX,
          arrowY = y - topY;
      this.ctx.moveTo(arrowX, arrowY);  
      this.ctx.moveTo(x, y);  
      this.ctx.lineTo(offsetX, offsetY);

      arrowX = offsetX + topX;
      arrowY = offsetY + topY;
      this.ctx.moveTo(arrowX, arrowY);
      this.ctx.lineTo(offsetX, offsetY);

      arrowX = offsetX + botX;
      arrowY = offsetY + botY;
      this.ctx.lineTo(arrowX, arrowY);

      this.ctx[type + 'Style'] = color;
      this.ctx.lineWidth = lineWidth;
      this.ctx[type]();
      this.ctx.restore();

    };

    this.drawEllipse = function (x, y, a, b, lineWidth, color) {
      this.ctx.beginPath();
      this.ctx.ellipse(x, y, a, b, 0, 0, 2 * Math.PI);
      this.ctx.lineWidth = lineWidth;
      this.ctx.fillStyle = 'rgba(0,0,0,0)';
      this.ctx.strokeStyle = color;
      this.ctx.fill();
      this.ctx.stroke();
    };

    this.drawFont = function (text, x, y) {
      this.ctx.font = "26px Georgia";
      this.ctx.fillStyle = 'yellow';
      this.ctx.fillText(text, x, y);
    };


    // 画图撤销功能
    this.gohistory = function (prev) {
      if (this.status.data.length == 0) {
        if (this.trail.length != 0) {

          var i = this.trail.length - 1;
          if (this.trail[i] == 'a') {
            this.recoverData.rectArr.push(this.status.rectArr[this.status.rectArr.length - 1]);
            this.status.rectArr.pop();
            this.trail.pop();
            // this.selectOptions.pop();
            this.trailReurn.push('a');
            this.clear();
            this.redrawAll();
            delete this.rois[i];
          } else if (this.trail[i] == 'b') {
            this.recoverData.straightArr.push(this.status.straightArr[this.status.straightArr.length - 1]);
            this.status.straightArr.pop();
            this.trail.pop();
            // this.selectOptions.pop();
            this.trailReurn.push('b');
            this.clear();
            this.redrawAll();
            delete this.rois[i];
          } else if (this.trail[i] == 'c') {
            this.recoverData.dataArr.push(
              this.status.dataArr[this.status.dataArr.length - 4],
              this.status.dataArr[this.status.dataArr.length - 3],
              this.status.dataArr[this.status.dataArr.length - 2],
              this.status.dataArr[this.status.dataArr.length - 1]
            );
            this.status.dataArr.splice(this.status.dataArr.length - 4, this.status.dataArr.length);
            this.trail.pop();
            // this.selectOptions.pop();
            this.trailReurn.push('c');
            this.clear();
            this.redrawAll();
            delete this.rois[i];
          }
          if (prev) {
            prev();
          }
        }
      }

    };

    // 恢复功能
    this.recover = function () {
      if (this.trailReurn.length != 0) {
        if (this.trailReurn[this.trailReurn.length - 1] == 'a') {

          this.status.rectArr.push(this.recoverData.rectArr[this.recoverData.rectArr.length - 1]);
          this.recoverData.rectArr.pop();
          this.trail.push(this.trailReurn[this.trailReurn.length - 1]);
          this.trailReurn.pop();
          this.clear();
          this.redrawAll();

        } else if (this.trailReurn[this.trailReurn.length - 1] == 'b') {
          this.status.straightArr.push(this.recoverData.straightArr[this.recoverData.straightArr.length - 1]);
          this.recoverData.straightArr.pop();
          this.trail.push(this.trailReurn[this.trailReurn.length - 1]);
          this.trailReurn.pop();
          this.clear();
          this.redrawAll();
        } else if (this.trailReurn[this.trailReurn.length - 1] == 'c') {
          this.status.dataArr.push(
            this.recoverData.dataArr[this.recoverData.dataArr.length - 4],
            this.recoverData.dataArr[this.recoverData.dataArr.length - 3],
            this.recoverData.dataArr[this.recoverData.dataArr.length - 2],
            this.recoverData.dataArr[this.recoverData.dataArr.length - 1]
          );
          this.recoverData.dataArr.splice(this.recoverData.dataArr.length - 4, this.recoverData.dataArr.length);
          this.trail.push(this.trailReurn[this.trailReurn.length - 1]);
          this.trailReurn.pop();
          this.clear();
          this.redrawAll();
        }
      }
    };

    this.clear = function () {
      this.ctx.clearRect(0, 0, this.w, this.h);
    };

    this.redrawAll = function () {
      var t = this;

      if (this.status.dataArr.length > 0) {

        this.status.dataArr.forEach(function (val) {
          t.drawStraight(val.a, val.b, val.c, val.d, val.color, val.lineWidth);
          if (val.num) {
            t.drawFont(val.num, val.c, val.d);
          }
        })
      }

      if (this.status.rectArr.length > 0) {
        this.status.rectArr.forEach(function (val) {
          t.drawRect(val.realX, val.realY, val.width, val.height, val.radius, val.color, val.lineWidth);
          t.drawFont(val.num, val.realX, val.realY);
        })
      }
      if (this.status.straightArr.length > 0) {
        this.status.straightArr.forEach(function (val) {
          t.straightArrow(val.x, val.y, val.offsetX, val.offsetY, val.color, val.lineWidth);
          t.drawFont(val.num, val.x, val.y);
        })

      }
      if (this.status.circleArr.length > 0) {
        this.status.circleArr.forEach(function (val) {
          t.drawEllipse(val.x, val.y, val.a, val.b, val.lineWidth, val.color)
        })

      }
      if (this.status.lineArr.length > 0) {
        this.status.lineArr.forEach(function (val) {
          t.drawPoint(val.x, val.y, val.clickDrag, val.lineWidth, val.color);
        })
      }
      if (this.status.arrowArr.length > 0) {
        this.status.arrowArr.forEach(function (val) {
          if (val.beginPoint != {}) {
            t.arrowCoord(val.beginPoint, val.stopPoint, val.range);
            t.sideCoord();
            t.drawArrow(val.color);
          }
        })
      }
    }
  }

  drawMap = function (canvas) {
    var p = new drawPaint();
    p.init(canvas);
    return p;
  };
  return drawMap

});
