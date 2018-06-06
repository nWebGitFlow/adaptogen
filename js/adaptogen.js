/**
 * Adaptogen – шаблон адаптивной страницы
 * Copyright © 2018 INVITATIONRU. All rights reserved.
 * Author: nWebGitFlow
 * 
 * Данный скрипт производит:
 * – пропорциональное сжатие главного фрейма страницы до размеров внутренней области окна браузера (видового 
 *   порта), если размеры фрейма больше размеров области отображения Web-страницы;
 * – размещение фрейма страницы по центру внутренней области окна браузера, 
 *   если размеры фрейма меньше размеров его видового порта.
 *
 * ВАЖНО! Здесь под "фреймом" понимается прямоугольная область (блок), объявленная в HTML-файле тегом div и 
 * вмещающая внутри себя или поверх себя все графические элементы web-страницы, подлежащие 
 * отображению при открытии страницы без скроллера окна браузера. 
 * Рекомендованный идентификатор такого блока "center-block".
 * 
 * Данный скрипт будет незаменим для масштабирования готового дизайна на CSS, спроектированного в пикселях.
 * Подробности применения скрипта читайте по тексту кода ниже.
 */

$(document).ready(function(){ 

  /**
   * ЗАПОЛНИТЕ СЕКЦИЮ :root В ФАЙЛЕ adaptogen.css ПРОЕКТНЫМИ РАЗМЕРАМИ БЛОКА ФРЕЙМА В ПИКСЕЛЯХ,   
   * (--frame-height И --frame-width), А ТАКЖЕ ДРУГИМИ ГЛОБАЛЬНЫМИ ПЕРЕМЕННЫМИ, ОПРЕДЕЛЯЮЩИМИ 
   * МАСШТАБИРУЕМЫЕ ЛИНЕЙНЫЕ РАЗМЕРЫ НЕЗАВИСИМЫХ КОМПОНЕНТОВ ФРЕЙМА СТРАНИЦЫ. 
   * @todo
   */

  //===================================================================== НАЧАЛО ВХОДНЫХ ДАННЫХ
  /**
   * ОПРЕДЕЛИТЕ СПОСОБ ОТСЛЕЖИВАНИЯ ИЗМЕНЕНИЯ РАЗМЕРА ОКНА БРАУЗЕРА
   * @global
   * Если trackResize = true, 
   * то фрейм масштабируется вслед за границами окна, но отключается масштабирование от браузера
   * Если trackResize = false, 
   * то фрейм не масштабируется до обновления страницы, но работает масштабирование от браузера
   *
   * Выберите вариант поведения фрейма в окне браузера
   * @todo
   */
  var trackResize = true; 


  /**
   * СОСТАВЬТЕ СПИСКИ ГЛОБАЛЬНЫХ CSS-ПЕРЕМЕННЫХ, ПОДЛЕЖАЩИХ МОДИФИКАЦИИ ПРИ МАСШТАБНЫХ ПРЕОБРАЗОВАНИЯХ
   * @global
   * Array root_width_list – все ширины 
   * Array root_height_list – все высоты 
   * Array root_left_list – все левые отступы 
   * Array root_top_list – все верхние отступы 
   * Array root_height_list – любые иные линейные размеры
   *
   * Разнесите по коллекциям все CSS-переменные свойств стилей независимых элементов страницы
   * @todo
   */
  var root_width_list = [];
  var root_height_list = [];
  var root_left_list = [];
  var root_top_list = [];
  var root_any_list = [];

  /**
   * СОСТАВЬТЕ СПИСКИ КЛАССОВ, УКАЗАТЕЛЕЙ И ТЕГОВ С ДИНАМИЧЕСКИ МОДИФИЦИРУЕМЫМИ ШРИФТАМИ, 
   * ГРАНИЦАМИ, ПОЛЯМИ И ОТСТУПАМИ 
   * При заполнении линейных размеров в стилях зависимых элементов страницы по возможности пользуйтесь 
   * относительными единицами измерения: %, em, rem.
   * Для всех остальных свойств потребуется прибегнуть к принудительному масштабированию.
   * @todo
   * Например: var fnt_cls_list = ['legend', 'article', 'copyright'];
   */

  /**
   * СПИСОК КЛАССОВ С МОДИФИЦИРУЕМЫМИ ШРИФТАМИ
   * @global
   *
   * Известные недочёты библиотеки: 
   * – Из-за браузеров Opera, Google Chrom, Safari на мелких масштабах видового порта увеличивается шрифт, 
   * после чего он не уменьшается до обновления экрана. 
   * Исправление проблемы осуществляется через глобальный тег HTML и назначения всех шрифтовых параметров 
   * через размерность rem.
   * – Если размерности шрифтов заданы не через em и не через rem, то для таких стилей можно воспользоваться
   * ниже приведёнными списками для настройки шрифтов.
   */
  var fnt_cls_list = [];
  /**
   * СПИСОК УКАЗАТЕЛЕЙ С МОДИФИЦИРУЕМЫМИ ШРИФТАМИ
   * @global
   */
  var fnt_ids_list = [];
  /**
   * СПИСОК ТЕГОВ С МОДИФИЦИРУЕМЫМИ ШРИФТАМИ
   * изменение шрифта в теге html влияет на единицу измерения rem на всей странице
   * @global
   */
  var fnt_tgs_list = ['html']; 

  /**
   * СПИСОК КЛАССОВ С МОДИФИЦИРУЕМЫМИ СВОЙСТВАМИ ГРАНИЦЫ
   * @global
   *
   * Известные недочёты библиотеки: 
   * – Включение в списки border при trackResize = true не приводит 
   * к восстановлению (увеличению) толщины границы в режиме увеличения размера окна браузера.
   * – В процентах border-width тоже задать нельзя, поэтому пользуйтесь глобальными CSS-переменными.
   * – Техника с parseFloat(parseFloat(rootStyles.getPropertyValue(root_var_nm)).toFixed(6))  решила
   * проблему с пропаданием границ в 2-3 пиксела на предельно больших масштабах браузера.
   */
  var brd_cls_list = []; 
  /**
   * СПИСОК УКАЗАТЕЛЕЙ С МОДИФИЦИРУЕМЫМИ СВОЙСТВАМИ ГРАНИЦЫ
   * @global
   */
  var brd_ids_list = [];
  /**
   * СПИСОК ТЕГОВ С МОДИФИЦИРУЕМЫМИ СВОЙСТВАМИ ГРАНИЦЫ
   * @global
   */
  var brd_tgs_list = []; 


  /**
   * СПИСОК КЛАССОВ С МОДИФИЦИРУЕМЫМИ ПОЛЯМИ И ОТСТУПАМИ
   * @global
   */
  var mrg_cls_list = [];
  /**
   * СПИСОК УКАЗАТЕЛЕЙ С МОДИФИЦИРУЕМЫМИ ПОЛЯМИ И ОТСТУПАМИ
   * @global
   */
  var mrg_ids_list = [];
  /**
   * СПИСОК ТЕГОВ С МОДИФИЦИРУЕМЫМИ ПОЛЯМИ И ОТСТУПАМИ
   * @global
   */
  var mrg_tgs_list = [];
  //===================================================================== КОНЕЦ ВХОДНЫХ ДАННЫХ

  /**
   * javascript-объект корневой секции CSS с переменными
   * @global
   */
  var root = document.querySelector(':root');
  var rootStyles = getComputedStyle(root);

  /**
   * АССОЦИАТИВНЫЙ МАССИВ CSS-ПЕРЕМЕННЫХ 
   * @global
   * неизменяемые начальные данные
   */
  var rootM = {};

  /**
   * ИНИЦИИРУЕМ МАССИВ НАЧАЛЬНЫХ ДАННЫХ ИЗ CSS-ПЕРЕМЕННЫХ
   * (Вспомогательная функция)
   *
   * – здесь заполняется ассоциативный массив констант – Object rootM
   * – заполнение должно производиться до любого программного изменения CSS-ПЕРЕМЕННЫХ в секции :root
   */
  var initRootM = function () {
    rootM.width   = {};
    rootM.height  = {};
    rootM.left    = {};
    rootM.top     = {};
    rootM.any     = {};
    /**
     * НАЧАЛЬНЫЕ РАЗМЕРЫ БЛОКА (ГЛАВНОГО ФРЕЙМА СТРАНИЦЫ), СЖИМАЕМОГО ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА
     * @global
     */
    rootM['--frame-width']  = rootStyles.getPropertyValue('--frame-width');
    rootM['--frame-height'] = rootStyles.getPropertyValue('--frame-height');
    /**
     * НАЧАЛЬНАЯ ПОЗИЦИЯ БЛОКА (ГЛАВНОГО ФРЕЙМА СТРАНИЦЫ), ЦЕНТРИРУЕМОГО ВНУТРИ ОКНА БРАУЗЕРА 
     * @global
     */
    rootM['--frame-left']   = rootStyles.getPropertyValue('--frame-left');
    rootM['--frame-top']    = rootStyles.getPropertyValue('--frame-top');

    /**
     * СПИСКИ ГЛОБАЛЬНЫХ CSS-ПЕРЕМЕННЫХ, ПОДЛЕЖАЩИХ МОДИФИКАЦИИ ПРИ МАСШТАБНЫХ ПРЕОБРАЗОВАНИЯХ
     * @global
     */
    root_width_list.forEach (function(root_var_nm) {
      // console.log("initRootM.root_width_list."+root_var_nm); 
      rootM.width[root_var_nm]  = parseFloat(parseFloat(rootStyles.getPropertyValue(root_var_nm)).toFixed(6));
    });       
    root_height_list.forEach (function(root_var_nm) {
      // console.log("initRootM.root_height_list."+root_var_nm); 
      rootM.height[root_var_nm] = parseFloat(parseFloat(rootStyles.getPropertyValue(root_var_nm)).toFixed(6));
    });       
    root_left_list.forEach (function(root_var_nm) {
      // console.log("initRootM.root_left_list."+root_var_nm); 
      rootM.left[root_var_nm]   = parseFloat(parseFloat(rootStyles.getPropertyValue(root_var_nm)).toFixed(6));
    });       
    root_top_list.forEach (function(root_var_nm) {
      // console.log("initRootM.root_top_list."+root_var_nm); 
      rootM.top[root_var_nm]    = parseFloat(parseFloat(rootStyles.getPropertyValue(root_var_nm)).toFixed(6));
    });       
    root_any_list.forEach (function(root_var_nm) {
      // console.log("initRootM.root_any_list."+root_var_nm); 
      rootM.any[root_var_nm]    = parseFloat(parseFloat(rootStyles.getPropertyValue(root_var_nm)).toFixed(6));
    });       
  };


  /**
   * ИЗВЛЕКАЕМ ИЗ CSS РАЗМЕРЫ БЛОКА, СЖИМАЕМОГО ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА
   * (Управляющая функция)
   * здесь же извлекаем все остальные css-переменных, которые станут исходными данными 
   * для масштабирования
   */
  initRootM();

  /**
   * АССОЦИАТИВНЫЙ МАССИВ НАЧАЛЬНЫХ СТИЛЕВЫХ СВОЙСТВ МАСШТАБИРУЕМЫХ ОБЪЕКТОВ
   * @global
   * неизменяемые начальные данные
   */
  // var startAttrs = {};
  /**
   * ИНИЦИИРУЕМ МАССИВ НАЧАЛЬНЫХ ДАННЫХ ИЗ СПИСКОВ ОБЪЕКТОВ СО СТИЛЕВОЙ МОДИФИКАЦИЕЙ
   * (Вспомогательная функция)
   * К точному подходу масштабирования стилевых свойств объектов. Но он более трудоёмкий и ресурсозатратный.
   * На практике может оказаться достаточно приближённого подхода, реализованного через манипулирование 
   * коэффициентом mod_rel = rel/bak_rel . Поэтому реализация этого и других сопутствующих методов здесь отсутствует.
   *
   * – заполнение должно производиться в начале исполнения скрипта вместе с initRootM
   */
  // var initStartAttrs = function () {
  // };
  /**
   * ИЗВЛЕКАЕМ ИЗ CSS ИСХОДНЫЕ СТИЛИ МАСШТАБИРУЕМЫХ ОБЪЕКТОВ
   * (Управляющая функция)
   */
  // initStartAttrs();

  /**
   * АССОЦИАТИВНЫЙ МАССИВ ТЕКУЩИХ СТИЛЕВЫХ СВОЙСТВ МАСШТАБИРУЕМЫХ ОБЪЕКТОВ
   * @global
   * отсутствующий ниже обработчик currentAttrs должен полностью повторять обработчик массива currentM
   * изменяемые данные
   */
  // var currentAttrs = {};
  /**
   * АССОЦИАТИВНЫЙ МАССИВ ТЕКУЩИХ CSS-ПЕРЕМЕННЫХ 
   * @global
   * изменяемые данные
   */
  var currentM = {};

  /**
   * ИНИЦИИРУЕМ МАССИВ НАЧАЛЬНЫХ ДАННЫХ ИЗ CSS-ПЕРЕМЕННЫХ
   * (Вспомогательная функция)
   *
   * – здесь заполняется ассоциативный массив констант – Object rootM
   * – заполнение должно производиться до любого программного изменения CSS-ПЕРЕМЕННЫХ в секции :root
   */
  var getCurrentM = function () {
    currentM.width   = {};
    currentM.height  = {};
    currentM.left    = {};
    currentM.top     = {};
    currentM.any     = {};
    /**
     * ТЕКУЩИЕ РАЗМЕРЫ БЛОКА (ГЛАВНОГО ФРЕЙМА СТРАНИЦЫ), СЖИМАЕМОГО ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА
     * @global
     */
    // console.log("getCurrentM.rootM['--frame-width'] = "+rootM['--frame-width']); 
    currentM['--frame-width']   = parseInt(rootM['--frame-width'], 10);
    currentM['--frame-height']  = parseInt(rootM['--frame-height'], 10);
    /**
     * ПОЗИЦИЯ БЛОКА (ГЛАВНОГО ФРЕЙМА СТРАНИЦЫ), ЦЕНТРИРУЕМОГО ВНУТРИ ОКНА БРАУЗЕРА 
     * @global
     */
    currentM['--frame-left']    = parseInt(rootM['--frame-left'], 10);
    currentM['--frame-top']     = parseInt(rootM['--frame-top'], 10);
    // console.log("getCurrentM.currentM['--frame-width'] = "+currentM['--frame-width']); 


    /**
     * СПИСКИ ГЛОБАЛЬНЫХ CSS-ПЕРЕМЕННЫХ, ПОДЛЕЖАЩИХ МОДИФИКАЦИИ ПРИ МАСШТАБНЫХ ПРЕОБРАЗОВАНИЯХ
     * @global
     */
    root_width_list.forEach (function(root_var_nm) {
      currentM.width[root_var_nm]   = rootM.width[root_var_nm];
    });       
    root_height_list.forEach (function(root_var_nm) {
      currentM.height[root_var_nm]  = rootM.height[root_var_nm];
    });       
    root_left_list.forEach (function(root_var_nm) {
      currentM.left[root_var_nm]    = rootM.left[root_var_nm];
    });       
    root_top_list.forEach (function(root_var_nm) {
      currentM.top[root_var_nm]     = rootM.top[root_var_nm];
    });       
    root_any_list.forEach (function(root_var_nm) {
      currentM.any[root_var_nm]     = rootM.any[root_var_nm];
    });       
  };



  /**
   * ИЗВЛЕКАЕМ ИЗ МАССИВА НАЧАЛЬНЫХ ДАННЫХ ЦЕЛОЧИСЛЕННЫЕ ЗНАЧЕНИЯ
   * (Управляющая функция)
   */
  getCurrentM();

  /**
   * КОПИЯ РАЗМЕРОВ БЛОКА, СЖИМАЕМОГО ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА
   * @internal
   */
  var sws = currentM['--frame-width'];
  var shs = currentM['--frame-height']; 


  /**
   * КОЭФФИЦИЕНТ СЖАТИЯ СТРАНИЦЫ ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА 
   * @internal
   */
  var rel = 1.0;

  /**
   * КОЭФФИЦИЕНТ ПРЕДВАРИТЕЛЬНОГО СЖАТИЯ СТРАНИЦЫ ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА 
   * @internal
   */
  var bak_rel = 1.0;

  /**
   * ЗАПРЕТ НА ПЕРЕМЕЩЕНИЯ БЛОКА С ФРЕЙМОМ СТРАНИЦЫ К ЦЕНТРУ ОКНА БРАУЗЕРА ДО ПЕРЕРАСЧЁТА ЕГО РАЗМЕРОВ  
   * @global
   */
  var wasStart = false;

  /**
   * ОПРЕДЕЛИТЕЛЬ МАСШТАБА ВИДОВОГО ПОРТА БРАУЗЕРА
   * (Встроенная пользовательская функция)
   * Актуально для браузеров FireFox, Opera, Google Chrome. 
   *
   * @return string возвращает масштаб видового порта.
   */
  var getVPScale = function() {
    var scale = (window.devicePixelRatio/2*100).toFixed(2)+'%'
    // console.log("Текущий масштаб видового порта: "+scale); 
    return scale;
  };

  /**
   * ОПРЕДЕЛИТЕЛЬ МАСШТАБ СЖАТИЯ СТРАНИЦЫ
   * (Встроенная пользовательская функция)
   *
   * @return string возвращает масштаб сжатия страницы.
   */
  var getPageScale = function() {
    var scale = (rel*100).toFixed(2)+'%'
    // console.log("Текущий масштаб сжатия страницы: "+scale); 
    return scale;
  };

  /**
   * ОПРЕДЕЛИТЕЛЬ МИНИМАЛЬНОГО РАЗМЕРА ШРИФТА В БРАУЗЕРЕ
   * (Встроенная пользовательская функция)
   * Актуально для браузеров Opera, Google Chrome, запрещающих уменьшение шрифта на маленьких масштабах. 
   *
   * @return string возвращает размер шрифта в пикселях на экране.
   */
  var getMinimumFontSize = function() {
    var ta = document.createElement('textarea');
    ta.style.display = 'none';
    ta.style.fontSize = '6px'; 
    document.body.appendChild(ta); 
    var minimumFontSize = window.getComputedStyle(ta, null).getPropertyValue('font-size'); 
    document.body.removeChild(ta);
    return minimumFontSize;
  };

  /**
   * Извлечение действительного числа из CSS-свойства для объекта, найденного по классу, указателю или тегу.
   * (Вспомогательная функция)
   *
   * @param obj|cont – jQuery-объект, полученный через селектор.
   * @param string|prop – Метка для текста.
   *
   * @return float возвращает действительное значение для свойства объект.
   */
  var getFValue = function (cont, prop) {
    return parseFloat(parseFloat(cont.css(prop)).toFixed(6));
  };

  /**
   * МАСШТАБИРУЕМ ГЛОБАЛЬНЫЕ CSS-ПЕРЕМЕННЫЕ
   * (Вспомогательная функция)
   */
  var scaleCurrentM = function (rel) {
    /**
     * ТЕКУЩИЕ РАЗМЕРЫ БЛОКА (ГЛАВНОГО ФРЕЙМА СТРАНИЦЫ), СЖИМАЕМОГО ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА
     * @global
     */
    currentM['--frame-width']   = parseInt((currentM['--frame-width']*rel).toFixed(), 10);
    currentM['--frame-height']  = parseInt((currentM['--frame-height']*rel).toFixed(), 10);

    /**
     * СПИСКИ ГЛОБАЛЬНЫХ CSS-ПЕРЕМЕННЫХ, ПОДЛЕЖАЩИХ МОДИФИКАЦИИ ПРИ МАСШТАБНЫХ ПРЕОБРАЗОВАНИЯХ
     * @global
     */
    root_width_list.forEach (function(root_var_nm) {
      currentM.width[root_var_nm]  = currentM.width[root_var_nm]*rel;
    });       
    root_height_list.forEach (function(root_var_nm) {
      currentM.height[root_var_nm] = currentM.height[root_var_nm]*rel;
    });       
    root_left_list.forEach (function(root_var_nm) {
      currentM.left[root_var_nm]   = currentM.left[root_var_nm]*rel;
    });       
    root_top_list.forEach (function(root_var_nm) {
      currentM.top[root_var_nm]    = currentM.top[root_var_nm]*rel;
    });       
    root_any_list.forEach (function(root_var_nm) {
      currentM.any[root_var_nm]     = currentM.any[root_var_nm]*rel;
    });       
  };
  /**
   * ПРОВЕРКА ЗНАЧЕНИЯ ОКОЛО НУЛЯ
   * (Вспомогательная функция)
   *
   * @param string|var_nm – имя селектора jQuery.
   * @param integer/float|val – значение переменной.
   *
   * @return float возвращает значение переменной, откорректированной на интервале (0..1) в сторону единицы.
   */
  var checkZero = function (var_nm, val) {
    // console.log("checkZero: "+var_nm+" is "+val);
    if (val==0) {
      // console.log("checkZero: "+var_nm+" = 0 = "+val);
      return 0;
    } else if ((val>0) && (val<1)) {
      // console.log("checkZero: "+var_nm+" = 1 = "+val);
      return 1;
    } else {
      var v = getMinimumFontSize();
      // console.log("checkZero.getMinimumFontSize = "+v);
      var factor = parseFloat(parseFloat(v).toFixed(1));

      // console.log("checkZero: "+var_nm+" > 1 = "+val);
      if ((factor>6.0) && ((factor/val)>4.0)) val*=2;

      // console.log("checkZero.factor = "+factor+"; val = "+val);
      return val;
    }
  };

  /**
   * СОХРАНЯЕМ МАСШТАБИРОВАНИЕ ГЛОБАЛЬНЫХ CSS-ПЕРЕМЕННЫХ
   * (Вспомогательная функция)
   */
  var setScaleCurrentM = function () {
    /**
     * ТЕКУЩИЕ РАЗМЕРЫ БЛОКА (ГЛАВНОГО ФРЕЙМА СТРАНИЦЫ), СЖИМАЕМОГО ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА
     * @global
     */
    root.style.setProperty('--frame-width', currentM['--frame-width']+'px');
    root.style.setProperty('--frame-height', currentM['--frame-height']+'px');

    /**
     * СПИСКИ ГЛОБАЛЬНЫХ CSS-ПЕРЕМЕННЫХ, ПОДЛЕЖАЩИХ МОДИФИКАЦИИ ПРИ МАСШТАБНЫХ ПРЕОБРАЗОВАНИЯХ
     * @global
     */
    root_width_list.forEach (function(root_var_nm) {
      var locV = currentM.width[root_var_nm];
      var locVar = checkZero(root_var_nm, locV);
      root.style.setProperty(root_var_nm, locVar+'px');
    });       
    root_height_list.forEach (function(root_var_nm) {
      var locV = currentM.height[root_var_nm];
      var locVar = checkZero(root_var_nm, locV);
      root.style.setProperty(root_var_nm, locVar+'px');
    });       
    root_left_list.forEach (function(root_var_nm) {
      var locV = currentM.left[root_var_nm];
      var locVar = checkZero(root_var_nm, locV);
      root.style.setProperty(root_var_nm, locVar+'px');
    });       
    root_top_list.forEach (function(root_var_nm) {
      var locV = currentM.top[root_var_nm];
      var locVar = checkZero(root_var_nm, locV);
      root.style.setProperty(root_var_nm, locVar+'px');
    });       
    root_any_list.forEach (function(root_var_nm) {
      var locV = currentM.any[root_var_nm];
      var locVar = checkZero(root_var_nm, locV);
      root.style.setProperty(root_var_nm, locVar+'px');
    });     
  };


  /**
   * СДВИГАЕМ ГЛОБАЛЬНЫЕ CSS-ПЕРЕМЕННЫЕ
   * (Вспомогательная функция)
   */
  var moveCurrentM = function (moveX, moveY) {
    /**
     * ПОЗИЦИЯ БЛОКА (ГЛАВНОГО ФРЕЙМА СТРАНИЦЫ), ЦЕНТРИРУЕМОГО ВНУТРИ ОКНА БРАУЗЕРА 
     * @global
     */
    currentM['--frame-left']    = moveX;
    currentM['--frame-top']     = moveY;

  };

  /**
   * СОХРАНЯЕМ СДВИГ ГЛОБАЛЬНЫХ CSS-ПЕРЕМЕННЫХ
   * (Вспомогательная функция)
   */
  var setMoveCurrentM = function () {
    /**
     * ПОЗИЦИЯ БЛОКА (ГЛАВНОГО ФРЕЙМА СТРАНИЦЫ), ЦЕНТРИРУЕМОГО ВНУТРИ ОКНА БРАУЗЕРА 
     * @global
     */
    root.style.setProperty('--frame-left', currentM['--frame-left']+'px');
    root.style.setProperty('--frame-top', currentM['--frame-top']+'px');

  };
  /**
   * ПРОВЕРЯЕМ НАЛИЧИЕ ЭЛЕМЕНТА НА СТРАНИЦЕ ПО СЕЛЕКТОРУ
   * (Вспомогательная функция)
   *
   * @param string|selector – jQuery-объект, полученный через селектор.
   *
   * @return boolean возвращает признак существования объекта на странице.
   */
  jQuery.exists = function(selector) {
     return ($(selector).length > 0);
  }


  /**
   * МОДИФИЦИРУЕМ РАЗМЕР ШРИФТА, МЕЖСИМВОЛЬНЫЙ ИНТЕРВАЛ
   * (Вспомогательная функция)
   *
   * @param string|cont – jQuery-объект, полученный через селектор.
   */
  var changeFont = function (cont) {
    mod_rel = rel/bak_rel;
    // console.log("Размер шрифта (было): rel ="+mod_rel + "; cont.css('fontSize') = " + cont.css("fontSize"));
    var ncFS = getFValue(cont, "fontSize") * mod_rel;  
    var ncLS = getFValue(cont, "letterSpacing") * mod_rel;  

    // console.log("Размер шрифта.5: rel ="+mod_rel + "; fontSize = " + ncFS + "; letterSpacing = " + ncLS); //
    cont.css({fontSize: ncFS, letterSpacing: ncLS});
    // console.log("Размер шрифта (стало): rel ="+mod_rel + "; cont.css('fontSize') = " + cont.css("fontSize"));
  };

  /**
   * МОДИФИЦИРУЕМ ТОЛЩИНУ И РАДИУС У border-а
   * (Вспомогательная функция)
   *
   * @param string|cont – jQuery-объект, полученный через селектор.
   */
  var changeBorder = function (cont) {
    mod_rel = rel/bak_rel;
    // console.log("Размер бордюра (было): rel ="+mod_rel + "; cont.css('border-width') = " + cont.css("borderTopWidth"));
    var ncT = getFValue(cont, "borderTopWidth") * mod_rel;  
    var ncR = getFValue(cont, "borderRightWidth") * mod_rel;  
    var ncB = getFValue(cont, "borderBottomWidth") * mod_rel;  
    var ncL = getFValue(cont, "borderLeftWidth") * mod_rel;  

    var ncTL = getFValue(cont, "borderTopLeftRadius") * mod_rel;  
    var ncTR = getFValue(cont, "borderTopRightRadius") * mod_rel;  
    var ncBL = getFValue(cont, "borderBottomLeftRadius") * mod_rel;  
    var ncBR = getFValue(cont, "borderBottomRightRadius") * mod_rel;  
    // console.log("Размер бордюра.5: rel ="+mod_rel + "; border.Width = " + ncT + ", " + ncR + ", " + ncB + ", " + ncL+ "; border.Radius = " + ncTL + ", " + ncTR + ", " + ncBL + ", " + ncBR); 
    cont.css({borderTopWidth: ncT, borderRightWidth: ncR, borderBottomWidth: ncB, borderLeftWidth: ncL, borderTopLeftRadius: ncTL, borderTopRightRadius: ncTR, borderBottomLeftRadius: ncBL, borderBottomRightRadius: ncBR});
    // console.log("Размер бордюра (стало): rel ="+mod_rel + "; cont.css('border-width') = " + cont.css("borderTopWidth")); 
  };    

  /**
   * МОДИФИЦИРУЕМ ПОЛЯ И ОТСТУПЫ У КОМПОНЕНТА
   * (Вспомогательная функция)
   *
   * @param string|cont – jQuery-объект, полученный через селектор.
   */
  var changeFields = function (cont) {
    mod_rel = rel/bak_rel;
      // console.log("Размер поля (было): rel ="+mod_rel + "; cont.css('margin-left') = " + cont.css("marginLeft")); 
      var ncMT = getFValue(cont, "marginTop") * mod_rel;  
      var ncMR = getFValue(cont, "marginRight") * mod_rel;  
      var ncMB = getFValue(cont, "marginBottom") * mod_rel;  
      var ncML = getFValue(cont, "marginLeft") * mod_rel;  

      var ncPT = getFValue(cont, "paddingTop") * mod_rel;  
      var ncPR = getFValue(cont, "paddingRight") * mod_rel;  
      var ncPB = getFValue(cont, "paddingBottom") * mod_rel;  
      var ncPL = getFValue(cont, "paddingLeft") * mod_rel;  
      // console.log("Размер поля.5: rel ="+rel + "; margin = " + ncMT + " " + ncMR + " " + ncMB + " " + ncML  + "; padding = " + ncPT + " " + ncPR + " " + ncPB + " " + ncPL ); 
      cont.css({marginTop: ncMT, marginRight: ncMR, marginBottom: ncMB, marginLeft: ncML, paddingTop: ncPT, paddingRight: ncPR, paddingBottom: ncPB, paddingLeft: ncPL});
      // console.log("Размер поля (стало): rel ="+rel + "; cont.css('marginLeft') = " + cont.css("marginLeft")); 
  };    


  /**
   * ОТЛОЖЕННЫЙ ЗАПУСК ОБРАБОТЧИКА ПРОПОРЦИОНАЛЬНО СЖИМАЕМЫХ КОМПОНЕНТОВ
   * (Управляющая функция)
   * ВАЖНО! На страницах с графическими ресурсами выделяется время на их полную загрузку. 
   */
  setTimeout(first_zoom(false), 100);
  /**
   * СЖАТИЕ БЛОКА И КОМПОНЕНТОВ ФРЕЙМА СТРАНИЦЫ ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА
   * "zoom out frame"
   * (Первая главная функция)
   */
  function first_zoom_param() {
    first_zoom(true); 
  };    
  function first_zoom(byResize) {
    /**
     * КОЭФФИЦИЕНТ ПРЕДВАРИТЕЛЬНОГО СЖАТИЯ СТРАНИЦЫ ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА 
     * @internal
     * Приближённый подход к масштабируванию стилевых свойств объектов
     */
    bak_rel = rel;

    if (trackResize) {

      /**
       * ИЗВЛЕКАЕМ ИЗ МАССИВА НАЧАЛЬНЫХ ДАННЫХ ЦЕЛОЧИСЛЕННЫЕ ЗНАЧЕНИЯ
       * (Управляющая функция)
       */
      getCurrentM();
      // console.log("Размеры Блока: W * H ="+currentM['--frame-width']+' * '+currentM['--frame-height']); 

      /**
       * КОПИЯ РАЗМЕРОВ БЛОКА, СЖИМАЕМОГО ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА
       * @internal
       */
      sws = currentM['--frame-width'];
      shs = currentM['--frame-height']; 

      /**
       * КОЭФФИЦИЕНТ СЖАТИЯ СТРАНИЦЫ ДО РАЗМЕРОВ ВНУТРЕННЕЙ ОБЛАСТИ ОКНА БРАУЗЕРА 
       * @internal
       */
      rel = 1.0;

    };
  

    /**
     * ИЩЕМ РАЗМЕРЫ блока ФРЕЙМА СТРАНИЦЫ, ВПИСАННОГО ВО ВНУТРЕННЮЮ ОБЛАСТЬ ОКНА БРАУЗЕРА, 
     * а также:
     */
    /**
     * – ИЩЕМ КОЭФФИЦИЕНТ СЖАТИЯ ФРЕЙМА СТРАНИЦЫ ПО ШИРИНЕ
     */
    if ((currentM['--frame-width']!=0) && (window.innerWidth<currentM['--frame-width'])) {
      rel = window.innerWidth / currentM['--frame-width'];
      // console.log("1. Пропорции размера изображения к размеру окна: rel ="+rel); 
      shs = parseInt((rel*currentM['--frame-height']).toFixed(), 10);
      sws = window.innerWidth;
      /**
       * – ИЩЕМ КОЭФФИЦИЕНТ СЖАТИЯ ФРЕЙМА СТРАНИЦЫ ПО ВЫСОТЕ
       */
      if ((currentM['--frame-height']!=0) && (window.innerHeight<shs)) {
        rel = window.innerHeight / currentM['--frame-height'];
        // console.log("2. Пропорции размера изображения к размеру окна: rel ="+rel); 
        sws = parseInt((rel*currentM['--frame-width']).toFixed(), 10);
        shs = window.innerHeight;
      };
    };
    /**
     * – ИЩЕМ КОЭФФИЦИЕНТ СЖАТИЯ ФРЕЙМА СТРАНИЦЫ ПО ВЫСОТЕ
     */
    if ((currentM['--frame-height']!=0) && (window.innerHeight<currentM['--frame-height'])) {
      rel = window.innerHeight / currentM['--frame-height'];
      // console.log("3. Пропорции размера изображения к размеру окна: rel ="+rel); 
      sws = parseInt((rel*currentM['--frame-width']).toFixed(), 10);
      shs = window.innerHeight;
      /**
       * – ИЩЕМ КОЭФФИЦИЕНТ СЖАТИЯ ФРЕЙМА СТРАНИЦЫ ПО ШИРИНЕ
       */
      if ((currentM['--frame-width']!=0) && (window.innerWidth<sws)) {
        rel = window.innerWidth / currentM['--frame-width'];
        // console.log("4. Пропорции размера изображения к размеру окна: rel ="+rel); 
        shs = parseInt((rel*currentM['--frame-height']).toFixed(), 10);
        sws = window.innerWidth;
      };
    };
    // var p1 = getVPScale();
    // var p2 = getPageScale();
    // console.log('first_zoom.0. Масштаб окна = '+p1+'; Масштаб сцены = '+p2+'; Размеры окна = '+window.innerWidth+'*'+window.innerHeight);

    /**
     * МАСШТАБИРУЕМ РАЗМЕРЫ БЛОКА ФРЕЙМА СТРАНИЦЫ, ВПИСАННОГО ВО ВНУТРЕННЮЮ ОБЛАСТЬ ОКНА БРАУЗЕРА 
     * при этом CSS-переменные ширины и высоты фрейма страницы не меняем
     */
    scaleCurrentM(rel);
    // console.log("B. Размеры внутренней области окна браузера: W * H ="+window.innerWidth+" * "+window.innerHeight + " Размеры фрейма страницы: W * H ="+currentM['--frame-width']+" * "+currentM['--frame-height'] + "; window.devicePixelRatio = " + window.devicePixelRatio); 

    /**
     * МЕНЯЕМ ПОЛОЖЕНИЕ БЛОКА ФРЕЙМА СТРАНИЦЫ, ВПИСАННОГО ВО ВНУТРЕННЮЮ ОБЛАСТЬ ОКНА БРАУЗЕРА 
     */
    var bl_style_left = parseInt( ( (window.innerWidth - currentM['--frame-width'])  /2).toFixed(), 10);
    var bl_style_top  = parseInt( ( (window.innerHeight - currentM['--frame-height']) /2).toFixed(), 10);
    
    moveCurrentM(bl_style_left, bl_style_top);

    /**
     * МОДИФИЦИРУЕМ CSS-ПЕРЕМЕННЫЕ, ПОДЛЕЖАЩИЕ МОДИФИКАЦИИ 
     */
    setMoveCurrentM();
    setScaleCurrentM();

    /**
     * МОДИФИЦИРУЕМ СВОЙСТВА ШРИФТА И СТРОКИ 
     */
    // console.log("Флажок trackResize установлен: "+trackResize);
    fnt_cls_list.forEach (function(fnt_cls_nm) {
      // console.log("Размер шрифта.1: rel ="+rel + "; fnt_cls_nm = " + fnt_cls_nm); 
      var selector = '.'+fnt_cls_nm;
      if ($.exists(selector)) changeFont($(selector));    
    }); 
    fnt_ids_list.forEach (function(fnt_ids_nm) {
      // console.log("Размер шрифта.1: rel ="+rel + "; fnt_ids_nm = " + fnt_ids_nm); 
      var selector = '#'+fnt_ids_nm;
      if ($.exists(selector))  changeFont($(selector));    
    }); 
    fnt_tgs_list.forEach (function(fnt_tgs_nm) {
      // console.log("Размер шрифта.1: rel ="+rel + "; fnt_tgs_nm = " + fnt_tgs_nm); 
      var selector = fnt_tgs_nm;
      if ($.exists(selector))  changeFont($(selector));    
    });


    /**
     * МОДИФИЦИРУЕМ СВОЙСТВА ГРАНИЦЫ БЛОКА И ЕЁ РАДИУСА
     */
    brd_cls_list.forEach (function(brd_cls_nm) {
      // console.log("Размер бордюра.1: rel ="+rel + "; brd_cls_nm = " + brd_cls_nm); 
      var selector = '.'+brd_cls_nm;
      if ($.exists(selector)) changeBorder($(selector));    
    }); 
    brd_ids_list.forEach (function(brd_ids_nm) {
      console.log("Размер бордюра.1: rel ="+rel + "; brd_ids_nm = " + brd_ids_nm); 
      var selector = '#'+brd_ids_nm;
      if ($.exists(selector)) changeBorder($(selector));    
    }); 
    brd_tgs_list.forEach (function(brd_tgs_nm) {
      // console.log("Размер бордюра.1: rel ="+rel + "; brd_tgs_nm = " + brd_tgs_nm); 
      var selector = brd_tgs_nm;
      if ($.exists(selector)) changeBorder($(selector));    
    }); 


    /**
     * МОДИФИЦИРУЕМ ПОЛЯ И ОТСТУПЫ У КОМПОНЕНТА
     */
    mrg_cls_list.forEach (function(mrg_cls_nm) {
      // console.log("Размер поля.1: rel ="+rel + "; mrg_cls_nm = " + mrg_cls_nm); 
      var selector = '.'+mrg_cls_nm;
      if ($.exists(selector)) changeFields($(selector));    
    });
    mrg_ids_list.forEach (function(mrg_ids_nm) {
      // console.log("Размер поля.1: rel ="+rel + "; mrg_ids_nm = " + mrg_ids_nm); 
      var selector = '#'+mrg_ids_nm;
      if ($.exists(selector)) changeFields($(selector));    
    });
    mrg_tgs_list.forEach (function(mrg_tgs_nm) {
      // console.log("Размер поля.1: rel ="+rel + "; mrg_tgs_nm = " + mrg_tgs_nm); 
      var selector = mrg_tgs_nm;
      if ($.exists(selector)) changeFields($(selector));    
    });

    wasStart = true;

    /**
     * ВКЛЮЧАЕМ СТРАНИЦУ
     * @global
     */
    $("body").css({overflow: "auto", opacity: "1"});
  }

  /**
   * ЦЕНТРИРОВАНИЕ СТРАНИЦЫ В ОКНЕ БРАУЗЕРА, ЕСЛИ ЕЁ РАЗМЕРЫ МЕНЬШЕ РАЗМЕРОВ ВИДОВОГО ПОРТА БРАУЗЕРА
   * (Вторая главная функция)
   */
  function flashpos() { 
    if (!wasStart) return ;
    // var p1 = getVPScale();
    // var p2 = getPageScale();
    // console.log('flashpos.0. Масштаб окна = '+p1+'; Масштаб сцены = '+p2+'; Размеры окна = '+window.innerWidth+'*'+window.innerHeight);
    // console.log("flashpos. Размер окна был изменен! "+window.innerWidth+' * '+window.innerHeight); 
    var n_win_w = window.innerWidth;
    var n_win_h = window.innerHeight;

    // console.log("flashpos. Размеры изображения: W * H ="+currentM['--frame-width']+" * "+currentM['--frame-height'] + "; window.devicePixelRatio = " + window.devicePixelRatio); 
    var lessWidth = (n_win_w<currentM['--frame-width']);
    var lessHight = (n_win_h<currentM['--frame-height']);
    // console.log("flashpos. lessWidth = "+lessWidth+'; lessHight = '+lessHight); 
    var bl_style_left = (lessWidth==true) ? 0 : parseInt(((n_win_w - currentM['--frame-width'])/2).toFixed(), 10);
    var bl_style_top  = (lessHight==true)  ? 0 : parseInt(((n_win_h - currentM['--frame-height'])/2).toFixed(), 10);

    moveCurrentM(bl_style_left, bl_style_top);

    /**
     * ОБНОВЛЯЕМ CSS-СВОЙСТВА О ПОЛОЖЕНИИ ЭЛЕМЕНТОВ ФРЕЙМА СТРАНИЦЫ
     */
    setMoveCurrentM();

  };
  /**
   * ПЕРЕХВАТЫВАЕМ СОБЫТИЕ МАСШТАБИРОВАНИЯ СТРАНИЦЫ ОТ ИСПОЛЬЗОВАНИЯ ГОРЯЧИХ КЛАВИШ В БРАУЗЕРЕ
   * (Управляющая функция)
   */
  window.onresize = (trackResize) ? first_zoom_param : flashpos;


});
