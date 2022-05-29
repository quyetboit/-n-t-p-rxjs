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
import { buffer, bufferTime, delay, mapTo, pluck, reduce, scan, tap, toArray } from 'rxjs/operators';

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


// --------------------RxJS Transformation Operators-----------------------------
// Biến đổi dữ liệu.
// pipe() Operator: Thay thể cho cách viết dotchain, thực thi lần lượt các operators được truyền vào pipe thông qua đối số (Thực thi, lấy kết quả của đối số trước gọi đến đối số được truyền sau)
// vd:
of({name: 'Lê quyết'}).pipe(
  pluck('name'),
  map(name => "My name is " + name)
)

// map(): là 1 operator sử dụng trong pipe(), nhận vào 1 đối số là 1 callback funciton, callback function này nhận 1 đối số là giá trị mà observable cha emit. Khi subscribe vào observable cha, observable cha sẽ emit dữ liệu mà callback function truyền vào map() return, sau đó complete.
of('lê Văn Quyết').pipe(
  map( (name) => 'My name is ' + name)
)
from([1, 2, 3, 4, 5]).pipe(
  map(current => 'Current value is: ' + current),
)

// mapTo(): 1 operator sử dụng trong pipe(), Nhận vào 1 đối số là già trị bất kỳ, observable cha sẽ mit giá trị được truyền vào mapTo() khi được subscribe.
of("lê văn quyêt").pipe(
  mapTo('Some thing')
)

// fluck(): là 1 operator sử dụng trong pipe.
/**
 * Đối với giá trị observabe cha emit là 1 mảng: pluck nhận vào đối số là 1 number, pluck sẽ lấy phần từ có index = số được truyền vào và trả về giá trị đó
 * Đối với giá trị observable cha emit là 1 object: pluck nhận vào đối số là key của object và trả về value của key đó.
 */
of([1, 2, 3, 5]).pipe(
  pluck(0)
)
of([1, 2, 3, 5], [7, 8, 9, 10]).pipe(
  pluck('name')
)

of({name: 'lê Vanw Quyết'}).pipe(
  pluck('name')
)
of({name: 'Quyết', child: {name: 'quyet2'}}).pipe(
  pluck('child', 'name')
)

// reduce(): là 1 operator sử dụng trong pipe, nó giống với reduce của mảng, thay vì nhận tứng giá trị của mảng thì nó sẽ nhận từng giá trị mà observable cha emit. Sau khi observable cha emit hết dữ liệu thì reduce trả về kết quả cuối cùng và observable cha complete.
from([1, 2, 3, 4, 6, 7]).pipe(
  reduce((acc, curr) => acc + curr, 0)
)

// scan(): giống như reduce nhưng nó sẽ emit luôn dữ liệu khi observale cha emit.
from([1, 2, 3, 4, 6, 7]).pipe(
  scan((acc, curr) => acc + curr, 0)
)

// toArray(): Gom các giá trị observable cha emit lại thành 1 mảng, đến khi observable cha emit hết dữ liệu thì trả về mảng đó và complete.
of(1, 2, 3, 4, 5, 6).pipe(
  toArray()
)

// buffer(): là 1 operator sử dụng trong pipe(), nhận vào 1 đối số là closingNotifier (là 1 observable). Lưu trữ dữ liệu observable cha emit (dưới dạng mảng) cho đến khi closingNotifier phát ra tín hiệu (emit) thì sẽ emit ra dữ liệu đã được lưu trữ trức đó.
const click$ = fromEvent(document, 'click');
interval(10000).pipe(
  buffer(click$)
)

// bufferTime(): giống như buffer() nhưng nó nhận vào 1 khoảng thời gian tính bắng mls, sau khoảng thời gian đc truyền vào này nó sẽ emit dữ liệu được lưu trữ
interval(1000).pipe(
  bufferTime(5000)
)