import './style.css';

import { of, map, Observable } from 'rxjs';

// ----------------------------RxJS concept------------------------
/**
 * Khởi tạo bằng Observable contructor
 * Observable constructor nhận vào 1 đối số là 1 function subscribe và constructor này trả về 1 subscription, subscription cung cấp phương thức unsubscribe để huỷ việc nhận dữ liệu từ stream.
 * function subscribe nhận vào 1 đối số là 1 đối tượng tập hợp 3 callback function là next(), error() và complete(). Next() gửi đi 1 giá trị, error gửi đi 1 error, complete báo hiệu stream (1 observable được subscribe) đã hoàn thành. 1 stream có error thì sẽ không có complete, có complete thì sẽ không có error.
 * invoking observable: observable sẽ không được thực thi nếu không subcribe. khi subscribe sẽ invoke obserable và trả về 1 subscription.
 */
const observable = new Observable(function subscribe(observe) {
  const id = setTimeout( () => {
    observe.error('This is message error');
    observe.complete()
  }, 1000)

  return function unsubscribe() {
    clearTimeout(id);
  }
})
// observable.subscribe({
//   next: (data) => console.log(data),
//   error: message => console.error(message),
//   complete: () => console.log("Observable completed") 
// })
