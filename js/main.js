'use strict';

document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll('.input-char').forEach((item) => {
    item.onchange = applyCharacteristics;
  });

  let m; // масса груза
  let k; // коэф. жесткости пружины
  let x0, xt; // начальное и текущее отклонения
  let w0; // циклическая частота собственных колебаний
  let start; // время начала анимации
  let animation_interval_id; // id из setInterval для обработки анимации
  let animation_status = false; // статус анимации (вкл/выкл)

  let left_right_elements = document.querySelectorAll('.spring__left, .spring__right'),
    first_last_elements = document.querySelectorAll('.spring__first, .spring__last'); // HTML-элементы пружины
  let weight = document.querySelector('.weight'); // HTML-элемент груза


  applyCharacteristics();

  // применение введенных пользователем харакеристик
  function applyCharacteristics() {
    m = document.getElementById('inp_m').value;
    let d = 100 * Math.cbrt(m) + 'px';
    weight.style.height = d;
    weight.style.width = d;
    k = document.getElementById('inp_k').value;
    x0 = document.getElementById('inp_x0').value;
    xt = x0;
    document.getElementById('xt').innerHTML = xt;
    draw();
    w0 = Math.sqrt(k / m);
    document.getElementById('w0').innerHTML = w0.toFixed(2);
    document.getElementById('t').innerHTML = 0;
    document.getElementById('n').innerHTML = 0;
  };

  // отрисовка
  function draw() {
    let curr_height = (30 + (xt / 5)) + 'px';
    let curr_height_first_last = (30 + (xt / 5)) / 2 + 'px';

    left_right_elements.forEach((item) => {
      item.style.height = curr_height;
    });

    first_last_elements.forEach((item) => {
      item.style.height = curr_height_first_last;
    });
  }

  // расчет состояния в текущий момент времени для анимации
  function animate() {
    let t = (performance.now() - start) / 1000;
    let n = w0 * t / (2 * Math.PI);

    xt = x0 * Math.cos(w0 * t);
    document.getElementById('t').innerHTML = t.toFixed(2);
    document.getElementById('xt').innerHTML = xt.toFixed(2);
    document.getElementById('n').innerHTML = n.toFixed(0);

    draw();
  };

  // обработка нажатия кнопки Старт/стоп
  document.getElementById('start').addEventListener('click', (e) => {
    e.preventDefault();
    if (animation_status) {
      // из Стоп в Старт
      clearInterval(animation_interval_id);
      animation_status = !animation_status;
      document.getElementById('start').innerHTML = 'Play';
      document.getElementById('start').style.background = 'greenyellow';
      document.querySelectorAll('.input-char').forEach((item) => {
        item.removeAttribute('disabled');
      });
    } else {
      // из Старт в Стоп
      start = performance.now();
      animation_interval_id = setInterval(animate, 30);
      animation_status = !animation_status;
      document.getElementById('start').innerHTML = 'Stop';
      document.getElementById('start').style.background = 'red';
      document.querySelectorAll('.input-char').forEach((item) => {
        item.setAttribute('disabled', true);
      });
    }
  });

});
