import './style.css';

import {
  of,
  map,
  Observable,
  from,
  fromEvent,
  fromEventPattern,
  interval,
  timer,
  throwError,
  defer,
} from 'rxjs';

// ----------------------------RxJS concept------------------------
/**
 * Khởi tạo bằng Observable contructor
 * Observable constructor nhận vào 1 đối số là 1 function subscribe và constructor này trả về 1 subscription, subscription cung cấp phương thức unsubscribe để huỷ việc nhận dữ liệu từ stream.
 * function subscribe nhận vào 1 đối số là 1 đối tượng tập hợp 3 callback function là next(), error() và complete(). Next() gửi đi 1 giá trị, error gửi đi 1 error, complete báo hiệu stream (1 observable được subscribe) đã hoàn thành. 1 stream có error thì sẽ không có complete, có complete thì sẽ không có error.
 * invoking observable: observable sẽ không được thực thi nếu không subcribe. khi subscribe sẽ invoke obserable và trả về 1 subscription.
 */
const observable = new Observable(function subscribe(observe) {
  const id = setTimeout(() => {
    observe.error('This is message error');
    observe.complete();
  }, 1000);

  return function unsubscribe() {
    clearTimeout(id);
  };
});
// observable.subscribe({
//   next: (data) => console.log(data),
//   error: message => console.error(message),
//   complete: () => console.log("Observable completed")
// })

// Observer dùng chung.
const observer = {
  next: (data) => console.log(data),
  error: (message) => console.error(message),
  complete: () => console.log('Complete'),
};

// -----------------------------RxJS Creation Operator ------------------------
// of() Nhận vào 1 giá trị bất kỳ, khi subscribe sẽ emit giá trị đó, sau đó complete.
of(10);
of('This is string');
of([1, 3, 4, 6]);
of({ foo: 'bar' });
of(Promise.resolve('Data resolve promise'));

// from(): Nhận vào giá trị là 1 Interable (Có thể lặp qua) hoặc 1 promise.
// Khi subscribe:
//   + Nếu giá trị truyền vào là một Interable, sẽ emit lần lượt các phần từ của giá trị đó, sau đó complete
//   + Nếu giá trị là 1 promise, sẽ thực thi promise đó và emit già trị của promise đó (resolve hoặc reject promise đó luôn) sau đó complete
// Interable
from([1, 4, 6, 3, 6]);
from('Le van quyet');
// Promise()
from(Promise.resolve('This is data resolve'));

// fromEvent(): Chuyển đổi 1 sự kiện sang 1 observable
/**
 * Nhận vào 2 đối số
 * Đối số 1: 1 element node
 * Đối số 2: tên sự kiện (vd: click, moserover, ...)
 * Khi sự kiện sảy ra sẽ emit sự kiện đó
 * fromEvent() sẽ tạo 1 observable không tự complete().
 */
fromEvent(document, 'click');

// formEventPattern(): Chuyển từ sự kiện sang 1 observable, là 1 dạng nâng cao của fromEvent.
/**
 * fromEventPattern() Nhận vào 3 đối số là 3 callback function
 * Đối số 1 (required): add handler
 * Đối số 2 (requierd): remove handler
 * Đối số 3 (optional): projectFunction dùng để transfom dữ liệu trước khi emit, observable mà fromEventPattern() trả về sẽ emit dữ liệu mà projectFunction này return.
 */
fromEventPattern(
  (handler) => document.addEventListener('click', handler),
  (handler) => document.removeEventListener('click', handler),
  (event) => event.offsetX + ' ' + event.offsetY
);

// interval(): Nhận vào 1 đối số là khoảng thời gian tính bằng mls, trả về 1 observable khi subscribe sẽ nhận emit giá trị từ 0 -> vô cùng, mỗi lần emit sẽ cách nhau 1 khoảng thời gian = đối số được truyền vào. Observable này sẽ không bao giờ complete, muốn dừng nhận giá trị mà nó emit thì unsubscribe()
const itv$ = interval(1000);

// timmer(): trả về 1 observable.
/**
 * Nhận vào 2 đối số
 * Đối số 1: (requierd) Khoảng thời gian delay tính bằng mls.
 * Đối số 2: (optional) Khoảng thời gian các emit cách nhau tính bắng mls
 * Khi subsribe vào observable mà timer trả về
 *    Nếu chỉ truyền đối số 1: emit 0 rồi complete
 *    Nếu truyền cả 2 đối số: delay 1 khoảng thời gian =  đối số 1, sau đó emit từ 0 -> vô cùng, mỗi lần emit cách nhau 1 khoảng thời gian bằng đối số 2.
 */
timer(1000, 2000);

// throwError(): Trả về 1 observalbe, khi subscribe sẽ throw 1 error (Gọi đến error của của observer được truyền vào khi subscribe).
throwError([1, 2, 5]);

// defer(): trả về 1 observale
/**
 * Nhận vào 1 đối số là 1 callback function, callback function này trả về 1 Observable
 * Khi subsctibe vào observable mà defer trả về sẽ tạo 1 observable mới (observalber mà callback function return) và emit giá trị của observable mới đó
 */
const randOber$ = defer(() => of(Math.random()));
randOber$;
randOber$;
randOber$;
