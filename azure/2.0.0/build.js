(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.augurReactComponents=e()}}(function(){var e;return function e(t,n,a){function r(i,s){if(!n[i]){if(!t[i]){var l="function"==typeof require&&require;if(!s&&l)return l(i,!0);if(o)return o(i,!0);var u=new Error("Cannot find module '"+i+"'");throw u.code="MODULE_NOT_FOUND",u}var c=n[i]={exports:{}};t[i][0].call(c.exports,function(e){var n=t[i][1][e];return r(n?n:e)},c,c.exports,e,t,n,a)}return n[i].exports}for(var o="function"==typeof require&&require,i=0;i<a.length;i++)r(a[i]);return r}({1:[function(t,n,a){!function(){"use strict";function t(){for(var e=[],n=0;n<arguments.length;n++){var r=arguments[n];if(r){var o=typeof r;if("string"===o||"number"===o)e.push(r);else if(Array.isArray(r))e.push(t.apply(null,r));else if("object"===o)for(var i in r)a.call(r,i)&&r[i]&&e.push(i)}}return e.join(" ")}var a={}.hasOwnProperty;"undefined"!=typeof n&&n.exports?n.exports=t:"function"==typeof e&&"object"==typeof e.amd&&e.amd?e("classnames",[],function(){return t}):window.classNames=t}()},{}],2:[function(e,t,n){"use strict";function a(){}var r,o=function(){function e(e,t){var n=[],a=!0,r=!1,o=void 0;try{for(var i,s=e[Symbol.iterator]();!(a=(i=s.next()).done)&&(n.push(i.value),!t||n.length!==t);a=!0);}catch(e){r=!0,o=e}finally{try{!a&&s.return&&s.return()}finally{if(r)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=e("react"),s=e("moment"),l=e("object-assign"),u=e("./utils/format"),c=e("./utils/asConfig"),d=(e("./toMoment"),e("./onEnter")),l=e("object-assign"),p=e("./utils/isInRange"),f=i.createClass({displayName:"DecadeView",getDefaultProps:function(){return c()},getYearsInDecade:function(e){var t=s(e).get("year"),n=t%10;t=t-n-1;for(var a=[],r=0,o=s(t,"YYYY").startOf("year");12>r;r++)a.push(s(o)),o.add(1,"year");return a},render:function(){r=+s().startOf("day");var e=l({},this.props),t=e.viewMoment=s(this.props.viewDate);this.props.range||(e.moment=s(e.date).startOf("year"));var n=this.getYearsInDecade(t);return i.createElement("div",{className:"dp-table dp-decade-view"},this.renderYears(e,n))},renderYears:function(e,t){for(var n=t.map(function(t,n,a){return this.renderYear(e,t,n,a)},this),a=t.length,r=[],o=Math.ceil(a/4),s=0;o>s;s++)r.push(n.slice(4*s,4*(s+1)));return r.map(function(e,t){return i.createElement("div",{key:"row"+t,className:"dp-row"},e)})},renderYear:function(e,t,n,a){var r=u.year(t,e.yearFormat),l=["dp-cell dp-year"],c=+t;if(e.range){var f=t,m=s(f).endOf("year"),h=o(e.range,2),v=h[0],g=h[1];(p(f,e.range)||p(m,e.range)||v&&p(v,[f,m])||g&&p(g,[f,m]))&&l.push("dp-in-range")}c!=e.moment||e.range||l.push("dp-value"),n||l.push("dp-prev"),n==a.length-1&&l.push("dp-next");var y=this.handleClick.bind(this,e,t);return i.createElement("div",{role:"link",tabIndex:"1",key:r,className:l.join(" "),onClick:y,onKeyUp:d(y)},r)},handleClick:function(e,t,n){n.target.value=t,(e.onSelect||a)(t,n)}});f.getHeaderText=function(e,t){var n=s(e).get("year"),a=n%10;return n=n-a-1,n+" - "+(n+11)},t.exports=f},{"./onEnter":8,"./toMoment":9,"./utils/asConfig":10,"./utils/format":11,"./utils/isInRange":13,moment:14,"object-assign":15,react:181}],3:[function(e,t,n){"use strict";var a=e("react"),r=a.PropTypes,o=e("./onEnter");t.exports=a.createClass({displayName:"DatePickerHeader",propTypes:{onChange:r.func,onPrev:r.func,onNext:r.func,colspan:r.number,children:r.node},render:function(){var e=this.props;return a.createElement("div",{className:"dp-header"},a.createElement("div",{className:"dp-nav-table"},a.createElement("div",{className:"dp-row"},a.createElement("div",{tabIndex:"1",role:"link",className:"dp-prev-nav dp-nav-cell dp-cell",onClick:e.onPrev,onKeyUp:o(e.onPrev)},e.prevText),a.createElement("div",{tabIndex:"1",role:"link",className:"dp-nav-view dp-cell",colSpan:e.colspan,onClick:e.onChange,onKeyUp:o(e.onChange)},e.children),a.createElement("div",{tabIndex:"1",role:"link",className:"dp-next-nav dp-nav-cell dp-cell",onClick:e.onNext,onKeyUp:o(e.onNext)},e.nextText))))}})},{"./onEnter":8,react:181}],4:[function(e,t,n){"use strict";function a(){}var r,o=function(){function e(e,t){var n=[],a=!0,r=!1,o=void 0;try{for(var i,s=e[Symbol.iterator]();!(a=(i=s.next()).done)&&(n.push(i.value),!t||n.length!==t);a=!0);}catch(e){r=!0,o=e}finally{try{!a&&s.return&&s.return()}finally{if(r)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=e("react"),s=e("moment"),l=e("object-assign"),u=e("./utils/format"),c=e("./utils/asConfig"),d=e("./onEnter"),p=e("./toMoment"),f=e("./utils/isInRange"),m=i.createClass({displayName:"MonthView",formatAsDay:function(e,t){return e.format(t||"D")},getDefaultProps:function(){return c()},getInitialState:function(){return{range:null}},getWeekStartMoment:function(e){var t=this.weekStartDay,n=this.toMoment(e).day(t);return n},getDaysInMonth:function(e){var t=this.toMoment(e).startOf("month"),n=this.toMoment(e).startOf("month").add(-1,"days"),a=this.getWeekStartMoment(t),r=[],o=0;for(!n.isBefore(a)||!this.props.alwaysShowPrevWeek&&a.isSame(t)||a.add(-1,"weeks");42>o;o++)r.push(this.toMoment(a)),a.add(1,"days");return r},render:function(){var e=l({},this.props);this.toMoment=function(t,n){return p(t,n||e.dateFormat,{locale:e.locale})},r=+this.toMoment().startOf("day");var t=e.dateFormat,n=e.viewMoment=this.toMoment(e.viewDate,t),a=e.weekStartDay;null==a&&(a=e.localeData._week?e.localeData._week.dow:null),this.weekStartDay=e.weekStartDay=a,e.minDate&&s.isMoment(e.minDate)&&e.minDate.startOf("day"),e.minDate&&(e.minDate=+this.toMoment(e.minDate,t)),e.maxDate&&(e.maxDate=+this.toMoment(e.maxDate,t)),this.monthFirst=this.toMoment(n).startOf("month"),this.monthLast=this.toMoment(n).endOf("month"),e.date&&(e.moment=this.props.range?null:this.toMoment(e.date).startOf("day"));var o=this.getDaysInMonth(n);return i.createElement("div",{className:"dp-table dp-month-view",onMouseLeave:e.highlightRangeOnMouseMove&&this.handleViewMouseLeave},this.renderWeekDayNames(),this.renderDays(e,o))},handleViewMouseLeave:function(){this.state.range&&this.setState({range:null})},renderWeekNumber:function e(t,n){var a,r=n[0],o=r.weeks(),s={key:"week",className:"dp-cell dp-weeknumber",week:o,days:n,date:r,children:o},e=t.renderWeekNumber;return e&&(a=e(s)),void 0===a&&(a=i.createElement("div",s)),a},renderDays:function(e,t){for(var n,a,r=t.map(function(t){return this.renderDay(e,t)},this),o=t.length,s=[],l=Math.ceil(o/7),u=0;l>u;u++)n=7*u,a=7*(u+1),s.push([e.weekNumbers&&this.renderWeekNumber(e,t.slice(n,a))].concat(r.slice(n,a)));return s.map(function(e,t){return i.createElement("div",{key:"row"+t,className:"dp-week dp-row"},e)})},renderDay:function(e,t){var n,a=u.day(t,e.dayFormat),l=["dp-cell dp-day"],c=+t,p=this.toMoment(t),m=this.handleClick.bind(this,e,t,c),h=this.state.range||this.props.range;c==r?l.push("dp-current"):c<this.monthFirst?l.push("dp-prev"):c>this.monthLast&&l.push("dp-next"),e.minDate&&t<e.minDate&&(l.push("dp-disabled dp-before-min"),n=!0);var v;if(e.maxDate&&t>e.maxDate&&(l.push("dp-disabled dp-after-max"),v=!0),c==e.moment&&l.push("dp-value"),h){var g=p,y=s(g).endOf("day"),b=o(h,2),E=b[0],_=b[1];(f(g,h)||f(y,h)||E&&f(E,[g,y])||_&&f(_,[g,y]))&&l.push("dp-in-range")}var C=p.day();0!==C&&6!==C||(l.push("dp-weekend"),e.highlightWeekends&&l.push("dp-weekend-highlight"));var k={role:"link",tabIndex:1,key:a,text:a,date:p,moment:p,className:l.join(" "),style:{},onClick:m,onKeyUp:d(m),children:a};e.range&&e.highlightRangeOnMouseMove&&(k.onMouseEnter=this.handleDayMouseEnter.bind(this,k)),n&&(k.isDisabled=!0,k.beforeMinDate=!0),v&&(k.isDisabled=!0,k.afterMaxDate=!0),"function"==typeof e.onRenderDay&&(k=e.onRenderDay(k));var T=i.DOM.div,N=e.renderDay||T,P=N(k);return void 0===P&&(P=T(k)),P},handleDayMouseEnter:function(e){var t=this.props.range;if(t&&1==t.length){var n=o(t,1),a=n[0];this.setState({range:[a,e.date].sort(function(e,t){return e-t})})}else this.state.range&&this.setState({range:null})},getWeekDayNames:function(e){e=e||this.props;var t=e.weekDayNames,n=this.weekStartDay;if("function"==typeof t)t=t(n,e.locale);else if(Array.isArray(t)){t=[].concat(t);for(var a=n;a>0;)t.push(t.shift()),a--}return t},renderWeekDayNames:function(){var e=this.props.weekNumbers?[this.props.weekNumberName]:[],t=e.concat(this.getWeekDayNames());return i.createElement("div",{className:"dp-row dp-week-day-names"},t.map(function(e,t){return i.createElement("div",{key:t,className:"dp-cell dp-week-day-name"},e)}))},handleClick:function(e,t,n,r){e.minDate&&n<e.minDate||e.maxDate&&n>e.maxDate||(r.target.value=t,(e.onChange||a)(t,r))}});m.getHeaderText=function(e,t){return p(e,null,{locale:t.locale}).format("MMMM YYYY")},t.exports=m},{"./onEnter":8,"./toMoment":9,"./utils/asConfig":10,"./utils/format":11,"./utils/isInRange":13,moment:14,"object-assign":15,react:181}],5:[function(e,t,n){"use strict";function a(){}var r,o=function(){function e(e,t){var n=[],a=!0,r=!1,o=void 0;try{for(var i,s=e[Symbol.iterator]();!(a=(i=s.next()).done)&&(n.push(i.value),!t||n.length!==t);a=!0);}catch(e){r=!0,o=e}finally{try{!a&&s.return&&s.return()}finally{if(r)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=e("react"),s=e("moment"),l=e("./utils/format"),u=e("./utils/asConfig"),c=e("./toMoment"),d=e("./onEnter"),p=e("object-assign"),f=e("./utils/isInRange"),m=i.createClass({displayName:"YearView",getDefaultProps:function(){return u()},getMonthsInYear:function(e){for(var t=s(e).startOf("year"),n=[],a=0;12>a;a++)n.push(s(t)),t.add(1,"month");return n},render:function(){r=+s().startOf("day");var e=p({},this.props),t=e.viewMoment=s(this.props.viewDate);this.props.range||(e.moment=s(e.date).startOf("month"));var n=this.getMonthsInYear(t);return i.createElement("div",{className:"dp-table dp-year-view"},this.renderMonths(e,n))},renderMonths:function(e,t){for(var n=t.map(function(t){return this.renderMonth(e,t)},this),a=t.length,r=[],o=Math.ceil(a/4),s=0;o>s;s++)r.push(n.slice(4*s,4*(s+1)));return r.map(function(e,t){return i.createElement("div",{key:"row"+t,className:"dp-row"},e)})},renderMonth:function(e,t){var n=l.month(t,e.monthFormat),a=["dp-cell dp-month"],r=+t;if(e.range){var u=t,c=s(u).endOf("month"),p=o(e.range,2),m=p[0],h=p[1];(f(u,e.range)||f(c,e.range)||m&&f(m,[u,c])||h&&f(h,[u,c]))&&a.push("dp-in-range")}r==e.moment&&a.push("dp-value");var v=this.handleClick.bind(this,e,t);return i.createElement("div",{tabIndex:"1",role:"link",key:n,className:a.join(" "),onClick:v,onKeyUp:d(v)},n)},handleClick:function(e,t,n){n.target.value=t,(e.onSelect||a)(t,n)}});m.getHeaderText=function(e,t){return c(e,null,{locale:t.locale}).format("YYYY")},t.exports=m},{"./onEnter":8,"./toMoment":9,"./utils/asConfig":10,"./utils/format":11,"./utils/isInRange":13,moment:14,"object-assign":15,react:181}],6:[function(e,t,n){"use strict";var a=e("./utils/getWeekDayNames");t.exports={weekDayNames:a,weekStartDay:null,locale:null,dayFormat:"D",monthFormat:"MMMM",yearFormat:"YYYY",navPrev:"‹",navNext:"›",view:null,date:null,minDate:null,maxDate:null,viewDate:null,dateFormat:"YYYY-MM-DD",onRenderDay:null,renderDay:null,alwaysShowPrevWeek:!1}},{"./utils/getWeekDayNames":12}],7:[function(e,t,n){"use strict";function a(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function r(){}var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},i=e("react"),s=e("moment"),l=e("object-assign"),u=e("./utils/asConfig"),c=e("./MonthView"),d=e("./YearView"),p=e("./DecadeView"),f=e("./Header"),m=e("./toMoment"),h=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},v=e("./onEnter"),g={month:c,year:d,decade:p},y=i.createClass({displayName:"DatePicker",propTypes:{todayText:i.PropTypes.string,gotoSelectedText:i.PropTypes.string,renderFooter:i.PropTypes.func,onChange:i.PropTypes.func,date:i.PropTypes.any,viewDate:i.PropTypes.any},getViewOrder:function(){return this.props.viewOrder||["month","year","decade"]},getDefaultProps:function(){var e=l({},u(),{highlightWeekends:!1,weekNumberName:"",isDatePicker:!0,navOnDateClick:!0,highlightRangeOnMouseMove:!0,defaultStyle:{boxSizing:"border-box"},onRangeChange:function(){}});return delete e.viewDate,delete e.date,e},getInitialState:function(){return{view:this.props.defaultView,viewDate:this.props.defaultViewDate,defaultDate:this.props.defaultDate,defaultRange:this.props.defaultRange}},getViewName:function(){var e=null!=this.props.view?this.props.view:this.state.view;return e||"month"},addViewIndex:function(e){var t=this.getViewName(),n=this.getViewOrder(),a=n.indexOf(t);return a+=e,a%n.length},getNextViewName:function(){return this.getViewOrder()[this.addViewIndex(1)]},getPrevViewName:function(){return this.getViewOrder()[this.addViewIndex(-1)]},getView:function(){var e=this.props.views||g;return e[this.getViewName()]||e.month},getViewFactory:function(){var e=this.getView();return i.createFactory&&e&&e.prototype&&"function"==typeof e.prototype.render&&(e.__factory=e.__factory||i.createFactory(e),e=e.__factory),e},getViewDate:function(){var e=h(this.props,"viewDate")?this.props.viewDate:this.state.viewDate;return e=e||this.viewMoment||this.getDate()||new Date,s.isMoment(e)&&(e=+e),e=this.toMoment(e)},getDate:function(){var e;return e=h(this.props,"date")?this.props.date:this.state.defaultDate,e?this.toMoment(e):null},getRange:function(){var e,t=this;return h(this.props,"range")?e=this.props.range:this.state.defaultRange&&(e=this.state.defaultRange),e?e.map(function(e){return e?t.toMoment(e):null})||null:null},render:function(){var e=this.p=l({},this.props);this.toMoment=function(t,n){return m(t,n||e.dateFormat,{locale:e.locale})};var t=this.getViewFactory();e.date=this.getDate(),e.range=this.getRange();var n=null==e.date?"":e.date.format(this.props.dateFormat);e.viewDate=this.viewMoment=this.getViewDate(),e.locale=this.props.locale,e.localeData=s.localeData(e.locale),e.renderDay=this.props.renderDay,e.onRenderDay=this.props.onRenderDay;var a=(this.props.className||"")+" date-picker";e.style=this.prepareStyle(e);var r=e,r=u(e);return r.toMoment=this.toMoment,r.highlightWeekends=this.props.highlightWeekends,r.weekNumbers=this.props.weekNumbers,r.weekNumberName=this.props.weekNumberName,r.dateString=n,r.localeData=e.localeData,r.onSelect=this.handleSelect,r.onChange=this.handleChange,r.onWeekChange=this.props.onWeekChange,r.renderWeekNumber=this.props.renderWeekNumber,r.highlightRangeOnMouseMove=this.props.highlightRangeOnMouseMove,r.range=e.range,i.createElement("div",o({},this.props,{className:a,style:e.style}),this.renderHeader(t,e),i.createElement("div",{className:"dp-body",style:{flex:1}},t(r)),this.renderFooter(e))},prepareStyle:function(e){return l({},e.defaultStyle,e.style)},renderFooter:function(e){if(!this.props.hideFooter){this.props.today,this.props.gotoSelected;var t,n=this.props.todayText||"Today",a=this.props.gotoSelectedText||"Go to selected",r={todayText:n,gotoSelectedText:a,gotoToday:this.gotoNow,gotoSelected:this.gotoSelected.bind(this,e),date:e.date,viewDate:e.viewDate};return"function"==typeof this.props.footerFactory&&(t=this.props.footerFactory(r)),void 0!==t?t:i.createElement("div",{className:"dp-footer"},i.createElement("div",{tabIndex:"1",role:"link",className:"dp-footer-today",onClick:r.gotoToday,onKeyUp:v(r.gotoToday)},n),i.createElement("div",{tabIndex:"1",role:"link",className:"dp-footer-selected",onClick:r.gotoSelected,onKeyUp:v(r.gotoSelected)},a))}},gotoNow:function(){this.gotoDate(+new Date)},gotoSelected:function(e){this.gotoDate(e.date||+new Date)},gotoDate:function(e){this.setView("month"),this.setViewDate(e)},getViewColspan:function(){var e={month:5,year:2,decade:2};return e[this.getViewName()]},renderHeader:function(e,t){if(!this.props.hideHeader){t=t||this.props;var n=this.getViewDate(),a=this.getView().getHeaderText(n,t),r=this.getViewColspan(),o=this.props.navPrev,s=this.props.navNext;return i.createElement(f,{prevText:o,nextText:s,colspan:r,onPrev:this.handleNavPrev,onNext:this.handleNavNext,onChange:this.handleViewChange},a)}},handleRenderDay:function(e){return(this.props.renderDay||r)(e)||[]},handleViewChange:function(){this.setView(this.getNextViewName())},setView:function(e){"function"==typeof this.props.onViewChange&&this.props.onViewChange(e),null==this.props.view&&this.setState({view:e})},setViewDate:function(e){e=this.toMoment(e);var t=this.props.onViewDateChange;if("function"==typeof t){var n=e.format(this.props.dateFormat),a=this.getViewName();t(n,e,a)}h(this.props,"viewDate")||this.setState({viewDate:e})},getNext:function(){var e=this.getViewDate(),t=this.toMoment;return{month:function(){return t(e).add(1,"month")},year:function(){return t(e).add(1,"year")},decade:function(){return t(e).add(10,"year")}}[this.getViewName()]()},getPrev:function(){var e=this.getViewDate(),t=this.toMoment;return{month:function(){return t(e).add(-1,"month")},year:function(){return t(e).add(-1,"year")},decade:function(){return t(e).add(-10,"year")}}[this.getViewName()]()},handleNavigation:function(e,t){var n=-1==e?this.getPrev():this.getNext();if(this.setViewDate(n),"function"==typeof this.props.onNav){var a=n.format(this.props.dateFormat),r=this.getViewName();this.props.onNav(a,n,r,e,t)}},handleNavPrev:function(e){this.handleNavigation(-1,e)},handleNavNext:function(e){this.handleNavigation(1,e)},handleChange:function(e,t){if(e=this.toMoment(e),this.props.navOnDateClick){var n=this.toMoment(this.getViewDate()),a=n.format("YYYY-MM"),o=e.format("YYYY-MM");o>a?this.handleNavNext(t):a>o&&this.handleNavPrev(t)}var i=e.format(this.props.dateFormat);h(this.props,"date")||this.setState({defaultDate:i}),(this.props.onChange||r)(i,e,t),this.p.range&&this.handleRangeChange(e,t)},handleRangeChange:function(e){var t=this,n=this.p.range;n=n.length<2?[].concat(a(n),[e]):[e],n.sort(function(e,t){return e-t}),this.props.range||this.setState({defaultRange:n});var r=n.map(function(e){return e.format(t.props.dateFormat)});this.props.onRangeChange(r,n,event)},handleSelect:function(e,t){var n=this.getViewName(),a={decade:"year",year:"month"}[n],r=e.get(a),o=this.toMoment(this.getViewDate()).set(a,r),i=this.getPrevViewName();if(this.setViewDate(o),this.setView(i),"function"==typeof this.props.onSelect){var s=o.format(this.props.dateFormat);this.props.onSelect(s,o,i,t)}}});y.views=g;var b=i.PropTypes;y.propTypes={highlightWeekends:b.bool,onChange:b.func,onNav:b.func,onSelect:b.func,renderDay:b.func,onRenderDay:b.func,defaultView:b.string,view:b.string,onViewDateChange:b.func,onViewChange:b.func,navOnDateClick:b.bool,highlightRangeOnMouseMove:b.bool},t.exports=y},{"./DecadeView":2,"./Header":3,"./MonthView":4,"./YearView":5,"./onEnter":8,"./toMoment":9,"./utils/asConfig":10,moment:14,"object-assign":15,react:181}],8:[function(e,t,n){"use strict";t.exports=function(e){return function(t){"Enter"==t.key&&e(t)}}},{}],9:[function(e,t,n){"use strict";var a=e("moment"),r=e("./config");t.exports=function(e,t,n){var o=!(!n||!n.strict),i=n&&n.locale;return t=t||r.dateFormat,"string"==typeof e?a(e,t,i,o):a(null==e?new Date:e,void 0,i,o)}},{"./config":6,moment:14}],10:[function(e,t,n){"use strict";function a(e,t,n){return e&&n.forEach(function(n){t[n]=e[n]}),t}var r=e("object-assign"),o=e("../config"),i=Object.keys(o);t.exports=function(e,t){var n=i;return t&&(n=Object.keys(t)),t=t||o,e?a(e,r({},t),n):r({},t)}},{"../config":6,"object-assign":15}],11:[function(e,t,n){"use strict";function a(e,t){return o(e).format(t)}var r=e("../config"),o=e("../toMoment");t.exports={day:function(e,t){return a(e,t||r.dayFormat)},month:function(e,t){return a(e,t||r.monthFormat)},year:function(e,t){return a(e,t||r.yearFormat)}}},{"../config":6,"../toMoment":9}],12:[function(e,t,n){"use strict";var a=e("moment"),r=1*a().startOf("week").format("d");t.exports=function(e,t){var n;if(t){var o=a.localeData(t);n=o&&o._weekdaysShort?o._weekdaysShort:n}n=(n||a.weekdaysShort()).concat();for(var i=n,s=null==e?r:e;s>0;)i.push(i.shift()),s--;return i}},{moment:14}],13:[function(e,t,n){"use strict";var a=function(){function e(e,t){var n=[],a=!0,r=!1,o=void 0;try{for(var i,s=e[Symbol.iterator]();!(a=(i=s.next()).done)&&(n.push(i.value),!t||n.length!==t);a=!0);}catch(e){r=!0,o=e}finally{try{!a&&s.return&&s.return()}finally{if(r)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();t.exports=function(e,t){var n=a(t,2),r=n[0],o=n[1];return e&&o?r.isSameOrBefore(e)&&o.isSameOrAfter(e):!1}},{}],14:[function(t,n,a){!function(t,r){"object"==typeof a&&"undefined"!=typeof n?n.exports=r():"function"==typeof e&&e.amd?e(r):t.moment=r()}(this,function(){"use strict";function e(){return la.apply(null,arguments)}function a(e){la=e}function r(e){return e instanceof Array||"[object Array]"===Object.prototype.toString.call(e)}function o(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function i(e,t){var n,a=[];for(n=0;n<e.length;++n)a.push(t(e[n],n));return a}function s(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function l(e,t){for(var n in t)s(t,n)&&(e[n]=t[n]);return s(t,"toString")&&(e.toString=t.toString),s(t,"valueOf")&&(e.valueOf=t.valueOf),e}function u(e,t,n,a){return Ue(e,t,n,a,!0).utc()}function c(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],meridiem:null}}function d(e){return null==e._pf&&(e._pf=c()),e._pf}function p(e){if(null==e._isValid){var t=d(e),n=ua.call(t.parsedDateParts,function(e){return null!=e});e._isValid=!isNaN(e._d.getTime())&&t.overflow<0&&!t.empty&&!t.invalidMonth&&!t.invalidWeekday&&!t.nullInput&&!t.invalidFormat&&!t.userInvalidated&&(!t.meridiem||t.meridiem&&n),e._strict&&(e._isValid=e._isValid&&0===t.charsLeftOver&&0===t.unusedTokens.length&&void 0===t.bigHour)}return e._isValid}function f(e){var t=u(NaN);return null!=e?l(d(t),e):d(t).userInvalidated=!0,t}function m(e){return void 0===e}function h(e,t){var n,a,r;if(m(t._isAMomentObject)||(e._isAMomentObject=t._isAMomentObject),m(t._i)||(e._i=t._i),m(t._f)||(e._f=t._f),m(t._l)||(e._l=t._l),m(t._strict)||(e._strict=t._strict),m(t._tzm)||(e._tzm=t._tzm),m(t._isUTC)||(e._isUTC=t._isUTC),m(t._offset)||(e._offset=t._offset),m(t._pf)||(e._pf=d(t)),m(t._locale)||(e._locale=t._locale),ca.length>0)for(n in ca)a=ca[n],r=t[a],m(r)||(e[a]=r);return e}function v(t){h(this,t),this._d=new Date(null!=t._d?t._d.getTime():NaN),da===!1&&(da=!0,e.updateOffset(this),da=!1)}function g(e){return e instanceof v||null!=e&&null!=e._isAMomentObject}function y(e){return 0>e?Math.ceil(e):Math.floor(e)}function b(e){var t=+e,n=0;return 0!==t&&isFinite(t)&&(n=y(t)),n}function E(e,t,n){var a,r=Math.min(e.length,t.length),o=Math.abs(e.length-t.length),i=0;for(a=0;r>a;a++)(n&&e[a]!==t[a]||!n&&b(e[a])!==b(t[a]))&&i++;return i+o}function _(t){e.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn}function C(t,n){var a=!0;return l(function(){return null!=e.deprecationHandler&&e.deprecationHandler(null,t),a&&(_(t+"\nArguments: "+Array.prototype.slice.call(arguments).join(", ")+"\n"+(new Error).stack),a=!1),n.apply(this,arguments)},n)}function k(t,n){null!=e.deprecationHandler&&e.deprecationHandler(t,n),pa[t]||(_(n),pa[t]=!0)}function T(e){return e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}function N(e){return"[object Object]"===Object.prototype.toString.call(e)}function P(e){var t,n;for(n in e)t=e[n],T(t)?this[n]=t:this["_"+n]=t;this._config=e,this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)}function w(e,t){var n,a=l({},e);for(n in t)s(t,n)&&(N(e[n])&&N(t[n])?(a[n]={},l(a[n],e[n]),l(a[n],t[n])):null!=t[n]?a[n]=t[n]:delete a[n]);return a}function M(e){null!=e&&this.set(e)}function S(e){return e?e.toLowerCase().replace("_","-"):e}function x(e){for(var t,n,a,r,o=0;o<e.length;){for(r=S(e[o]).split("-"),t=r.length,n=S(e[o+1]),n=n?n.split("-"):null;t>0;){if(a=R(r.slice(0,t).join("-")))return a;if(n&&n.length>=t&&E(r,n,!0)>=t-1)break;t--}o++}return null}function R(e){var a=null;if(!va[e]&&"undefined"!=typeof n&&n&&n.exports)try{a=ma._abbr,t("./locale/"+e),D(a)}catch(e){}return va[e]}function D(e,t){var n;return e&&(n=m(t)?j(e):O(e,t),n&&(ma=n)),ma._abbr}function O(e,t){return null!==t?(t.abbr=e,null!=va[e]?(k("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale"),t=w(va[e]._config,t)):null!=t.parentLocale&&(null!=va[t.parentLocale]?t=w(va[t.parentLocale]._config,t):k("parentLocaleUndefined","specified parentLocale is not defined yet")),va[e]=new M(t),D(e),va[e]):(delete va[e],null)}function I(e,t){if(null!=t){var n;null!=va[e]&&(t=w(va[e]._config,t)),n=new M(t),n.parentLocale=va[e],va[e]=n,D(e)}else null!=va[e]&&(null!=va[e].parentLocale?va[e]=va[e].parentLocale:null!=va[e]&&delete va[e]);return va[e]}function j(e){var t;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return ma;if(!r(e)){if(t=R(e))return t;e=[e]}return x(e)}function A(){return fa(va)}function U(e,t){var n=e.toLowerCase();ga[n]=ga[n+"s"]=ga[t]=e}function L(e){return"string"==typeof e?ga[e]||ga[e.toLowerCase()]:void 0}function F(e){var t,n,a={};for(n in e)s(e,n)&&(t=L(n),t&&(a[t]=e[n]));return a}function V(t,n){return function(a){return null!=a?(W(this,t,a),e.updateOffset(this,n),this):Y(this,t)}}function Y(e,t){return e.isValid()?e._d["get"+(e._isUTC?"UTC":"")+t]():NaN}function W(e,t,n){e.isValid()&&e._d["set"+(e._isUTC?"UTC":"")+t](n)}function H(e,t){var n;if("object"==typeof e)for(n in e)this.set(n,e[n]);else if(e=L(e),T(this[e]))return this[e](t);return this}function B(e,t,n){var a=""+Math.abs(e),r=t-a.length,o=e>=0;return(o?n?"+":"":"-")+Math.pow(10,Math.max(0,r)).toString().substr(1)+a}function G(e,t,n,a){var r=a;"string"==typeof a&&(r=function(){return this[a]()}),e&&(_a[e]=r),t&&(_a[t[0]]=function(){return B(r.apply(this,arguments),t[1],t[2])}),n&&(_a[n]=function(){return this.localeData().ordinal(r.apply(this,arguments),e)})}function K(e){return e.match(/\[[\s\S]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function q(e){var t,n,a=e.match(ya);for(t=0,n=a.length;n>t;t++)_a[a[t]]?a[t]=_a[a[t]]:a[t]=K(a[t]);return function(t){var r,o="";for(r=0;n>r;r++)o+=a[r]instanceof Function?a[r].call(t,e):a[r];return o}}function z(e,t){return e.isValid()?(t=X(t,e.localeData()),Ea[t]=Ea[t]||q(t),Ea[t](e)):e.localeData().invalidDate()}function X(e,t){function n(e){return t.longDateFormat(e)||e}var a=5;for(ba.lastIndex=0;a>=0&&ba.test(e);)e=e.replace(ba,n),ba.lastIndex=0,a-=1;return e}function Q(e,t,n){Fa[e]=T(t)?t:function(e,a){return e&&n?n:t}}function Z(e,t){return s(Fa,e)?Fa[e](t._strict,t._locale):new RegExp($(e))}function $(e){return J(e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(e,t,n,a,r){return t||n||a||r}))}function J(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function ee(e,t){var n,a=t;for("string"==typeof e&&(e=[e]),"number"==typeof t&&(a=function(e,n){n[t]=b(e)}),n=0;n<e.length;n++)Va[e[n]]=a}function te(e,t){ee(e,function(e,n,a,r){a._w=a._w||{},t(e,a._w,a,r)})}function ne(e,t,n){null!=t&&s(Va,e)&&Va[e](t,n._a,n,e)}function ae(e,t){return new Date(Date.UTC(e,t+1,0)).getUTCDate()}function re(e,t){return r(this._months)?this._months[e.month()]:this._months[Qa.test(t)?"format":"standalone"][e.month()]}function oe(e,t){return r(this._monthsShort)?this._monthsShort[e.month()]:this._monthsShort[Qa.test(t)?"format":"standalone"][e.month()]}function ie(e,t,n){var a,r,o,i=e.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],a=0;12>a;++a)o=u([2e3,a]),this._shortMonthsParse[a]=this.monthsShort(o,"").toLocaleLowerCase(),this._longMonthsParse[a]=this.months(o,"").toLocaleLowerCase();return n?"MMM"===t?(r=ha.call(this._shortMonthsParse,i),-1!==r?r:null):(r=ha.call(this._longMonthsParse,i),-1!==r?r:null):"MMM"===t?(r=ha.call(this._shortMonthsParse,i),-1!==r?r:(r=ha.call(this._longMonthsParse,i),-1!==r?r:null)):(r=ha.call(this._longMonthsParse,i),-1!==r?r:(r=ha.call(this._shortMonthsParse,i),-1!==r?r:null))}function se(e,t,n){var a,r,o;if(this._monthsParseExact)return ie.call(this,e,t,n);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),a=0;12>a;a++){if(r=u([2e3,a]),n&&!this._longMonthsParse[a]&&(this._longMonthsParse[a]=new RegExp("^"+this.months(r,"").replace(".","")+"$","i"),this._shortMonthsParse[a]=new RegExp("^"+this.monthsShort(r,"").replace(".","")+"$","i")),n||this._monthsParse[a]||(o="^"+this.months(r,"")+"|^"+this.monthsShort(r,""),this._monthsParse[a]=new RegExp(o.replace(".",""),"i")),n&&"MMMM"===t&&this._longMonthsParse[a].test(e))return a;if(n&&"MMM"===t&&this._shortMonthsParse[a].test(e))return a;if(!n&&this._monthsParse[a].test(e))return a}}function le(e,t){var n;if(!e.isValid())return e;if("string"==typeof t)if(/^\d+$/.test(t))t=b(t);else if(t=e.localeData().monthsParse(t),"number"!=typeof t)return e;return n=Math.min(e.date(),ae(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,n),e}function ue(t){return null!=t?(le(this,t),e.updateOffset(this,!0),this):Y(this,"Month")}function ce(){return ae(this.year(),this.month())}function de(e){return this._monthsParseExact?(s(this,"_monthsRegex")||fe.call(this),e?this._monthsShortStrictRegex:this._monthsShortRegex):this._monthsShortStrictRegex&&e?this._monthsShortStrictRegex:this._monthsShortRegex}function pe(e){return this._monthsParseExact?(s(this,"_monthsRegex")||fe.call(this),e?this._monthsStrictRegex:this._monthsRegex):this._monthsStrictRegex&&e?this._monthsStrictRegex:this._monthsRegex}function fe(){function e(e,t){return t.length-e.length}var t,n,a=[],r=[],o=[];for(t=0;12>t;t++)n=u([2e3,t]),a.push(this.monthsShort(n,"")),r.push(this.months(n,"")),o.push(this.months(n,"")),o.push(this.monthsShort(n,""));for(a.sort(e),r.sort(e),o.sort(e),t=0;12>t;t++)a[t]=J(a[t]),r[t]=J(r[t]),o[t]=J(o[t]);this._monthsRegex=new RegExp("^("+o.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+r.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+a.join("|")+")","i")}function me(e){var t,n=e._a;return n&&-2===d(e).overflow&&(t=n[Wa]<0||n[Wa]>11?Wa:n[Ha]<1||n[Ha]>ae(n[Ya],n[Wa])?Ha:n[Ba]<0||n[Ba]>24||24===n[Ba]&&(0!==n[Ga]||0!==n[Ka]||0!==n[qa])?Ba:n[Ga]<0||n[Ga]>59?Ga:n[Ka]<0||n[Ka]>59?Ka:n[qa]<0||n[qa]>999?qa:-1,d(e)._overflowDayOfYear&&(Ya>t||t>Ha)&&(t=Ha),d(e)._overflowWeeks&&-1===t&&(t=za),d(e)._overflowWeekday&&-1===t&&(t=Xa),d(e).overflow=t),e}function he(e){var t,n,a,r,o,i,s=e._i,l=tr.exec(s)||nr.exec(s);if(l){for(d(e).iso=!0,t=0,n=rr.length;n>t;t++)if(rr[t][1].exec(l[1])){r=rr[t][0],a=rr[t][2]!==!1;break}if(null==r)return void(e._isValid=!1);if(l[3]){for(t=0,n=or.length;n>t;t++)if(or[t][1].exec(l[3])){o=(l[2]||" ")+or[t][0];break}if(null==o)return void(e._isValid=!1)}if(!a&&null!=o)return void(e._isValid=!1);if(l[4]){if(!ar.exec(l[4]))return void(e._isValid=!1);i="Z"}e._f=r+(o||"")+(i||""),xe(e)}else e._isValid=!1}function ve(t){var n=ir.exec(t._i);return null!==n?void(t._d=new Date(+n[1])):(he(t),void(t._isValid===!1&&(delete t._isValid,e.createFromInputFallback(t))))}
function ge(e,t,n,a,r,o,i){var s=new Date(e,t,n,a,r,o,i);return 100>e&&e>=0&&isFinite(s.getFullYear())&&s.setFullYear(e),s}function ye(e){var t=new Date(Date.UTC.apply(null,arguments));return 100>e&&e>=0&&isFinite(t.getUTCFullYear())&&t.setUTCFullYear(e),t}function be(e){return Ee(e)?366:365}function Ee(e){return e%4===0&&e%100!==0||e%400===0}function _e(){return Ee(this.year())}function Ce(e,t,n){var a=7+t-n,r=(7+ye(e,0,a).getUTCDay()-t)%7;return-r+a-1}function ke(e,t,n,a,r){var o,i,s=(7+n-a)%7,l=Ce(e,a,r),u=1+7*(t-1)+s+l;return 0>=u?(o=e-1,i=be(o)+u):u>be(e)?(o=e+1,i=u-be(e)):(o=e,i=u),{year:o,dayOfYear:i}}function Te(e,t,n){var a,r,o=Ce(e.year(),t,n),i=Math.floor((e.dayOfYear()-o-1)/7)+1;return 1>i?(r=e.year()-1,a=i+Ne(r,t,n)):i>Ne(e.year(),t,n)?(a=i-Ne(e.year(),t,n),r=e.year()+1):(r=e.year(),a=i),{week:a,year:r}}function Ne(e,t,n){var a=Ce(e,t,n),r=Ce(e+1,t,n);return(be(e)-a+r)/7}function Pe(e,t,n){return null!=e?e:null!=t?t:n}function we(t){var n=new Date(e.now());return t._useUTC?[n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate()]:[n.getFullYear(),n.getMonth(),n.getDate()]}function Me(e){var t,n,a,r,o=[];if(!e._d){for(a=we(e),e._w&&null==e._a[Ha]&&null==e._a[Wa]&&Se(e),e._dayOfYear&&(r=Pe(e._a[Ya],a[Ya]),e._dayOfYear>be(r)&&(d(e)._overflowDayOfYear=!0),n=ye(r,0,e._dayOfYear),e._a[Wa]=n.getUTCMonth(),e._a[Ha]=n.getUTCDate()),t=0;3>t&&null==e._a[t];++t)e._a[t]=o[t]=a[t];for(;7>t;t++)e._a[t]=o[t]=null==e._a[t]?2===t?1:0:e._a[t];24===e._a[Ba]&&0===e._a[Ga]&&0===e._a[Ka]&&0===e._a[qa]&&(e._nextDay=!0,e._a[Ba]=0),e._d=(e._useUTC?ye:ge).apply(null,o),null!=e._tzm&&e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),e._nextDay&&(e._a[Ba]=24)}}function Se(e){var t,n,a,r,o,i,s,l;t=e._w,null!=t.GG||null!=t.W||null!=t.E?(o=1,i=4,n=Pe(t.GG,e._a[Ya],Te(Le(),1,4).year),a=Pe(t.W,1),r=Pe(t.E,1),(1>r||r>7)&&(l=!0)):(o=e._locale._week.dow,i=e._locale._week.doy,n=Pe(t.gg,e._a[Ya],Te(Le(),o,i).year),a=Pe(t.w,1),null!=t.d?(r=t.d,(0>r||r>6)&&(l=!0)):null!=t.e?(r=t.e+o,(t.e<0||t.e>6)&&(l=!0)):r=o),1>a||a>Ne(n,o,i)?d(e)._overflowWeeks=!0:null!=l?d(e)._overflowWeekday=!0:(s=ke(n,a,r,o,i),e._a[Ya]=s.year,e._dayOfYear=s.dayOfYear)}function xe(t){if(t._f===e.ISO_8601)return void he(t);t._a=[],d(t).empty=!0;var n,a,r,o,i,s=""+t._i,l=s.length,u=0;for(r=X(t._f,t._locale).match(ya)||[],n=0;n<r.length;n++)o=r[n],a=(s.match(Z(o,t))||[])[0],a&&(i=s.substr(0,s.indexOf(a)),i.length>0&&d(t).unusedInput.push(i),s=s.slice(s.indexOf(a)+a.length),u+=a.length),_a[o]?(a?d(t).empty=!1:d(t).unusedTokens.push(o),ne(o,a,t)):t._strict&&!a&&d(t).unusedTokens.push(o);d(t).charsLeftOver=l-u,s.length>0&&d(t).unusedInput.push(s),d(t).bigHour===!0&&t._a[Ba]<=12&&t._a[Ba]>0&&(d(t).bigHour=void 0),d(t).parsedDateParts=t._a.slice(0),d(t).meridiem=t._meridiem,t._a[Ba]=Re(t._locale,t._a[Ba],t._meridiem),Me(t),me(t)}function Re(e,t,n){var a;return null==n?t:null!=e.meridiemHour?e.meridiemHour(t,n):null!=e.isPM?(a=e.isPM(n),a&&12>t&&(t+=12),a||12!==t||(t=0),t):t}function De(e){var t,n,a,r,o;if(0===e._f.length)return d(e).invalidFormat=!0,void(e._d=new Date(NaN));for(r=0;r<e._f.length;r++)o=0,t=h({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._f=e._f[r],xe(t),p(t)&&(o+=d(t).charsLeftOver,o+=10*d(t).unusedTokens.length,d(t).score=o,(null==a||a>o)&&(a=o,n=t));l(e,n||t)}function Oe(e){if(!e._d){var t=F(e._i);e._a=i([t.year,t.month,t.day||t.date,t.hour,t.minute,t.second,t.millisecond],function(e){return e&&parseInt(e,10)}),Me(e)}}function Ie(e){var t=new v(me(je(e)));return t._nextDay&&(t.add(1,"d"),t._nextDay=void 0),t}function je(e){var t=e._i,n=e._f;return e._locale=e._locale||j(e._l),null===t||void 0===n&&""===t?f({nullInput:!0}):("string"==typeof t&&(e._i=t=e._locale.preparse(t)),g(t)?new v(me(t)):(r(n)?De(e):n?xe(e):o(t)?e._d=t:Ae(e),p(e)||(e._d=null),e))}function Ae(t){var n=t._i;void 0===n?t._d=new Date(e.now()):o(n)?t._d=new Date(n.valueOf()):"string"==typeof n?ve(t):r(n)?(t._a=i(n.slice(0),function(e){return parseInt(e,10)}),Me(t)):"object"==typeof n?Oe(t):"number"==typeof n?t._d=new Date(n):e.createFromInputFallback(t)}function Ue(e,t,n,a,r){var o={};return"boolean"==typeof n&&(a=n,n=void 0),o._isAMomentObject=!0,o._useUTC=o._isUTC=r,o._l=n,o._i=e,o._f=t,o._strict=a,Ie(o)}function Le(e,t,n,a){return Ue(e,t,n,a,!1)}function Fe(e,t){var n,a;if(1===t.length&&r(t[0])&&(t=t[0]),!t.length)return Le();for(n=t[0],a=1;a<t.length;++a)t[a].isValid()&&!t[a][e](n)||(n=t[a]);return n}function Ve(){var e=[].slice.call(arguments,0);return Fe("isBefore",e)}function Ye(){var e=[].slice.call(arguments,0);return Fe("isAfter",e)}function We(e){var t=F(e),n=t.year||0,a=t.quarter||0,r=t.month||0,o=t.week||0,i=t.day||0,s=t.hour||0,l=t.minute||0,u=t.second||0,c=t.millisecond||0;this._milliseconds=+c+1e3*u+6e4*l+1e3*s*60*60,this._days=+i+7*o,this._months=+r+3*a+12*n,this._data={},this._locale=j(),this._bubble()}function He(e){return e instanceof We}function Be(e,t){G(e,0,0,function(){var e=this.utcOffset(),n="+";return 0>e&&(e=-e,n="-"),n+B(~~(e/60),2)+t+B(~~e%60,2)})}function Ge(e,t){var n=(t||"").match(e)||[],a=n[n.length-1]||[],r=(a+"").match(dr)||["-",0,0],o=+(60*r[1])+b(r[2]);return"+"===r[0]?o:-o}function Ke(t,n){var a,r;return n._isUTC?(a=n.clone(),r=(g(t)||o(t)?t.valueOf():Le(t).valueOf())-a.valueOf(),a._d.setTime(a._d.valueOf()+r),e.updateOffset(a,!1),a):Le(t).local()}function qe(e){return 15*-Math.round(e._d.getTimezoneOffset()/15)}function ze(t,n){var a,r=this._offset||0;return this.isValid()?null!=t?("string"==typeof t?t=Ge(Aa,t):Math.abs(t)<16&&(t=60*t),!this._isUTC&&n&&(a=qe(this)),this._offset=t,this._isUTC=!0,null!=a&&this.add(a,"m"),r!==t&&(!n||this._changeInProgress?dt(this,ot(t-r,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,e.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?r:qe(this):null!=t?this:NaN}function Xe(e,t){return null!=e?("string"!=typeof e&&(e=-e),this.utcOffset(e,t),this):-this.utcOffset()}function Qe(e){return this.utcOffset(0,e)}function Ze(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(qe(this),"m")),this}function $e(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(Ge(ja,this._i)),this}function Je(e){return this.isValid()?(e=e?Le(e).utcOffset():0,(this.utcOffset()-e)%60===0):!1}function et(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function tt(){if(!m(this._isDSTShifted))return this._isDSTShifted;var e={};if(h(e,this),e=je(e),e._a){var t=e._isUTC?u(e._a):Le(e._a);this._isDSTShifted=this.isValid()&&E(e._a,t.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function nt(){return this.isValid()?!this._isUTC:!1}function at(){return this.isValid()?this._isUTC:!1}function rt(){return this.isValid()?this._isUTC&&0===this._offset:!1}function ot(e,t){var n,a,r,o=e,i=null;return He(e)?o={ms:e._milliseconds,d:e._days,M:e._months}:"number"==typeof e?(o={},t?o[t]=e:o.milliseconds=e):(i=pr.exec(e))?(n="-"===i[1]?-1:1,o={y:0,d:b(i[Ha])*n,h:b(i[Ba])*n,m:b(i[Ga])*n,s:b(i[Ka])*n,ms:b(i[qa])*n}):(i=fr.exec(e))?(n="-"===i[1]?-1:1,o={y:it(i[2],n),M:it(i[3],n),w:it(i[4],n),d:it(i[5],n),h:it(i[6],n),m:it(i[7],n),s:it(i[8],n)}):null==o?o={}:"object"==typeof o&&("from"in o||"to"in o)&&(r=lt(Le(o.from),Le(o.to)),o={},o.ms=r.milliseconds,o.M=r.months),a=new We(o),He(e)&&s(e,"_locale")&&(a._locale=e._locale),a}function it(e,t){var n=e&&parseFloat(e.replace(",","."));return(isNaN(n)?0:n)*t}function st(e,t){var n={milliseconds:0,months:0};return n.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(n.months,"M").isAfter(t)&&--n.months,n.milliseconds=+t-+e.clone().add(n.months,"M"),n}function lt(e,t){var n;return e.isValid()&&t.isValid()?(t=Ke(t,e),e.isBefore(t)?n=st(e,t):(n=st(t,e),n.milliseconds=-n.milliseconds,n.months=-n.months),n):{milliseconds:0,months:0}}function ut(e){return 0>e?-1*Math.round(-1*e):Math.round(e)}function ct(e,t){return function(n,a){var r,o;return null===a||isNaN(+a)||(k(t,"moment()."+t+"(period, number) is deprecated. Please use moment()."+t+"(number, period)."),o=n,n=a,a=o),n="string"==typeof n?+n:n,r=ot(n,a),dt(this,r,e),this}}function dt(t,n,a,r){var o=n._milliseconds,i=ut(n._days),s=ut(n._months);t.isValid()&&(r=null==r?!0:r,o&&t._d.setTime(t._d.valueOf()+o*a),i&&W(t,"Date",Y(t,"Date")+i*a),s&&le(t,Y(t,"Month")+s*a),r&&e.updateOffset(t,i||s))}function pt(e,t){var n=e||Le(),a=Ke(n,this).startOf("day"),r=this.diff(a,"days",!0),o=-6>r?"sameElse":-1>r?"lastWeek":0>r?"lastDay":1>r?"sameDay":2>r?"nextDay":7>r?"nextWeek":"sameElse",i=t&&(T(t[o])?t[o]():t[o]);return this.format(i||this.localeData().calendar(o,this,Le(n)))}function ft(){return new v(this)}function mt(e,t){var n=g(e)?e:Le(e);return this.isValid()&&n.isValid()?(t=L(m(t)?"millisecond":t),"millisecond"===t?this.valueOf()>n.valueOf():n.valueOf()<this.clone().startOf(t).valueOf()):!1}function ht(e,t){var n=g(e)?e:Le(e);return this.isValid()&&n.isValid()?(t=L(m(t)?"millisecond":t),"millisecond"===t?this.valueOf()<n.valueOf():this.clone().endOf(t).valueOf()<n.valueOf()):!1}function vt(e,t,n,a){return a=a||"()",("("===a[0]?this.isAfter(e,n):!this.isBefore(e,n))&&(")"===a[1]?this.isBefore(t,n):!this.isAfter(t,n))}function gt(e,t){var n,a=g(e)?e:Le(e);return this.isValid()&&a.isValid()?(t=L(t||"millisecond"),"millisecond"===t?this.valueOf()===a.valueOf():(n=a.valueOf(),this.clone().startOf(t).valueOf()<=n&&n<=this.clone().endOf(t).valueOf())):!1}function yt(e,t){return this.isSame(e,t)||this.isAfter(e,t)}function bt(e,t){return this.isSame(e,t)||this.isBefore(e,t)}function Et(e,t,n){var a,r,o,i;return this.isValid()?(a=Ke(e,this),a.isValid()?(r=6e4*(a.utcOffset()-this.utcOffset()),t=L(t),"year"===t||"month"===t||"quarter"===t?(i=_t(this,a),"quarter"===t?i/=3:"year"===t&&(i/=12)):(o=this-a,i="second"===t?o/1e3:"minute"===t?o/6e4:"hour"===t?o/36e5:"day"===t?(o-r)/864e5:"week"===t?(o-r)/6048e5:o),n?i:y(i)):NaN):NaN}function _t(e,t){var n,a,r=12*(t.year()-e.year())+(t.month()-e.month()),o=e.clone().add(r,"months");return 0>t-o?(n=e.clone().add(r-1,"months"),a=(t-o)/(o-n)):(n=e.clone().add(r+1,"months"),a=(t-o)/(n-o)),-(r+a)||0}function Ct(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function kt(){var e=this.clone().utc();return 0<e.year()&&e.year()<=9999?T(Date.prototype.toISOString)?this.toDate().toISOString():z(e,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):z(e,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")}function Tt(t){t||(t=this.isUtc()?e.defaultFormatUtc:e.defaultFormat);var n=z(this,t);return this.localeData().postformat(n)}function Nt(e,t){return this.isValid()&&(g(e)&&e.isValid()||Le(e).isValid())?ot({to:this,from:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()}function Pt(e){return this.from(Le(),e)}function wt(e,t){return this.isValid()&&(g(e)&&e.isValid()||Le(e).isValid())?ot({from:this,to:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()}function Mt(e){return this.to(Le(),e)}function St(e){var t;return void 0===e?this._locale._abbr:(t=j(e),null!=t&&(this._locale=t),this)}function xt(){return this._locale}function Rt(e){switch(e=L(e)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":case"date":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===e&&this.weekday(0),"isoWeek"===e&&this.isoWeekday(1),"quarter"===e&&this.month(3*Math.floor(this.month()/3)),this}function Dt(e){return e=L(e),void 0===e||"millisecond"===e?this:("date"===e&&(e="day"),this.startOf(e).add(1,"isoWeek"===e?"week":e).subtract(1,"ms"))}function Ot(){return this._d.valueOf()-6e4*(this._offset||0)}function It(){return Math.floor(this.valueOf()/1e3)}function jt(){return this._offset?new Date(this.valueOf()):this._d}function At(){var e=this;return[e.year(),e.month(),e.date(),e.hour(),e.minute(),e.second(),e.millisecond()]}function Ut(){var e=this;return{years:e.year(),months:e.month(),date:e.date(),hours:e.hours(),minutes:e.minutes(),seconds:e.seconds(),milliseconds:e.milliseconds()}}function Lt(){return this.isValid()?this.toISOString():null}function Ft(){return p(this)}function Vt(){return l({},d(this))}function Yt(){return d(this).overflow}function Wt(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}}function Ht(e,t){G(0,[e,e.length],0,t)}function Bt(e){return zt.call(this,e,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)}function Gt(e){return zt.call(this,e,this.isoWeek(),this.isoWeekday(),1,4)}function Kt(){return Ne(this.year(),1,4)}function qt(){var e=this.localeData()._week;return Ne(this.year(),e.dow,e.doy)}function zt(e,t,n,a,r){var o;return null==e?Te(this,a,r).year:(o=Ne(e,a,r),t>o&&(t=o),Xt.call(this,e,t,n,a,r))}function Xt(e,t,n,a,r){var o=ke(e,t,n,a,r),i=ye(o.year,0,o.dayOfYear);return this.year(i.getUTCFullYear()),this.month(i.getUTCMonth()),this.date(i.getUTCDate()),this}function Qt(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)}function Zt(e){return Te(e,this._week.dow,this._week.doy).week}function $t(){return this._week.dow}function Jt(){return this._week.doy}function en(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")}function tn(e){var t=Te(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")}function nn(e,t){return"string"!=typeof e?e:isNaN(e)?(e=t.weekdaysParse(e),"number"==typeof e?e:null):parseInt(e,10)}function an(e,t){return r(this._weekdays)?this._weekdays[e.day()]:this._weekdays[this._weekdays.isFormat.test(t)?"format":"standalone"][e.day()]}function rn(e){return this._weekdaysShort[e.day()]}function on(e){return this._weekdaysMin[e.day()]}function sn(e,t,n){var a,r,o,i=e.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],a=0;7>a;++a)o=u([2e3,1]).day(a),this._minWeekdaysParse[a]=this.weekdaysMin(o,"").toLocaleLowerCase(),this._shortWeekdaysParse[a]=this.weekdaysShort(o,"").toLocaleLowerCase(),this._weekdaysParse[a]=this.weekdays(o,"").toLocaleLowerCase();return n?"dddd"===t?(r=ha.call(this._weekdaysParse,i),-1!==r?r:null):"ddd"===t?(r=ha.call(this._shortWeekdaysParse,i),-1!==r?r:null):(r=ha.call(this._minWeekdaysParse,i),-1!==r?r:null):"dddd"===t?(r=ha.call(this._weekdaysParse,i),-1!==r?r:(r=ha.call(this._shortWeekdaysParse,i),-1!==r?r:(r=ha.call(this._minWeekdaysParse,i),-1!==r?r:null))):"ddd"===t?(r=ha.call(this._shortWeekdaysParse,i),-1!==r?r:(r=ha.call(this._weekdaysParse,i),-1!==r?r:(r=ha.call(this._minWeekdaysParse,i),-1!==r?r:null))):(r=ha.call(this._minWeekdaysParse,i),-1!==r?r:(r=ha.call(this._weekdaysParse,i),-1!==r?r:(r=ha.call(this._shortWeekdaysParse,i),-1!==r?r:null)))}function ln(e,t,n){var a,r,o;if(this._weekdaysParseExact)return sn.call(this,e,t,n);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),a=0;7>a;a++){if(r=u([2e3,1]).day(a),n&&!this._fullWeekdaysParse[a]&&(this._fullWeekdaysParse[a]=new RegExp("^"+this.weekdays(r,"").replace(".",".?")+"$","i"),this._shortWeekdaysParse[a]=new RegExp("^"+this.weekdaysShort(r,"").replace(".",".?")+"$","i"),this._minWeekdaysParse[a]=new RegExp("^"+this.weekdaysMin(r,"").replace(".",".?")+"$","i")),this._weekdaysParse[a]||(o="^"+this.weekdays(r,"")+"|^"+this.weekdaysShort(r,"")+"|^"+this.weekdaysMin(r,""),this._weekdaysParse[a]=new RegExp(o.replace(".",""),"i")),n&&"dddd"===t&&this._fullWeekdaysParse[a].test(e))return a;if(n&&"ddd"===t&&this._shortWeekdaysParse[a].test(e))return a;if(n&&"dd"===t&&this._minWeekdaysParse[a].test(e))return a;if(!n&&this._weekdaysParse[a].test(e))return a}}function un(e){if(!this.isValid())return null!=e?this:NaN;var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(e=nn(e,this.localeData()),this.add(e-t,"d")):t}function cn(e){if(!this.isValid())return null!=e?this:NaN;var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")}function dn(e){return this.isValid()?null==e?this.day()||7:this.day(this.day()%7?e:e-7):null!=e?this:NaN}function pn(e){return this._weekdaysParseExact?(s(this,"_weekdaysRegex")||hn.call(this),e?this._weekdaysStrictRegex:this._weekdaysRegex):this._weekdaysStrictRegex&&e?this._weekdaysStrictRegex:this._weekdaysRegex}function fn(e){return this._weekdaysParseExact?(s(this,"_weekdaysRegex")||hn.call(this),e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):this._weekdaysShortStrictRegex&&e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex}function mn(e){return this._weekdaysParseExact?(s(this,"_weekdaysRegex")||hn.call(this),e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):this._weekdaysMinStrictRegex&&e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex}function hn(){function e(e,t){return t.length-e.length}var t,n,a,r,o,i=[],s=[],l=[],c=[];for(t=0;7>t;t++)n=u([2e3,1]).day(t),a=this.weekdaysMin(n,""),r=this.weekdaysShort(n,""),o=this.weekdays(n,""),i.push(a),s.push(r),l.push(o),c.push(a),c.push(r),c.push(o);for(i.sort(e),s.sort(e),l.sort(e),c.sort(e),t=0;7>t;t++)s[t]=J(s[t]),l[t]=J(l[t]),c[t]=J(c[t]);this._weekdaysRegex=new RegExp("^("+c.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+l.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+s.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+i.join("|")+")","i")}function vn(e){var t=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")}function gn(){return this.hours()%12||12}function yn(){return this.hours()||24}function bn(e,t){G(e,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),t)})}function En(e,t){return t._meridiemParse}function _n(e){return"p"===(e+"").toLowerCase().charAt(0)}function Cn(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"}function kn(e,t){t[qa]=b(1e3*("0."+e))}function Tn(){return this._isUTC?"UTC":""}function Nn(){return this._isUTC?"Coordinated Universal Time":""}function Pn(e){return Le(1e3*e)}function wn(){return Le.apply(null,arguments).parseZone()}function Mn(e,t,n){var a=this._calendar[e];return T(a)?a.call(t,n):a}function Sn(e){var t=this._longDateFormat[e],n=this._longDateFormat[e.toUpperCase()];return t||!n?t:(this._longDateFormat[e]=n.replace(/MMMM|MM|DD|dddd/g,function(e){return e.slice(1)}),this._longDateFormat[e])}function xn(){return this._invalidDate}function Rn(e){return this._ordinal.replace("%d",e)}function Dn(e){return e}function On(e,t,n,a){var r=this._relativeTime[n];return T(r)?r(e,t,n,a):r.replace(/%d/i,e)}function In(e,t){var n=this._relativeTime[e>0?"future":"past"];return T(n)?n(t):n.replace(/%s/i,t)}function jn(e,t,n,a){var r=j(),o=u().set(a,t);return r[n](o,e)}function An(e,t,n){if("number"==typeof e&&(t=e,e=void 0),e=e||"",null!=t)return jn(e,t,n,"month");var a,r=[];for(a=0;12>a;a++)r[a]=jn(e,a,n,"month");return r}function Un(e,t,n,a){"boolean"==typeof e?("number"==typeof t&&(n=t,t=void 0),t=t||""):(t=e,n=t,e=!1,"number"==typeof t&&(n=t,t=void 0),t=t||"");var r=j(),o=e?r._week.dow:0;if(null!=n)return jn(t,(n+o)%7,a,"day");var i,s=[];for(i=0;7>i;i++)s[i]=jn(t,(i+o)%7,a,"day");return s}function Ln(e,t){return An(e,t,"months")}function Fn(e,t){return An(e,t,"monthsShort")}function Vn(e,t,n){return Un(e,t,n,"weekdays")}function Yn(e,t,n){return Un(e,t,n,"weekdaysShort")}function Wn(e,t,n){return Un(e,t,n,"weekdaysMin")}function Hn(){var e=this._data;return this._milliseconds=Vr(this._milliseconds),this._days=Vr(this._days),this._months=Vr(this._months),e.milliseconds=Vr(e.milliseconds),e.seconds=Vr(e.seconds),e.minutes=Vr(e.minutes),e.hours=Vr(e.hours),e.months=Vr(e.months),e.years=Vr(e.years),this}function Bn(e,t,n,a){var r=ot(t,n);return e._milliseconds+=a*r._milliseconds,e._days+=a*r._days,e._months+=a*r._months,e._bubble()}function Gn(e,t){return Bn(this,e,t,1)}function Kn(e,t){return Bn(this,e,t,-1)}function qn(e){return 0>e?Math.floor(e):Math.ceil(e)}function zn(){var e,t,n,a,r,o=this._milliseconds,i=this._days,s=this._months,l=this._data;return o>=0&&i>=0&&s>=0||0>=o&&0>=i&&0>=s||(o+=864e5*qn(Qn(s)+i),i=0,s=0),l.milliseconds=o%1e3,e=y(o/1e3),l.seconds=e%60,t=y(e/60),l.minutes=t%60,n=y(t/60),l.hours=n%24,i+=y(n/24),r=y(Xn(i)),s+=r,i-=qn(Qn(r)),a=y(s/12),s%=12,l.days=i,l.months=s,l.years=a,this}function Xn(e){return 4800*e/146097}function Qn(e){return 146097*e/4800}function Zn(e){var t,n,a=this._milliseconds;if(e=L(e),"month"===e||"year"===e)return t=this._days+a/864e5,n=this._months+Xn(t),"month"===e?n:n/12;switch(t=this._days+Math.round(Qn(this._months)),e){case"week":return t/7+a/6048e5;case"day":return t+a/864e5;case"hour":return 24*t+a/36e5;case"minute":return 1440*t+a/6e4;case"second":return 86400*t+a/1e3;case"millisecond":return Math.floor(864e5*t)+a;default:throw new Error("Unknown unit "+e)}}function $n(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*b(this._months/12)}function Jn(e){return function(){return this.as(e)}}function ea(e){return e=L(e),this[e+"s"]()}function ta(e){return function(){return this._data[e]}}function na(){return y(this.days()/7)}function aa(e,t,n,a,r){return r.relativeTime(t||1,!!n,e,a)}function ra(e,t,n){var a=ot(e).abs(),r=no(a.as("s")),o=no(a.as("m")),i=no(a.as("h")),s=no(a.as("d")),l=no(a.as("M")),u=no(a.as("y")),c=r<ao.s&&["s",r]||1>=o&&["m"]||o<ao.m&&["mm",o]||1>=i&&["h"]||i<ao.h&&["hh",i]||1>=s&&["d"]||s<ao.d&&["dd",s]||1>=l&&["M"]||l<ao.M&&["MM",l]||1>=u&&["y"]||["yy",u];return c[2]=t,c[3]=+e>0,c[4]=n,aa.apply(null,c)}function oa(e,t){return void 0===ao[e]?!1:void 0===t?ao[e]:(ao[e]=t,!0)}function ia(e){var t=this.localeData(),n=ra(this,!e,t);return e&&(n=t.pastFuture(+this,n)),t.postformat(n)}function sa(){var e,t,n,a=ro(this._milliseconds)/1e3,r=ro(this._days),o=ro(this._months);e=y(a/60),t=y(e/60),a%=60,e%=60,n=y(o/12),o%=12;var i=n,s=o,l=r,u=t,c=e,d=a,p=this.asSeconds();return p?(0>p?"-":"")+"P"+(i?i+"Y":"")+(s?s+"M":"")+(l?l+"D":"")+(u||c||d?"T":"")+(u?u+"H":"")+(c?c+"M":"")+(d?d+"S":""):"P0D"}var la,ua;ua=Array.prototype.some?Array.prototype.some:function(e){for(var t=Object(this),n=t.length>>>0,a=0;n>a;a++)if(a in t&&e.call(this,t[a],a,t))return!0;return!1};var ca=e.momentProperties=[],da=!1,pa={};e.suppressDeprecationWarnings=!1,e.deprecationHandler=null;var fa;fa=Object.keys?Object.keys:function(e){var t,n=[];for(t in e)s(e,t)&&n.push(t);return n};var ma,ha,va={},ga={},ya=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,ba=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Ea={},_a={},Ca=/\d/,ka=/\d\d/,Ta=/\d{3}/,Na=/\d{4}/,Pa=/[+-]?\d{6}/,wa=/\d\d?/,Ma=/\d\d\d\d?/,Sa=/\d\d\d\d\d\d?/,xa=/\d{1,3}/,Ra=/\d{1,4}/,Da=/[+-]?\d{1,6}/,Oa=/\d+/,Ia=/[+-]?\d+/,ja=/Z|[+-]\d\d:?\d\d/gi,Aa=/Z|[+-]\d\d(?::?\d\d)?/gi,Ua=/[+-]?\d+(\.\d{1,3})?/,La=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Fa={},Va={},Ya=0,Wa=1,Ha=2,Ba=3,Ga=4,Ka=5,qa=6,za=7,Xa=8;ha=Array.prototype.indexOf?Array.prototype.indexOf:function(e){var t;for(t=0;t<this.length;++t)if(this[t]===e)return t;return-1},G("M",["MM",2],"Mo",function(){return this.month()+1}),G("MMM",0,0,function(e){return this.localeData().monthsShort(this,e)}),G("MMMM",0,0,function(e){return this.localeData().months(this,e)}),U("month","M"),Q("M",wa),Q("MM",wa,ka),Q("MMM",function(e,t){return t.monthsShortRegex(e)}),Q("MMMM",function(e,t){return t.monthsRegex(e)}),ee(["M","MM"],function(e,t){t[Wa]=b(e)-1}),ee(["MMM","MMMM"],function(e,t,n,a){var r=n._locale.monthsParse(e,a,n._strict);null!=r?t[Wa]=r:d(n).invalidMonth=e});var Qa=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/,Za="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),$a="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),Ja=La,er=La,tr=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,nr=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,ar=/Z|[+-]\d\d(?::?\d\d)?/,rr=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],or=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],ir=/^\/?Date\((\-?\d+)/i;e.createFromInputFallback=C("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))}),G("Y",0,0,function(){var e=this.year();return 9999>=e?""+e:"+"+e}),G(0,["YY",2],0,function(){return this.year()%100}),G(0,["YYYY",4],0,"year"),G(0,["YYYYY",5],0,"year"),G(0,["YYYYYY",6,!0],0,"year"),U("year","y"),Q("Y",Ia),Q("YY",wa,ka),Q("YYYY",Ra,Na),Q("YYYYY",Da,Pa),Q("YYYYYY",Da,Pa),ee(["YYYYY","YYYYYY"],Ya),ee("YYYY",function(t,n){n[Ya]=2===t.length?e.parseTwoDigitYear(t):b(t)}),ee("YY",function(t,n){n[Ya]=e.parseTwoDigitYear(t)}),ee("Y",function(e,t){t[Ya]=parseInt(e,10)}),e.parseTwoDigitYear=function(e){return b(e)+(b(e)>68?1900:2e3)};var sr=V("FullYear",!0);e.ISO_8601=function(){};var lr=C("moment().min is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(){var e=Le.apply(null,arguments);return this.isValid()&&e.isValid()?this>e?this:e:f()}),ur=C("moment().max is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(){var e=Le.apply(null,arguments);return this.isValid()&&e.isValid()?e>this?this:e:f()}),cr=function(){return Date.now?Date.now():+new Date};Be("Z",":"),Be("ZZ",""),Q("Z",Aa),Q("ZZ",Aa),ee(["Z","ZZ"],function(e,t,n){n._useUTC=!0,n._tzm=Ge(Aa,e)});var dr=/([\+\-]|\d\d)/gi;e.updateOffset=function(){};var pr=/^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/,fr=/^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;ot.fn=We.prototype;var mr=ct(1,"add"),hr=ct(-1,"subtract");e.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",e.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var vr=C("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(e){return void 0===e?this.localeData():this.locale(e)});G(0,["gg",2],0,function(){return this.weekYear()%100}),G(0,["GG",2],0,function(){return this.isoWeekYear()%100}),Ht("gggg","weekYear"),Ht("ggggg","weekYear"),Ht("GGGG","isoWeekYear"),Ht("GGGGG","isoWeekYear"),U("weekYear","gg"),U("isoWeekYear","GG"),Q("G",Ia),Q("g",Ia),Q("GG",wa,ka),Q("gg",wa,ka),Q("GGGG",Ra,Na),Q("gggg",Ra,Na),Q("GGGGG",Da,Pa),Q("ggggg",Da,Pa),te(["gggg","ggggg","GGGG","GGGGG"],function(e,t,n,a){t[a.substr(0,2)]=b(e)}),te(["gg","GG"],function(t,n,a,r){n[r]=e.parseTwoDigitYear(t)}),G("Q",0,"Qo","quarter"),U("quarter","Q"),Q("Q",Ca),ee("Q",function(e,t){t[Wa]=3*(b(e)-1)}),G("w",["ww",2],"wo","week"),G("W",["WW",2],"Wo","isoWeek"),U("week","w"),U("isoWeek","W"),Q("w",wa),Q("ww",wa,ka),Q("W",wa),Q("WW",wa,ka),te(["w","ww","W","WW"],function(e,t,n,a){t[a.substr(0,1)]=b(e)});var gr={dow:0,doy:6};G("D",["DD",2],"Do","date"),U("date","D"),Q("D",wa),Q("DD",wa,ka),Q("Do",function(e,t){return e?t._ordinalParse:t._ordinalParseLenient}),ee(["D","DD"],Ha),ee("Do",function(e,t){t[Ha]=b(e.match(wa)[0],10)});var yr=V("Date",!0);G("d",0,"do","day"),G("dd",0,0,function(e){return this.localeData().weekdaysMin(this,e)}),G("ddd",0,0,function(e){return this.localeData().weekdaysShort(this,e)}),G("dddd",0,0,function(e){return this.localeData().weekdays(this,e)}),G("e",0,0,"weekday"),G("E",0,0,"isoWeekday"),U("day","d"),U("weekday","e"),U("isoWeekday","E"),Q("d",wa),Q("e",wa),Q("E",wa),Q("dd",function(e,t){return t.weekdaysMinRegex(e)}),Q("ddd",function(e,t){return t.weekdaysShortRegex(e)}),Q("dddd",function(e,t){return t.weekdaysRegex(e)}),te(["dd","ddd","dddd"],function(e,t,n,a){var r=n._locale.weekdaysParse(e,a,n._strict);null!=r?t.d=r:d(n).invalidWeekday=e}),te(["d","e","E"],function(e,t,n,a){t[a]=b(e)});var br="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),Er="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),_r="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),Cr=La,kr=La,Tr=La;G("DDD",["DDDD",3],"DDDo","dayOfYear"),U("dayOfYear","DDD"),Q("DDD",xa),Q("DDDD",Ta),ee(["DDD","DDDD"],function(e,t,n){n._dayOfYear=b(e)}),G("H",["HH",2],0,"hour"),G("h",["hh",2],0,gn),G("k",["kk",2],0,yn),G("hmm",0,0,function(){return""+gn.apply(this)+B(this.minutes(),2)}),G("hmmss",0,0,function(){return""+gn.apply(this)+B(this.minutes(),2)+B(this.seconds(),2)}),G("Hmm",0,0,function(){return""+this.hours()+B(this.minutes(),2)}),G("Hmmss",0,0,function(){return""+this.hours()+B(this.minutes(),2)+B(this.seconds(),2)}),bn("a",!0),bn("A",!1),U("hour","h"),Q("a",En),Q("A",En),Q("H",wa),Q("h",wa),Q("HH",wa,ka),Q("hh",wa,ka),Q("hmm",Ma),Q("hmmss",Sa),Q("Hmm",Ma),Q("Hmmss",Sa),ee(["H","HH"],Ba),ee(["a","A"],function(e,t,n){n._isPm=n._locale.isPM(e),n._meridiem=e}),ee(["h","hh"],function(e,t,n){t[Ba]=b(e),d(n).bigHour=!0}),ee("hmm",function(e,t,n){var a=e.length-2;t[Ba]=b(e.substr(0,a)),t[Ga]=b(e.substr(a)),d(n).bigHour=!0}),ee("hmmss",function(e,t,n){var a=e.length-4,r=e.length-2;t[Ba]=b(e.substr(0,a)),t[Ga]=b(e.substr(a,2)),t[Ka]=b(e.substr(r)),d(n).bigHour=!0}),ee("Hmm",function(e,t,n){var a=e.length-2;t[Ba]=b(e.substr(0,a)),t[Ga]=b(e.substr(a))}),ee("Hmmss",function(e,t,n){var a=e.length-4,r=e.length-2;t[Ba]=b(e.substr(0,a)),t[Ga]=b(e.substr(a,2)),t[Ka]=b(e.substr(r))});var Nr=/[ap]\.?m?\.?/i,Pr=V("Hours",!0);G("m",["mm",2],0,"minute"),U("minute","m"),Q("m",wa),Q("mm",wa,ka),ee(["m","mm"],Ga);var wr=V("Minutes",!1);G("s",["ss",2],0,"second"),U("second","s"),Q("s",wa),Q("ss",wa,ka),ee(["s","ss"],Ka);var Mr=V("Seconds",!1);G("S",0,0,function(){return~~(this.millisecond()/100)}),G(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),G(0,["SSS",3],0,"millisecond"),G(0,["SSSS",4],0,function(){return 10*this.millisecond()}),G(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),G(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),G(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),G(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),G(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),U("millisecond","ms"),Q("S",xa,Ca),Q("SS",xa,ka),Q("SSS",xa,Ta);var Sr;for(Sr="SSSS";Sr.length<=9;Sr+="S")Q(Sr,Oa);for(Sr="S";Sr.length<=9;Sr+="S")ee(Sr,kn);var xr=V("Milliseconds",!1);G("z",0,0,"zoneAbbr"),G("zz",0,0,"zoneName");var Rr=v.prototype;Rr.add=mr,Rr.calendar=pt,Rr.clone=ft,Rr.diff=Et,Rr.endOf=Dt,Rr.format=Tt,Rr.from=Nt,Rr.fromNow=Pt,Rr.to=wt,Rr.toNow=Mt,Rr.get=H,Rr.invalidAt=Yt,Rr.isAfter=mt,Rr.isBefore=ht,Rr.isBetween=vt,Rr.isSame=gt,Rr.isSameOrAfter=yt,Rr.isSameOrBefore=bt,Rr.isValid=Ft,Rr.lang=vr,Rr.locale=St,Rr.localeData=xt,Rr.max=ur,Rr.min=lr,Rr.parsingFlags=Vt,Rr.set=H,Rr.startOf=Rt,Rr.subtract=hr,Rr.toArray=At,Rr.toObject=Ut,Rr.toDate=jt,Rr.toISOString=kt,Rr.toJSON=Lt,Rr.toString=Ct,Rr.unix=It,Rr.valueOf=Ot,Rr.creationData=Wt,Rr.year=sr,Rr.isLeapYear=_e,Rr.weekYear=Bt,Rr.isoWeekYear=Gt,Rr.quarter=Rr.quarters=Qt,Rr.month=ue,Rr.daysInMonth=ce,Rr.week=Rr.weeks=en,Rr.isoWeek=Rr.isoWeeks=tn,Rr.weeksInYear=qt,Rr.isoWeeksInYear=Kt,Rr.date=yr,Rr.day=Rr.days=un,Rr.weekday=cn,Rr.isoWeekday=dn,
Rr.dayOfYear=vn,Rr.hour=Rr.hours=Pr,Rr.minute=Rr.minutes=wr,Rr.second=Rr.seconds=Mr,Rr.millisecond=Rr.milliseconds=xr,Rr.utcOffset=ze,Rr.utc=Qe,Rr.local=Ze,Rr.parseZone=$e,Rr.hasAlignedHourOffset=Je,Rr.isDST=et,Rr.isDSTShifted=tt,Rr.isLocal=nt,Rr.isUtcOffset=at,Rr.isUtc=rt,Rr.isUTC=rt,Rr.zoneAbbr=Tn,Rr.zoneName=Nn,Rr.dates=C("dates accessor is deprecated. Use date instead.",yr),Rr.months=C("months accessor is deprecated. Use month instead",ue),Rr.years=C("years accessor is deprecated. Use year instead",sr),Rr.zone=C("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779",Xe);var Dr=Rr,Or={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},Ir={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},jr="Invalid date",Ar="%d",Ur=/\d{1,2}/,Lr={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},Fr=M.prototype;Fr._calendar=Or,Fr.calendar=Mn,Fr._longDateFormat=Ir,Fr.longDateFormat=Sn,Fr._invalidDate=jr,Fr.invalidDate=xn,Fr._ordinal=Ar,Fr.ordinal=Rn,Fr._ordinalParse=Ur,Fr.preparse=Dn,Fr.postformat=Dn,Fr._relativeTime=Lr,Fr.relativeTime=On,Fr.pastFuture=In,Fr.set=P,Fr.months=re,Fr._months=Za,Fr.monthsShort=oe,Fr._monthsShort=$a,Fr.monthsParse=se,Fr._monthsRegex=er,Fr.monthsRegex=pe,Fr._monthsShortRegex=Ja,Fr.monthsShortRegex=de,Fr.week=Zt,Fr._week=gr,Fr.firstDayOfYear=Jt,Fr.firstDayOfWeek=$t,Fr.weekdays=an,Fr._weekdays=br,Fr.weekdaysMin=on,Fr._weekdaysMin=_r,Fr.weekdaysShort=rn,Fr._weekdaysShort=Er,Fr.weekdaysParse=ln,Fr._weekdaysRegex=Cr,Fr.weekdaysRegex=pn,Fr._weekdaysShortRegex=kr,Fr.weekdaysShortRegex=fn,Fr._weekdaysMinRegex=Tr,Fr.weekdaysMinRegex=mn,Fr.isPM=_n,Fr._meridiemParse=Nr,Fr.meridiem=Cn,D("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10,n=1===b(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n}}),e.lang=C("moment.lang is deprecated. Use moment.locale instead.",D),e.langData=C("moment.langData is deprecated. Use moment.localeData instead.",j);var Vr=Math.abs,Yr=Jn("ms"),Wr=Jn("s"),Hr=Jn("m"),Br=Jn("h"),Gr=Jn("d"),Kr=Jn("w"),qr=Jn("M"),zr=Jn("y"),Xr=ta("milliseconds"),Qr=ta("seconds"),Zr=ta("minutes"),$r=ta("hours"),Jr=ta("days"),eo=ta("months"),to=ta("years"),no=Math.round,ao={s:45,m:45,h:22,d:26,M:11},ro=Math.abs,oo=We.prototype;oo.abs=Hn,oo.add=Gn,oo.subtract=Kn,oo.as=Zn,oo.asMilliseconds=Yr,oo.asSeconds=Wr,oo.asMinutes=Hr,oo.asHours=Br,oo.asDays=Gr,oo.asWeeks=Kr,oo.asMonths=qr,oo.asYears=zr,oo.valueOf=$n,oo._bubble=zn,oo.get=ea,oo.milliseconds=Xr,oo.seconds=Qr,oo.minutes=Zr,oo.hours=$r,oo.days=Jr,oo.weeks=na,oo.months=eo,oo.years=to,oo.humanize=ia,oo.toISOString=sa,oo.toString=sa,oo.toJSON=sa,oo.locale=St,oo.localeData=xt,oo.toIsoString=C("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",sa),oo.lang=vr,G("X",0,0,"unix"),G("x",0,0,"valueOf"),Q("x",Ia),Q("X",Ua),ee("X",function(e,t,n){n._d=new Date(1e3*parseFloat(e,10))}),ee("x",function(e,t,n){n._d=new Date(b(e))}),e.version="2.13.0",a(Le),e.fn=Dr,e.min=Ve,e.max=Ye,e.now=cr,e.utc=u,e.unix=Pn,e.months=Ln,e.isDate=o,e.locale=D,e.invalid=f,e.duration=ot,e.isMoment=g,e.weekdays=Vn,e.parseZone=wn,e.localeData=j,e.isDuration=He,e.monthsShort=Fn,e.weekdaysMin=Wn,e.defineLocale=O,e.updateLocale=I,e.locales=A,e.weekdaysShort=Yn,e.normalizeUnits=L,e.relativeTimeThreshold=oa,e.prototype=Dr;var io=e;return io})},{}],15:[function(e,t,n){"use strict";function a(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}function r(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;10>n;n++)t["_"+String.fromCharCode(n)]=n;var a=Object.getOwnPropertyNames(t).map(function(e){return t[e]});if("0123456789"!==a.join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}var o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;t.exports=r()?Object.assign:function(e,t){for(var n,r,s=a(e),l=1;l<arguments.length;l++){n=Object(arguments[l]);for(var u in n)o.call(n,u)&&(s[u]=n[u]);if(Object.getOwnPropertySymbols){r=Object.getOwnPropertySymbols(n);for(var c=0;c<r.length;c++)i.call(n,r[c])&&(s[r[c]]=n[r[c]])}}return s}},{}],16:[function(e,t,n){"use strict";t.exports=e("react/lib/ReactDOM")},{"react/lib/ReactDOM":53}],17:[function(e,t,n){"use strict";var a=e("./ReactDOMComponentTree"),r=e("fbjs/lib/focusNode"),o={focusDOMComponent:function(){r(a.getNodeFromInstance(this))}};t.exports=o},{"./ReactDOMComponentTree":57,"fbjs/lib/focusNode":163}],18:[function(e,t,n){"use strict";function a(){var e=window.opera;return"object"==typeof e&&"function"==typeof e.version&&parseInt(e.version(),10)<=12}function r(e){return(e.ctrlKey||e.altKey||e.metaKey)&&!(e.ctrlKey&&e.altKey)}function o(e){switch(e){case M.topCompositionStart:return S.compositionStart;case M.topCompositionEnd:return S.compositionEnd;case M.topCompositionUpdate:return S.compositionUpdate}}function i(e,t){return e===M.topKeyDown&&t.keyCode===_}function s(e,t){switch(e){case M.topKeyUp:return-1!==E.indexOf(t.keyCode);case M.topKeyDown:return t.keyCode!==_;case M.topKeyPress:case M.topMouseDown:case M.topBlur:return!0;default:return!1}}function l(e){var t=e.detail;return"object"==typeof t&&"data"in t?t.data:null}function u(e,t,n,a){var r,u;if(C?r=o(e):R?s(e,n)&&(r=S.compositionEnd):i(e,n)&&(r=S.compositionStart),!r)return null;N&&(R||r!==S.compositionStart?r===S.compositionEnd&&R&&(u=R.getData()):R=v.getPooled(a));var c=g.getPooled(r,t,n,a);if(u)c.data=u;else{var d=l(n);null!==d&&(c.data=d)}return m.accumulateTwoPhaseDispatches(c),c}function c(e,t){switch(e){case M.topCompositionEnd:return l(t);case M.topKeyPress:var n=t.which;return n!==P?null:(x=!0,w);case M.topTextInput:var a=t.data;return a===w&&x?null:a;default:return null}}function d(e,t){if(R){if(e===M.topCompositionEnd||s(e,t)){var n=R.getData();return v.release(R),R=null,n}return null}switch(e){case M.topPaste:return null;case M.topKeyPress:return t.which&&!r(t)?String.fromCharCode(t.which):null;case M.topCompositionEnd:return N?null:t.data;default:return null}}function p(e,t,n,a){var r;if(r=T?c(e,n):d(e,n),!r)return null;var o=y.getPooled(S.beforeInput,t,n,a);return o.data=r,m.accumulateTwoPhaseDispatches(o),o}var f=e("./EventConstants"),m=e("./EventPropagators"),h=e("fbjs/lib/ExecutionEnvironment"),v=e("./FallbackCompositionState"),g=e("./SyntheticCompositionEvent"),y=e("./SyntheticInputEvent"),b=e("fbjs/lib/keyOf"),E=[9,13,27,32],_=229,C=h.canUseDOM&&"CompositionEvent"in window,k=null;h.canUseDOM&&"documentMode"in document&&(k=document.documentMode);var T=h.canUseDOM&&"TextEvent"in window&&!k&&!a(),N=h.canUseDOM&&(!C||k&&k>8&&11>=k),P=32,w=String.fromCharCode(P),M=f.topLevelTypes,S={beforeInput:{phasedRegistrationNames:{bubbled:b({onBeforeInput:null}),captured:b({onBeforeInputCapture:null})},dependencies:[M.topCompositionEnd,M.topKeyPress,M.topTextInput,M.topPaste]},compositionEnd:{phasedRegistrationNames:{bubbled:b({onCompositionEnd:null}),captured:b({onCompositionEndCapture:null})},dependencies:[M.topBlur,M.topCompositionEnd,M.topKeyDown,M.topKeyPress,M.topKeyUp,M.topMouseDown]},compositionStart:{phasedRegistrationNames:{bubbled:b({onCompositionStart:null}),captured:b({onCompositionStartCapture:null})},dependencies:[M.topBlur,M.topCompositionStart,M.topKeyDown,M.topKeyPress,M.topKeyUp,M.topMouseDown]},compositionUpdate:{phasedRegistrationNames:{bubbled:b({onCompositionUpdate:null}),captured:b({onCompositionUpdateCapture:null})},dependencies:[M.topBlur,M.topCompositionUpdate,M.topKeyDown,M.topKeyPress,M.topKeyUp,M.topMouseDown]}},x=!1,R=null,D={eventTypes:S,extractEvents:function(e,t,n,a){return[u(e,t,n,a),p(e,t,n,a)]}};t.exports=D},{"./EventConstants":32,"./EventPropagators":36,"./FallbackCompositionState":37,"./SyntheticCompositionEvent":112,"./SyntheticInputEvent":116,"fbjs/lib/ExecutionEnvironment":155,"fbjs/lib/keyOf":173}],19:[function(e,t,n){"use strict";function a(e,t){return e+t.charAt(0).toUpperCase()+t.substring(1)}var r={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridColumn:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},o=["Webkit","ms","Moz","O"];Object.keys(r).forEach(function(e){o.forEach(function(t){r[a(t,e)]=r[e]})});var i={background:{backgroundAttachment:!0,backgroundColor:!0,backgroundImage:!0,backgroundPositionX:!0,backgroundPositionY:!0,backgroundRepeat:!0},backgroundPosition:{backgroundPositionX:!0,backgroundPositionY:!0},border:{borderWidth:!0,borderStyle:!0,borderColor:!0},borderBottom:{borderBottomWidth:!0,borderBottomStyle:!0,borderBottomColor:!0},borderLeft:{borderLeftWidth:!0,borderLeftStyle:!0,borderLeftColor:!0},borderRight:{borderRightWidth:!0,borderRightStyle:!0,borderRightColor:!0},borderTop:{borderTopWidth:!0,borderTopStyle:!0,borderTopColor:!0},font:{fontStyle:!0,fontVariant:!0,fontWeight:!0,fontSize:!0,lineHeight:!0,fontFamily:!0},outline:{outlineWidth:!0,outlineStyle:!0,outlineColor:!0}},s={isUnitlessNumber:r,shorthandPropertyExpansions:i};t.exports=s},{}],20:[function(e,t,n){"use strict";var a=e("./CSSProperty"),r=e("fbjs/lib/ExecutionEnvironment"),o=(e("./ReactInstrumentation"),e("fbjs/lib/camelizeStyleName"),e("./dangerousStyleValue")),i=e("fbjs/lib/hyphenateStyleName"),s=e("fbjs/lib/memoizeStringOnly"),l=(e("fbjs/lib/warning"),s(function(e){return i(e)})),u=!1,c="cssFloat";if(r.canUseDOM){var d=document.createElement("div").style;try{d.font=""}catch(e){u=!0}void 0===document.documentElement.style.cssFloat&&(c="styleFloat")}var p={createMarkupForStyles:function(e,t){var n="";for(var a in e)if(e.hasOwnProperty(a)){var r=e[a];null!=r&&(n+=l(a)+":",n+=o(a,r,t)+";")}return n||null},setValueForStyles:function(e,t,n){var r=e.style;for(var i in t)if(t.hasOwnProperty(i)){var s=o(i,t[i],n);if("float"!==i&&"cssFloat"!==i||(i=c),s)r[i]=s;else{var l=u&&a.shorthandPropertyExpansions[i];if(l)for(var d in l)r[d]="";else r[i]=""}}}};t.exports=p},{"./CSSProperty":19,"./ReactInstrumentation":86,"./dangerousStyleValue":129,"fbjs/lib/ExecutionEnvironment":155,"fbjs/lib/camelizeStyleName":157,"fbjs/lib/hyphenateStyleName":168,"fbjs/lib/memoizeStringOnly":175,"fbjs/lib/warning":179}],21:[function(e,t,n){"use strict";function a(){this._callbacks=null,this._contexts=null}var r=e("object-assign"),o=e("./PooledClass"),i=e("fbjs/lib/invariant");r(a.prototype,{enqueue:function(e,t){this._callbacks=this._callbacks||[],this._contexts=this._contexts||[],this._callbacks.push(e),this._contexts.push(t)},notifyAll:function(){var e=this._callbacks,t=this._contexts;if(e){e.length!==t.length?i(!1):void 0,this._callbacks=null,this._contexts=null;for(var n=0;n<e.length;n++)e[n].call(t[n]);e.length=0,t.length=0}},checkpoint:function(){return this._callbacks?this._callbacks.length:0},rollback:function(e){this._callbacks&&(this._callbacks.length=e,this._contexts.length=e)},reset:function(){this._callbacks=null,this._contexts=null},destructor:function(){this.reset()}}),o.addPoolingTo(a),t.exports=a},{"./PooledClass":41,"fbjs/lib/invariant":169,"object-assign":180}],22:[function(e,t,n){"use strict";function a(e){var t=e.nodeName&&e.nodeName.toLowerCase();return"select"===t||"input"===t&&"file"===e.type}function r(e){var t=T.getPooled(x.change,D,e,N(e));E.accumulateTwoPhaseDispatches(t),k.batchedUpdates(o,t)}function o(e){b.enqueueEvents(e),b.processEventQueue(!1)}function i(e,t){R=e,D=t,R.attachEvent("onchange",r)}function s(){R&&(R.detachEvent("onchange",r),R=null,D=null)}function l(e,t){return e===S.topChange?t:void 0}function u(e,t,n){e===S.topFocus?(s(),i(t,n)):e===S.topBlur&&s()}function c(e,t){R=e,D=t,O=e.value,I=Object.getOwnPropertyDescriptor(e.constructor.prototype,"value"),Object.defineProperty(R,"value",U),R.attachEvent?R.attachEvent("onpropertychange",p):R.addEventListener("propertychange",p,!1)}function d(){R&&(delete R.value,R.detachEvent?R.detachEvent("onpropertychange",p):R.removeEventListener("propertychange",p,!1),R=null,D=null,O=null,I=null)}function p(e){if("value"===e.propertyName){var t=e.srcElement.value;t!==O&&(O=t,r(e))}}function f(e,t){return e===S.topInput?t:void 0}function m(e,t,n){e===S.topFocus?(d(),c(t,n)):e===S.topBlur&&d()}function h(e,t){return e!==S.topSelectionChange&&e!==S.topKeyUp&&e!==S.topKeyDown||!R||R.value===O?void 0:(O=R.value,D)}function v(e){return e.nodeName&&"input"===e.nodeName.toLowerCase()&&("checkbox"===e.type||"radio"===e.type)}function g(e,t){return e===S.topClick?t:void 0}var y=e("./EventConstants"),b=e("./EventPluginHub"),E=e("./EventPropagators"),_=e("fbjs/lib/ExecutionEnvironment"),C=e("./ReactDOMComponentTree"),k=e("./ReactUpdates"),T=e("./SyntheticEvent"),N=e("./getEventTarget"),P=e("./isEventSupported"),w=e("./isTextInputElement"),M=e("fbjs/lib/keyOf"),S=y.topLevelTypes,x={change:{phasedRegistrationNames:{bubbled:M({onChange:null}),captured:M({onChangeCapture:null})},dependencies:[S.topBlur,S.topChange,S.topClick,S.topFocus,S.topInput,S.topKeyDown,S.topKeyUp,S.topSelectionChange]}},R=null,D=null,O=null,I=null,j=!1;_.canUseDOM&&(j=P("change")&&(!("documentMode"in document)||document.documentMode>8));var A=!1;_.canUseDOM&&(A=P("input")&&(!("documentMode"in document)||document.documentMode>11));var U={get:function(){return I.get.call(this)},set:function(e){O=""+e,I.set.call(this,e)}},L={eventTypes:x,extractEvents:function(e,t,n,r){var o,i,s=t?C.getNodeFromInstance(t):window;if(a(s)?j?o=l:i=u:w(s)?A?o=f:(o=h,i=m):v(s)&&(o=g),o){var c=o(e,t);if(c){var d=T.getPooled(x.change,c,n,r);return d.type="change",E.accumulateTwoPhaseDispatches(d),d}}i&&i(e,s,t)}};t.exports=L},{"./EventConstants":32,"./EventPluginHub":33,"./EventPropagators":36,"./ReactDOMComponentTree":57,"./ReactUpdates":105,"./SyntheticEvent":114,"./getEventTarget":137,"./isEventSupported":144,"./isTextInputElement":145,"fbjs/lib/ExecutionEnvironment":155,"fbjs/lib/keyOf":173}],23:[function(e,t,n){"use strict";function a(e,t){return Array.isArray(t)&&(t=t[1]),t?t.nextSibling:e.firstChild}function r(e,t,n){c.insertTreeBefore(e,t,n)}function o(e,t,n){Array.isArray(t)?s(e,t[0],t[1],n):v(e,t,n)}function i(e,t){if(Array.isArray(t)){var n=t[1];t=t[0],l(e,t,n),e.removeChild(n)}e.removeChild(t)}function s(e,t,n,a){for(var r=t;;){var o=r.nextSibling;if(v(e,r,a),r===n)break;r=o}}function l(e,t,n){for(;;){var a=t.nextSibling;if(a===n)break;e.removeChild(a)}}function u(e,t,n){var a=e.parentNode,r=e.nextSibling;r===t?n&&v(a,document.createTextNode(n),r):n?(h(r,n),l(a,r,t)):l(a,e,t)}var c=e("./DOMLazyTree"),d=e("./Danger"),p=e("./ReactMultiChildUpdateTypes"),f=(e("./ReactDOMComponentTree"),e("./ReactInstrumentation"),e("./createMicrosoftUnsafeLocalFunction")),m=e("./setInnerHTML"),h=e("./setTextContent"),v=f(function(e,t,n){e.insertBefore(t,n)}),g=d.dangerouslyReplaceNodeWithMarkup,y={dangerouslyReplaceNodeWithMarkup:g,replaceDelimitedText:u,processUpdates:function(e,t){for(var n=0;n<t.length;n++){var s=t[n];switch(s.type){case p.INSERT_MARKUP:r(e,s.content,a(e,s.afterNode));break;case p.MOVE_EXISTING:o(e,s.fromNode,a(e,s.afterNode));break;case p.SET_MARKUP:m(e,s.content);break;case p.TEXT_CONTENT:h(e,s.content);break;case p.REMOVE_NODE:i(e,s.fromNode)}}}};t.exports=y},{"./DOMLazyTree":24,"./Danger":28,"./ReactDOMComponentTree":57,"./ReactInstrumentation":86,"./ReactMultiChildUpdateTypes":91,"./createMicrosoftUnsafeLocalFunction":128,"./setInnerHTML":149,"./setTextContent":150}],24:[function(e,t,n){"use strict";function a(e){if(h){var t=e.node,n=e.children;if(n.length)for(var a=0;a<n.length;a++)v(t,n[a],null);else null!=e.html?t.innerHTML=e.html:null!=e.text&&p(t,e.text)}}function r(e,t){e.parentNode.replaceChild(t.node,e),a(t)}function o(e,t){h?e.children.push(t):e.node.appendChild(t.node)}function i(e,t){h?e.html=t:e.node.innerHTML=t}function s(e,t){h?e.text=t:p(e.node,t)}function l(){return this.node.nodeName}function u(e){return{node:e,children:[],html:null,text:null,toString:l}}var c=e("./DOMNamespaces"),d=e("./createMicrosoftUnsafeLocalFunction"),p=e("./setTextContent"),f=1,m=11,h="undefined"!=typeof document&&"number"==typeof document.documentMode||"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent&&/\bEdge\/\d/.test(navigator.userAgent),v=d(function(e,t,n){t.node.nodeType===m||t.node.nodeType===f&&"object"===t.node.nodeName.toLowerCase()&&(null==t.node.namespaceURI||t.node.namespaceURI===c.html)?(a(t),e.insertBefore(t.node,n)):(e.insertBefore(t.node,n),a(t))});u.insertTreeBefore=v,u.replaceChildWithTree=r,u.queueChild=o,u.queueHTML=i,u.queueText=s,t.exports=u},{"./DOMNamespaces":25,"./createMicrosoftUnsafeLocalFunction":128,"./setTextContent":150}],25:[function(e,t,n){"use strict";var a={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};t.exports=a},{}],26:[function(e,t,n){"use strict";function a(e,t){return(e&t)===t}var r=e("fbjs/lib/invariant"),o={MUST_USE_PROPERTY:1,HAS_SIDE_EFFECTS:2,HAS_BOOLEAN_VALUE:4,HAS_NUMERIC_VALUE:8,HAS_POSITIVE_NUMERIC_VALUE:24,HAS_OVERLOADED_BOOLEAN_VALUE:32,injectDOMPropertyConfig:function(e){var t=o,n=e.Properties||{},i=e.DOMAttributeNamespaces||{},l=e.DOMAttributeNames||{},u=e.DOMPropertyNames||{},c=e.DOMMutationMethods||{};e.isCustomAttribute&&s._isCustomAttributeFunctions.push(e.isCustomAttribute);for(var d in n){s.properties.hasOwnProperty(d)?r(!1):void 0;var p=d.toLowerCase(),f=n[d],m={attributeName:p,attributeNamespace:null,propertyName:d,mutationMethod:null,mustUseProperty:a(f,t.MUST_USE_PROPERTY),hasSideEffects:a(f,t.HAS_SIDE_EFFECTS),hasBooleanValue:a(f,t.HAS_BOOLEAN_VALUE),hasNumericValue:a(f,t.HAS_NUMERIC_VALUE),hasPositiveNumericValue:a(f,t.HAS_POSITIVE_NUMERIC_VALUE),hasOverloadedBooleanValue:a(f,t.HAS_OVERLOADED_BOOLEAN_VALUE)};if(!m.mustUseProperty&&m.hasSideEffects?r(!1):void 0,m.hasBooleanValue+m.hasNumericValue+m.hasOverloadedBooleanValue<=1?void 0:r(!1),l.hasOwnProperty(d)){var h=l[d];m.attributeName=h}i.hasOwnProperty(d)&&(m.attributeNamespace=i[d]),u.hasOwnProperty(d)&&(m.propertyName=u[d]),c.hasOwnProperty(d)&&(m.mutationMethod=c[d]),s.properties[d]=m}}},i=":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",s={ID_ATTRIBUTE_NAME:"data-reactid",ROOT_ATTRIBUTE_NAME:"data-reactroot",ATTRIBUTE_NAME_START_CHAR:i,ATTRIBUTE_NAME_CHAR:i+"\\-.0-9\\uB7\\u0300-\\u036F\\u203F-\\u2040",properties:{},getPossibleStandardName:null,_isCustomAttributeFunctions:[],isCustomAttribute:function(e){for(var t=0;t<s._isCustomAttributeFunctions.length;t++){var n=s._isCustomAttributeFunctions[t];if(n(e))return!0}return!1},injection:o};t.exports=s},{"fbjs/lib/invariant":169}],27:[function(e,t,n){"use strict";function a(e){return u.hasOwnProperty(e)?!0:l.hasOwnProperty(e)?!1:s.test(e)?(u[e]=!0,!0):(l[e]=!0,!1)}function r(e,t){return null==t||e.hasBooleanValue&&!t||e.hasNumericValue&&isNaN(t)||e.hasPositiveNumericValue&&1>t||e.hasOverloadedBooleanValue&&t===!1}var o=e("./DOMProperty"),i=(e("./ReactDOMComponentTree"),e("./ReactDOMInstrumentation"),e("./ReactInstrumentation"),e("./quoteAttributeValueForBrowser")),s=(e("fbjs/lib/warning"),new RegExp("^["+o.ATTRIBUTE_NAME_START_CHAR+"]["+o.ATTRIBUTE_NAME_CHAR+"]*$")),l={},u={},c={createMarkupForID:function(e){return o.ID_ATTRIBUTE_NAME+"="+i(e)},setAttributeForID:function(e,t){e.setAttribute(o.ID_ATTRIBUTE_NAME,t)},createMarkupForRoot:function(){return o.ROOT_ATTRIBUTE_NAME+'=""'},setAttributeForRoot:function(e){e.setAttribute(o.ROOT_ATTRIBUTE_NAME,"")},createMarkupForProperty:function(e,t){var n=o.properties.hasOwnProperty(e)?o.properties[e]:null;if(n){if(r(n,t))return"";var a=n.attributeName;return n.hasBooleanValue||n.hasOverloadedBooleanValue&&t===!0?a+'=""':a+"="+i(t)}return o.isCustomAttribute(e)?null==t?"":e+"="+i(t):null},createMarkupForCustomAttribute:function(e,t){return a(e)&&null!=t?e+"="+i(t):""},setValueForProperty:function(e,t,n){var a=o.properties.hasOwnProperty(t)?o.properties[t]:null;if(a){var i=a.mutationMethod;if(i)i(e,n);else{if(r(a,n))return void this.deleteValueForProperty(e,t);if(a.mustUseProperty){var s=a.propertyName;a.hasSideEffects&&""+e[s]==""+n||(e[s]=n)}else{var l=a.attributeName,u=a.attributeNamespace;u?e.setAttributeNS(u,l,""+n):a.hasBooleanValue||a.hasOverloadedBooleanValue&&n===!0?e.setAttribute(l,""):e.setAttribute(l,""+n)}}}else if(o.isCustomAttribute(t))return void c.setValueForAttribute(e,t,n)},setValueForAttribute:function(e,t,n){if(a(t)){null==n?e.removeAttribute(t):e.setAttribute(t,""+n)}},deleteValueForProperty:function(e,t){var n=o.properties.hasOwnProperty(t)?o.properties[t]:null;if(n){var a=n.mutationMethod;if(a)a(e,void 0);else if(n.mustUseProperty){var r=n.propertyName;n.hasBooleanValue?e[r]=!1:n.hasSideEffects&&""+e[r]==""||(e[r]="")}else e.removeAttribute(n.attributeName)}else o.isCustomAttribute(t)&&e.removeAttribute(t)}};t.exports=c},{"./DOMProperty":26,"./ReactDOMComponentTree":57,"./ReactDOMInstrumentation":65,"./ReactInstrumentation":86,"./quoteAttributeValueForBrowser":147,"fbjs/lib/warning":179}],28:[function(e,t,n){"use strict";function a(e){return e.substring(1,e.indexOf(" "))}var r=e("./DOMLazyTree"),o=e("fbjs/lib/ExecutionEnvironment"),i=e("fbjs/lib/createNodesFromMarkup"),s=e("fbjs/lib/emptyFunction"),l=e("fbjs/lib/getMarkupWrap"),u=e("fbjs/lib/invariant"),c=/^(<[^ \/>]+)/,d="data-danger-index",p={dangerouslyRenderMarkup:function(e){o.canUseDOM?void 0:u(!1);for(var t,n={},r=0;r<e.length;r++)e[r]?void 0:u(!1),t=a(e[r]),t=l(t)?t:"*",n[t]=n[t]||[],n[t][r]=e[r];var p=[],f=0;for(t in n)if(n.hasOwnProperty(t)){var m,h=n[t];for(m in h)if(h.hasOwnProperty(m)){var v=h[m];h[m]=v.replace(c,"$1 "+d+'="'+m+'" ')}for(var g=i(h.join(""),s),y=0;y<g.length;++y){var b=g[y];b.hasAttribute&&b.hasAttribute(d)&&(m=+b.getAttribute(d),b.removeAttribute(d),p.hasOwnProperty(m)?u(!1):void 0,p[m]=b,f+=1)}}return f!==p.length?u(!1):void 0,p.length!==e.length?u(!1):void 0,p},dangerouslyReplaceNodeWithMarkup:function(e,t){if(o.canUseDOM?void 0:u(!1),t?void 0:u(!1),"HTML"===e.nodeName?u(!1):void 0,"string"==typeof t){var n=i(t,s)[0];e.parentNode.replaceChild(n,e)}else r.replaceChildWithTree(e,t)}};t.exports=p},{"./DOMLazyTree":24,"fbjs/lib/ExecutionEnvironment":155,"fbjs/lib/createNodesFromMarkup":160,"fbjs/lib/emptyFunction":161,"fbjs/lib/getMarkupWrap":165,"fbjs/lib/invariant":169}],29:[function(e,t,n){"use strict";var a=e("fbjs/lib/keyOf"),r=[a({ResponderEventPlugin:null}),a({SimpleEventPlugin:null}),a({TapEventPlugin:null}),a({EnterLeaveEventPlugin:null}),a({ChangeEventPlugin:null}),a({SelectEventPlugin:null}),a({BeforeInputEventPlugin:null})];t.exports=r},{"fbjs/lib/keyOf":173}],30:[function(e,t,n){"use strict";var a={onClick:!0,onDoubleClick:!0,onMouseDown:!0,onMouseMove:!0,onMouseUp:!0,onClickCapture:!0,onDoubleClickCapture:!0,onMouseDownCapture:!0,onMouseMoveCapture:!0,onMouseUpCapture:!0},r={getNativeProps:function(e,t){if(!t.disabled)return t;var n={};for(var r in t)!a[r]&&t.hasOwnProperty(r)&&(n[r]=t[r]);return n}};t.exports=r},{}],31:[function(e,t,n){"use strict";var a=e("./EventConstants"),r=e("./EventPropagators"),o=e("./ReactDOMComponentTree"),i=e("./SyntheticMouseEvent"),s=e("fbjs/lib/keyOf"),l=a.topLevelTypes,u={mouseEnter:{registrationName:s({onMouseEnter:null}),dependencies:[l.topMouseOut,l.topMouseOver]},mouseLeave:{registrationName:s({onMouseLeave:null}),dependencies:[l.topMouseOut,l.topMouseOver]}},c={eventTypes:u,extractEvents:function(e,t,n,a){if(e===l.topMouseOver&&(n.relatedTarget||n.fromElement))return null;if(e!==l.topMouseOut&&e!==l.topMouseOver)return null;var s;if(a.window===a)s=a;else{var c=a.ownerDocument;s=c?c.defaultView||c.parentWindow:window}var d,p;if(e===l.topMouseOut){d=t;var f=n.relatedTarget||n.toElement;p=f?o.getClosestInstanceFromNode(f):null}else d=null,p=t;if(d===p)return null;var m=null==d?s:o.getNodeFromInstance(d),h=null==p?s:o.getNodeFromInstance(p),v=i.getPooled(u.mouseLeave,d,n,a);v.type="mouseleave",v.target=m,v.relatedTarget=h;var g=i.getPooled(u.mouseEnter,p,n,a);return g.type="mouseenter",g.target=h,g.relatedTarget=m,r.accumulateEnterLeaveDispatches(v,g,d,p),[v,g]}};t.exports=c},{"./EventConstants":32,"./EventPropagators":36,"./ReactDOMComponentTree":57,"./SyntheticMouseEvent":118,"fbjs/lib/keyOf":173}],32:[function(e,t,n){"use strict";var a=e("fbjs/lib/keyMirror"),r=a({bubbled:null,captured:null}),o=a({topAbort:null,topAnimationEnd:null,topAnimationIteration:null,topAnimationStart:null,topBlur:null,topCanPlay:null,topCanPlayThrough:null,topChange:null,topClick:null,topCompositionEnd:null,topCompositionStart:null,topCompositionUpdate:null,topContextMenu:null,topCopy:null,topCut:null,topDoubleClick:null,topDrag:null,topDragEnd:null,topDragEnter:null,topDragExit:null,topDragLeave:null,topDragOver:null,topDragStart:null,topDrop:null,topDurationChange:null,topEmptied:null,topEncrypted:null,topEnded:null,topError:null,topFocus:null,topInput:null,topInvalid:null,topKeyDown:null,topKeyPress:null,topKeyUp:null,topLoad:null,topLoadedData:null,topLoadedMetadata:null,topLoadStart:null,topMouseDown:null,topMouseMove:null,topMouseOut:null,topMouseOver:null,topMouseUp:null,topPaste:null,topPause:null,topPlay:null,topPlaying:null,topProgress:null,topRateChange:null,topReset:null,topScroll:null,topSeeked:null,topSeeking:null,topSelectionChange:null,topStalled:null,topSubmit:null,topSuspend:null,topTextInput:null,topTimeUpdate:null,topTouchCancel:null,topTouchEnd:null,topTouchMove:null,topTouchStart:null,topTransitionEnd:null,topVolumeChange:null,topWaiting:null,topWheel:null}),i={topLevelTypes:o,PropagationPhases:r};t.exports=i},{"fbjs/lib/keyMirror":172}],33:[function(e,t,n){"use strict";var a=e("./EventPluginRegistry"),r=e("./EventPluginUtils"),o=e("./ReactErrorUtils"),i=e("./accumulateInto"),s=e("./forEachAccumulated"),l=e("fbjs/lib/invariant"),u={},c=null,d=function(e,t){e&&(r.executeDispatchesInOrder(e,t),e.isPersistent()||e.constructor.release(e))},p=function(e){return d(e,!0)},f=function(e){return d(e,!1)},m={injection:{injectEventPluginOrder:a.injectEventPluginOrder,injectEventPluginsByName:a.injectEventPluginsByName},putListener:function(e,t,n){"function"!=typeof n?l(!1):void 0;var r=u[t]||(u[t]={});r[e._rootNodeID]=n;var o=a.registrationNameModules[t];o&&o.didPutListener&&o.didPutListener(e,t,n)},getListener:function(e,t){var n=u[t];return n&&n[e._rootNodeID]},deleteListener:function(e,t){var n=a.registrationNameModules[t];n&&n.willDeleteListener&&n.willDeleteListener(e,t);var r=u[t];r&&delete r[e._rootNodeID]},deleteAllListeners:function(e){for(var t in u)if(u[t][e._rootNodeID]){var n=a.registrationNameModules[t];n&&n.willDeleteListener&&n.willDeleteListener(e,t),delete u[t][e._rootNodeID]}},extractEvents:function(e,t,n,r){for(var o,s=a.plugins,l=0;l<s.length;l++){var u=s[l];if(u){var c=u.extractEvents(e,t,n,r);c&&(o=i(o,c))}}return o},enqueueEvents:function(e){e&&(c=i(c,e))},processEventQueue:function(e){var t=c;c=null,e?s(t,p):s(t,f),c?l(!1):void 0,o.rethrowCaughtError()},__purge:function(){u={}},__getListenerBank:function(){return u}};t.exports=m},{"./EventPluginRegistry":34,"./EventPluginUtils":35,"./ReactErrorUtils":79,"./accumulateInto":125,"./forEachAccumulated":133,"fbjs/lib/invariant":169}],34:[function(e,t,n){"use strict";function a(){if(s)for(var e in l){var t=l[e],n=s.indexOf(e);if(n>-1?void 0:i(!1),!u.plugins[n]){t.extractEvents?void 0:i(!1),u.plugins[n]=t;var a=t.eventTypes;for(var o in a)r(a[o],t,o)?void 0:i(!1)}}}function r(e,t,n){u.eventNameDispatchConfigs.hasOwnProperty(n)?i(!1):void 0,u.eventNameDispatchConfigs[n]=e;var a=e.phasedRegistrationNames;if(a){for(var r in a)if(a.hasOwnProperty(r)){var s=a[r];o(s,t,n)}return!0}return e.registrationName?(o(e.registrationName,t,n),!0):!1}function o(e,t,n){u.registrationNameModules[e]?i(!1):void 0,u.registrationNameModules[e]=t,u.registrationNameDependencies[e]=t.eventTypes[n].dependencies}var i=e("fbjs/lib/invariant"),s=null,l={},u={plugins:[],eventNameDispatchConfigs:{},registrationNameModules:{},registrationNameDependencies:{},possibleRegistrationNames:null,injectEventPluginOrder:function(e){s?i(!1):void 0,s=Array.prototype.slice.call(e),a()},injectEventPluginsByName:function(e){var t=!1;for(var n in e)if(e.hasOwnProperty(n)){var r=e[n];l.hasOwnProperty(n)&&l[n]===r||(l[n]?i(!1):void 0,l[n]=r,t=!0)}t&&a()},getPluginModuleForEvent:function(e){var t=e.dispatchConfig;if(t.registrationName)return u.registrationNameModules[t.registrationName]||null;for(var n in t.phasedRegistrationNames)if(t.phasedRegistrationNames.hasOwnProperty(n)){var a=u.registrationNameModules[t.phasedRegistrationNames[n]];if(a)return a}return null},_resetEventPlugins:function(){s=null;for(var e in l)l.hasOwnProperty(e)&&delete l[e];u.plugins.length=0;var t=u.eventNameDispatchConfigs;for(var n in t)t.hasOwnProperty(n)&&delete t[n];var a=u.registrationNameModules;for(var r in a)a.hasOwnProperty(r)&&delete a[r]}};t.exports=u},{"fbjs/lib/invariant":169}],35:[function(e,t,n){"use strict";function a(e){return e===y.topMouseUp||e===y.topTouchEnd||e===y.topTouchCancel}function r(e){return e===y.topMouseMove||e===y.topTouchMove}function o(e){return e===y.topMouseDown||e===y.topTouchStart}function i(e,t,n,a){var r=e.type||"unknown-event";e.currentTarget=b.getNodeFromInstance(a),t?h.invokeGuardedCallbackWithCatch(r,n,e):h.invokeGuardedCallback(r,n,e),e.currentTarget=null}function s(e,t){var n=e._dispatchListeners,a=e._dispatchInstances;if(Array.isArray(n))for(var r=0;r<n.length&&!e.isPropagationStopped();r++)i(e,t,n[r],a[r]);else n&&i(e,t,n,a);e._dispatchListeners=null,e._dispatchInstances=null}function l(e){var t=e._dispatchListeners,n=e._dispatchInstances;if(Array.isArray(t)){for(var a=0;a<t.length&&!e.isPropagationStopped();a++)if(t[a](e,n[a]))return n[a]}else if(t&&t(e,n))return n;return null}function u(e){var t=l(e);return e._dispatchInstances=null,e._dispatchListeners=null,t}function c(e){var t=e._dispatchListeners,n=e._dispatchInstances;Array.isArray(t)?v(!1):void 0,e.currentTarget=t?b.getNodeFromInstance(n):null;var a=t?t(e):null;return e.currentTarget=null,e._dispatchListeners=null,e._dispatchInstances=null,a}function d(e){return!!e._dispatchListeners}var p,f,m=e("./EventConstants"),h=e("./ReactErrorUtils"),v=e("fbjs/lib/invariant"),g=(e("fbjs/lib/warning"),{injectComponentTree:function(e){p=e},injectTreeTraversal:function(e){f=e}}),y=m.topLevelTypes,b={isEndish:a,isMoveish:r,isStartish:o,executeDirectDispatch:c,executeDispatchesInOrder:s,executeDispatchesInOrderStopAtTrue:u,hasDispatches:d,getInstanceFromNode:function(e){return p.getInstanceFromNode(e)},getNodeFromInstance:function(e){return p.getNodeFromInstance(e)},isAncestor:function(e,t){return f.isAncestor(e,t)},getLowestCommonAncestor:function(e,t){return f.getLowestCommonAncestor(e,t)},getParentInstance:function(e){return f.getParentInstance(e)},traverseTwoPhase:function(e,t,n){return f.traverseTwoPhase(e,t,n)},traverseEnterLeave:function(e,t,n,a,r){return f.traverseEnterLeave(e,t,n,a,r)},injection:g};t.exports=b},{"./EventConstants":32,"./ReactErrorUtils":79,"fbjs/lib/invariant":169,"fbjs/lib/warning":179}],36:[function(e,t,n){"use strict";function a(e,t,n){var a=t.dispatchConfig.phasedRegistrationNames[n];return b(e,a)}function r(e,t,n){var r=t?y.bubbled:y.captured,o=a(e,n,r);o&&(n._dispatchListeners=v(n._dispatchListeners,o),
n._dispatchInstances=v(n._dispatchInstances,e))}function o(e){e&&e.dispatchConfig.phasedRegistrationNames&&h.traverseTwoPhase(e._targetInst,r,e)}function i(e){if(e&&e.dispatchConfig.phasedRegistrationNames){var t=e._targetInst,n=t?h.getParentInstance(t):null;h.traverseTwoPhase(n,r,e)}}function s(e,t,n){if(n&&n.dispatchConfig.registrationName){var a=n.dispatchConfig.registrationName,r=b(e,a);r&&(n._dispatchListeners=v(n._dispatchListeners,r),n._dispatchInstances=v(n._dispatchInstances,e))}}function l(e){e&&e.dispatchConfig.registrationName&&s(e._targetInst,null,e)}function u(e){g(e,o)}function c(e){g(e,i)}function d(e,t,n,a){h.traverseEnterLeave(n,a,s,e,t)}function p(e){g(e,l)}var f=e("./EventConstants"),m=e("./EventPluginHub"),h=e("./EventPluginUtils"),v=e("./accumulateInto"),g=e("./forEachAccumulated"),y=(e("fbjs/lib/warning"),f.PropagationPhases),b=m.getListener,E={accumulateTwoPhaseDispatches:u,accumulateTwoPhaseDispatchesSkipTarget:c,accumulateDirectDispatches:p,accumulateEnterLeaveDispatches:d};t.exports=E},{"./EventConstants":32,"./EventPluginHub":33,"./EventPluginUtils":35,"./accumulateInto":125,"./forEachAccumulated":133,"fbjs/lib/warning":179}],37:[function(e,t,n){"use strict";function a(e){this._root=e,this._startText=this.getText(),this._fallbackText=null}var r=e("object-assign"),o=e("./PooledClass"),i=e("./getTextContentAccessor");r(a.prototype,{destructor:function(){this._root=null,this._startText=null,this._fallbackText=null},getText:function(){return"value"in this._root?this._root.value:this._root[i()]},getData:function(){if(this._fallbackText)return this._fallbackText;var e,t,n=this._startText,a=n.length,r=this.getText(),o=r.length;for(e=0;a>e&&n[e]===r[e];e++);var i=a-e;for(t=1;i>=t&&n[a-t]===r[o-t];t++);var s=t>1?1-t:void 0;return this._fallbackText=r.slice(e,s),this._fallbackText}}),o.addPoolingTo(a),t.exports=a},{"./PooledClass":41,"./getTextContentAccessor":141,"object-assign":180}],38:[function(e,t,n){"use strict";var a=e("./DOMProperty"),r=a.injection.MUST_USE_PROPERTY,o=a.injection.HAS_BOOLEAN_VALUE,i=a.injection.HAS_SIDE_EFFECTS,s=a.injection.HAS_NUMERIC_VALUE,l=a.injection.HAS_POSITIVE_NUMERIC_VALUE,u=a.injection.HAS_OVERLOADED_BOOLEAN_VALUE,c={isCustomAttribute:RegExp.prototype.test.bind(new RegExp("^(data|aria)-["+a.ATTRIBUTE_NAME_CHAR+"]*$")),Properties:{accept:0,acceptCharset:0,accessKey:0,action:0,allowFullScreen:o,allowTransparency:0,alt:0,async:o,autoComplete:0,autoPlay:o,capture:o,cellPadding:0,cellSpacing:0,charSet:0,challenge:0,checked:r|o,cite:0,classID:0,className:0,cols:l,colSpan:0,content:0,contentEditable:0,contextMenu:0,controls:o,coords:0,crossOrigin:0,data:0,dateTime:0,default:o,defer:o,dir:0,disabled:o,download:u,draggable:0,encType:0,form:0,formAction:0,formEncType:0,formMethod:0,formNoValidate:o,formTarget:0,frameBorder:0,headers:0,height:0,hidden:o,high:0,href:0,hrefLang:0,htmlFor:0,httpEquiv:0,icon:0,id:0,inputMode:0,integrity:0,is:0,keyParams:0,keyType:0,kind:0,label:0,lang:0,list:0,loop:o,low:0,manifest:0,marginHeight:0,marginWidth:0,max:0,maxLength:0,media:0,mediaGroup:0,method:0,min:0,minLength:0,multiple:r|o,muted:r|o,name:0,nonce:0,noValidate:o,open:o,optimum:0,pattern:0,placeholder:0,poster:0,preload:0,profile:0,radioGroup:0,readOnly:o,rel:0,required:o,reversed:o,role:0,rows:l,rowSpan:s,sandbox:0,scope:0,scoped:o,scrolling:0,seamless:o,selected:r|o,shape:0,size:l,sizes:0,span:l,spellCheck:0,src:0,srcDoc:0,srcLang:0,srcSet:0,start:s,step:0,style:0,summary:0,tabIndex:0,target:0,title:0,type:0,useMap:0,value:r|i,width:0,wmode:0,wrap:0,about:0,datatype:0,inlist:0,prefix:0,property:0,resource:0,typeof:0,vocab:0,autoCapitalize:0,autoCorrect:0,autoSave:0,color:0,itemProp:0,itemScope:o,itemType:0,itemID:0,itemRef:0,results:0,security:0,unselectable:0},DOMAttributeNames:{acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv"},DOMPropertyNames:{}};t.exports=c},{"./DOMProperty":26}],39:[function(e,t,n){"use strict";function a(e){var t=/[=:]/g,n={"=":"=0",":":"=2"},a=(""+e).replace(t,function(e){return n[e]});return"$"+a}function r(e){var t=/(=0|=2)/g,n={"=0":"=","=2":":"},a="."===e[0]&&"$"===e[1]?e.substring(2):e.substring(1);return(""+a).replace(t,function(e){return n[e]})}var o={escape:a,unescape:r};t.exports=o},{}],40:[function(e,t,n){"use strict";function a(e){null!=e.checkedLink&&null!=e.valueLink?u(!1):void 0}function r(e){a(e),null!=e.value||null!=e.onChange?u(!1):void 0}function o(e){a(e),null!=e.checked||null!=e.onChange?u(!1):void 0}function i(e){if(e){var t=e.getName();if(t)return" Check the render method of `"+t+"`."}return""}var s=e("./ReactPropTypes"),l=e("./ReactPropTypeLocations"),u=e("fbjs/lib/invariant"),c=(e("fbjs/lib/warning"),{button:!0,checkbox:!0,image:!0,hidden:!0,radio:!0,reset:!0,submit:!0}),d={value:function(e,t,n){return!e[t]||c[e.type]||e.onChange||e.readOnly||e.disabled?null:new Error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.")},checked:function(e,t,n){return!e[t]||e.onChange||e.readOnly||e.disabled?null:new Error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.")},onChange:s.func},p={},f={checkPropTypes:function(e,t,n){for(var a in d){if(d.hasOwnProperty(a))var r=d[a](t,a,e,l.prop);if(r instanceof Error&&!(r.message in p)){p[r.message]=!0;i(n)}}},getValue:function(e){return e.valueLink?(r(e),e.valueLink.value):e.value},getChecked:function(e){return e.checkedLink?(o(e),e.checkedLink.value):e.checked},executeOnChange:function(e,t){return e.valueLink?(r(e),e.valueLink.requestChange(t.target.value)):e.checkedLink?(o(e),e.checkedLink.requestChange(t.target.checked)):e.onChange?e.onChange.call(void 0,t):void 0}};t.exports=f},{"./ReactPropTypeLocations":98,"./ReactPropTypes":99,"fbjs/lib/invariant":169,"fbjs/lib/warning":179}],41:[function(e,t,n){"use strict";var a=e("fbjs/lib/invariant"),r=function(e){var t=this;if(t.instancePool.length){var n=t.instancePool.pop();return t.call(n,e),n}return new t(e)},o=function(e,t){var n=this;if(n.instancePool.length){var a=n.instancePool.pop();return n.call(a,e,t),a}return new n(e,t)},i=function(e,t,n){var a=this;if(a.instancePool.length){var r=a.instancePool.pop();return a.call(r,e,t,n),r}return new a(e,t,n)},s=function(e,t,n,a){var r=this;if(r.instancePool.length){var o=r.instancePool.pop();return r.call(o,e,t,n,a),o}return new r(e,t,n,a)},l=function(e,t,n,a,r){var o=this;if(o.instancePool.length){var i=o.instancePool.pop();return o.call(i,e,t,n,a,r),i}return new o(e,t,n,a,r)},u=function(e){var t=this;e instanceof t?void 0:a(!1),e.destructor(),t.instancePool.length<t.poolSize&&t.instancePool.push(e)},c=10,d=r,p=function(e,t){var n=e;return n.instancePool=[],n.getPooled=t||d,n.poolSize||(n.poolSize=c),n.release=u,n},f={addPoolingTo:p,oneArgumentPooler:r,twoArgumentPooler:o,threeArgumentPooler:i,fourArgumentPooler:s,fiveArgumentPooler:l};t.exports=f},{"fbjs/lib/invariant":169}],42:[function(e,t,n){"use strict";var a=e("object-assign"),r=e("./ReactChildren"),o=e("./ReactComponent"),i=e("./ReactClass"),s=e("./ReactDOMFactories"),l=e("./ReactElement"),u=(e("./ReactElementValidator"),e("./ReactPropTypes")),c=e("./ReactVersion"),d=e("./onlyChild"),p=(e("fbjs/lib/warning"),l.createElement),f=l.createFactory,m=l.cloneElement,h=a,v={Children:{map:r.map,forEach:r.forEach,count:r.count,toArray:r.toArray,only:d},Component:o,createElement:p,cloneElement:m,isValidElement:l.isValidElement,PropTypes:u,createClass:i.createClass,createFactory:f,createMixin:function(e){return e},DOM:s,version:c,__spread:h};t.exports=v},{"./ReactChildren":45,"./ReactClass":46,"./ReactComponent":47,"./ReactDOMFactories":61,"./ReactElement":76,"./ReactElementValidator":77,"./ReactPropTypes":99,"./ReactVersion":106,"./onlyChild":146,"fbjs/lib/warning":179,"object-assign":180}],43:[function(e,t,n){"use strict";function a(e){return Object.prototype.hasOwnProperty.call(e,v)||(e[v]=m++,p[e[v]]={}),p[e[v]]}var r,o=e("object-assign"),i=e("./EventConstants"),s=e("./EventPluginRegistry"),l=e("./ReactEventEmitterMixin"),u=e("./ViewportMetrics"),c=e("./getVendorPrefixedEventName"),d=e("./isEventSupported"),p={},f=!1,m=0,h={topAbort:"abort",topAnimationEnd:c("animationend")||"animationend",topAnimationIteration:c("animationiteration")||"animationiteration",topAnimationStart:c("animationstart")||"animationstart",topBlur:"blur",topCanPlay:"canplay",topCanPlayThrough:"canplaythrough",topChange:"change",topClick:"click",topCompositionEnd:"compositionend",topCompositionStart:"compositionstart",topCompositionUpdate:"compositionupdate",topContextMenu:"contextmenu",topCopy:"copy",topCut:"cut",topDoubleClick:"dblclick",topDrag:"drag",topDragEnd:"dragend",topDragEnter:"dragenter",topDragExit:"dragexit",topDragLeave:"dragleave",topDragOver:"dragover",topDragStart:"dragstart",topDrop:"drop",topDurationChange:"durationchange",topEmptied:"emptied",topEncrypted:"encrypted",topEnded:"ended",topError:"error",topFocus:"focus",topInput:"input",topKeyDown:"keydown",topKeyPress:"keypress",topKeyUp:"keyup",topLoadedData:"loadeddata",topLoadedMetadata:"loadedmetadata",topLoadStart:"loadstart",topMouseDown:"mousedown",topMouseMove:"mousemove",topMouseOut:"mouseout",topMouseOver:"mouseover",topMouseUp:"mouseup",topPaste:"paste",topPause:"pause",topPlay:"play",topPlaying:"playing",topProgress:"progress",topRateChange:"ratechange",topScroll:"scroll",topSeeked:"seeked",topSeeking:"seeking",topSelectionChange:"selectionchange",topStalled:"stalled",topSuspend:"suspend",topTextInput:"textInput",topTimeUpdate:"timeupdate",topTouchCancel:"touchcancel",topTouchEnd:"touchend",topTouchMove:"touchmove",topTouchStart:"touchstart",topTransitionEnd:c("transitionend")||"transitionend",topVolumeChange:"volumechange",topWaiting:"waiting",topWheel:"wheel"},v="_reactListenersID"+String(Math.random()).slice(2),g=o({},l,{ReactEventListener:null,injection:{injectReactEventListener:function(e){e.setHandleTopLevel(g.handleTopLevel),g.ReactEventListener=e}},setEnabled:function(e){g.ReactEventListener&&g.ReactEventListener.setEnabled(e)},isEnabled:function(){return!(!g.ReactEventListener||!g.ReactEventListener.isEnabled())},listenTo:function(e,t){for(var n=t,r=a(n),o=s.registrationNameDependencies[e],l=i.topLevelTypes,u=0;u<o.length;u++){var c=o[u];r.hasOwnProperty(c)&&r[c]||(c===l.topWheel?d("wheel")?g.ReactEventListener.trapBubbledEvent(l.topWheel,"wheel",n):d("mousewheel")?g.ReactEventListener.trapBubbledEvent(l.topWheel,"mousewheel",n):g.ReactEventListener.trapBubbledEvent(l.topWheel,"DOMMouseScroll",n):c===l.topScroll?d("scroll",!0)?g.ReactEventListener.trapCapturedEvent(l.topScroll,"scroll",n):g.ReactEventListener.trapBubbledEvent(l.topScroll,"scroll",g.ReactEventListener.WINDOW_HANDLE):c===l.topFocus||c===l.topBlur?(d("focus",!0)?(g.ReactEventListener.trapCapturedEvent(l.topFocus,"focus",n),g.ReactEventListener.trapCapturedEvent(l.topBlur,"blur",n)):d("focusin")&&(g.ReactEventListener.trapBubbledEvent(l.topFocus,"focusin",n),g.ReactEventListener.trapBubbledEvent(l.topBlur,"focusout",n)),r[l.topBlur]=!0,r[l.topFocus]=!0):h.hasOwnProperty(c)&&g.ReactEventListener.trapBubbledEvent(c,h[c],n),r[c]=!0)}},trapBubbledEvent:function(e,t,n){return g.ReactEventListener.trapBubbledEvent(e,t,n)},trapCapturedEvent:function(e,t,n){return g.ReactEventListener.trapCapturedEvent(e,t,n)},ensureScrollValueMonitoring:function(){if(void 0===r&&(r=document.createEvent&&"pageX"in document.createEvent("MouseEvent")),!r&&!f){var e=u.refreshScrollValues;g.ReactEventListener.monitorScrollValue(e),f=!0}}});t.exports=g},{"./EventConstants":32,"./EventPluginRegistry":34,"./ReactEventEmitterMixin":80,"./ViewportMetrics":124,"./getVendorPrefixedEventName":142,"./isEventSupported":144,"object-assign":180}],44:[function(e,t,n){"use strict";function a(e,t,n){var a=void 0===e[n];null!=t&&a&&(e[n]=o(t))}var r=e("./ReactReconciler"),o=e("./instantiateReactComponent"),i=(e("./KeyEscapeUtils"),e("./shouldUpdateReactComponent")),s=e("./traverseAllChildren"),l=(e("fbjs/lib/warning"),{instantiateChildren:function(e,t,n){if(null==e)return null;var r={};return s(e,a,r),r},updateChildren:function(e,t,n,a,s){if(t||e){var l,u;for(l in t)if(t.hasOwnProperty(l)){u=e&&e[l];var c=u&&u._currentElement,d=t[l];if(null!=u&&i(c,d))r.receiveComponent(u,d,a,s),t[l]=u;else{u&&(n[l]=r.getNativeNode(u),r.unmountComponent(u,!1));var p=o(d);t[l]=p}}for(l in e)!e.hasOwnProperty(l)||t&&t.hasOwnProperty(l)||(u=e[l],n[l]=r.getNativeNode(u),r.unmountComponent(u,!1))}},unmountChildren:function(e,t){for(var n in e)if(e.hasOwnProperty(n)){var a=e[n];r.unmountComponent(a,t)}}});t.exports=l},{"./KeyEscapeUtils":39,"./ReactReconciler":101,"./instantiateReactComponent":143,"./shouldUpdateReactComponent":151,"./traverseAllChildren":152,"fbjs/lib/warning":179}],45:[function(e,t,n){"use strict";function a(e){return(""+e).replace(E,"$&/")}function r(e,t){this.func=e,this.context=t,this.count=0}function o(e,t,n){var a=e.func,r=e.context;a.call(r,t,e.count++)}function i(e,t,n){if(null==e)return e;var a=r.getPooled(t,n);g(e,o,a),r.release(a)}function s(e,t,n,a){this.result=e,this.keyPrefix=t,this.func=n,this.context=a,this.count=0}function l(e,t,n){var r=e.result,o=e.keyPrefix,i=e.func,s=e.context,l=i.call(s,t,e.count++);Array.isArray(l)?u(l,r,n,v.thatReturnsArgument):null!=l&&(h.isValidElement(l)&&(l=h.cloneAndReplaceKey(l,o+(!l.key||t&&t.key===l.key?"":a(l.key)+"/")+n)),r.push(l))}function u(e,t,n,r,o){var i="";null!=n&&(i=a(n)+"/");var u=s.getPooled(t,i,r,o);g(e,l,u),s.release(u)}function c(e,t,n){if(null==e)return e;var a=[];return u(e,a,null,t,n),a}function d(e,t,n){return null}function p(e,t){return g(e,d,null)}function f(e){var t=[];return u(e,t,null,v.thatReturnsArgument),t}var m=e("./PooledClass"),h=e("./ReactElement"),v=e("fbjs/lib/emptyFunction"),g=e("./traverseAllChildren"),y=m.twoArgumentPooler,b=m.fourArgumentPooler,E=/\/+/g;r.prototype.destructor=function(){this.func=null,this.context=null,this.count=0},m.addPoolingTo(r,y),s.prototype.destructor=function(){this.result=null,this.keyPrefix=null,this.func=null,this.context=null,this.count=0},m.addPoolingTo(s,b);var _={forEach:i,map:c,mapIntoWithKeyPrefixInternal:u,count:p,toArray:f};t.exports=_},{"./PooledClass":41,"./ReactElement":76,"./traverseAllChildren":152,"fbjs/lib/emptyFunction":161}],46:[function(e,t,n){"use strict";function a(e,t){var n=C.hasOwnProperty(t)?C[t]:null;T.hasOwnProperty(t)&&(n!==E.OVERRIDE_BASE?v(!1):void 0),e&&(n!==E.DEFINE_MANY&&n!==E.DEFINE_MANY_MERGED?v(!1):void 0)}function r(e,t){if(t){"function"==typeof t?v(!1):void 0,f.isValidElement(t)?v(!1):void 0;var n=e.prototype,r=n.__reactAutoBindPairs;t.hasOwnProperty(b)&&k.mixins(e,t.mixins);for(var o in t)if(t.hasOwnProperty(o)&&o!==b){var i=t[o],u=n.hasOwnProperty(o);if(a(u,o),k.hasOwnProperty(o))k[o](e,i);else{var c=C.hasOwnProperty(o),d="function"==typeof i,p=d&&!c&&!u&&t.autobind!==!1;if(p)r.push(o,i),n[o]=i;else if(u){var m=C[o];!c||m!==E.DEFINE_MANY_MERGED&&m!==E.DEFINE_MANY?v(!1):void 0,m===E.DEFINE_MANY_MERGED?n[o]=s(n[o],i):m===E.DEFINE_MANY&&(n[o]=l(n[o],i))}else n[o]=i}}}}function o(e,t){if(t)for(var n in t){var a=t[n];if(t.hasOwnProperty(n)){var r=n in k;r?v(!1):void 0;var o=n in e;o?v(!1):void 0,e[n]=a}}}function i(e,t){e&&t&&"object"==typeof e&&"object"==typeof t?void 0:v(!1);for(var n in t)t.hasOwnProperty(n)&&(void 0!==e[n]?v(!1):void 0,e[n]=t[n]);return e}function s(e,t){return function(){var n=e.apply(this,arguments),a=t.apply(this,arguments);if(null==n)return a;if(null==a)return n;var r={};return i(r,n),i(r,a),r}}function l(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}function u(e,t){var n=t.bind(e);return n}function c(e){for(var t=e.__reactAutoBindPairs,n=0;n<t.length;n+=2){var a=t[n],r=t[n+1];e[a]=u(e,r)}}var d=e("object-assign"),p=e("./ReactComponent"),f=e("./ReactElement"),m=(e("./ReactPropTypeLocations"),e("./ReactPropTypeLocationNames"),e("./ReactNoopUpdateQueue")),h=e("fbjs/lib/emptyObject"),v=e("fbjs/lib/invariant"),g=e("fbjs/lib/keyMirror"),y=e("fbjs/lib/keyOf"),b=(e("fbjs/lib/warning"),y({mixins:null})),E=g({DEFINE_ONCE:null,DEFINE_MANY:null,OVERRIDE_BASE:null,DEFINE_MANY_MERGED:null}),_=[],C={mixins:E.DEFINE_MANY,statics:E.DEFINE_MANY,propTypes:E.DEFINE_MANY,contextTypes:E.DEFINE_MANY,childContextTypes:E.DEFINE_MANY,getDefaultProps:E.DEFINE_MANY_MERGED,getInitialState:E.DEFINE_MANY_MERGED,getChildContext:E.DEFINE_MANY_MERGED,render:E.DEFINE_ONCE,componentWillMount:E.DEFINE_MANY,componentDidMount:E.DEFINE_MANY,componentWillReceiveProps:E.DEFINE_MANY,shouldComponentUpdate:E.DEFINE_ONCE,componentWillUpdate:E.DEFINE_MANY,componentDidUpdate:E.DEFINE_MANY,componentWillUnmount:E.DEFINE_MANY,updateComponent:E.OVERRIDE_BASE},k={displayName:function(e,t){e.displayName=t},mixins:function(e,t){if(t)for(var n=0;n<t.length;n++)r(e,t[n])},childContextTypes:function(e,t){e.childContextTypes=d({},e.childContextTypes,t)},contextTypes:function(e,t){e.contextTypes=d({},e.contextTypes,t)},getDefaultProps:function(e,t){e.getDefaultProps?e.getDefaultProps=s(e.getDefaultProps,t):e.getDefaultProps=t},propTypes:function(e,t){e.propTypes=d({},e.propTypes,t)},statics:function(e,t){o(e,t)},autobind:function(){}},T={replaceState:function(e,t){this.updater.enqueueReplaceState(this,e),t&&this.updater.enqueueCallback(this,t,"replaceState")},isMounted:function(){return this.updater.isMounted(this)}},N=function(){};d(N.prototype,p.prototype,T);var P={createClass:function(e){var t=function(e,t,n){this.__reactAutoBindPairs.length&&c(this),this.props=e,this.context=t,this.refs=h,this.updater=n||m,this.state=null;var a=this.getInitialState?this.getInitialState():null;"object"!=typeof a||Array.isArray(a)?v(!1):void 0,this.state=a};t.prototype=new N,t.prototype.constructor=t,t.prototype.__reactAutoBindPairs=[],_.forEach(r.bind(null,t)),r(t,e),t.getDefaultProps&&(t.defaultProps=t.getDefaultProps()),t.prototype.render?void 0:v(!1);for(var n in C)t.prototype[n]||(t.prototype[n]=null);return t},injection:{injectMixin:function(e){_.push(e)}}};t.exports=P},{"./ReactComponent":47,"./ReactElement":76,"./ReactNoopUpdateQueue":95,"./ReactPropTypeLocationNames":97,"./ReactPropTypeLocations":98,"fbjs/lib/emptyObject":162,"fbjs/lib/invariant":169,"fbjs/lib/keyMirror":172,"fbjs/lib/keyOf":173,"fbjs/lib/warning":179,"object-assign":180}],47:[function(e,t,n){"use strict";function a(e,t,n){this.props=e,this.context=t,this.refs=o,this.updater=n||r}var r=e("./ReactNoopUpdateQueue"),o=(e("./ReactInstrumentation"),e("./canDefineProperty"),e("fbjs/lib/emptyObject")),i=e("fbjs/lib/invariant");e("fbjs/lib/warning");a.prototype.isReactComponent={},a.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e?i(!1):void 0,this.updater.enqueueSetState(this,e),t&&this.updater.enqueueCallback(this,t,"setState")},a.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this),e&&this.updater.enqueueCallback(this,e,"forceUpdate")};t.exports=a},{"./ReactInstrumentation":86,"./ReactNoopUpdateQueue":95,"./canDefineProperty":127,"fbjs/lib/emptyObject":162,"fbjs/lib/invariant":169,"fbjs/lib/warning":179}],48:[function(e,t,n){"use strict";var a=e("./DOMChildrenOperations"),r=e("./ReactDOMIDOperations"),o={processChildrenUpdates:r.dangerouslyProcessChildrenUpdates,replaceNodeWithMarkup:a.dangerouslyReplaceNodeWithMarkup,unmountIDFromEnvironment:function(e){}};t.exports=o},{"./DOMChildrenOperations":23,"./ReactDOMIDOperations":63}],49:[function(e,t,n){"use strict";var a=e("fbjs/lib/invariant"),r=!1,o={unmountIDFromEnvironment:null,replaceNodeWithMarkup:null,processChildrenUpdates:null,injection:{injectEnvironment:function(e){r?a(!1):void 0,o.unmountIDFromEnvironment=e.unmountIDFromEnvironment,o.replaceNodeWithMarkup=e.replaceNodeWithMarkup,o.processChildrenUpdates=e.processChildrenUpdates,r=!0}}};t.exports=o},{"fbjs/lib/invariant":169}],50:[function(e,t,n){"use strict";function a(e,t){i[e]||(i[e]={parentID:null,ownerID:null,text:null,childIDs:[],displayName:"Unknown",isMounted:!1,updateCount:0}),t(i[e])}function r(e){var t=i[e];if(t){var n=t.childIDs;delete i[e],n.forEach(r)}}var o=e("fbjs/lib/invariant"),i={},s=[],l={onSetDisplayName:function(e,t){a(e,function(e){return e.displayName=t})},onSetChildren:function(e,t){a(e,function(n){var a=n.childIDs;n.childIDs=t,t.forEach(function(t){var n=i[t];n?void 0:o(!1),null==n.displayName?o(!1):void 0,null==n.childIDs&&null==n.text?o(!1):void 0,n.isMounted?void 0:o(!1),-1===a.indexOf(t)&&(n.parentID=e)})})},onSetOwner:function(e,t){a(e,function(e){return e.ownerID=t})},onSetText:function(e,t){a(e,function(e){return e.text=t})},onMountComponent:function(e){a(e,function(e){return e.isMounted=!0})},onMountRootComponent:function(e){s.push(e)},onUpdateComponent:function(e){a(e,function(e){return e.updateCount++})},onUnmountComponent:function(e){a(e,function(e){return e.isMounted=!1}),s=s.filter(function(t){return t!==e})},purgeUnmountedComponents:function(){l._preventPurging||Object.keys(i).filter(function(e){return!i[e].isMounted}).forEach(r)},isMounted:function(e){var t=i[e];return t?t.isMounted:!1},getChildIDs:function(e){var t=i[e];return t?t.childIDs:[]},getDisplayName:function(e){var t=i[e];return t?t.displayName:"Unknown"},getOwnerID:function(e){var t=i[e];return t?t.ownerID:null},getParentID:function(e){var t=i[e];return t?t.parentID:null},getText:function(e){var t=i[e];return t?t.text:null},getUpdateCount:function(e){var t=i[e];return t?t.updateCount:0},getRootIDs:function(){return s},getRegisteredIDs:function(){return Object.keys(i)}};t.exports=l},{"fbjs/lib/invariant":169}],51:[function(e,t,n){"use strict";function a(e){var t=e._currentElement._owner||null;if(t){var n=t.getName();if(n)return" Check the render method of `"+n+"`."}return""}function r(e){}function o(e,t){}function i(e){return e.prototype&&e.prototype.isReactComponent}var s=e("object-assign"),l=e("./ReactComponentEnvironment"),u=e("./ReactCurrentOwner"),c=e("./ReactElement"),d=e("./ReactErrorUtils"),p=e("./ReactInstanceMap"),f=(e("./ReactInstrumentation"),e("./ReactNodeTypes")),m=e("./ReactPropTypeLocations"),h=(e("./ReactPropTypeLocationNames"),e("./ReactReconciler")),v=e("./ReactUpdateQueue"),g=e("fbjs/lib/emptyObject"),y=e("fbjs/lib/invariant"),b=e("./shouldUpdateReactComponent");e("fbjs/lib/warning");r.prototype.render=function(){var e=p.get(this)._currentElement.type,t=e(this.props,this.context,this.updater);return o(e,t),t};var E=1,_={construct:function(e){this._currentElement=e,this._rootNodeID=null,this._instance=null,this._nativeParent=null,this._nativeContainerInfo=null,this._updateBatchNumber=null,this._pendingElement=null,this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1,this._renderedNodeType=null,this._renderedComponent=null,this._context=null,this._mountOrder=0,this._topLevelWrapper=null,this._pendingCallbacks=null,this._calledComponentWillUnmount=!1},mountComponent:function(e,t,n,a){this._context=a,this._mountOrder=E++,this._nativeParent=t,this._nativeContainerInfo=n;var s,l=this._processProps(this._currentElement.props),u=this._processContext(a),d=this._currentElement.type,f=this._constructComponent(l,u);i(d)||null!=f&&null!=f.render||(s=f,o(d,s),null===f||f===!1||c.isValidElement(f)?void 0:y(!1),f=new r(d));f.props=l,f.context=u,f.refs=g,f.updater=v,this._instance=f,p.set(f,this);var m=f.state;void 0===m&&(f.state=m=null),"object"!=typeof m||Array.isArray(m)?y(!1):void 0,this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1;var h;return h=f.unstable_handleError?this.performInitialMountWithErrorHandling(s,t,n,e,a):this.performInitialMount(s,t,n,e,a),f.componentDidMount&&e.getReactMountReady().enqueue(f.componentDidMount,f),h},_constructComponent:function(e,t){return this._constructComponentWithoutOwner(e,t)},_constructComponentWithoutOwner:function(e,t){var n,a=this._currentElement.type;return n=i(a)?new a(e,t,v):a(e,t,v)},performInitialMountWithErrorHandling:function(e,t,n,a,r){var o,i=a.checkpoint();try{o=this.performInitialMount(e,t,n,a,r)}catch(s){a.rollback(i),this._instance.unstable_handleError(s),this._pendingStateQueue&&(this._instance.state=this._processPendingState(this._instance.props,this._instance.context)),i=a.checkpoint(),this._renderedComponent.unmountComponent(!0),a.rollback(i),o=this.performInitialMount(e,t,n,a,r)}return o},performInitialMount:function(e,t,n,a,r){var o=this._instance;o.componentWillMount&&(o.componentWillMount(),this._pendingStateQueue&&(o.state=this._processPendingState(o.props,o.context))),void 0===e&&(e=this._renderValidatedComponent()),this._renderedNodeType=f.getType(e),this._renderedComponent=this._instantiateReactComponent(e);var i=h.mountComponent(this._renderedComponent,a,t,n,this._processChildContext(r));return i},getNativeNode:function(){return h.getNativeNode(this._renderedComponent)},unmountComponent:function(e){if(this._renderedComponent){var t=this._instance;if(t.componentWillUnmount&&!t._calledComponentWillUnmount)if(t._calledComponentWillUnmount=!0,e){var n=this.getName()+".componentWillUnmount()";d.invokeGuardedCallback(n,t.componentWillUnmount.bind(t))}else t.componentWillUnmount();this._renderedComponent&&(h.unmountComponent(this._renderedComponent,e),this._renderedNodeType=null,this._renderedComponent=null,this._instance=null),this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1,this._pendingCallbacks=null,this._pendingElement=null,this._context=null,this._rootNodeID=null,this._topLevelWrapper=null,p.remove(t)}},_maskContext:function(e){var t=this._currentElement.type,n=t.contextTypes;if(!n)return g;var a={};for(var r in n)a[r]=e[r];return a},_processContext:function(e){var t=this._maskContext(e);return t},_processChildContext:function(e){var t=this._currentElement.type,n=this._instance,a=n.getChildContext&&n.getChildContext();if(a){"object"!=typeof t.childContextTypes?y(!1):void 0;for(var r in a)r in t.childContextTypes?void 0:y(!1);return s({},e,a)}return e},_processProps:function(e){return e},_checkPropTypes:function(e,t,n){var r=this.getName();for(var o in e)if(e.hasOwnProperty(o)){var i;try{"function"!=typeof e[o]?y(!1):void 0,i=e[o](t,o,r,n)}catch(e){i=e}if(i instanceof Error){a(this);n===m.prop}}},receiveComponent:function(e,t,n){var a=this._currentElement,r=this._context;this._pendingElement=null,this.updateComponent(t,a,e,r,n)},performUpdateIfNecessary:function(e){null!=this._pendingElement?h.receiveComponent(this,this._pendingElement,e,this._context):null!==this._pendingStateQueue||this._pendingForceUpdate?this.updateComponent(e,this._currentElement,this._currentElement,this._context,this._context):this._updateBatchNumber=null},updateComponent:function(e,t,n,a,r){var o,i,s=this._instance,l=!1;this._context===r?o=s.context:(o=this._processContext(r),l=!0),t===n?i=n.props:(i=this._processProps(n.props),l=!0),l&&s.componentWillReceiveProps&&s.componentWillReceiveProps(i,o);var u=this._processPendingState(i,o),c=!0;!this._pendingForceUpdate&&s.shouldComponentUpdate&&(c=s.shouldComponentUpdate(i,u,o)),this._updateBatchNumber=null,c?(this._pendingForceUpdate=!1,this._performComponentUpdate(n,i,u,o,e,r)):(this._currentElement=n,this._context=r,s.props=i,s.state=u,s.context=o)},_processPendingState:function(e,t){var n=this._instance,a=this._pendingStateQueue,r=this._pendingReplaceState;if(this._pendingReplaceState=!1,this._pendingStateQueue=null,!a)return n.state;if(r&&1===a.length)return a[0];for(var o=s({},r?a[0]:n.state),i=r?1:0;i<a.length;i++){var l=a[i];s(o,"function"==typeof l?l.call(n,o,e,t):l)}return o},_performComponentUpdate:function(e,t,n,a,r,o){var i,s,l,u=this._instance,c=Boolean(u.componentDidUpdate);c&&(i=u.props,s=u.state,l=u.context),u.componentWillUpdate&&u.componentWillUpdate(t,n,a),this._currentElement=e,this._context=o,u.props=t,u.state=n,u.context=a,this._updateRenderedComponent(r,o),c&&r.getReactMountReady().enqueue(u.componentDidUpdate.bind(u,i,s,l),u)},_updateRenderedComponent:function(e,t){var n=this._renderedComponent,a=n._currentElement,r=this._renderValidatedComponent();if(b(a,r))h.receiveComponent(n,r,e,this._processChildContext(t));else{var o=h.getNativeNode(n);h.unmountComponent(n,!1),this._renderedNodeType=f.getType(r),this._renderedComponent=this._instantiateReactComponent(r);var i=h.mountComponent(this._renderedComponent,e,this._nativeParent,this._nativeContainerInfo,this._processChildContext(t));this._replaceNodeWithMarkup(o,i,n)}},_replaceNodeWithMarkup:function(e,t,n){l.replaceNodeWithMarkup(e,t,n)},_renderValidatedComponentWithoutOwnerOrContext:function(){var e=this._instance,t=e.render();return t},_renderValidatedComponent:function(){var e;u.current=this;try{e=this._renderValidatedComponentWithoutOwnerOrContext()}finally{u.current=null}return null===e||e===!1||c.isValidElement(e)?void 0:y(!1),e},attachRef:function(e,t){var n=this.getPublicInstance();null==n?y(!1):void 0;var a=t.getPublicInstance(),r=n.refs===g?n.refs={}:n.refs;r[e]=a},detachRef:function(e){var t=this.getPublicInstance().refs;delete t[e]},getName:function(){var e=this._currentElement.type,t=this._instance&&this._instance.constructor;return e.displayName||t&&t.displayName||e.name||t&&t.name||null},getPublicInstance:function(){var e=this._instance;return e instanceof r?null:e},_instantiateReactComponent:null},C={Mixin:_};t.exports=C},{"./ReactComponentEnvironment":49,"./ReactCurrentOwner":52,"./ReactElement":76,"./ReactErrorUtils":79,"./ReactInstanceMap":85,"./ReactInstrumentation":86,"./ReactNodeTypes":94,"./ReactPropTypeLocationNames":97,"./ReactPropTypeLocations":98,"./ReactReconciler":101,"./ReactUpdateQueue":104,"./shouldUpdateReactComponent":151,"fbjs/lib/emptyObject":162,"fbjs/lib/invariant":169,"fbjs/lib/warning":179,"object-assign":180}],52:[function(e,t,n){"use strict";var a={current:null};t.exports=a},{}],53:[function(e,t,n){"use strict";var a=e("./ReactDOMComponentTree"),r=e("./ReactDefaultInjection"),o=e("./ReactMount"),i=e("./ReactReconciler"),s=e("./ReactUpdates"),l=e("./ReactVersion"),u=e("./findDOMNode"),c=e("./getNativeComponentFromComposite"),d=e("./renderSubtreeIntoContainer");e("fbjs/lib/warning");r.inject();var p={findDOMNode:u,render:o.render,unmountComponentAtNode:o.unmountComponentAtNode,version:l,unstable_batchedUpdates:s.batchedUpdates,unstable_renderSubtreeIntoContainer:d};"undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject&&__REACT_DEVTOOLS_GLOBAL_HOOK__.inject({ComponentTree:{getClosestInstanceFromNode:a.getClosestInstanceFromNode,getNodeFromInstance:function(e){return e._renderedComponent&&(e=c(e)),e?a.getNodeFromInstance(e):null}},Mount:o,Reconciler:i});t.exports=p},{"./ReactDOMComponentTree":57,"./ReactDefaultInjection":75,"./ReactMount":89,"./ReactReconciler":101,"./ReactUpdates":105,"./ReactVersion":106,"./findDOMNode":131,"./getNativeComponentFromComposite":139,"./renderSubtreeIntoContainer":148,"fbjs/lib/ExecutionEnvironment":155,"fbjs/lib/warning":179}],54:[function(e,t,n){"use strict";var a=e("./DisabledInputUtils"),r={getNativeProps:a.getNativeProps};t.exports=r},{"./DisabledInputUtils":30}],55:[function(e,t,n){"use strict";function a(e,t){t&&(X[e._tag]&&(null!=t.children||null!=t.dangerouslySetInnerHTML?I(!1):void 0),null!=t.dangerouslySetInnerHTML&&(null!=t.children?I(!1):void 0,"object"==typeof t.dangerouslySetInnerHTML&&H in t.dangerouslySetInnerHTML?void 0:I(!1)),null!=t.style&&"object"!=typeof t.style?I(!1):void 0)}function r(e,t,n,a){if(!(a instanceof D)){var r=e._nativeContainerInfo,i=r._node&&r._node.nodeType===G,s=i?r._node:r._ownerDocument;F(t,s),a.getReactMountReady().enqueue(o,{inst:e,registrationName:t,listener:n})}}function o(){var e=this;E.putListener(e.inst,e.registrationName,e.listener)}function i(){var e=this;M.postMountWrapper(e)}function s(){var e=this;
e._rootNodeID?void 0:I(!1);var t=L(e);switch(t?void 0:I(!1),e._tag){case"iframe":case"object":e._wrapperState.listeners=[C.trapBubbledEvent(b.topLevelTypes.topLoad,"load",t)];break;case"video":case"audio":e._wrapperState.listeners=[];for(var n in K)K.hasOwnProperty(n)&&e._wrapperState.listeners.push(C.trapBubbledEvent(b.topLevelTypes[n],K[n],t));break;case"img":e._wrapperState.listeners=[C.trapBubbledEvent(b.topLevelTypes.topError,"error",t),C.trapBubbledEvent(b.topLevelTypes.topLoad,"load",t)];break;case"form":e._wrapperState.listeners=[C.trapBubbledEvent(b.topLevelTypes.topReset,"reset",t),C.trapBubbledEvent(b.topLevelTypes.topSubmit,"submit",t)];break;case"input":case"select":case"textarea":e._wrapperState.listeners=[C.trapBubbledEvent(b.topLevelTypes.topInvalid,"invalid",t)]}}function l(){S.postUpdateWrapper(this)}function u(e){$.call(Z,e)||(Q.test(e)?void 0:I(!1),Z[e]=!0)}function c(e,t){return e.indexOf("-")>=0||null!=t.is}function d(e){var t=e.type;u(t),this._currentElement=e,this._tag=t.toLowerCase(),this._namespaceURI=null,this._renderedChildren=null,this._previousStyle=null,this._previousStyleCopy=null,this._nativeNode=null,this._nativeParent=null,this._rootNodeID=null,this._domID=null,this._nativeContainerInfo=null,this._wrapperState=null,this._topLevelWrapper=null,this._flags=0}var p=e("object-assign"),f=e("./AutoFocusUtils"),m=e("./CSSPropertyOperations"),h=e("./DOMLazyTree"),v=e("./DOMNamespaces"),g=e("./DOMProperty"),y=e("./DOMPropertyOperations"),b=e("./EventConstants"),E=e("./EventPluginHub"),_=e("./EventPluginRegistry"),C=e("./ReactBrowserEventEmitter"),k=e("./ReactComponentBrowserEnvironment"),T=e("./ReactDOMButton"),N=e("./ReactDOMComponentFlags"),P=e("./ReactDOMComponentTree"),w=e("./ReactDOMInput"),M=e("./ReactDOMOption"),S=e("./ReactDOMSelect"),x=e("./ReactDOMTextarea"),R=(e("./ReactInstrumentation"),e("./ReactMultiChild")),D=e("./ReactServerRenderingTransaction"),O=(e("fbjs/lib/emptyFunction"),e("./escapeTextContentForBrowser")),I=e("fbjs/lib/invariant"),j=(e("./isEventSupported"),e("fbjs/lib/keyOf")),A=(e("fbjs/lib/shallowEqual"),e("./validateDOMNesting"),e("fbjs/lib/warning"),N),U=E.deleteListener,L=P.getNodeFromInstance,F=C.listenTo,V=_.registrationNameModules,Y={string:!0,number:!0},W=j({style:null}),H=j({__html:null}),B={children:null,dangerouslySetInnerHTML:null,suppressContentEditableWarning:null},G=11,K={topAbort:"abort",topCanPlay:"canplay",topCanPlayThrough:"canplaythrough",topDurationChange:"durationchange",topEmptied:"emptied",topEncrypted:"encrypted",topEnded:"ended",topError:"error",topLoadedData:"loadeddata",topLoadedMetadata:"loadedmetadata",topLoadStart:"loadstart",topPause:"pause",topPlay:"play",topPlaying:"playing",topProgress:"progress",topRateChange:"ratechange",topSeeked:"seeked",topSeeking:"seeking",topStalled:"stalled",topSuspend:"suspend",topTimeUpdate:"timeupdate",topVolumeChange:"volumechange",topWaiting:"waiting"},q={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},z={listing:!0,pre:!0,textarea:!0},X=p({menuitem:!0},q),Q=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,Z={},$={}.hasOwnProperty,J=1;d.displayName="ReactDOMComponent",d.Mixin={mountComponent:function(e,t,n,r){this._rootNodeID=J++,this._domID=n._idCounter++,this._nativeParent=t,this._nativeContainerInfo=n;var o=this._currentElement.props;switch(this._tag){case"iframe":case"object":case"img":case"form":case"video":case"audio":this._wrapperState={listeners:null},e.getReactMountReady().enqueue(s,this);break;case"button":o=T.getNativeProps(this,o,t);break;case"input":w.mountWrapper(this,o,t),o=w.getNativeProps(this,o),e.getReactMountReady().enqueue(s,this);break;case"option":M.mountWrapper(this,o,t),o=M.getNativeProps(this,o);break;case"select":S.mountWrapper(this,o,t),o=S.getNativeProps(this,o),e.getReactMountReady().enqueue(s,this);break;case"textarea":x.mountWrapper(this,o,t),o=x.getNativeProps(this,o),e.getReactMountReady().enqueue(s,this)}a(this,o);var l,u;null!=t?(l=t._namespaceURI,u=t._tag):n._tag&&(l=n._namespaceURI,u=n._tag),(null==l||l===v.svg&&"foreignobject"===u)&&(l=v.html),l===v.html&&("svg"===this._tag?l=v.svg:"math"===this._tag&&(l=v.mathml)),this._namespaceURI=l;var c;if(e.useCreateElement){var d,p=n._ownerDocument;if(l===v.html)if("script"===this._tag){var m=p.createElement("div"),g=this._currentElement.type;m.innerHTML="<"+g+"></"+g+">",d=m.removeChild(m.firstChild)}else d=p.createElement(this._currentElement.type,o.is||null);else d=p.createElementNS(l,this._currentElement.type);P.precacheNode(this,d),this._flags|=A.hasCachedChildNodes,this._nativeParent||y.setAttributeForRoot(d),this._updateDOMProperties(null,o,e);var b=h(d);this._createInitialChildren(e,o,r,b),c=b}else{var E=this._createOpenTagMarkupAndPutListeners(e,o),_=this._createContentMarkup(e,o,r);c=!_&&q[this._tag]?E+"/>":E+">"+_+"</"+this._currentElement.type+">"}switch(this._tag){case"button":case"input":case"select":case"textarea":o.autoFocus&&e.getReactMountReady().enqueue(f.focusDOMComponent,this);break;case"option":e.getReactMountReady().enqueue(i,this)}return c},_createOpenTagMarkupAndPutListeners:function(e,t){var n="<"+this._currentElement.type;for(var a in t)if(t.hasOwnProperty(a)){var o=t[a];if(null!=o)if(V.hasOwnProperty(a))o&&r(this,a,o,e);else{a===W&&(o&&(o=this._previousStyleCopy=p({},t.style)),o=m.createMarkupForStyles(o,this));var i=null;null!=this._tag&&c(this._tag,t)?B.hasOwnProperty(a)||(i=y.createMarkupForCustomAttribute(a,o)):i=y.createMarkupForProperty(a,o),i&&(n+=" "+i)}}return e.renderToStaticMarkup?n:(this._nativeParent||(n+=" "+y.createMarkupForRoot()),n+=" "+y.createMarkupForID(this._domID))},_createContentMarkup:function(e,t,n){var a="",r=t.dangerouslySetInnerHTML;if(null!=r)null!=r.__html&&(a=r.__html);else{var o=Y[typeof t.children]?t.children:null,i=null!=o?null:t.children;if(null!=o)a=O(o);else if(null!=i){var s=this.mountChildren(i,e,n);a=s.join("")}}return z[this._tag]&&"\n"===a.charAt(0)?"\n"+a:a},_createInitialChildren:function(e,t,n,a){var r=t.dangerouslySetInnerHTML;if(null!=r)null!=r.__html&&h.queueHTML(a,r.__html);else{var o=Y[typeof t.children]?t.children:null,i=null!=o?null:t.children;if(null!=o)h.queueText(a,o);else if(null!=i)for(var s=this.mountChildren(i,e,n),l=0;l<s.length;l++)h.queueChild(a,s[l])}},receiveComponent:function(e,t,n){var a=this._currentElement;this._currentElement=e,this.updateComponent(t,a,e,n)},updateComponent:function(e,t,n,r){var o=t.props,i=this._currentElement.props;switch(this._tag){case"button":o=T.getNativeProps(this,o),i=T.getNativeProps(this,i);break;case"input":w.updateWrapper(this),o=w.getNativeProps(this,o),i=w.getNativeProps(this,i);break;case"option":o=M.getNativeProps(this,o),i=M.getNativeProps(this,i);break;case"select":o=S.getNativeProps(this,o),i=S.getNativeProps(this,i);break;case"textarea":x.updateWrapper(this),o=x.getNativeProps(this,o),i=x.getNativeProps(this,i)}a(this,i),this._updateDOMProperties(o,i,e),this._updateDOMChildren(o,i,e,r),"select"===this._tag&&e.getReactMountReady().enqueue(l,this)},_updateDOMProperties:function(e,t,n){var a,o,i;for(a in e)if(!t.hasOwnProperty(a)&&e.hasOwnProperty(a)&&null!=e[a])if(a===W){var s=this._previousStyleCopy;for(o in s)s.hasOwnProperty(o)&&(i=i||{},i[o]="");this._previousStyleCopy=null}else V.hasOwnProperty(a)?e[a]&&U(this,a):(g.properties[a]||g.isCustomAttribute(a))&&y.deleteValueForProperty(L(this),a);for(a in t){var l=t[a],u=a===W?this._previousStyleCopy:null!=e?e[a]:void 0;if(t.hasOwnProperty(a)&&l!==u&&(null!=l||null!=u))if(a===W)if(l?l=this._previousStyleCopy=p({},l):this._previousStyleCopy=null,u){for(o in u)!u.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(i=i||{},i[o]="");for(o in l)l.hasOwnProperty(o)&&u[o]!==l[o]&&(i=i||{},i[o]=l[o])}else i=l;else if(V.hasOwnProperty(a))l?r(this,a,l,n):u&&U(this,a);else if(c(this._tag,t))B.hasOwnProperty(a)||y.setValueForAttribute(L(this),a,l);else if(g.properties[a]||g.isCustomAttribute(a)){var d=L(this);null!=l?y.setValueForProperty(d,a,l):y.deleteValueForProperty(d,a)}}i&&m.setValueForStyles(L(this),i,this)},_updateDOMChildren:function(e,t,n,a){var r=Y[typeof e.children]?e.children:null,o=Y[typeof t.children]?t.children:null,i=e.dangerouslySetInnerHTML&&e.dangerouslySetInnerHTML.__html,s=t.dangerouslySetInnerHTML&&t.dangerouslySetInnerHTML.__html,l=null!=r?null:e.children,u=null!=o?null:t.children,c=null!=r||null!=i,d=null!=o||null!=s;null!=l&&null==u?this.updateChildren(null,n,a):c&&!d&&this.updateTextContent(""),null!=o?r!==o&&this.updateTextContent(""+o):null!=s?i!==s&&this.updateMarkup(""+s):null!=u&&this.updateChildren(u,n,a)},getNativeNode:function(){return L(this)},unmountComponent:function(e){switch(this._tag){case"iframe":case"object":case"img":case"form":case"video":case"audio":var t=this._wrapperState.listeners;if(t)for(var n=0;n<t.length;n++)t[n].remove();break;case"html":case"head":case"body":I(!1)}this.unmountChildren(e),P.uncacheNode(this),E.deleteAllListeners(this),k.unmountIDFromEnvironment(this._rootNodeID),this._rootNodeID=null,this._domID=null,this._wrapperState=null},getPublicInstance:function(){return L(this)}},p(d.prototype,d.Mixin,R.Mixin),t.exports=d},{"./AutoFocusUtils":17,"./CSSPropertyOperations":20,"./DOMLazyTree":24,"./DOMNamespaces":25,"./DOMProperty":26,"./DOMPropertyOperations":27,"./EventConstants":32,"./EventPluginHub":33,"./EventPluginRegistry":34,"./ReactBrowserEventEmitter":43,"./ReactComponentBrowserEnvironment":48,"./ReactDOMButton":54,"./ReactDOMComponentFlags":56,"./ReactDOMComponentTree":57,"./ReactDOMInput":64,"./ReactDOMOption":66,"./ReactDOMSelect":67,"./ReactDOMTextarea":70,"./ReactInstrumentation":86,"./ReactMultiChild":90,"./ReactServerRenderingTransaction":103,"./escapeTextContentForBrowser":130,"./isEventSupported":144,"./validateDOMNesting":153,"fbjs/lib/emptyFunction":161,"fbjs/lib/invariant":169,"fbjs/lib/keyOf":173,"fbjs/lib/shallowEqual":178,"fbjs/lib/warning":179,"object-assign":180}],56:[function(e,t,n){"use strict";var a={hasCachedChildNodes:1};t.exports=a},{}],57:[function(e,t,n){"use strict";function a(e){for(var t;t=e._renderedComponent;)e=t;return e}function r(e,t){var n=a(e);n._nativeNode=t,t[h]=n}function o(e){var t=e._nativeNode;t&&(delete t[h],e._nativeNode=null)}function i(e,t){if(!(e._flags&m.hasCachedChildNodes)){var n=e._renderedChildren,o=t.firstChild;e:for(var i in n)if(n.hasOwnProperty(i)){var s=n[i],l=a(s)._domID;if(null!=l){for(;null!==o;o=o.nextSibling)if(1===o.nodeType&&o.getAttribute(f)===String(l)||8===o.nodeType&&o.nodeValue===" react-text: "+l+" "||8===o.nodeType&&o.nodeValue===" react-empty: "+l+" "){r(s,o);continue e}p(!1)}}e._flags|=m.hasCachedChildNodes}}function s(e){if(e[h])return e[h];for(var t=[];!e[h];){if(t.push(e),!e.parentNode)return null;e=e.parentNode}for(var n,a;e&&(a=e[h]);e=t.pop())n=a,t.length&&i(a,e);return n}function l(e){var t=s(e);return null!=t&&t._nativeNode===e?t:null}function u(e){if(void 0===e._nativeNode?p(!1):void 0,e._nativeNode)return e._nativeNode;for(var t=[];!e._nativeNode;)t.push(e),e._nativeParent?void 0:p(!1),e=e._nativeParent;for(;t.length;e=t.pop())i(e,e._nativeNode);return e._nativeNode}var c=e("./DOMProperty"),d=e("./ReactDOMComponentFlags"),p=e("fbjs/lib/invariant"),f=c.ID_ATTRIBUTE_NAME,m=d,h="__reactInternalInstance$"+Math.random().toString(36).slice(2),v={getClosestInstanceFromNode:s,getInstanceFromNode:l,getNodeFromInstance:u,precacheChildNodes:i,precacheNode:r,uncacheNode:o};t.exports=v},{"./DOMProperty":26,"./ReactDOMComponentFlags":56,"fbjs/lib/invariant":169}],58:[function(e,t,n){"use strict";function a(e,t){var n={_topLevelWrapper:e,_idCounter:1,_ownerDocument:t?t.nodeType===r?t:t.ownerDocument:null,_node:t,_tag:t?t.nodeName.toLowerCase():null,_namespaceURI:t?t.namespaceURI:null};return n}var r=(e("./validateDOMNesting"),9);t.exports=a},{"./validateDOMNesting":153}],59:[function(e,t,n){"use strict";function a(e,t,n,a,r,o){}var r=e("./ReactDOMUnknownPropertyDevtool"),o=(e("fbjs/lib/warning"),[]),i={addDevtool:function(e){o.push(e)},removeDevtool:function(e){for(var t=0;t<o.length;t++)o[t]===e&&(o.splice(t,1),t--)},onCreateMarkupForProperty:function(e,t){a("onCreateMarkupForProperty",e,t)},onSetValueForProperty:function(e,t,n){a("onSetValueForProperty",e,t,n)},onDeleteValueForProperty:function(e,t){a("onDeleteValueForProperty",e,t)}};i.addDevtool(r),t.exports=i},{"./ReactDOMUnknownPropertyDevtool":72,"fbjs/lib/warning":179}],60:[function(e,t,n){"use strict";var a=e("object-assign"),r=e("./DOMLazyTree"),o=e("./ReactDOMComponentTree"),i=function(e){this._currentElement=null,this._nativeNode=null,this._nativeParent=null,this._nativeContainerInfo=null,this._domID=null};a(i.prototype,{mountComponent:function(e,t,n,a){var i=n._idCounter++;this._domID=i,this._nativeParent=t,this._nativeContainerInfo=n;var s=" react-empty: "+this._domID+" ";if(e.useCreateElement){var l=n._ownerDocument,u=l.createComment(s);return o.precacheNode(this,u),r(u)}return e.renderToStaticMarkup?"":"<!--"+s+"-->"},receiveComponent:function(){},getNativeNode:function(){return o.getNodeFromInstance(this)},unmountComponent:function(){o.uncacheNode(this)}}),t.exports=i},{"./DOMLazyTree":24,"./ReactDOMComponentTree":57,"object-assign":180}],61:[function(e,t,n){"use strict";function a(e){return r.createFactory(e)}var r=e("./ReactElement"),o=(e("./ReactElementValidator"),e("fbjs/lib/mapObject")),i=o({a:"a",abbr:"abbr",address:"address",area:"area",article:"article",aside:"aside",audio:"audio",b:"b",base:"base",bdi:"bdi",bdo:"bdo",big:"big",blockquote:"blockquote",body:"body",br:"br",button:"button",canvas:"canvas",caption:"caption",cite:"cite",code:"code",col:"col",colgroup:"colgroup",data:"data",datalist:"datalist",dd:"dd",del:"del",details:"details",dfn:"dfn",dialog:"dialog",div:"div",dl:"dl",dt:"dt",em:"em",embed:"embed",fieldset:"fieldset",figcaption:"figcaption",figure:"figure",footer:"footer",form:"form",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",head:"head",header:"header",hgroup:"hgroup",hr:"hr",html:"html",i:"i",iframe:"iframe",img:"img",input:"input",ins:"ins",kbd:"kbd",keygen:"keygen",label:"label",legend:"legend",li:"li",link:"link",main:"main",map:"map",mark:"mark",menu:"menu",menuitem:"menuitem",meta:"meta",meter:"meter",nav:"nav",noscript:"noscript",object:"object",ol:"ol",optgroup:"optgroup",option:"option",output:"output",p:"p",param:"param",picture:"picture",pre:"pre",progress:"progress",q:"q",rp:"rp",rt:"rt",ruby:"ruby",s:"s",samp:"samp",script:"script",section:"section",select:"select",small:"small",source:"source",span:"span",strong:"strong",style:"style",sub:"sub",summary:"summary",sup:"sup",table:"table",tbody:"tbody",td:"td",textarea:"textarea",tfoot:"tfoot",th:"th",thead:"thead",time:"time",title:"title",tr:"tr",track:"track",u:"u",ul:"ul",var:"var",video:"video",wbr:"wbr",circle:"circle",clipPath:"clipPath",defs:"defs",ellipse:"ellipse",g:"g",image:"image",line:"line",linearGradient:"linearGradient",mask:"mask",path:"path",pattern:"pattern",polygon:"polygon",polyline:"polyline",radialGradient:"radialGradient",rect:"rect",stop:"stop",svg:"svg",text:"text",tspan:"tspan"},a);t.exports=i},{"./ReactElement":76,"./ReactElementValidator":77,"fbjs/lib/mapObject":174}],62:[function(e,t,n){"use strict";var a={useCreateElement:!0};t.exports=a},{}],63:[function(e,t,n){"use strict";var a=e("./DOMChildrenOperations"),r=e("./ReactDOMComponentTree"),o={dangerouslyProcessChildrenUpdates:function(e,t){var n=r.getNodeFromInstance(e);a.processUpdates(n,t)}};t.exports=o},{"./DOMChildrenOperations":23,"./ReactDOMComponentTree":57}],64:[function(e,t,n){"use strict";function a(){this._rootNodeID&&p.updateWrapper(this)}function r(e){var t=this._currentElement.props,n=l.executeOnChange(t,e);c.asap(a,this);var r=t.name;if("radio"===t.type&&null!=r){for(var o=u.getNodeFromInstance(this),i=o;i.parentNode;)i=i.parentNode;for(var s=i.querySelectorAll("input[name="+JSON.stringify(""+r)+'][type="radio"]'),p=0;p<s.length;p++){var f=s[p];if(f!==o&&f.form===o.form){var m=u.getInstanceFromNode(f);m?void 0:d(!1),c.asap(a,m)}}}return n}var o=e("object-assign"),i=e("./DisabledInputUtils"),s=e("./DOMPropertyOperations"),l=e("./LinkedValueUtils"),u=e("./ReactDOMComponentTree"),c=e("./ReactUpdates"),d=e("fbjs/lib/invariant"),p=(e("fbjs/lib/warning"),{getNativeProps:function(e,t){var n=l.getValue(t),a=l.getChecked(t),r=o({type:void 0},i.getNativeProps(e,t),{defaultChecked:void 0,defaultValue:void 0,value:null!=n?n:e._wrapperState.initialValue,checked:null!=a?a:e._wrapperState.initialChecked,onChange:e._wrapperState.onChange});return r},mountWrapper:function(e,t){var n=t.defaultValue;e._wrapperState={initialChecked:t.defaultChecked||!1,initialValue:null!=n?n:null,listeners:null,onChange:r.bind(e)}},updateWrapper:function(e){var t=e._currentElement.props,n=t.checked;null!=n&&s.setValueForProperty(u.getNodeFromInstance(e),"checked",n||!1);var a=l.getValue(t);null!=a&&s.setValueForProperty(u.getNodeFromInstance(e),"value",""+a)}});t.exports=p},{"./DOMPropertyOperations":27,"./DisabledInputUtils":30,"./LinkedValueUtils":40,"./ReactDOMComponentTree":57,"./ReactUpdates":105,"fbjs/lib/invariant":169,"fbjs/lib/warning":179,"object-assign":180}],65:[function(e,t,n){"use strict";var a=e("./ReactDOMDebugTool");t.exports={debugTool:a}},{"./ReactDOMDebugTool":59}],66:[function(e,t,n){"use strict";var a=e("object-assign"),r=e("./ReactChildren"),o=e("./ReactDOMComponentTree"),i=e("./ReactDOMSelect"),s=(e("fbjs/lib/warning"),{mountWrapper:function(e,t,n){var a=null;if(null!=n){var r=n;"optgroup"===r._tag&&(r=r._nativeParent),null!=r&&"select"===r._tag&&(a=i.getSelectValueContext(r))}var o=null;if(null!=a)if(o=!1,Array.isArray(a)){for(var s=0;s<a.length;s++)if(""+a[s]==""+t.value){o=!0;break}}else o=""+a==""+t.value;e._wrapperState={selected:o}},postMountWrapper:function(e){var t=e._currentElement.props;if(null!=t.value){var n=o.getNodeFromInstance(e);n.setAttribute("value",t.value)}},getNativeProps:function(e,t){var n=a({selected:void 0,children:void 0},t);null!=e._wrapperState.selected&&(n.selected=e._wrapperState.selected);var o="";return r.forEach(t.children,function(e){null!=e&&("string"!=typeof e&&"number"!=typeof e||(o+=e))}),o&&(n.children=o),n}});t.exports=s},{"./ReactChildren":45,"./ReactDOMComponentTree":57,"./ReactDOMSelect":67,"fbjs/lib/warning":179,"object-assign":180}],67:[function(e,t,n){"use strict";function a(){if(this._rootNodeID&&this._wrapperState.pendingUpdate){this._wrapperState.pendingUpdate=!1;var e=this._currentElement.props,t=l.getValue(e);null!=t&&r(this,Boolean(e.multiple),t)}}function r(e,t,n){var a,r,o=u.getNodeFromInstance(e).options;if(t){for(a={},r=0;r<n.length;r++)a[""+n[r]]=!0;for(r=0;r<o.length;r++){var i=a.hasOwnProperty(o[r].value);o[r].selected!==i&&(o[r].selected=i)}}else{for(a=""+n,r=0;r<o.length;r++)if(o[r].value===a)return void(o[r].selected=!0);o.length&&(o[0].selected=!0)}}function o(e){var t=this._currentElement.props,n=l.executeOnChange(t,e);return this._rootNodeID&&(this._wrapperState.pendingUpdate=!0),c.asap(a,this),n}var i=e("object-assign"),s=e("./DisabledInputUtils"),l=e("./LinkedValueUtils"),u=e("./ReactDOMComponentTree"),c=e("./ReactUpdates"),d=(e("fbjs/lib/warning"),!1),p={getNativeProps:function(e,t){return i({},s.getNativeProps(e,t),{onChange:e._wrapperState.onChange,value:void 0})},mountWrapper:function(e,t){var n=l.getValue(t);e._wrapperState={pendingUpdate:!1,initialValue:null!=n?n:t.defaultValue,listeners:null,onChange:o.bind(e),wasMultiple:Boolean(t.multiple)},void 0===t.value||void 0===t.defaultValue||d||(d=!0)},getSelectValueContext:function(e){return e._wrapperState.initialValue},postUpdateWrapper:function(e){var t=e._currentElement.props;e._wrapperState.initialValue=void 0;var n=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=Boolean(t.multiple);var a=l.getValue(t);null!=a?(e._wrapperState.pendingUpdate=!1,r(e,Boolean(t.multiple),a)):n!==Boolean(t.multiple)&&(null!=t.defaultValue?r(e,Boolean(t.multiple),t.defaultValue):r(e,Boolean(t.multiple),t.multiple?[]:""))}};t.exports=p},{"./DisabledInputUtils":30,"./LinkedValueUtils":40,"./ReactDOMComponentTree":57,"./ReactUpdates":105,"fbjs/lib/warning":179,"object-assign":180}],68:[function(e,t,n){"use strict";function a(e,t,n,a){return e===n&&t===a}function r(e){var t=document.selection,n=t.createRange(),a=n.text.length,r=n.duplicate();r.moveToElementText(e),r.setEndPoint("EndToStart",n);var o=r.text.length,i=o+a;return{start:o,end:i}}function o(e){var t=window.getSelection&&window.getSelection();if(!t||0===t.rangeCount)return null;var n=t.anchorNode,r=t.anchorOffset,o=t.focusNode,i=t.focusOffset,s=t.getRangeAt(0);try{s.startContainer.nodeType,s.endContainer.nodeType}catch(e){return null}var l=a(t.anchorNode,t.anchorOffset,t.focusNode,t.focusOffset),u=l?0:s.toString().length,c=s.cloneRange();c.selectNodeContents(e),c.setEnd(s.startContainer,s.startOffset);var d=a(c.startContainer,c.startOffset,c.endContainer,c.endOffset),p=d?0:c.toString().length,f=p+u,m=document.createRange();m.setStart(n,r),m.setEnd(o,i);var h=m.collapsed;return{start:h?f:p,end:h?p:f}}function i(e,t){var n,a,r=document.selection.createRange().duplicate();void 0===t.end?(n=t.start,a=n):t.start>t.end?(n=t.end,a=t.start):(n=t.start,a=t.end),r.moveToElementText(e),r.moveStart("character",n),r.setEndPoint("EndToStart",r),r.moveEnd("character",a-n),r.select()}function s(e,t){if(window.getSelection){var n=window.getSelection(),a=e[c()].length,r=Math.min(t.start,a),o=void 0===t.end?r:Math.min(t.end,a);if(!n.extend&&r>o){var i=o;o=r,r=i}var s=u(e,r),l=u(e,o);if(s&&l){var d=document.createRange();d.setStart(s.node,s.offset),n.removeAllRanges(),r>o?(n.addRange(d),n.extend(l.node,l.offset)):(d.setEnd(l.node,l.offset),n.addRange(d))}}}var l=e("fbjs/lib/ExecutionEnvironment"),u=e("./getNodeForCharacterOffset"),c=e("./getTextContentAccessor"),d=l.canUseDOM&&"selection"in document&&!("getSelection"in window),p={getOffsets:d?r:o,setOffsets:d?i:s};t.exports=p},{"./getNodeForCharacterOffset":140,"./getTextContentAccessor":141,"fbjs/lib/ExecutionEnvironment":155}],69:[function(e,t,n){"use strict";var a=e("object-assign"),r=e("./DOMChildrenOperations"),o=e("./DOMLazyTree"),i=e("./ReactDOMComponentTree"),s=(e("./ReactInstrumentation"),e("./escapeTextContentForBrowser")),l=e("fbjs/lib/invariant"),u=(e("./validateDOMNesting"),function(e){this._currentElement=e,this._stringText=""+e,this._nativeNode=null,this._nativeParent=null,this._domID=null,this._mountIndex=0,this._closingComment=null,this._commentNodes=null});a(u.prototype,{mountComponent:function(e,t,n,a){var r=n._idCounter++,l=" react-text: "+r+" ",u=" /react-text ";if(this._domID=r,this._nativeParent=t,e.useCreateElement){var c=n._ownerDocument,d=c.createComment(l),p=c.createComment(u),f=o(c.createDocumentFragment());return o.queueChild(f,o(d)),this._stringText&&o.queueChild(f,o(c.createTextNode(this._stringText))),o.queueChild(f,o(p)),i.precacheNode(this,d),this._closingComment=p,f}var m=s(this._stringText);return e.renderToStaticMarkup?m:"<!--"+l+"-->"+m+"<!--"+u+"-->"},receiveComponent:function(e,t){if(e!==this._currentElement){this._currentElement=e;var n=""+e;if(n!==this._stringText){this._stringText=n;var a=this.getNativeNode();r.replaceDelimitedText(a[0],a[1],n)}}},getNativeNode:function(){var e=this._commentNodes;if(e)return e;if(!this._closingComment)for(var t=i.getNodeFromInstance(this),n=t.nextSibling;;){if(null==n?l(!1):void 0,8===n.nodeType&&" /react-text "===n.nodeValue){this._closingComment=n;break}n=n.nextSibling}return e=[this._nativeNode,this._closingComment],this._commentNodes=e,e},unmountComponent:function(){this._closingComment=null,this._commentNodes=null,i.uncacheNode(this)}}),t.exports=u},{"./DOMChildrenOperations":23,"./DOMLazyTree":24,"./ReactDOMComponentTree":57,"./ReactInstrumentation":86,"./escapeTextContentForBrowser":130,"./validateDOMNesting":153,"fbjs/lib/invariant":169,"object-assign":180}],70:[function(e,t,n){"use strict";function a(){this._rootNodeID&&p.updateWrapper(this)}function r(e){var t=this._currentElement.props,n=l.executeOnChange(t,e);return c.asap(a,this),n}var o=e("object-assign"),i=e("./DisabledInputUtils"),s=e("./DOMPropertyOperations"),l=e("./LinkedValueUtils"),u=e("./ReactDOMComponentTree"),c=e("./ReactUpdates"),d=e("fbjs/lib/invariant"),p=(e("fbjs/lib/warning"),{getNativeProps:function(e,t){null!=t.dangerouslySetInnerHTML?d(!1):void 0;var n=o({},i.getNativeProps(e,t),{defaultValue:void 0,value:void 0,children:e._wrapperState.initialValue,onChange:e._wrapperState.onChange});return n},mountWrapper:function(e,t){var n=t.defaultValue,a=t.children;null!=a&&(null!=n?d(!1):void 0,Array.isArray(a)&&(a.length<=1?void 0:d(!1),a=a[0]),n=""+a),null==n&&(n="");var o=l.getValue(t);e._wrapperState={initialValue:""+(null!=o?o:n),listeners:null,onChange:r.bind(e)}},updateWrapper:function(e){var t=e._currentElement.props,n=l.getValue(t);null!=n&&s.setValueForProperty(u.getNodeFromInstance(e),"value",""+n)}});t.exports=p},{"./DOMPropertyOperations":27,"./DisabledInputUtils":30,"./LinkedValueUtils":40,"./ReactDOMComponentTree":57,"./ReactUpdates":105,"fbjs/lib/invariant":169,"fbjs/lib/warning":179,"object-assign":180}],71:[function(e,t,n){"use strict";function a(e,t){"_nativeNode"in e?void 0:l(!1),"_nativeNode"in t?void 0:l(!1);for(var n=0,a=e;a;a=a._nativeParent)n++;for(var r=0,o=t;o;o=o._nativeParent)r++;for(;n-r>0;)e=e._nativeParent,n--;for(;r-n>0;)t=t._nativeParent,r--;for(var i=n;i--;){if(e===t)return e;e=e._nativeParent,t=t._nativeParent}return null}function r(e,t){"_nativeNode"in e?void 0:l(!1),"_nativeNode"in t?void 0:l(!1);for(;t;){if(t===e)return!0;t=t._nativeParent}return!1}function o(e){return"_nativeNode"in e?void 0:l(!1),e._nativeParent}function i(e,t,n){for(var a=[];e;)a.push(e),e=e._nativeParent;var r;for(r=a.length;r-- >0;)t(a[r],!1,n);for(r=0;r<a.length;r++)t(a[r],!0,n)}function s(e,t,n,r,o){for(var i=e&&t?a(e,t):null,s=[];e&&e!==i;)s.push(e),e=e._nativeParent;for(var l=[];t&&t!==i;)l.push(t),t=t._nativeParent;var u;for(u=0;u<s.length;u++)n(s[u],!0,r);for(u=l.length;u-- >0;)n(l[u],!1,o)}var l=e("fbjs/lib/invariant");t.exports={isAncestor:r,getLowestCommonAncestor:a,getParentInstance:o,traverseTwoPhase:i,traverseEnterLeave:s}},{"fbjs/lib/invariant":169}],72:[function(e,t,n){"use strict";var a,r=(e("./DOMProperty"),e("./EventPluginRegistry"),e("fbjs/lib/warning"),{onCreateMarkupForProperty:function(e,t){a(e)},onSetValueForProperty:function(e,t,n){a(t)},onDeleteValueForProperty:function(e,t){a(t)}});t.exports=r},{"./DOMProperty":26,"./EventPluginRegistry":34,"fbjs/lib/warning":179}],73:[function(e,t,n){"use strict";function a(e,t,n,a,r,o){}function r(e){}var o=(e("fbjs/lib/ExecutionEnvironment"),e("fbjs/lib/performanceNow"),e("fbjs/lib/warning"),[]),i={addDevtool:function(e){o.push(e)},removeDevtool:function(e){for(var t=0;t<o.length;t++)o[t]===e&&(o.splice(t,1),t--)},beginProfiling:function(){},endProfiling:function(){},getFlushHistory:function(){},onBeginFlush:function(){a("onBeginFlush")},onEndFlush:function(){a("onEndFlush")},onBeginLifeCycleTimer:function(e,t){r(e),a("onBeginLifeCycleTimer",e,t)},onEndLifeCycleTimer:function(e,t){r(e),a("onEndLifeCycleTimer",e,t)},onBeginReconcilerTimer:function(e,t){r(e),a("onBeginReconcilerTimer",e,t)},onEndReconcilerTimer:function(e,t){r(e),a("onEndReconcilerTimer",e,t)},onBeginProcessingChildContext:function(){a("onBeginProcessingChildContext")},onEndProcessingChildContext:function(){a("onEndProcessingChildContext")},onNativeOperation:function(e,t,n){r(e),a("onNativeOperation",e,t,n)},onSetState:function(){a("onSetState")},onSetDisplayName:function(e,t){r(e),a("onSetDisplayName",e,t)},onSetChildren:function(e,t){r(e),a("onSetChildren",e,t)},onSetOwner:function(e,t){r(e),a("onSetOwner",e,t)},onSetText:function(e,t){r(e),a("onSetText",e,t)},onMountRootComponent:function(e){r(e),a("onMountRootComponent",e)},onMountComponent:function(e){r(e),a("onMountComponent",e)},onUpdateComponent:function(e){r(e),a("onUpdateComponent",e)},onUnmountComponent:function(e){r(e),a("onUnmountComponent",e)}};t.exports=i},{"./ReactComponentTreeDevtool":50,"./ReactInvalidSetStateWarningDevTool":87,"./ReactNativeOperationHistoryDevtool":93,"fbjs/lib/ExecutionEnvironment":155,"fbjs/lib/performanceNow":177,"fbjs/lib/warning":179}],74:[function(e,t,n){"use strict";function a(){this.reinitializeTransaction()}var r=e("object-assign"),o=e("./ReactUpdates"),i=e("./Transaction"),s=e("fbjs/lib/emptyFunction"),l={initialize:s,close:function(){p.isBatchingUpdates=!1}},u={initialize:s,close:o.flushBatchedUpdates.bind(o)},c=[u,l];r(a.prototype,i.Mixin,{getTransactionWrappers:function(){return c}});var d=new a,p={isBatchingUpdates:!1,batchedUpdates:function(e,t,n,a,r,o){var i=p.isBatchingUpdates;p.isBatchingUpdates=!0,i?e(t,n,a,r,o):d.perform(e,null,t,n,a,r,o)}};t.exports=p},{"./ReactUpdates":105,"./Transaction":123,"fbjs/lib/emptyFunction":161,"object-assign":180}],75:[function(e,t,n){"use strict";function a(){C||(C=!0,g.EventEmitter.injectReactEventListener(v),g.EventPluginHub.injectEventPluginOrder(i),g.EventPluginUtils.injectComponentTree(d),g.EventPluginUtils.injectTreeTraversal(f),g.EventPluginHub.injectEventPluginsByName({SimpleEventPlugin:_,EnterLeaveEventPlugin:s,ChangeEventPlugin:o,SelectEventPlugin:E,BeforeInputEventPlugin:r}),g.NativeComponent.injectGenericComponentClass(c),g.NativeComponent.injectTextComponentClass(m),g.DOMProperty.injectDOMPropertyConfig(l),g.DOMProperty.injectDOMPropertyConfig(b),g.EmptyComponent.injectEmptyComponentFactory(function(e){return new p(e)}),g.Updates.injectReconcileTransaction(y),g.Updates.injectBatchingStrategy(h),g.Component.injectEnvironment(u))}var r=e("./BeforeInputEventPlugin"),o=e("./ChangeEventPlugin"),i=e("./DefaultEventPluginOrder"),s=e("./EnterLeaveEventPlugin"),l=e("./HTMLDOMPropertyConfig"),u=e("./ReactComponentBrowserEnvironment"),c=e("./ReactDOMComponent"),d=e("./ReactDOMComponentTree"),p=e("./ReactDOMEmptyComponent"),f=e("./ReactDOMTreeTraversal"),m=e("./ReactDOMTextComponent"),h=e("./ReactDefaultBatchingStrategy"),v=e("./ReactEventListener"),g=e("./ReactInjection"),y=e("./ReactReconcileTransaction"),b=e("./SVGDOMPropertyConfig"),E=e("./SelectEventPlugin"),_=e("./SimpleEventPlugin"),C=!1;t.exports={inject:a}},{"./BeforeInputEventPlugin":18,"./ChangeEventPlugin":22,"./DefaultEventPluginOrder":29,"./EnterLeaveEventPlugin":31,"./HTMLDOMPropertyConfig":38,"./ReactComponentBrowserEnvironment":48,"./ReactDOMComponent":55,"./ReactDOMComponentTree":57,"./ReactDOMEmptyComponent":60,"./ReactDOMTextComponent":69,"./ReactDOMTreeTraversal":71,"./ReactDefaultBatchingStrategy":74,"./ReactEventListener":81,"./ReactInjection":83,"./ReactReconcileTransaction":100,"./SVGDOMPropertyConfig":107,"./SelectEventPlugin":108,"./SimpleEventPlugin":109}],76:[function(e,t,n){"use strict";var a=e("object-assign"),r=e("./ReactCurrentOwner"),o=(e("fbjs/lib/warning"),e("./canDefineProperty"),"function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103),i={key:!0,ref:!0,__self:!0,__source:!0},s=function(e,t,n,a,r,i,s){var l={$$typeof:o,type:e,key:t,ref:n,props:s,_owner:i};return l};s.createElement=function(e,t,n){var a,o={},l=null,u=null,c=null,d=null;if(null!=t){u=void 0===t.ref?null:t.ref,l=void 0===t.key?null:""+t.key,c=void 0===t.__self?null:t.__self,d=void 0===t.__source?null:t.__source;for(a in t)t.hasOwnProperty(a)&&!i.hasOwnProperty(a)&&(o[a]=t[a])}var p=arguments.length-2;if(1===p)o.children=n;else if(p>1){for(var f=Array(p),m=0;p>m;m++)f[m]=arguments[m+2];o.children=f}if(e&&e.defaultProps){var h=e.defaultProps;for(a in h)void 0===o[a]&&(o[a]=h[a])}return s(e,l,u,c,d,r.current,o)},s.createFactory=function(e){var t=s.createElement.bind(null,e);return t.type=e,t},s.cloneAndReplaceKey=function(e,t){var n=s(e.type,t,e.ref,e._self,e._source,e._owner,e.props);return n},s.cloneElement=function(e,t,n){var o,l=a({},e.props),u=e.key,c=e.ref,d=e._self,p=e._source,f=e._owner;if(null!=t){void 0!==t.ref&&(c=t.ref,f=r.current),void 0!==t.key&&(u=""+t.key);var m;e.type&&e.type.defaultProps&&(m=e.type.defaultProps);
for(o in t)t.hasOwnProperty(o)&&!i.hasOwnProperty(o)&&(void 0===t[o]&&void 0!==m?l[o]=m[o]:l[o]=t[o])}var h=arguments.length-2;if(1===h)l.children=n;else if(h>1){for(var v=Array(h),g=0;h>g;g++)v[g]=arguments[g+2];l.children=v}return s(e.type,u,c,d,p,f,l)},s.isValidElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===o},t.exports=s},{"./ReactCurrentOwner":52,"./canDefineProperty":127,"fbjs/lib/warning":179,"object-assign":180}],77:[function(e,t,n){"use strict";function a(){if(d.current){var e=d.current.getName();if(e)return" Check the render method of `"+e+"`."}return""}function r(e,t){if(e._store&&!e._store.validated&&null==e.key){e._store.validated=!0;o("uniqueKey",e,t)}}function o(e,t,n){var r=a();if(!r){var o="string"==typeof n?n:n.displayName||n.name;o&&(r=" Check the top-level render call using <"+o+">.")}var i=m[e]||(m[e]={});if(i[r])return null;i[r]=!0;var s={parentOrOwner:r,url:" See https://fb.me/react-warning-keys for more information.",childOwner:null};return t&&t._owner&&t._owner!==d.current&&(s.childOwner=" It was passed a child from "+t._owner.getName()+"."),s}function i(e,t){if("object"==typeof e)if(Array.isArray(e))for(var n=0;n<e.length;n++){var a=e[n];u.isValidElement(a)&&r(a,t)}else if(u.isValidElement(e))e._store&&(e._store.validated=!0);else if(e){var o=p(e);if(o&&o!==e.entries)for(var i,s=o.call(e);!(i=s.next()).done;)u.isValidElement(i.value)&&r(i.value,t)}}function s(e,t,n,r){for(var o in t)if(t.hasOwnProperty(o)){var i;try{"function"!=typeof t[o]?f(!1):void 0,i=t[o](n,o,e,r)}catch(e){i=e}if(i instanceof Error&&!(i.message in h)){h[i.message]=!0;a()}}}function l(e){var t=e.type;if("function"==typeof t){var n=t.displayName||t.name;t.propTypes&&s(n,t.propTypes,e.props,c.prop),"function"==typeof t.getDefaultProps}}var u=e("./ReactElement"),c=e("./ReactPropTypeLocations"),d=(e("./ReactPropTypeLocationNames"),e("./ReactCurrentOwner")),p=(e("./canDefineProperty"),e("./getIteratorFn")),f=e("fbjs/lib/invariant"),m=(e("fbjs/lib/warning"),{}),h={},v={createElement:function(e,t,n){var a="string"==typeof e||"function"==typeof e,r=u.createElement.apply(this,arguments);if(null==r)return r;if(a)for(var o=2;o<arguments.length;o++)i(arguments[o],e);return l(r),r},createFactory:function(e){var t=v.createElement.bind(null,e);return t.type=e,t},cloneElement:function(e,t,n){for(var a=u.cloneElement.apply(this,arguments),r=2;r<arguments.length;r++)i(arguments[r],a.type);return l(a),a}};t.exports=v},{"./ReactCurrentOwner":52,"./ReactElement":76,"./ReactPropTypeLocationNames":97,"./ReactPropTypeLocations":98,"./canDefineProperty":127,"./getIteratorFn":138,"fbjs/lib/invariant":169,"fbjs/lib/warning":179}],78:[function(e,t,n){"use strict";var a,r={injectEmptyComponentFactory:function(e){a=e}},o={create:function(e){return a(e)}};o.injection=r,t.exports=o},{}],79:[function(e,t,n){"use strict";function a(e,t,n,a){try{return t(n,a)}catch(e){return void(null===r&&(r=e))}}var r=null,o={invokeGuardedCallback:a,invokeGuardedCallbackWithCatch:a,rethrowCaughtError:function(){if(r){var e=r;throw r=null,e}}};t.exports=o},{}],80:[function(e,t,n){"use strict";function a(e){r.enqueueEvents(e),r.processEventQueue(!1)}var r=e("./EventPluginHub"),o={handleTopLevel:function(e,t,n,o){var i=r.extractEvents(e,t,n,o);a(i)}};t.exports=o},{"./EventPluginHub":33}],81:[function(e,t,n){"use strict";function a(e){for(;e._nativeParent;)e=e._nativeParent;var t=d.getNodeFromInstance(e),n=t.parentNode;return d.getClosestInstanceFromNode(n)}function r(e,t){this.topLevelType=e,this.nativeEvent=t,this.ancestors=[]}function o(e){var t=f(e.nativeEvent),n=d.getClosestInstanceFromNode(t),r=n;do e.ancestors.push(r),r=r&&a(r);while(r);for(var o=0;o<e.ancestors.length;o++)n=e.ancestors[o],h._handleTopLevel(e.topLevelType,n,e.nativeEvent,f(e.nativeEvent))}function i(e){var t=m(window);e(t)}var s=e("object-assign"),l=e("fbjs/lib/EventListener"),u=e("fbjs/lib/ExecutionEnvironment"),c=e("./PooledClass"),d=e("./ReactDOMComponentTree"),p=e("./ReactUpdates"),f=e("./getEventTarget"),m=e("fbjs/lib/getUnboundedScrollPosition");s(r.prototype,{destructor:function(){this.topLevelType=null,this.nativeEvent=null,this.ancestors.length=0}}),c.addPoolingTo(r,c.twoArgumentPooler);var h={_enabled:!0,_handleTopLevel:null,WINDOW_HANDLE:u.canUseDOM?window:null,setHandleTopLevel:function(e){h._handleTopLevel=e},setEnabled:function(e){h._enabled=!!e},isEnabled:function(){return h._enabled},trapBubbledEvent:function(e,t,n){var a=n;return a?l.listen(a,t,h.dispatchEvent.bind(null,e)):null},trapCapturedEvent:function(e,t,n){var a=n;return a?l.capture(a,t,h.dispatchEvent.bind(null,e)):null},monitorScrollValue:function(e){var t=i.bind(null,e);l.listen(window,"scroll",t)},dispatchEvent:function(e,t){if(h._enabled){var n=r.getPooled(e,t);try{p.batchedUpdates(o,n)}finally{r.release(n)}}}};t.exports=h},{"./PooledClass":41,"./ReactDOMComponentTree":57,"./ReactUpdates":105,"./getEventTarget":137,"fbjs/lib/EventListener":154,"fbjs/lib/ExecutionEnvironment":155,"fbjs/lib/getUnboundedScrollPosition":166,"object-assign":180}],82:[function(e,t,n){"use strict";var a={logTopLevelRenders:!1};t.exports=a},{}],83:[function(e,t,n){"use strict";var a=e("./DOMProperty"),r=e("./EventPluginHub"),o=e("./EventPluginUtils"),i=e("./ReactComponentEnvironment"),s=e("./ReactClass"),l=e("./ReactEmptyComponent"),u=e("./ReactBrowserEventEmitter"),c=e("./ReactNativeComponent"),d=e("./ReactUpdates"),p={Component:i.injection,Class:s.injection,DOMProperty:a.injection,EmptyComponent:l.injection,EventPluginHub:r.injection,EventPluginUtils:o.injection,EventEmitter:u.injection,NativeComponent:c.injection,Updates:d.injection};t.exports=p},{"./DOMProperty":26,"./EventPluginHub":33,"./EventPluginUtils":35,"./ReactBrowserEventEmitter":43,"./ReactClass":46,"./ReactComponentEnvironment":49,"./ReactEmptyComponent":78,"./ReactNativeComponent":92,"./ReactUpdates":105}],84:[function(e,t,n){"use strict";function a(e){return o(document.documentElement,e)}var r=e("./ReactDOMSelection"),o=e("fbjs/lib/containsNode"),i=e("fbjs/lib/focusNode"),s=e("fbjs/lib/getActiveElement"),l={hasSelectionCapabilities:function(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&"text"===e.type||"textarea"===t||"true"===e.contentEditable)},getSelectionInformation:function(){var e=s();return{focusedElem:e,selectionRange:l.hasSelectionCapabilities(e)?l.getSelection(e):null}},restoreSelection:function(e){var t=s(),n=e.focusedElem,r=e.selectionRange;t!==n&&a(n)&&(l.hasSelectionCapabilities(n)&&l.setSelection(n,r),i(n))},getSelection:function(e){var t;if("selectionStart"in e)t={start:e.selectionStart,end:e.selectionEnd};else if(document.selection&&e.nodeName&&"input"===e.nodeName.toLowerCase()){var n=document.selection.createRange();n.parentElement()===e&&(t={start:-n.moveStart("character",-e.value.length),end:-n.moveEnd("character",-e.value.length)})}else t=r.getOffsets(e);return t||{start:0,end:0}},setSelection:function(e,t){var n=t.start,a=t.end;if(void 0===a&&(a=n),"selectionStart"in e)e.selectionStart=n,e.selectionEnd=Math.min(a,e.value.length);else if(document.selection&&e.nodeName&&"input"===e.nodeName.toLowerCase()){var o=e.createTextRange();o.collapse(!0),o.moveStart("character",n),o.moveEnd("character",a-n),o.select()}else r.setOffsets(e,t)}};t.exports=l},{"./ReactDOMSelection":68,"fbjs/lib/containsNode":158,"fbjs/lib/focusNode":163,"fbjs/lib/getActiveElement":164}],85:[function(e,t,n){"use strict";var a={remove:function(e){e._reactInternalInstance=void 0},get:function(e){return e._reactInternalInstance},has:function(e){return void 0!==e._reactInternalInstance},set:function(e,t){e._reactInternalInstance=t}};t.exports=a},{}],86:[function(e,t,n){"use strict";var a=e("./ReactDebugTool");t.exports={debugTool:a}},{"./ReactDebugTool":73}],87:[function(e,t,n){"use strict";var a,r,o=(e("fbjs/lib/warning"),{onBeginProcessingChildContext:function(){a=!0},onEndProcessingChildContext:function(){a=!1},onSetState:function(){r()}});t.exports=o},{"fbjs/lib/warning":179}],88:[function(e,t,n){"use strict";var a=e("./adler32"),r=/\/?>/,o=/^<\!\-\-/,i={CHECKSUM_ATTR_NAME:"data-react-checksum",addChecksumToMarkup:function(e){var t=a(e);return o.test(e)?e:e.replace(r," "+i.CHECKSUM_ATTR_NAME+'="'+t+'"$&')},canReuseMarkup:function(e,t){var n=t.getAttribute(i.CHECKSUM_ATTR_NAME);n=n&&parseInt(n,10);var r=a(e);return r===n}};t.exports=i},{"./adler32":126}],89:[function(e,t,n){"use strict";function a(e,t){for(var n=Math.min(e.length,t.length),a=0;n>a;a++)if(e.charAt(a)!==t.charAt(a))return a;return e.length===t.length?-1:n}function r(e){return e?e.nodeType===D?e.documentElement:e.firstChild:null}function o(e){return e.getAttribute&&e.getAttribute(S)||""}function i(e,t,n,a,r){var o;if(b.logTopLevelRenders){var i=e._currentElement.props,s=i.type;o="React mount: "+("string"==typeof s?s:s.displayName||s.name)}var l=_.mountComponent(e,n,null,v(e,t),r);e._renderedComponent._topLevelWrapper=e,U._mountImageIntoNode(l,t,e,a,n)}function s(e,t,n,a){var r=k.ReactReconcileTransaction.getPooled(!n&&g.useCreateElement);r.perform(i,null,e,t,r,n,a),k.ReactReconcileTransaction.release(r)}function l(e,t,n){for(_.unmountComponent(e,n),t.nodeType===D&&(t=t.documentElement);t.lastChild;)t.removeChild(t.lastChild)}function u(e){var t=r(e);if(t){var n=h.getInstanceFromNode(t);return!(!n||!n._nativeParent)}}function c(e){var t=r(e),n=t&&h.getInstanceFromNode(t);return n&&!n._nativeParent?n:null}function d(e){var t=c(e);return t?t._nativeContainerInfo._topLevelWrapper:null}var p=e("./DOMLazyTree"),f=e("./DOMProperty"),m=e("./ReactBrowserEventEmitter"),h=(e("./ReactCurrentOwner"),e("./ReactDOMComponentTree")),v=e("./ReactDOMContainerInfo"),g=e("./ReactDOMFeatureFlags"),y=e("./ReactElement"),b=e("./ReactFeatureFlags"),E=(e("./ReactInstrumentation"),e("./ReactMarkupChecksum")),_=e("./ReactReconciler"),C=e("./ReactUpdateQueue"),k=e("./ReactUpdates"),T=e("fbjs/lib/emptyObject"),N=e("./instantiateReactComponent"),P=e("fbjs/lib/invariant"),w=e("./setInnerHTML"),M=e("./shouldUpdateReactComponent"),S=(e("fbjs/lib/warning"),f.ID_ATTRIBUTE_NAME),x=f.ROOT_ATTRIBUTE_NAME,R=1,D=9,O=11,I={},j=1,A=function(){this.rootID=j++};A.prototype.isReactComponent={},A.prototype.render=function(){return this.props};var U={TopLevelWrapper:A,_instancesByReactRootID:I,scrollMonitor:function(e,t){t()},_updateRootComponent:function(e,t,n,a){return U.scrollMonitor(n,function(){C.enqueueElementInternal(e,t),a&&C.enqueueCallbackInternal(e,a)}),e},_renderNewRootComponent:function(e,t,n,a){!t||t.nodeType!==R&&t.nodeType!==D&&t.nodeType!==O?P(!1):void 0,m.ensureScrollValueMonitoring();var r=N(e);k.batchedUpdates(s,r,t,n,a);var o=r._instance.rootID;return I[o]=r,r},renderSubtreeIntoContainer:function(e,t,n,a){return null==e||null==e._reactInternalInstance?P(!1):void 0,U._renderSubtreeIntoContainer(e,t,n,a)},_renderSubtreeIntoContainer:function(e,t,n,a){C.validateCallback(a,"ReactDOM.render"),y.isValidElement(t)?void 0:P(!1);var i=y(A,null,null,null,null,null,t),s=d(n);if(s){var l=s._currentElement,c=l.props;if(M(c,t)){var p=s._renderedComponent.getPublicInstance(),f=a&&function(){a.call(p)};return U._updateRootComponent(s,i,n,f),p}U.unmountComponentAtNode(n)}var m=r(n),h=m&&!!o(m),v=u(n),g=h&&!s&&!v,b=U._renderNewRootComponent(i,n,g,null!=e?e._reactInternalInstance._processChildContext(e._reactInternalInstance._context):T)._renderedComponent.getPublicInstance();return a&&a.call(b),b},render:function(e,t,n){return U._renderSubtreeIntoContainer(null,e,t,n)},unmountComponentAtNode:function(e){!e||e.nodeType!==R&&e.nodeType!==D&&e.nodeType!==O?P(!1):void 0;var t=d(e);if(!t){u(e),1===e.nodeType&&e.hasAttribute(x);return!1}return delete I[t._instance.rootID],k.batchedUpdates(l,t,e,!1),!0},_mountImageIntoNode:function(e,t,n,o,i){if(!t||t.nodeType!==R&&t.nodeType!==D&&t.nodeType!==O?P(!1):void 0,o){var s=r(t);if(E.canReuseMarkup(e,s))return void h.precacheNode(n,s);var l=s.getAttribute(E.CHECKSUM_ATTR_NAME);s.removeAttribute(E.CHECKSUM_ATTR_NAME);var u=s.outerHTML;s.setAttribute(E.CHECKSUM_ATTR_NAME,l);var c=e,d=a(c,u);" (client) "+c.substring(d-20,d+20)+"\n (server) "+u.substring(d-20,d+20);t.nodeType===D?P(!1):void 0}if(t.nodeType===D?P(!1):void 0,i.useCreateElement){for(;t.lastChild;)t.removeChild(t.lastChild);p.insertTreeBefore(t,e,null)}else w(t,e),h.precacheNode(n,t.firstChild)}};t.exports=U},{"./DOMLazyTree":24,"./DOMProperty":26,"./ReactBrowserEventEmitter":43,"./ReactCurrentOwner":52,"./ReactDOMComponentTree":57,"./ReactDOMContainerInfo":58,"./ReactDOMFeatureFlags":62,"./ReactElement":76,"./ReactFeatureFlags":82,"./ReactInstrumentation":86,"./ReactMarkupChecksum":88,"./ReactReconciler":101,"./ReactUpdateQueue":104,"./ReactUpdates":105,"./instantiateReactComponent":143,"./setInnerHTML":149,"./shouldUpdateReactComponent":151,"fbjs/lib/emptyObject":162,"fbjs/lib/invariant":169,"fbjs/lib/warning":179}],90:[function(e,t,n){"use strict";function a(e,t,n){return{type:d.INSERT_MARKUP,content:e,fromIndex:null,fromNode:null,toIndex:n,afterNode:t}}function r(e,t,n){return{type:d.MOVE_EXISTING,content:null,fromIndex:e._mountIndex,fromNode:p.getNativeNode(e),toIndex:n,afterNode:t}}function o(e,t){return{type:d.REMOVE_NODE,content:null,fromIndex:e._mountIndex,fromNode:t,toIndex:null,afterNode:null}}function i(e){return{type:d.SET_MARKUP,content:e,fromIndex:null,fromNode:null,toIndex:null,afterNode:null}}function s(e){return{type:d.TEXT_CONTENT,content:e,fromIndex:null,fromNode:null,toIndex:null,afterNode:null}}function l(e,t){return t&&(e=e||[],e.push(t)),e}function u(e,t){c.processChildrenUpdates(e,t)}var c=e("./ReactComponentEnvironment"),d=(e("./ReactInstrumentation"),e("./ReactMultiChildUpdateTypes")),p=(e("./ReactCurrentOwner"),e("./ReactReconciler")),f=e("./ReactChildReconciler"),m=(e("fbjs/lib/emptyFunction"),e("./flattenChildren")),h=e("fbjs/lib/invariant"),v={Mixin:{_reconcilerInstantiateChildren:function(e,t,n){return f.instantiateChildren(e,t,n)},_reconcilerUpdateChildren:function(e,t,n,a,r){var o;return o=m(t),f.updateChildren(e,o,n,a,r),o},mountChildren:function(e,t,n){var a=this._reconcilerInstantiateChildren(e,t,n);this._renderedChildren=a;var r=[],o=0;for(var i in a)if(a.hasOwnProperty(i)){var s=a[i],l=p.mountComponent(s,t,this,this._nativeContainerInfo,n);s._mountIndex=o++,r.push(l)}return r},updateTextContent:function(e){var t=this._renderedChildren;f.unmountChildren(t,!1);for(var n in t)t.hasOwnProperty(n)&&h(!1);var a=[s(e)];u(this,a)},updateMarkup:function(e){var t=this._renderedChildren;f.unmountChildren(t,!1);for(var n in t)t.hasOwnProperty(n)&&h(!1);var a=[i(e)];u(this,a)},updateChildren:function(e,t,n){this._updateChildren(e,t,n)},_updateChildren:function(e,t,n){var a=this._renderedChildren,r={},o=this._reconcilerUpdateChildren(a,e,r,t,n);if(o||a){var i,s=null,c=0,d=0,f=null;for(i in o)if(o.hasOwnProperty(i)){var m=a&&a[i],h=o[i];m===h?(s=l(s,this.moveChild(m,f,d,c)),c=Math.max(m._mountIndex,c),m._mountIndex=d):(m&&(c=Math.max(m._mountIndex,c)),s=l(s,this._mountChildAtIndex(h,f,d,t,n))),d++,f=p.getNativeNode(h)}for(i in r)r.hasOwnProperty(i)&&(s=l(s,this._unmountChild(a[i],r[i])));s&&u(this,s),this._renderedChildren=o}},unmountChildren:function(e){var t=this._renderedChildren;f.unmountChildren(t,e),this._renderedChildren=null},moveChild:function(e,t,n,a){return e._mountIndex<a?r(e,t,n):void 0},createChild:function(e,t,n){return a(n,t,e._mountIndex)},removeChild:function(e,t){return o(e,t)},_mountChildAtIndex:function(e,t,n,a,r){var o=p.mountComponent(e,a,this,this._nativeContainerInfo,r);return e._mountIndex=n,this.createChild(e,t,o)},_unmountChild:function(e,t){var n=this.removeChild(e,t);return e._mountIndex=null,n}}};t.exports=v},{"./ReactChildReconciler":44,"./ReactComponentEnvironment":49,"./ReactCurrentOwner":52,"./ReactInstrumentation":86,"./ReactMultiChildUpdateTypes":91,"./ReactReconciler":101,"./flattenChildren":132,"fbjs/lib/emptyFunction":161,"fbjs/lib/invariant":169}],91:[function(e,t,n){"use strict";var a=e("fbjs/lib/keyMirror"),r=a({INSERT_MARKUP:null,MOVE_EXISTING:null,REMOVE_NODE:null,SET_MARKUP:null,TEXT_CONTENT:null});t.exports=r},{"fbjs/lib/keyMirror":172}],92:[function(e,t,n){"use strict";function a(e){if("function"==typeof e.type)return e.type;var t=e.type,n=d[t];return null==n&&(d[t]=n=u(t)),n}function r(e){return c?void 0:l(!1),new c(e)}function o(e){return new p(e)}function i(e){return e instanceof p}var s=e("object-assign"),l=e("fbjs/lib/invariant"),u=null,c=null,d={},p=null,f={injectGenericComponentClass:function(e){c=e},injectTextComponentClass:function(e){p=e},injectComponentClasses:function(e){s(d,e)}},m={getComponentClassForElement:a,createInternalComponent:r,createInstanceForText:o,isTextComponent:i,injection:f};t.exports=m},{"fbjs/lib/invariant":169,"object-assign":180}],93:[function(e,t,n){"use strict";var a=[],r={onNativeOperation:function(e,t,n){a.push({instanceID:e,type:t,payload:n})},clearHistory:function(){r._preventClearing||(a=[])},getHistory:function(){return a}};t.exports=r},{}],94:[function(e,t,n){"use strict";var a=e("./ReactElement"),r=e("fbjs/lib/invariant"),o={NATIVE:0,COMPOSITE:1,EMPTY:2,getType:function(e){return null===e||e===!1?o.EMPTY:a.isValidElement(e)?"function"==typeof e.type?o.COMPOSITE:o.NATIVE:void r(!1)}};t.exports=o},{"./ReactElement":76,"fbjs/lib/invariant":169}],95:[function(e,t,n){"use strict";function a(e,t){}var r=(e("fbjs/lib/warning"),{isMounted:function(e){return!1},enqueueCallback:function(e,t){},enqueueForceUpdate:function(e){a(e,"forceUpdate")},enqueueReplaceState:function(e,t){a(e,"replaceState")},enqueueSetState:function(e,t){a(e,"setState")}});t.exports=r},{"fbjs/lib/warning":179}],96:[function(e,t,n){"use strict";var a=e("fbjs/lib/invariant"),r={isValidOwner:function(e){return!(!e||"function"!=typeof e.attachRef||"function"!=typeof e.detachRef)},addComponentAsRefTo:function(e,t,n){r.isValidOwner(n)?void 0:a(!1),n.attachRef(t,e)},removeComponentAsRefFrom:function(e,t,n){r.isValidOwner(n)?void 0:a(!1);var o=n.getPublicInstance();o&&o.refs[t]===e.getPublicInstance()&&n.detachRef(t)}};t.exports=r},{"fbjs/lib/invariant":169}],97:[function(e,t,n){"use strict";var a={};t.exports=a},{}],98:[function(e,t,n){"use strict";var a=e("fbjs/lib/keyMirror"),r=a({prop:null,context:null,childContext:null});t.exports=r},{"fbjs/lib/keyMirror":172}],99:[function(e,t,n){"use strict";function a(e,t){return e===t?0!==e||1/e===1/t:e!==e&&t!==t}function r(e){function t(t,n,a,r,o,i){if(r=r||k,i=i||a,null==n[a]){var s=E[o];return t?new Error("Required "+s+" `"+i+"` was not specified in "+("`"+r+"`.")):null}return e(n,a,r,o,i)}var n=t.bind(null,!1);return n.isRequired=t.bind(null,!0),n}function o(e){function t(t,n,a,r,o){var i=t[n],s=v(i);if(s!==e){var l=E[r],u=g(i);return new Error("Invalid "+l+" `"+o+"` of type "+("`"+u+"` supplied to `"+a+"`, expected ")+("`"+e+"`."))}return null}return r(t)}function i(){return r(_.thatReturns(null))}function s(e){function t(t,n,a,r,o){if("function"!=typeof e)return new Error("Property `"+o+"` of component `"+a+"` has invalid PropType notation inside arrayOf.");var i=t[n];if(!Array.isArray(i)){var s=E[r],l=v(i);return new Error("Invalid "+s+" `"+o+"` of type "+("`"+l+"` supplied to `"+a+"`, expected an array."))}for(var u=0;u<i.length;u++){var c=e(i,u,a,r,o+"["+u+"]");if(c instanceof Error)return c}return null}return r(t)}function l(){function e(e,t,n,a,r){if(!b.isValidElement(e[t])){var o=E[a];return new Error("Invalid "+o+" `"+r+"` supplied to "+("`"+n+"`, expected a single ReactElement."))}return null}return r(e)}function u(e){function t(t,n,a,r,o){if(!(t[n]instanceof e)){var i=E[r],s=e.name||k,l=y(t[n]);return new Error("Invalid "+i+" `"+o+"` of type "+("`"+l+"` supplied to `"+a+"`, expected ")+("instance of `"+s+"`."))}return null}return r(t)}function c(e){function t(t,n,r,o,i){for(var s=t[n],l=0;l<e.length;l++)if(a(s,e[l]))return null;var u=E[o],c=JSON.stringify(e);return new Error("Invalid "+u+" `"+i+"` of value `"+s+"` "+("supplied to `"+r+"`, expected one of "+c+"."))}return r(Array.isArray(e)?t:function(){return new Error("Invalid argument supplied to oneOf, expected an instance of array.")})}function d(e){function t(t,n,a,r,o){if("function"!=typeof e)return new Error("Property `"+o+"` of component `"+a+"` has invalid PropType notation inside objectOf.");var i=t[n],s=v(i);if("object"!==s){var l=E[r];return new Error("Invalid "+l+" `"+o+"` of type "+("`"+s+"` supplied to `"+a+"`, expected an object."))}for(var u in i)if(i.hasOwnProperty(u)){var c=e(i,u,a,r,o+"."+u);if(c instanceof Error)return c}return null}return r(t)}function p(e){function t(t,n,a,r,o){for(var i=0;i<e.length;i++){var s=e[i];if(null==s(t,n,a,r,o))return null}var l=E[r];return new Error("Invalid "+l+" `"+o+"` supplied to "+("`"+a+"`."))}return r(Array.isArray(e)?t:function(){return new Error("Invalid argument supplied to oneOfType, expected an instance of array.")})}function f(){function e(e,t,n,a,r){if(!h(e[t])){var o=E[a];return new Error("Invalid "+o+" `"+r+"` supplied to "+("`"+n+"`, expected a ReactNode."))}return null}return r(e)}function m(e){function t(t,n,a,r,o){var i=t[n],s=v(i);if("object"!==s){var l=E[r];return new Error("Invalid "+l+" `"+o+"` of type `"+s+"` "+("supplied to `"+a+"`, expected `object`."))}for(var u in e){var c=e[u];if(c){var d=c(i,u,a,r,o+"."+u);if(d)return d}}return null}return r(t)}function h(e){switch(typeof e){case"number":case"string":case"undefined":return!0;case"boolean":return!e;case"object":if(Array.isArray(e))return e.every(h);if(null===e||b.isValidElement(e))return!0;var t=C(e);if(!t)return!1;var n,a=t.call(e);if(t!==e.entries){for(;!(n=a.next()).done;)if(!h(n.value))return!1}else for(;!(n=a.next()).done;){var r=n.value;if(r&&!h(r[1]))return!1}return!0;default:return!1}}function v(e){var t=typeof e;return Array.isArray(e)?"array":e instanceof RegExp?"object":t}function g(e){var t=v(e);if("object"===t){if(e instanceof Date)return"date";if(e instanceof RegExp)return"regexp"}return t}function y(e){return e.constructor&&e.constructor.name?e.constructor.name:k}var b=e("./ReactElement"),E=e("./ReactPropTypeLocationNames"),_=e("fbjs/lib/emptyFunction"),C=e("./getIteratorFn"),k="<<anonymous>>",T={array:o("array"),bool:o("boolean"),func:o("function"),number:o("number"),object:o("object"),string:o("string"),any:i(),arrayOf:s,element:l(),instanceOf:u,node:f(),objectOf:d,oneOf:c,oneOfType:p,shape:m};t.exports=T},{"./ReactElement":76,"./ReactPropTypeLocationNames":97,"./getIteratorFn":138,"fbjs/lib/emptyFunction":161}],100:[function(e,t,n){"use strict";function a(e){this.reinitializeTransaction(),this.renderToStaticMarkup=!1,this.reactMountReady=o.getPooled(null),this.useCreateElement=e}var r=e("object-assign"),o=e("./CallbackQueue"),i=e("./PooledClass"),s=e("./ReactBrowserEventEmitter"),l=e("./ReactInputSelection"),u=e("./Transaction"),c={initialize:l.getSelectionInformation,close:l.restoreSelection},d={initialize:function(){var e=s.isEnabled();return s.setEnabled(!1),e},close:function(e){s.setEnabled(e)}},p={initialize:function(){this.reactMountReady.reset()},close:function(){this.reactMountReady.notifyAll()}},f=[c,d,p],m={getTransactionWrappers:function(){return f},getReactMountReady:function(){return this.reactMountReady},checkpoint:function(){return this.reactMountReady.checkpoint()},rollback:function(e){this.reactMountReady.rollback(e)},destructor:function(){o.release(this.reactMountReady),this.reactMountReady=null}};r(a.prototype,u.Mixin,m),i.addPoolingTo(a),t.exports=a},{"./CallbackQueue":21,"./PooledClass":41,"./ReactBrowserEventEmitter":43,"./ReactInputSelection":84,"./Transaction":123,"object-assign":180}],101:[function(e,t,n){"use strict";function a(){r.attachRefs(this,this._currentElement)}var r=e("./ReactRef"),o=(e("./ReactInstrumentation"),e("fbjs/lib/invariant")),i={mountComponent:function(e,t,n,r,o){var i=e.mountComponent(t,n,r,o);return e._currentElement&&null!=e._currentElement.ref&&t.getReactMountReady().enqueue(a,e),i},getNativeNode:function(e){return e.getNativeNode()},unmountComponent:function(e,t){r.detachRefs(e,e._currentElement),e.unmountComponent(t)},receiveComponent:function(e,t,n,o){var i=e._currentElement;if(t!==i||o!==e._context){var s=r.shouldUpdateRefs(i,t);s&&r.detachRefs(e,i),e.receiveComponent(t,n,o),s&&e._currentElement&&null!=e._currentElement.ref&&n.getReactMountReady().enqueue(a,e)}},performUpdateIfNecessary:function(e,t,n){return e._updateBatchNumber!==n?void(null!=e._updateBatchNumber&&e._updateBatchNumber!==n+1?o(!1):void 0):void e.performUpdateIfNecessary(t)}};t.exports=i},{"./ReactInstrumentation":86,"./ReactRef":102,"fbjs/lib/invariant":169}],102:[function(e,t,n){"use strict";function a(e,t,n){"function"==typeof e?e(t.getPublicInstance()):o.addComponentAsRefTo(t,e,n)}function r(e,t,n){"function"==typeof e?e(null):o.removeComponentAsRefFrom(t,e,n)}var o=e("./ReactOwner"),i={};i.attachRefs=function(e,t){if(null!==t&&t!==!1){var n=t.ref;null!=n&&a(n,e,t._owner)}},i.shouldUpdateRefs=function(e,t){var n=null===e||e===!1,a=null===t||t===!1;return n||a||t._owner!==e._owner||t.ref!==e.ref},i.detachRefs=function(e,t){if(null!==t&&t!==!1){var n=t.ref;null!=n&&r(n,e,t._owner)}},t.exports=i},{"./ReactOwner":96}],103:[function(e,t,n){"use strict";function a(e){this.reinitializeTransaction(),this.renderToStaticMarkup=e,this.useCreateElement=!1}var r=e("object-assign"),o=e("./PooledClass"),i=e("./Transaction"),s=[],l={enqueue:function(){}},u={getTransactionWrappers:function(){return s},getReactMountReady:function(){return l},destructor:function(){},checkpoint:function(){},rollback:function(){}};r(a.prototype,i.Mixin,u),o.addPoolingTo(a),t.exports=a},{"./PooledClass":41,"./Transaction":123,"object-assign":180}],104:[function(e,t,n){"use strict";function a(e){i.enqueueUpdate(e)}function r(e,t){var n=o.get(e);return n?n:null}var o=(e("./ReactCurrentOwner"),e("./ReactInstanceMap")),i=e("./ReactUpdates"),s=e("fbjs/lib/invariant"),l=(e("fbjs/lib/warning"),{isMounted:function(e){var t=o.get(e);return t?!!t._renderedComponent:!1},enqueueCallback:function(e,t,n){l.validateCallback(t,n);var o=r(e);return o?(o._pendingCallbacks?o._pendingCallbacks.push(t):o._pendingCallbacks=[t],void a(o)):null},enqueueCallbackInternal:function(e,t){e._pendingCallbacks?e._pendingCallbacks.push(t):e._pendingCallbacks=[t],a(e)},enqueueForceUpdate:function(e){var t=r(e,"forceUpdate");t&&(t._pendingForceUpdate=!0,a(t))},enqueueReplaceState:function(e,t){var n=r(e,"replaceState");n&&(n._pendingStateQueue=[t],n._pendingReplaceState=!0,a(n))},enqueueSetState:function(e,t){var n=r(e,"setState");if(n){var o=n._pendingStateQueue||(n._pendingStateQueue=[]);o.push(t),a(n)}},enqueueElementInternal:function(e,t){e._pendingElement=t,a(e)},validateCallback:function(e,t){e&&"function"!=typeof e?s(!1):void 0}});t.exports=l},{"./ReactCurrentOwner":52,"./ReactInstanceMap":85,"./ReactUpdates":105,"fbjs/lib/invariant":169,"fbjs/lib/warning":179}],105:[function(e,t,n){"use strict";function a(){w.ReactReconcileTransaction&&_?void 0:v(!1)}function r(){this.reinitializeTransaction(),this.dirtyComponentsLength=null,this.callbackQueue=d.getPooled(),this.reconcileTransaction=w.ReactReconcileTransaction.getPooled(!0)}function o(e,t,n,r,o,i){a(),_.batchedUpdates(e,t,n,r,o,i)}function i(e,t){return e._mountOrder-t._mountOrder}function s(e){var t=e.dirtyComponentsLength;t!==g.length?v(!1):void 0,g.sort(i),y++;for(var n=0;t>n;n++){var a=g[n],r=a._pendingCallbacks;a._pendingCallbacks=null;var o;if(f.logTopLevelRenders){var s=a;a._currentElement.props===a._renderedComponent._currentElement&&(s=a._renderedComponent),o="React update: "+s.getName()}if(m.performUpdateIfNecessary(a,e.reconcileTransaction,y),r)for(var l=0;l<r.length;l++)e.callbackQueue.enqueue(r[l],a.getPublicInstance())}}function l(e){return a(),_.isBatchingUpdates?(g.push(e),void(null==e._updateBatchNumber&&(e._updateBatchNumber=y+1))):void _.batchedUpdates(l,e)}function u(e,t){_.isBatchingUpdates?void 0:v(!1),b.enqueue(e,t),E=!0}var c=e("object-assign"),d=e("./CallbackQueue"),p=e("./PooledClass"),f=e("./ReactFeatureFlags"),m=(e("./ReactInstrumentation"),e("./ReactReconciler")),h=e("./Transaction"),v=e("fbjs/lib/invariant"),g=[],y=0,b=d.getPooled(),E=!1,_=null,C={initialize:function(){this.dirtyComponentsLength=g.length},close:function(){this.dirtyComponentsLength!==g.length?(g.splice(0,this.dirtyComponentsLength),N()):g.length=0}},k={initialize:function(){this.callbackQueue.reset()},close:function(){this.callbackQueue.notifyAll()}},T=[C,k];c(r.prototype,h.Mixin,{getTransactionWrappers:function(){return T},destructor:function(){this.dirtyComponentsLength=null,d.release(this.callbackQueue),this.callbackQueue=null,w.ReactReconcileTransaction.release(this.reconcileTransaction),this.reconcileTransaction=null},perform:function(e,t,n){return h.Mixin.perform.call(this,this.reconcileTransaction.perform,this.reconcileTransaction,e,t,n)}}),p.addPoolingTo(r);var N=function(){for(;g.length||E;){if(g.length){var e=r.getPooled();e.perform(s,null,e),r.release(e)}if(E){E=!1;var t=b;b=d.getPooled(),t.notifyAll(),d.release(t)}}},P={injectReconcileTransaction:function(e){e?void 0:v(!1),w.ReactReconcileTransaction=e},injectBatchingStrategy:function(e){e?void 0:v(!1),"function"!=typeof e.batchedUpdates?v(!1):void 0,"boolean"!=typeof e.isBatchingUpdates?v(!1):void 0,_=e}},w={ReactReconcileTransaction:null,batchedUpdates:o,enqueueUpdate:l,flushBatchedUpdates:N,injection:P,asap:u};t.exports=w},{"./CallbackQueue":21,"./PooledClass":41,"./ReactFeatureFlags":82,"./ReactInstrumentation":86,"./ReactReconciler":101,"./Transaction":123,"fbjs/lib/invariant":169,"object-assign":180}],106:[function(e,t,n){"use strict";t.exports="15.1.0"},{}],107:[function(e,t,n){"use strict";var a={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"},r={accentHeight:"accent-height",accumulate:0,additive:0,alignmentBaseline:"alignment-baseline",allowReorder:"allowReorder",alphabetic:0,amplitude:0,arabicForm:"arabic-form",ascent:0,attributeName:"attributeName",attributeType:"attributeType",autoReverse:"autoReverse",azimuth:0,baseFrequency:"baseFrequency",baseProfile:"baseProfile",baselineShift:"baseline-shift",bbox:0,begin:0,bias:0,by:0,calcMode:"calcMode",capHeight:"cap-height",clip:0,clipPath:"clip-path",clipRule:"clip-rule",clipPathUnits:"clipPathUnits",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",contentScriptType:"contentScriptType",contentStyleType:"contentStyleType",cursor:0,cx:0,cy:0,d:0,decelerate:0,descent:0,diffuseConstant:"diffuseConstant",direction:0,display:0,divisor:0,dominantBaseline:"dominant-baseline",dur:0,dx:0,dy:0,edgeMode:"edgeMode",elevation:0,enableBackground:"enable-background",end:0,exponent:0,externalResourcesRequired:"externalResourcesRequired",fill:0,fillOpacity:"fill-opacity",fillRule:"fill-rule",filter:0,filterRes:"filterRes",filterUnits:"filterUnits",floodColor:"flood-color",floodOpacity:"flood-opacity",focusable:0,fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",format:0,from:0,fx:0,fy:0,g1:0,g2:0,glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",glyphRef:"glyphRef",gradientTransform:"gradientTransform",gradientUnits:"gradientUnits",hanging:0,horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",ideographic:0,imageRendering:"image-rendering",in:0,in2:0,intercept:0,k:0,k1:0,k2:0,k3:0,k4:0,kernelMatrix:"kernelMatrix",kernelUnitLength:"kernelUnitLength",kerning:0,keyPoints:"keyPoints",keySplines:"keySplines",keyTimes:"keyTimes",lengthAdjust:"lengthAdjust",letterSpacing:"letter-spacing",lightingColor:"lighting-color",limitingConeAngle:"limitingConeAngle",local:0,markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",markerHeight:"markerHeight",markerUnits:"markerUnits",markerWidth:"markerWidth",mask:0,
maskContentUnits:"maskContentUnits",maskUnits:"maskUnits",mathematical:0,mode:0,numOctaves:"numOctaves",offset:0,opacity:0,operator:0,order:0,orient:0,orientation:0,origin:0,overflow:0,overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pathLength:"pathLength",patternContentUnits:"patternContentUnits",patternTransform:"patternTransform",patternUnits:"patternUnits",pointerEvents:"pointer-events",points:0,pointsAtX:"pointsAtX",pointsAtY:"pointsAtY",pointsAtZ:"pointsAtZ",preserveAlpha:"preserveAlpha",preserveAspectRatio:"preserveAspectRatio",primitiveUnits:"primitiveUnits",r:0,radius:0,refX:"refX",refY:"refY",renderingIntent:"rendering-intent",repeatCount:"repeatCount",repeatDur:"repeatDur",requiredExtensions:"requiredExtensions",requiredFeatures:"requiredFeatures",restart:0,result:0,rotate:0,rx:0,ry:0,scale:0,seed:0,shapeRendering:"shape-rendering",slope:0,spacing:0,specularConstant:"specularConstant",specularExponent:"specularExponent",speed:0,spreadMethod:"spreadMethod",startOffset:"startOffset",stdDeviation:"stdDeviation",stemh:0,stemv:0,stitchTiles:"stitchTiles",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",string:0,stroke:0,strokeDasharray:"stroke-dasharray",strokeDashoffset:"stroke-dashoffset",strokeLinecap:"stroke-linecap",strokeLinejoin:"stroke-linejoin",strokeMiterlimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",surfaceScale:"surfaceScale",systemLanguage:"systemLanguage",tableValues:"tableValues",targetX:"targetX",targetY:"targetY",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",textLength:"textLength",to:0,transform:0,u1:0,u2:0,underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicode:0,unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",values:0,vectorEffect:"vector-effect",version:0,vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",viewBox:"viewBox",viewTarget:"viewTarget",visibility:0,widths:0,wordSpacing:"word-spacing",writingMode:"writing-mode",x:0,xHeight:"x-height",x1:0,x2:0,xChannelSelector:"xChannelSelector",xlinkActuate:"xlink:actuate",xlinkArcrole:"xlink:arcrole",xlinkHref:"xlink:href",xlinkRole:"xlink:role",xlinkShow:"xlink:show",xlinkTitle:"xlink:title",xlinkType:"xlink:type",xmlBase:"xml:base",xmlLang:"xml:lang",xmlSpace:"xml:space",y:0,y1:0,y2:0,yChannelSelector:"yChannelSelector",z:0,zoomAndPan:"zoomAndPan"},o={Properties:{},DOMAttributeNamespaces:{xlinkActuate:a.xlink,xlinkArcrole:a.xlink,xlinkHref:a.xlink,xlinkRole:a.xlink,xlinkShow:a.xlink,xlinkTitle:a.xlink,xlinkType:a.xlink,xmlBase:a.xml,xmlLang:a.xml,xmlSpace:a.xml},DOMAttributeNames:{}};Object.keys(r).forEach(function(e){o.Properties[e]=0,r[e]&&(o.DOMAttributeNames[e]=r[e])}),t.exports=o},{}],108:[function(e,t,n){"use strict";function a(e){if("selectionStart"in e&&u.hasSelectionCapabilities(e))return{start:e.selectionStart,end:e.selectionEnd};if(window.getSelection){var t=window.getSelection();return{anchorNode:t.anchorNode,anchorOffset:t.anchorOffset,focusNode:t.focusNode,focusOffset:t.focusOffset}}if(document.selection){var n=document.selection.createRange();return{parentElement:n.parentElement(),text:n.text,top:n.boundingTop,left:n.boundingLeft}}}function r(e,t){if(_||null==y||y!==d())return null;var n=a(y);if(!E||!m(E,n)){E=n;var r=c.getPooled(g.select,b,e,t);return r.type="select",r.target=y,i.accumulateTwoPhaseDispatches(r),r}return null}var o=e("./EventConstants"),i=e("./EventPropagators"),s=e("fbjs/lib/ExecutionEnvironment"),l=e("./ReactDOMComponentTree"),u=e("./ReactInputSelection"),c=e("./SyntheticEvent"),d=e("fbjs/lib/getActiveElement"),p=e("./isTextInputElement"),f=e("fbjs/lib/keyOf"),m=e("fbjs/lib/shallowEqual"),h=o.topLevelTypes,v=s.canUseDOM&&"documentMode"in document&&document.documentMode<=11,g={select:{phasedRegistrationNames:{bubbled:f({onSelect:null}),captured:f({onSelectCapture:null})},dependencies:[h.topBlur,h.topContextMenu,h.topFocus,h.topKeyDown,h.topMouseDown,h.topMouseUp,h.topSelectionChange]}},y=null,b=null,E=null,_=!1,C=!1,k=f({onSelect:null}),T={eventTypes:g,extractEvents:function(e,t,n,a){if(!C)return null;var o=t?l.getNodeFromInstance(t):window;switch(e){case h.topFocus:(p(o)||"true"===o.contentEditable)&&(y=o,b=t,E=null);break;case h.topBlur:y=null,b=null,E=null;break;case h.topMouseDown:_=!0;break;case h.topContextMenu:case h.topMouseUp:return _=!1,r(n,a);case h.topSelectionChange:if(v)break;case h.topKeyDown:case h.topKeyUp:return r(n,a)}return null},didPutListener:function(e,t,n){t===k&&(C=!0)}};t.exports=T},{"./EventConstants":32,"./EventPropagators":36,"./ReactDOMComponentTree":57,"./ReactInputSelection":84,"./SyntheticEvent":114,"./isTextInputElement":145,"fbjs/lib/ExecutionEnvironment":155,"fbjs/lib/getActiveElement":164,"fbjs/lib/keyOf":173,"fbjs/lib/shallowEqual":178}],109:[function(e,t,n){"use strict";var a=e("./EventConstants"),r=e("fbjs/lib/EventListener"),o=e("./EventPropagators"),i=e("./ReactDOMComponentTree"),s=e("./SyntheticAnimationEvent"),l=e("./SyntheticClipboardEvent"),u=e("./SyntheticEvent"),c=e("./SyntheticFocusEvent"),d=e("./SyntheticKeyboardEvent"),p=e("./SyntheticMouseEvent"),f=e("./SyntheticDragEvent"),m=e("./SyntheticTouchEvent"),h=e("./SyntheticTransitionEvent"),v=e("./SyntheticUIEvent"),g=e("./SyntheticWheelEvent"),y=e("fbjs/lib/emptyFunction"),b=e("./getEventCharCode"),E=e("fbjs/lib/invariant"),_=e("fbjs/lib/keyOf"),C=a.topLevelTypes,k={abort:{phasedRegistrationNames:{bubbled:_({onAbort:!0}),captured:_({onAbortCapture:!0})}},animationEnd:{phasedRegistrationNames:{bubbled:_({onAnimationEnd:!0}),captured:_({onAnimationEndCapture:!0})}},animationIteration:{phasedRegistrationNames:{bubbled:_({onAnimationIteration:!0}),captured:_({onAnimationIterationCapture:!0})}},animationStart:{phasedRegistrationNames:{bubbled:_({onAnimationStart:!0}),captured:_({onAnimationStartCapture:!0})}},blur:{phasedRegistrationNames:{bubbled:_({onBlur:!0}),captured:_({onBlurCapture:!0})}},canPlay:{phasedRegistrationNames:{bubbled:_({onCanPlay:!0}),captured:_({onCanPlayCapture:!0})}},canPlayThrough:{phasedRegistrationNames:{bubbled:_({onCanPlayThrough:!0}),captured:_({onCanPlayThroughCapture:!0})}},click:{phasedRegistrationNames:{bubbled:_({onClick:!0}),captured:_({onClickCapture:!0})}},contextMenu:{phasedRegistrationNames:{bubbled:_({onContextMenu:!0}),captured:_({onContextMenuCapture:!0})}},copy:{phasedRegistrationNames:{bubbled:_({onCopy:!0}),captured:_({onCopyCapture:!0})}},cut:{phasedRegistrationNames:{bubbled:_({onCut:!0}),captured:_({onCutCapture:!0})}},doubleClick:{phasedRegistrationNames:{bubbled:_({onDoubleClick:!0}),captured:_({onDoubleClickCapture:!0})}},drag:{phasedRegistrationNames:{bubbled:_({onDrag:!0}),captured:_({onDragCapture:!0})}},dragEnd:{phasedRegistrationNames:{bubbled:_({onDragEnd:!0}),captured:_({onDragEndCapture:!0})}},dragEnter:{phasedRegistrationNames:{bubbled:_({onDragEnter:!0}),captured:_({onDragEnterCapture:!0})}},dragExit:{phasedRegistrationNames:{bubbled:_({onDragExit:!0}),captured:_({onDragExitCapture:!0})}},dragLeave:{phasedRegistrationNames:{bubbled:_({onDragLeave:!0}),captured:_({onDragLeaveCapture:!0})}},dragOver:{phasedRegistrationNames:{bubbled:_({onDragOver:!0}),captured:_({onDragOverCapture:!0})}},dragStart:{phasedRegistrationNames:{bubbled:_({onDragStart:!0}),captured:_({onDragStartCapture:!0})}},drop:{phasedRegistrationNames:{bubbled:_({onDrop:!0}),captured:_({onDropCapture:!0})}},durationChange:{phasedRegistrationNames:{bubbled:_({onDurationChange:!0}),captured:_({onDurationChangeCapture:!0})}},emptied:{phasedRegistrationNames:{bubbled:_({onEmptied:!0}),captured:_({onEmptiedCapture:!0})}},encrypted:{phasedRegistrationNames:{bubbled:_({onEncrypted:!0}),captured:_({onEncryptedCapture:!0})}},ended:{phasedRegistrationNames:{bubbled:_({onEnded:!0}),captured:_({onEndedCapture:!0})}},error:{phasedRegistrationNames:{bubbled:_({onError:!0}),captured:_({onErrorCapture:!0})}},focus:{phasedRegistrationNames:{bubbled:_({onFocus:!0}),captured:_({onFocusCapture:!0})}},input:{phasedRegistrationNames:{bubbled:_({onInput:!0}),captured:_({onInputCapture:!0})}},invalid:{phasedRegistrationNames:{bubbled:_({onInvalid:!0}),captured:_({onInvalidCapture:!0})}},keyDown:{phasedRegistrationNames:{bubbled:_({onKeyDown:!0}),captured:_({onKeyDownCapture:!0})}},keyPress:{phasedRegistrationNames:{bubbled:_({onKeyPress:!0}),captured:_({onKeyPressCapture:!0})}},keyUp:{phasedRegistrationNames:{bubbled:_({onKeyUp:!0}),captured:_({onKeyUpCapture:!0})}},load:{phasedRegistrationNames:{bubbled:_({onLoad:!0}),captured:_({onLoadCapture:!0})}},loadedData:{phasedRegistrationNames:{bubbled:_({onLoadedData:!0}),captured:_({onLoadedDataCapture:!0})}},loadedMetadata:{phasedRegistrationNames:{bubbled:_({onLoadedMetadata:!0}),captured:_({onLoadedMetadataCapture:!0})}},loadStart:{phasedRegistrationNames:{bubbled:_({onLoadStart:!0}),captured:_({onLoadStartCapture:!0})}},mouseDown:{phasedRegistrationNames:{bubbled:_({onMouseDown:!0}),captured:_({onMouseDownCapture:!0})}},mouseMove:{phasedRegistrationNames:{bubbled:_({onMouseMove:!0}),captured:_({onMouseMoveCapture:!0})}},mouseOut:{phasedRegistrationNames:{bubbled:_({onMouseOut:!0}),captured:_({onMouseOutCapture:!0})}},mouseOver:{phasedRegistrationNames:{bubbled:_({onMouseOver:!0}),captured:_({onMouseOverCapture:!0})}},mouseUp:{phasedRegistrationNames:{bubbled:_({onMouseUp:!0}),captured:_({onMouseUpCapture:!0})}},paste:{phasedRegistrationNames:{bubbled:_({onPaste:!0}),captured:_({onPasteCapture:!0})}},pause:{phasedRegistrationNames:{bubbled:_({onPause:!0}),captured:_({onPauseCapture:!0})}},play:{phasedRegistrationNames:{bubbled:_({onPlay:!0}),captured:_({onPlayCapture:!0})}},playing:{phasedRegistrationNames:{bubbled:_({onPlaying:!0}),captured:_({onPlayingCapture:!0})}},progress:{phasedRegistrationNames:{bubbled:_({onProgress:!0}),captured:_({onProgressCapture:!0})}},rateChange:{phasedRegistrationNames:{bubbled:_({onRateChange:!0}),captured:_({onRateChangeCapture:!0})}},reset:{phasedRegistrationNames:{bubbled:_({onReset:!0}),captured:_({onResetCapture:!0})}},scroll:{phasedRegistrationNames:{bubbled:_({onScroll:!0}),captured:_({onScrollCapture:!0})}},seeked:{phasedRegistrationNames:{bubbled:_({onSeeked:!0}),captured:_({onSeekedCapture:!0})}},seeking:{phasedRegistrationNames:{bubbled:_({onSeeking:!0}),captured:_({onSeekingCapture:!0})}},stalled:{phasedRegistrationNames:{bubbled:_({onStalled:!0}),captured:_({onStalledCapture:!0})}},submit:{phasedRegistrationNames:{bubbled:_({onSubmit:!0}),captured:_({onSubmitCapture:!0})}},suspend:{phasedRegistrationNames:{bubbled:_({onSuspend:!0}),captured:_({onSuspendCapture:!0})}},timeUpdate:{phasedRegistrationNames:{bubbled:_({onTimeUpdate:!0}),captured:_({onTimeUpdateCapture:!0})}},touchCancel:{phasedRegistrationNames:{bubbled:_({onTouchCancel:!0}),captured:_({onTouchCancelCapture:!0})}},touchEnd:{phasedRegistrationNames:{bubbled:_({onTouchEnd:!0}),captured:_({onTouchEndCapture:!0})}},touchMove:{phasedRegistrationNames:{bubbled:_({onTouchMove:!0}),captured:_({onTouchMoveCapture:!0})}},touchStart:{phasedRegistrationNames:{bubbled:_({onTouchStart:!0}),captured:_({onTouchStartCapture:!0})}},transitionEnd:{phasedRegistrationNames:{bubbled:_({onTransitionEnd:!0}),captured:_({onTransitionEndCapture:!0})}},volumeChange:{phasedRegistrationNames:{bubbled:_({onVolumeChange:!0}),captured:_({onVolumeChangeCapture:!0})}},waiting:{phasedRegistrationNames:{bubbled:_({onWaiting:!0}),captured:_({onWaitingCapture:!0})}},wheel:{phasedRegistrationNames:{bubbled:_({onWheel:!0}),captured:_({onWheelCapture:!0})}}},T={topAbort:k.abort,topAnimationEnd:k.animationEnd,topAnimationIteration:k.animationIteration,topAnimationStart:k.animationStart,topBlur:k.blur,topCanPlay:k.canPlay,topCanPlayThrough:k.canPlayThrough,topClick:k.click,topContextMenu:k.contextMenu,topCopy:k.copy,topCut:k.cut,topDoubleClick:k.doubleClick,topDrag:k.drag,topDragEnd:k.dragEnd,topDragEnter:k.dragEnter,topDragExit:k.dragExit,topDragLeave:k.dragLeave,topDragOver:k.dragOver,topDragStart:k.dragStart,topDrop:k.drop,topDurationChange:k.durationChange,topEmptied:k.emptied,topEncrypted:k.encrypted,topEnded:k.ended,topError:k.error,topFocus:k.focus,topInput:k.input,topInvalid:k.invalid,topKeyDown:k.keyDown,topKeyPress:k.keyPress,topKeyUp:k.keyUp,topLoad:k.load,topLoadedData:k.loadedData,topLoadedMetadata:k.loadedMetadata,topLoadStart:k.loadStart,topMouseDown:k.mouseDown,topMouseMove:k.mouseMove,topMouseOut:k.mouseOut,topMouseOver:k.mouseOver,topMouseUp:k.mouseUp,topPaste:k.paste,topPause:k.pause,topPlay:k.play,topPlaying:k.playing,topProgress:k.progress,topRateChange:k.rateChange,topReset:k.reset,topScroll:k.scroll,topSeeked:k.seeked,topSeeking:k.seeking,topStalled:k.stalled,topSubmit:k.submit,topSuspend:k.suspend,topTimeUpdate:k.timeUpdate,topTouchCancel:k.touchCancel,topTouchEnd:k.touchEnd,topTouchMove:k.touchMove,topTouchStart:k.touchStart,topTransitionEnd:k.transitionEnd,topVolumeChange:k.volumeChange,topWaiting:k.waiting,topWheel:k.wheel};for(var N in T)T[N].dependencies=[N];var P=_({onClick:null}),w={},M={eventTypes:k,extractEvents:function(e,t,n,a){var r=T[e];if(!r)return null;var i;switch(e){case C.topAbort:case C.topCanPlay:case C.topCanPlayThrough:case C.topDurationChange:case C.topEmptied:case C.topEncrypted:case C.topEnded:case C.topError:case C.topInput:case C.topInvalid:case C.topLoad:case C.topLoadedData:case C.topLoadedMetadata:case C.topLoadStart:case C.topPause:case C.topPlay:case C.topPlaying:case C.topProgress:case C.topRateChange:case C.topReset:case C.topSeeked:case C.topSeeking:case C.topStalled:case C.topSubmit:case C.topSuspend:case C.topTimeUpdate:case C.topVolumeChange:case C.topWaiting:i=u;break;case C.topKeyPress:if(0===b(n))return null;case C.topKeyDown:case C.topKeyUp:i=d;break;case C.topBlur:case C.topFocus:i=c;break;case C.topClick:if(2===n.button)return null;case C.topContextMenu:case C.topDoubleClick:case C.topMouseDown:case C.topMouseMove:case C.topMouseOut:case C.topMouseOver:case C.topMouseUp:i=p;break;case C.topDrag:case C.topDragEnd:case C.topDragEnter:case C.topDragExit:case C.topDragLeave:case C.topDragOver:case C.topDragStart:case C.topDrop:i=f;break;case C.topTouchCancel:case C.topTouchEnd:case C.topTouchMove:case C.topTouchStart:i=m;break;case C.topAnimationEnd:case C.topAnimationIteration:case C.topAnimationStart:i=s;break;case C.topTransitionEnd:i=h;break;case C.topScroll:i=v;break;case C.topWheel:i=g;break;case C.topCopy:case C.topCut:case C.topPaste:i=l}i?void 0:E(!1);var y=i.getPooled(r,t,n,a);return o.accumulateTwoPhaseDispatches(y),y},didPutListener:function(e,t,n){if(t===P){var a=e._rootNodeID,o=i.getNodeFromInstance(e);w[a]||(w[a]=r.listen(o,"click",y))}},willDeleteListener:function(e,t){if(t===P){var n=e._rootNodeID;w[n].remove(),delete w[n]}}};t.exports=M},{"./EventConstants":32,"./EventPropagators":36,"./ReactDOMComponentTree":57,"./SyntheticAnimationEvent":110,"./SyntheticClipboardEvent":111,"./SyntheticDragEvent":113,"./SyntheticEvent":114,"./SyntheticFocusEvent":115,"./SyntheticKeyboardEvent":117,"./SyntheticMouseEvent":118,"./SyntheticTouchEvent":119,"./SyntheticTransitionEvent":120,"./SyntheticUIEvent":121,"./SyntheticWheelEvent":122,"./getEventCharCode":134,"fbjs/lib/EventListener":154,"fbjs/lib/emptyFunction":161,"fbjs/lib/invariant":169,"fbjs/lib/keyOf":173}],110:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticEvent"),o={animationName:null,elapsedTime:null,pseudoElement:null};r.augmentClass(a,o),t.exports=a},{"./SyntheticEvent":114}],111:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticEvent"),o={clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}};r.augmentClass(a,o),t.exports=a},{"./SyntheticEvent":114}],112:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticEvent"),o={data:null};r.augmentClass(a,o),t.exports=a},{"./SyntheticEvent":114}],113:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticMouseEvent"),o={dataTransfer:null};r.augmentClass(a,o),t.exports=a},{"./SyntheticMouseEvent":118}],114:[function(e,t,n){"use strict";function a(e,t,n,a){this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=n;var r=this.constructor.Interface;for(var o in r)if(r.hasOwnProperty(o)){var s=r[o];s?this[o]=s(n):"target"===o?this.target=a:this[o]=n[o]}var l=null!=n.defaultPrevented?n.defaultPrevented:n.returnValue===!1;return l?this.isDefaultPrevented=i.thatReturnsTrue:this.isDefaultPrevented=i.thatReturnsFalse,this.isPropagationStopped=i.thatReturnsFalse,this}var r=e("object-assign"),o=e("./PooledClass"),i=e("fbjs/lib/emptyFunction"),s=(e("fbjs/lib/warning"),"function"==typeof Proxy,["dispatchConfig","_targetInst","nativeEvent","isDefaultPrevented","isPropagationStopped","_dispatchListeners","_dispatchInstances"]),l={type:null,target:null,currentTarget:i.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};r(a.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():e.returnValue=!1,this.isDefaultPrevented=i.thatReturnsTrue)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():e.cancelBubble=!0,this.isPropagationStopped=i.thatReturnsTrue)},persist:function(){this.isPersistent=i.thatReturnsTrue},isPersistent:i.thatReturnsFalse,destructor:function(){var e=this.constructor.Interface;for(var t in e)this[t]=null;for(var n=0;n<s.length;n++)this[s[n]]=null}}),a.Interface=l,a.augmentClass=function(e,t){var n=this,a=function(){};a.prototype=n.prototype;var i=new a;r(i,e.prototype),e.prototype=i,e.prototype.constructor=e,e.Interface=r({},n.Interface,t),e.augmentClass=n.augmentClass,o.addPoolingTo(e,o.fourArgumentPooler)},o.addPoolingTo(a,o.fourArgumentPooler),t.exports=a},{"./PooledClass":41,"fbjs/lib/emptyFunction":161,"fbjs/lib/warning":179,"object-assign":180}],115:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticUIEvent"),o={relatedTarget:null};r.augmentClass(a,o),t.exports=a},{"./SyntheticUIEvent":121}],116:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticEvent"),o={data:null};r.augmentClass(a,o),t.exports=a},{"./SyntheticEvent":114}],117:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticUIEvent"),o=e("./getEventCharCode"),i=e("./getEventKey"),s=e("./getEventModifierState"),l={key:i,location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:s,charCode:function(e){return"keypress"===e.type?o(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?o(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}};r.augmentClass(a,l),t.exports=a},{"./SyntheticUIEvent":121,"./getEventCharCode":134,"./getEventKey":135,"./getEventModifierState":136}],118:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticUIEvent"),o=e("./ViewportMetrics"),i=e("./getEventModifierState"),s={screenX:null,screenY:null,clientX:null,clientY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:i,button:function(e){var t=e.button;return"which"in e?t:2===t?2:4===t?1:0},buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)},pageX:function(e){return"pageX"in e?e.pageX:e.clientX+o.currentScrollLeft},pageY:function(e){return"pageY"in e?e.pageY:e.clientY+o.currentScrollTop}};r.augmentClass(a,s),t.exports=a},{"./SyntheticUIEvent":121,"./ViewportMetrics":124,"./getEventModifierState":136}],119:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticUIEvent"),o=e("./getEventModifierState"),i={touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:o};r.augmentClass(a,i),t.exports=a},{"./SyntheticUIEvent":121,"./getEventModifierState":136}],120:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticEvent"),o={propertyName:null,elapsedTime:null,pseudoElement:null};r.augmentClass(a,o),t.exports=a},{"./SyntheticEvent":114}],121:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticEvent"),o=e("./getEventTarget"),i={view:function(e){if(e.view)return e.view;var t=o(e);if(null!=t&&t.window===t)return t;var n=t.ownerDocument;return n?n.defaultView||n.parentWindow:window},detail:function(e){return e.detail||0}};r.augmentClass(a,i),t.exports=a},{"./SyntheticEvent":114,"./getEventTarget":137}],122:[function(e,t,n){"use strict";function a(e,t,n,a){return r.call(this,e,t,n,a)}var r=e("./SyntheticMouseEvent"),o={deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null};r.augmentClass(a,o),t.exports=a},{"./SyntheticMouseEvent":118}],123:[function(e,t,n){"use strict";var a=e("fbjs/lib/invariant"),r={reinitializeTransaction:function(){this.transactionWrappers=this.getTransactionWrappers(),this.wrapperInitData?this.wrapperInitData.length=0:this.wrapperInitData=[],this._isInTransaction=!1},_isInTransaction:!1,getTransactionWrappers:null,isInTransaction:function(){return!!this._isInTransaction},perform:function(e,t,n,r,o,i,s,l){this.isInTransaction()?a(!1):void 0;var u,c;try{this._isInTransaction=!0,u=!0,this.initializeAll(0),c=e.call(t,n,r,o,i,s,l),u=!1}finally{try{if(u)try{this.closeAll(0)}catch(e){}else this.closeAll(0)}finally{this._isInTransaction=!1}}return c},initializeAll:function(e){for(var t=this.transactionWrappers,n=e;n<t.length;n++){var a=t[n];try{this.wrapperInitData[n]=o.OBSERVED_ERROR,this.wrapperInitData[n]=a.initialize?a.initialize.call(this):null}finally{if(this.wrapperInitData[n]===o.OBSERVED_ERROR)try{this.initializeAll(n+1)}catch(e){}}}},closeAll:function(e){this.isInTransaction()?void 0:a(!1);for(var t=this.transactionWrappers,n=e;n<t.length;n++){var r,i=t[n],s=this.wrapperInitData[n];try{r=!0,s!==o.OBSERVED_ERROR&&i.close&&i.close.call(this,s),r=!1}finally{if(r)try{this.closeAll(n+1)}catch(e){}}}this.wrapperInitData.length=0}},o={Mixin:r,OBSERVED_ERROR:{}};t.exports=o},{"fbjs/lib/invariant":169}],124:[function(e,t,n){"use strict";var a={currentScrollLeft:0,currentScrollTop:0,refreshScrollValues:function(e){a.currentScrollLeft=e.x,a.currentScrollTop=e.y}};t.exports=a},{}],125:[function(e,t,n){"use strict";function a(e,t){if(null==t?r(!1):void 0,null==e)return t;var n=Array.isArray(e),a=Array.isArray(t);return n&&a?(e.push.apply(e,t),e):n?(e.push(t),e):a?[e].concat(t):[e,t]}var r=e("fbjs/lib/invariant");t.exports=a},{"fbjs/lib/invariant":169}],126:[function(e,t,n){"use strict";function a(e){for(var t=1,n=0,a=0,o=e.length,i=-4&o;i>a;){for(var s=Math.min(a+4096,i);s>a;a+=4)n+=(t+=e.charCodeAt(a))+(t+=e.charCodeAt(a+1))+(t+=e.charCodeAt(a+2))+(t+=e.charCodeAt(a+3));t%=r,n%=r}for(;o>a;a++)n+=t+=e.charCodeAt(a);return t%=r,n%=r,t|n<<16}var r=65521;t.exports=a},{}],127:[function(e,t,n){"use strict";var a=!1;t.exports=a},{}],128:[function(e,t,n){"use strict";var a=function(e){return"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,n,a,r){MSApp.execUnsafeLocalFunction(function(){return e(t,n,a,r)})}:e};t.exports=a},{}],129:[function(e,t,n){"use strict";function a(e,t,n){var a=null==t||"boolean"==typeof t||""===t;if(a)return"";var r=isNaN(t);if(r||0===t||o.hasOwnProperty(e)&&o[e])return""+t;if("string"==typeof t){t=t.trim()}return t+"px"}var r=e("./CSSProperty"),o=(e("fbjs/lib/warning"),r.isUnitlessNumber);t.exports=a},{"./CSSProperty":19,"fbjs/lib/warning":179}],130:[function(e,t,n){"use strict";function a(e){return o[e]}function r(e){return(""+e).replace(i,a)}var o={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#x27;"},i=/[&><"']/g;t.exports=r},{}],131:[function(e,t,n){"use strict";function a(e){if(null==e)return null;if(1===e.nodeType)return e;var t=o.get(e);return t?(t=i(t),t?r.getNodeFromInstance(t):null):void s(("function"==typeof e.render,!1))}var r=(e("./ReactCurrentOwner"),e("./ReactDOMComponentTree")),o=e("./ReactInstanceMap"),i=e("./getNativeComponentFromComposite"),s=e("fbjs/lib/invariant");e("fbjs/lib/warning");t.exports=a},{"./ReactCurrentOwner":52,"./ReactDOMComponentTree":57,"./ReactInstanceMap":85,"./getNativeComponentFromComposite":139,"fbjs/lib/invariant":169,"fbjs/lib/warning":179}],132:[function(e,t,n){"use strict";function a(e,t,n){var a=e,r=void 0===a[n];r&&null!=t&&(a[n]=t)}function r(e){if(null==e)return e;var t={};return o(e,a,t),t}var o=(e("./KeyEscapeUtils"),e("./traverseAllChildren"));e("fbjs/lib/warning");t.exports=r},{"./KeyEscapeUtils":39,"./traverseAllChildren":152,"fbjs/lib/warning":179}],133:[function(e,t,n){"use strict";var a=function(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)};t.exports=a},{}],134:[function(e,t,n){"use strict";function a(e){var t,n=e.keyCode;return"charCode"in e?(t=e.charCode,0===t&&13===n&&(t=13)):t=n,t>=32||13===t?t:0}t.exports=a},{}],135:[function(e,t,n){"use strict";function a(e){if(e.key){var t=o[e.key]||e.key;if("Unidentified"!==t)return t}if("keypress"===e.type){var n=r(e);return 13===n?"Enter":String.fromCharCode(n)}return"keydown"===e.type||"keyup"===e.type?i[e.keyCode]||"Unidentified":""}var r=e("./getEventCharCode"),o={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},i={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"};t.exports=a},{"./getEventCharCode":134}],136:[function(e,t,n){"use strict";function a(e){var t=this,n=t.nativeEvent;if(n.getModifierState)return n.getModifierState(e);var a=o[e];return a?!!n[a]:!1}function r(e){return a}var o={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};t.exports=r},{}],137:[function(e,t,n){"use strict";function a(e){var t=e.target||e.srcElement||window;return t.correspondingUseElement&&(t=t.correspondingUseElement),3===t.nodeType?t.parentNode:t}t.exports=a},{}],138:[function(e,t,n){"use strict";function a(e){var t=e&&(r&&e[r]||e[o]);return"function"==typeof t?t:void 0}var r="function"==typeof Symbol&&Symbol.iterator,o="@@iterator";t.exports=a},{}],139:[function(e,t,n){"use strict";function a(e){for(var t;(t=e._renderedNodeType)===r.COMPOSITE;)e=e._renderedComponent;return t===r.NATIVE?e._renderedComponent:t===r.EMPTY?null:void 0}var r=e("./ReactNodeTypes");t.exports=a},{"./ReactNodeTypes":94}],140:[function(e,t,n){"use strict";function a(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function r(e){for(;e;){if(e.nextSibling)return e.nextSibling;e=e.parentNode}}function o(e,t){for(var n=a(e),o=0,i=0;n;){if(3===n.nodeType){if(i=o+n.textContent.length,t>=o&&i>=t)return{node:n,offset:t-o};o=i}n=a(r(n))}}t.exports=o},{}],141:[function(e,t,n){"use strict";function a(){return!o&&r.canUseDOM&&(o="textContent"in document.documentElement?"textContent":"innerText"),o}var r=e("fbjs/lib/ExecutionEnvironment"),o=null;t.exports=a},{"fbjs/lib/ExecutionEnvironment":155}],142:[function(e,t,n){"use strict";function a(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n["ms"+e]="MS"+t,n["O"+e]="o"+t.toLowerCase(),n}function r(e){if(s[e])return s[e];if(!i[e])return e;var t=i[e];for(var n in t)if(t.hasOwnProperty(n)&&n in l)return s[e]=t[n];return""}var o=e("fbjs/lib/ExecutionEnvironment"),i={animationend:a("Animation","AnimationEnd"),animationiteration:a("Animation","AnimationIteration"),animationstart:a("Animation","AnimationStart"),transitionend:a("Transition","TransitionEnd")},s={},l={};o.canUseDOM&&(l=document.createElement("div").style,"AnimationEvent"in window||(delete i.animationend.animation,delete i.animationiteration.animation,delete i.animationstart.animation),"TransitionEvent"in window||delete i.transitionend.transition),t.exports=r},{"fbjs/lib/ExecutionEnvironment":155}],143:[function(e,t,n){"use strict";function a(e){return"function"==typeof e&&"undefined"!=typeof e.prototype&&"function"==typeof e.prototype.mountComponent&&"function"==typeof e.prototype.receiveComponent}function r(e){var t,n=null===e||e===!1;if(n)t=s.create(r);else if("object"==typeof e){var o=e;!o||"function"!=typeof o.type&&"string"!=typeof o.type?u(!1):void 0,t="string"==typeof o.type?l.createInternalComponent(o):a(o.type)?new o.type(o):new c(o)}else"string"==typeof e||"number"==typeof e?t=l.createInstanceForText(e):u(!1);t._mountIndex=0,t._mountImage=null;return t}var o=e("object-assign"),i=e("./ReactCompositeComponent"),s=e("./ReactEmptyComponent"),l=e("./ReactNativeComponent"),u=(e("./ReactInstrumentation"),e("fbjs/lib/invariant")),c=(e("fbjs/lib/warning"),function(e){this.construct(e)});o(c.prototype,i.Mixin,{_instantiateReactComponent:r});t.exports=r},{"./ReactCompositeComponent":51,"./ReactEmptyComponent":78,"./ReactInstrumentation":86,"./ReactNativeComponent":92,"fbjs/lib/invariant":169,"fbjs/lib/warning":179,"object-assign":180}],144:[function(e,t,n){"use strict";function a(e,t){if(!o.canUseDOM||t&&!("addEventListener"in document))return!1;var n="on"+e,a=n in document;if(!a){var i=document.createElement("div");i.setAttribute(n,"return;"),a="function"==typeof i[n]}return!a&&r&&"wheel"===e&&(a=document.implementation.hasFeature("Events.wheel","3.0")),a}var r,o=e("fbjs/lib/ExecutionEnvironment");o.canUseDOM&&(r=document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0),t.exports=a},{"fbjs/lib/ExecutionEnvironment":155}],145:[function(e,t,n){"use strict";function a(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&r[e.type]||"textarea"===t)}var r={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};t.exports=a},{}],146:[function(e,t,n){"use strict";function a(e){return r.isValidElement(e)?void 0:o(!1),e}var r=e("./ReactElement"),o=e("fbjs/lib/invariant");t.exports=a},{"./ReactElement":76,"fbjs/lib/invariant":169}],147:[function(e,t,n){"use strict";function a(e){return'"'+r(e)+'"'}var r=e("./escapeTextContentForBrowser");t.exports=a},{"./escapeTextContentForBrowser":130}],148:[function(e,t,n){"use strict";var a=e("./ReactMount");t.exports=a.renderSubtreeIntoContainer},{"./ReactMount":89}],149:[function(e,t,n){"use strict";var a=e("fbjs/lib/ExecutionEnvironment"),r=/^[ \r\n\t\f]/,o=/<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/,i=e("./createMicrosoftUnsafeLocalFunction"),s=i(function(e,t){e.innerHTML=t});if(a.canUseDOM){var l=document.createElement("div");l.innerHTML=" ",""===l.innerHTML&&(s=function(e,t){if(e.parentNode&&e.parentNode.replaceChild(e,e),r.test(t)||"<"===t[0]&&o.test(t)){e.innerHTML=String.fromCharCode(65279)+t;var n=e.firstChild;1===n.data.length?e.removeChild(n):n.deleteData(0,1)}else e.innerHTML=t}),l=null}t.exports=s},{"./createMicrosoftUnsafeLocalFunction":128,"fbjs/lib/ExecutionEnvironment":155}],150:[function(e,t,n){
"use strict";var a=e("fbjs/lib/ExecutionEnvironment"),r=e("./escapeTextContentForBrowser"),o=e("./setInnerHTML"),i=function(e,t){e.textContent=t};a.canUseDOM&&("textContent"in document.documentElement||(i=function(e,t){o(e,r(t))})),t.exports=i},{"./escapeTextContentForBrowser":130,"./setInnerHTML":149,"fbjs/lib/ExecutionEnvironment":155}],151:[function(e,t,n){"use strict";function a(e,t){var n=null===e||e===!1,a=null===t||t===!1;if(n||a)return n===a;var r=typeof e,o=typeof t;return"string"===r||"number"===r?"string"===o||"number"===o:"object"===o&&e.type===t.type&&e.key===t.key}t.exports=a},{}],152:[function(e,t,n){"use strict";function a(e,t){return e&&"object"==typeof e&&null!=e.key?u.escape(e.key):t.toString(36)}function r(e,t,n,o){var p=typeof e;if("undefined"!==p&&"boolean"!==p||(e=null),null===e||"string"===p||"number"===p||i.isValidElement(e))return n(o,e,""===t?c+a(e,0):t),1;var f,m,h=0,v=""===t?c:t+d;if(Array.isArray(e))for(var g=0;g<e.length;g++)f=e[g],m=v+a(f,g),h+=r(f,m,n,o);else{var y=s(e);if(y){var b,E=y.call(e);if(y!==e.entries)for(var _=0;!(b=E.next()).done;)f=b.value,m=v+a(f,_++),h+=r(f,m,n,o);else for(;!(b=E.next()).done;){var C=b.value;C&&(f=C[1],m=v+u.escape(C[0])+d+a(f,0),h+=r(f,m,n,o))}}else if("object"===p){String(e);l(!1)}}return h}function o(e,t,n){return null==e?0:r(e,"",t,n)}var i=(e("./ReactCurrentOwner"),e("./ReactElement")),s=e("./getIteratorFn"),l=e("fbjs/lib/invariant"),u=e("./KeyEscapeUtils"),c=(e("fbjs/lib/warning"),"."),d=":";t.exports=o},{"./KeyEscapeUtils":39,"./ReactCurrentOwner":52,"./ReactElement":76,"./getIteratorFn":138,"fbjs/lib/invariant":169,"fbjs/lib/warning":179}],153:[function(e,t,n){"use strict";var a=(e("object-assign"),e("fbjs/lib/emptyFunction")),r=(e("fbjs/lib/warning"),a);t.exports=r},{"fbjs/lib/emptyFunction":161,"fbjs/lib/warning":179,"object-assign":180}],154:[function(e,t,n){"use strict";var a=e("./emptyFunction"),r={listen:function(e,t,n){return e.addEventListener?(e.addEventListener(t,n,!1),{remove:function(){e.removeEventListener(t,n,!1)}}):e.attachEvent?(e.attachEvent("on"+t,n),{remove:function(){e.detachEvent("on"+t,n)}}):void 0},capture:function(e,t,n){return e.addEventListener?(e.addEventListener(t,n,!0),{remove:function(){e.removeEventListener(t,n,!0)}}):{remove:a}},registerDefault:function(){}};t.exports=r},{"./emptyFunction":161}],155:[function(e,t,n){"use strict";var a=!("undefined"==typeof window||!window.document||!window.document.createElement),r={canUseDOM:a,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:a&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:a&&!!window.screen,isInWorker:!a};t.exports=r},{}],156:[function(e,t,n){"use strict";function a(e){return e.replace(r,function(e,t){return t.toUpperCase()})}var r=/-(.)/g;t.exports=a},{}],157:[function(e,t,n){"use strict";function a(e){return r(e.replace(o,"ms-"))}var r=e("./camelize"),o=/^-ms-/;t.exports=a},{"./camelize":156}],158:[function(e,t,n){"use strict";function a(e,t){return e&&t?e===t?!0:r(e)?!1:r(t)?a(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(16&e.compareDocumentPosition(t)):!1:!1}var r=e("./isTextNode");t.exports=a},{"./isTextNode":171}],159:[function(e,t,n){"use strict";function a(e){var t=e.length;if(Array.isArray(e)||"object"!=typeof e&&"function"!=typeof e?i(!1):void 0,"number"!=typeof t?i(!1):void 0,0===t||t-1 in e?void 0:i(!1),"function"==typeof e.callee?i(!1):void 0,e.hasOwnProperty)try{return Array.prototype.slice.call(e)}catch(e){}for(var n=Array(t),a=0;t>a;a++)n[a]=e[a];return n}function r(e){return!!e&&("object"==typeof e||"function"==typeof e)&&"length"in e&&!("setInterval"in e)&&"number"!=typeof e.nodeType&&(Array.isArray(e)||"callee"in e||"item"in e)}function o(e){return r(e)?Array.isArray(e)?e.slice():a(e):[e]}var i=e("./invariant");t.exports=o},{"./invariant":169}],160:[function(e,t,n){"use strict";function a(e){var t=e.match(c);return t&&t[1].toLowerCase()}function r(e,t){var n=u;u?void 0:l(!1);var r=a(e),o=r&&s(r);if(o){n.innerHTML=o[1]+e+o[2];for(var c=o[0];c--;)n=n.lastChild}else n.innerHTML=e;var d=n.getElementsByTagName("script");d.length&&(t?void 0:l(!1),i(d).forEach(t));for(var p=Array.from(n.childNodes);n.lastChild;)n.removeChild(n.lastChild);return p}var o=e("./ExecutionEnvironment"),i=e("./createArrayFromMixed"),s=e("./getMarkupWrap"),l=e("./invariant"),u=o.canUseDOM?document.createElement("div"):null,c=/^\s*<(\w+)/;t.exports=r},{"./ExecutionEnvironment":155,"./createArrayFromMixed":159,"./getMarkupWrap":165,"./invariant":169}],161:[function(e,t,n){"use strict";function a(e){return function(){return e}}var r=function(){};r.thatReturns=a,r.thatReturnsFalse=a(!1),r.thatReturnsTrue=a(!0),r.thatReturnsNull=a(null),r.thatReturnsThis=function(){return this},r.thatReturnsArgument=function(e){return e},t.exports=r},{}],162:[function(e,t,n){"use strict";var a={};t.exports=a},{}],163:[function(e,t,n){"use strict";function a(e){try{e.focus()}catch(e){}}t.exports=a},{}],164:[function(e,t,n){"use strict";function a(){if("undefined"==typeof document)return null;try{return document.activeElement||document.body}catch(e){return document.body}}t.exports=a},{}],165:[function(e,t,n){"use strict";function a(e){return i?void 0:o(!1),p.hasOwnProperty(e)||(e="*"),s.hasOwnProperty(e)||("*"===e?i.innerHTML="<link />":i.innerHTML="<"+e+"></"+e+">",s[e]=!i.firstChild),s[e]?p[e]:null}var r=e("./ExecutionEnvironment"),o=e("./invariant"),i=r.canUseDOM?document.createElement("div"):null,s={},l=[1,'<select multiple="true">',"</select>"],u=[1,"<table>","</table>"],c=[3,"<table><tbody><tr>","</tr></tbody></table>"],d=[1,'<svg xmlns="http://www.w3.org/2000/svg">',"</svg>"],p={"*":[1,"?<div>","</div>"],area:[1,"<map>","</map>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],legend:[1,"<fieldset>","</fieldset>"],param:[1,"<object>","</object>"],tr:[2,"<table><tbody>","</tbody></table>"],optgroup:l,option:l,caption:u,colgroup:u,tbody:u,tfoot:u,thead:u,td:c,th:c},f=["circle","clipPath","defs","ellipse","g","image","line","linearGradient","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","text","tspan"];f.forEach(function(e){p[e]=d,s[e]=!0}),t.exports=a},{"./ExecutionEnvironment":155,"./invariant":169}],166:[function(e,t,n){"use strict";function a(e){return e===window?{x:window.pageXOffset||document.documentElement.scrollLeft,y:window.pageYOffset||document.documentElement.scrollTop}:{x:e.scrollLeft,y:e.scrollTop}}t.exports=a},{}],167:[function(e,t,n){"use strict";function a(e){return e.replace(r,"-$1").toLowerCase()}var r=/([A-Z])/g;t.exports=a},{}],168:[function(e,t,n){"use strict";function a(e){return r(e).replace(o,"-ms-")}var r=e("./hyphenate"),o=/^ms-/;t.exports=a},{"./hyphenate":167}],169:[function(e,t,n){"use strict";function a(e,t,n,a,r,o,i,s){if(!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var u=[n,a,r,o,i,s],c=0;l=new Error(t.replace(/%s/g,function(){return u[c++]})),l.name="Invariant Violation"}throw l.framesToPop=1,l}}t.exports=a},{}],170:[function(e,t,n){"use strict";function a(e){return!(!e||!("function"==typeof Node?e instanceof Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName))}t.exports=a},{}],171:[function(e,t,n){"use strict";function a(e){return r(e)&&3==e.nodeType}var r=e("./isNode");t.exports=a},{"./isNode":170}],172:[function(e,t,n){"use strict";var a=e("./invariant"),r=function(e){var t,n={};e instanceof Object&&!Array.isArray(e)?void 0:a(!1);for(t in e)e.hasOwnProperty(t)&&(n[t]=t);return n};t.exports=r},{"./invariant":169}],173:[function(e,t,n){"use strict";var a=function(e){var t;for(t in e)if(e.hasOwnProperty(t))return t;return null};t.exports=a},{}],174:[function(e,t,n){"use strict";function a(e,t,n){if(!e)return null;var a={};for(var o in e)r.call(e,o)&&(a[o]=t.call(n,e[o],o,e));return a}var r=Object.prototype.hasOwnProperty;t.exports=a},{}],175:[function(e,t,n){"use strict";function a(e){var t={};return function(n){return t.hasOwnProperty(n)||(t[n]=e.call(this,n)),t[n]}}t.exports=a},{}],176:[function(e,t,n){"use strict";var a,r=e("./ExecutionEnvironment");r.canUseDOM&&(a=window.performance||window.msPerformance||window.webkitPerformance),t.exports=a||{}},{"./ExecutionEnvironment":155}],177:[function(e,t,n){"use strict";var a,r=e("./performance");a=r.now?function(){return r.now()}:function(){return Date.now()},t.exports=a},{"./performance":176}],178:[function(e,t,n){"use strict";function a(e,t){return e===t?0!==e||1/e===1/t:e!==e&&t!==t}function r(e,t){if(a(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var i=0;i<n.length;i++)if(!o.call(t,n[i])||!a(e[n[i]],t[n[i]]))return!1;return!0}var o=Object.prototype.hasOwnProperty;t.exports=r},{}],179:[function(e,t,n){"use strict";var a=e("./emptyFunction"),r=a;t.exports=r},{"./emptyFunction":161}],180:[function(e,t,n){arguments[4][15][0].apply(n,arguments)},{dup:15}],181:[function(e,t,n){"use strict";t.exports=e("./lib/React")},{"./lib/React":42}],182:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(e,t){var n,a=t;switch(a.siteHeader={activePage:a.activePage,loginAccount:a.loginAccount,positionsSummary:a.marketsTotals.positionsSummary,transactionsTotals:a.transactionsTotals,isTransactionsWorking:a.isTransactionsWorking,marketsLink:a.links&&a.links.marketsLink||void 0,positionsLink:a.links&&a.links.positionsLink||void 0,transactionsLink:a.links&&a.links.transactionsLink||void 0,authLink:a.links&&a.links.authLink||void 0},a.activePage){case l.REGISTER:case l.LOGIN:case l.LOGOUT:n=o.default.createElement(v.default,{siteHeader:a.siteHeader,authForm:a.authForm});break;case s.MAKE:n=o.default.createElement(m.default,{siteHeader:a.siteHeader,createMarketForm:a.createMarketForm});break;case s.POSITIONS:n=o.default.createElement(y.default,{siteHeader:a.siteHeader,positionsSummary:a.marketsTotals.positionsSummary,markets:a.markets});break;case s.TRANSACTIONS:n=o.default.createElement(E.default,{siteHeader:a.siteHeader,transactions:a.transactions,transactionsTotals:a.transactionsTotals});break;case s.M:n=o.default.createElement(p.default,{siteHeader:a.siteHeader,market:a.market,numPendingReports:a.marketsTotals.numPendingReports});break;default:n=o.default.createElement(c.default,{siteHeader:a.siteHeader,createMarketLink:(a.links||{}).createMarketLink,keywords:a.keywords&&a.keywords.value,onChangeKeywords:a.keywords&&a.keywords.onChangeKeywords,markets:a.markets,marketsHeader:a.marketsHeader,favoriteMarkets:a.favoriteMarkets,filters:a.filters,pagination:a.pagination,selectedSort:a.searchSort.selectedSort,sortOptions:a.searchSort.sortOptions,onChangeSort:a.searchSort.onChangeSort})}(0,i.render)(n,e)};var r=e("react"),o=a(r),i=e("react-dom"),s=e("./modules/site/constants/pages"),l=e("./modules/auth/constants/auth-types"),u=e("./modules/markets/components/markets-page"),c=a(u),d=e("./modules/market/components/market-page"),p=a(d),f=e("./modules/create-market/components/create-market-page"),m=a(f),h=e("./modules/auth/components/auth-page"),v=a(h),g=e("./modules/positions/components/positions-page"),y=a(g),b=e("./modules/transactions/components/transactions-page"),E=a(b)},{"./modules/auth/components/auth-page":184,"./modules/auth/constants/auth-types":185,"./modules/create-market/components/create-market-page":200,"./modules/market/components/market-page":206,"./modules/markets/components/markets-page":210,"./modules/positions/components/positions-page":216,"./modules/site/constants/pages":223,"./modules/transactions/components/transactions-page":227,react:181,"react-dom":16}],183:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=a(i),l=e("../../link/components/link"),u=a(l);t.exports=o.default.createClass({displayName:"exports",propTypes:{className:o.default.PropTypes.string,title:o.default.PropTypes.string,passwordPlaceholder:o.default.PropTypes.string,password2Placeholder:o.default.PropTypes.string,isVisibleUsername:o.default.PropTypes.bool,isVisiblePassword:o.default.PropTypes.bool,isVisiblePassword2:o.default.PropTypes.bool,clearUsername:o.default.PropTypes.bool,clearPassword:o.default.PropTypes.bool,clearCode:o.default.PropTypes.bool,msg:o.default.PropTypes.string,msgClass:o.default.PropTypes.string,topLinkText:o.default.PropTypes.string,topLink:o.default.PropTypes.object,botttomLinkText:o.default.PropTypes.string,botttomLink:o.default.PropTypes.object,closeLink:o.default.PropTypes.object,submitButtonText:o.default.PropTypes.string,submitButtonClass:o.default.PropTypes.string,onSubmit:o.default.PropTypes.func},getInitialState:function(){return{msg:this.props.msg}},componentWillReceiveProps:function(e){this.setState({msg:e.msg})},componentDidUpdate:function(){this.props.clearUsername&&(this.refs.username.value=""),this.props.clearPassword&&(this.refs.password.value="",this.refs.password2.value=""),this.props.clearCode&&(this.refs.code.value="")},render:function(){var e=this.props;return o.default.createElement("form",{className:e.className,onSubmit:this.handleSubmit},o.default.createElement("h1",{className:"title"},e.title,e.topLinkText&&o.default.createElement(u.default,{className:"top-link",href:e.topLink.href,onClick:e.topLink.onClick},e.topLinkText)),this.state.msg&&o.default.createElement("span",{className:(0,s.default)("msg",e.msgClass)},this.state.msg),o.default.createElement("input",{ref:"username",className:(0,s.default)("auth-input",{displayNone:!e.isVisibleUsername}),type:"text",placeholder:"name",maxLength:"30",autoFocus:"autofocus"}),o.default.createElement("input",{ref:"password",className:(0,s.default)("auth-input",{displayNone:!e.isVisiblePassword}),type:"password",placeholder:e.passwordPlaceholder||"password",maxLength:"256"}),o.default.createElement("input",{ref:"password2",className:(0,s.default)("auth-input",{displayNone:!e.isVisiblePassword2}),type:"password",placeholder:e.password2Placeholder||"confirm password",maxLength:"256"}),e.bottomLinkText&&o.default.createElement(u.default,{className:"bottom-link",href:e.bottomLinkHref,onClick:e.onClickBottomLink},e.bottomLinkText),o.default.createElement("input",{className:(0,s.default)("button","submit-button",e.submitButtonClass),type:"submit",value:e.submitButtonText}),o.default.createElement(u.default,{type:"button",className:"button x-button",title:"Close",href:e.closeLink.href,onClick:e.closeLink.onClick},""))},handleSubmit:function(e){var t=this;e.preventDefault(),this.setState({msg:void 0}),setTimeout(function(){return t.props.onSubmit(t.refs.username&&t.refs.username.value,t.refs.password&&t.refs.password.value,t.refs.password2&&t.refs.password2.value)},100)}})},{"../../link/components/link":203,classnames:1,react:181}],184:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("../../site/components/site-header"),l=a(s),u=e("../../site/components/site-footer"),c=a(u),d=e("../../auth/components/auth-form"),p=a(d);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,siteHeader:i.default.PropTypes.object,authForm:i.default.PropTypes.object},render:function(){var e=this.props;return i.default.createElement("main",{className:"page auth"},i.default.createElement(l.default,e.siteHeader),i.default.createElement("header",{className:"page-header"},i.default.createElement("div",{className:"l-container"},i.default.createElement("span",{className:"big-line"},"Augur is a completely decentralized system")," including user accounts. Your credentials never leave the browser, and you are responsible for keeping them safe.",i.default.createElement("br",null),i.default.createElement("b",null,i.default.createElement("i",{className:"negative"},"It is impossible to recover your account if your credentials get lost!")))),i.default.createElement(p.default,r({className:"auth-form"},e.authForm)),i.default.createElement(c.default,null))}})},{"../../auth/components/auth-form":183,"../../site/components/site-footer":221,"../../site/components/site-header":222,react:181}],185:[function(e,t,n){"use strict";function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(n,"__esModule",{value:!0});var r,o=n.REGISTER="register",i=n.LOGIN="login",s=n.LOGOUT="logout";n.AUTH_TYPES=(r={},a(r,o,o),a(r,i,i),a(r,s,s),r),n.DEFAULT_AUTH_TYPE=o},{}],186:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=a(i);t.exports=o.default.createClass({displayName:"exports",propTypes:{className:o.default.PropTypes.string,title:o.default.PropTypes.string,text:o.default.PropTypes.string,isChecked:o.default.PropTypes.bool,tabIndex:o.default.PropTypes.number,onClick:o.default.PropTypes.func},render:function(){var e=this.props;return o.default.createElement("span",{className:(0,s.default)("checkbox",e.className,{checked:e.isChecked}),title:e.title},o.default.createElement("span",{className:"checkbox-box",onClick:e.onClick}),o.default.createElement("span",{className:"checkbox-label",maxLength:e.maxLength,tabIndex:e.tabIndex,onClick:e.onClick},e.text))}})},{classnames:1,react:181}],187:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=a(i);t.exports=o.default.createClass({displayName:"exports",propTypes:{className:o.default.PropTypes.string,selected:o.default.PropTypes.object,options:o.default.PropTypes.array,onChange:o.default.PropTypes.func},render:function(){var e=this.props;return o.default.createElement("span",{className:(0,s.default)("drop-down",e.className)},!!e.selected&&o.default.createElement("span",{className:"selected"},e.selected.label),o.default.createElement("ul",{className:"options"},e.options.filter(function(t){return t.value!==e.selected.value}).map(function(t){return o.default.createElement("li",{key:t.value,className:"option",onClick:function(){return e.onChange(t.value)}},t.label)})))}})},{classnames:1,react:181}],188:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=a(i),l=e("../../common/components/input"),u=a(l);t.exports=o.default.createClass({displayName:"exports",propTypes:{className:o.default.PropTypes.string,list:o.default.PropTypes.array,errors:o.default.PropTypes.array,listMinElements:o.default.PropTypes.number,listMaxElements:o.default.PropTypes.number,itemMaxLength:o.default.PropTypes.number,onChange:o.default.PropTypes.func},getInitialState:function(){return{list:this.fillMinElements(this.props.list,this.props.listMinElements),timeoutID:""}},render:function(){var e=this,t=this.props,n=this.state,a=n.list||[];return(!t.listMaxElements||a.length<t.listMaxElements)&&(a=a.slice(),a.push("")),o.default.createElement("div",{className:(0,s.default)("input-list",t.className)},a.map(function(n,r){return o.default.createElement("div",{key:r,className:(0,s.default)("item",{"new-item":!(r!==a.length-1||n&&n.length)})},o.default.createElement(u.default,{type:"text",maxLength:t.itemMaxLength,value:n,debounceMS:0,onChange:function(t){return e.handleChange(r,t)}}),t.errors&&t.errors[r]&&t.errors[r].length&&o.default.createElement("span",{className:"error-message"},t.errors[r]))}))},handleChange:function(e,t){var n=this,a=(this.state.list||[]).slice();t&&t.length||this.props.listMinElements&&!(e>=this.props.listMinElements)?a[e]=t:a.splice(e,1),this.state.timeoutID&&clearTimeout(this.state.timeoutID),this.setState({timeoutID:setTimeout(function(){return n.props.onChange(a)},750),list:a})},fillMinElements:function(e,t){var n,a;if(e=e||[],t&&e.length<t)for(e=e.slice(),n=t-e.length,a=0;n>a;a++)e.push("");return e}})},{"../../common/components/input":189,classnames:1,react:181}],189:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=a(s),u=e("../../../utils/should-component-update-pure"),c=a(u);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,value:i.default.PropTypes.any,isMultiline:i.default.PropTypes.bool,isClearable:i.default.PropTypes.bool,debounceMS:i.default.PropTypes.number,onChange:i.default.PropTypes.func},getInitialState:function(){return{value:this.props.value||"",timeoutID:""}},componentWillReceiveProps:function(e){e.value&&e.value!==this.state.value&&e.value!==this.props.value&&this.setState({value:e.value})},shouldComponentUpdate:c.default,render:function(){var e=this.props,t=this.state;return i.default.createElement("div",{className:(0,l.default)("input",{clearable:e.isClearable!==!1},this.props.className)},!e.isMultiline&&i.default.createElement("input",r({},this.props,{className:"box",type:"text",value:t.value,onChange:this.handleOnChange,onBlur:this.handleOnBlur})),e.isMultiline&&i.default.createElement("textarea",r({},this.props,{className:"box",type:"text",value:t.value,onChange:this.handleOnChange,onBlur:this.handleOnBlur})),!e.isMultiline&&e.isClearable!==!1&&i.default.createElement("button",{className:"clear",onClick:this.handleClear},""))},handleOnChange:function(e){var t=this,n=e.target.value;0!==this.props.debounceMS?(clearTimeout(this.state.timeoutID),this.setState({timeoutID:setTimeout(function(){return t.sendValue(n)},this.props.debounceMS||750)})):this.sendValue(n),this.setState({value:n})},handleOnBlur:function(){0!==this.props.debounceMS&&(clearTimeout(this.state.timeoutID),this.sendValue(this.state.value))},handleClear:function(){this.setState({value:""}),this.sendValue("")},sendValue:function(e){this.props.onChange(e)}})},{"../../../utils/should-component-update-pure":230,classnames:1,react:181}],190:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=a(i),l=o.default.createClass({displayName:"ValueDenomination",propTypes:{className:o.default.PropTypes.string,value:o.default.PropTypes.number,formattedValue:o.default.PropTypes.number,formatted:o.default.PropTypes.string,denomination:o.default.PropTypes.string},render:function(){var e=this.props;return o.default.createElement("span",{className:(0,s.default)("value-denomination",e.className,{positive:e.formattedValue>0,negative:e.formattedValue<0}),title:e.value+" "+e.denomination},e.formatted&&o.default.createElement("span",{className:"value"},e.formatted),e.denomination&&o.default.createElement("span",{className:"denomination"},e.denomination))}});t.exports=l},{classnames:1,react:181}],191:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("../../markets/constants/market-types");t.exports=o.default.createClass({displayName:"exports",propTypes:{onValuesUpdated:o.default.PropTypes.func},render:function(){var e=this;this.props;return o.default.createElement("div",{className:"step-1"},o.default.createElement("h1",null,"Select the type of market you want to create"),o.default.createElement("hr",null),o.default.createElement("div",{className:"market-types"},o.default.createElement("div",{className:"market-type binary"},o.default.createElement("h4",null,"A market with a YES or NO outcome"),o.default.createElement("button",{className:"button select",onClick:function(){return e.props.onValuesUpdated({type:i.BINARY,step:2})}},"Yes / No"),o.default.createElement("p",null,"Ask a question that has a simple YES or NO answer")),o.default.createElement("hr",null),o.default.createElement("div",{className:"market-type categorical"},o.default.createElement("h4",null,"A market with a MULTIPLE CHOICE outcome"),o.default.createElement("button",{className:"button select",onClick:function(){return e.props.onValuesUpdated({type:i.CATEGORICAL,step:2})}},"Multiple Choice"),o.default.createElement("p",null,"Ask a question and provide a set of multiple choice answers")),o.default.createElement("hr",null),o.default.createElement("div",{className:"market-type scalar"},o.default.createElement("h4",null,"A market with a NUMERIC outcome"),o.default.createElement("button",{className:"button select",onClick:function(){return e.props.onValuesUpdated({type:i.SCALAR,step:2})}},"Numeric"),o.default.createElement("p",null,"Ask a question that has an answer within a range of numbers"))),o.default.createElement("hr",null),o.default.createElement("div",{className:"important-message"},o.default.createElement("h4",null,"Important:"),o.default.createElement("p",null,"There is a $30.00 bond charged to your account when you create a new market. If the outcome of your market cannot be determined (and the market cannot be expired as a result) or if your market is ruled unethical, this bond will be forfeited. If your market is expired the bond will be returned to you in full.")))}})},{"../../markets/constants/market-types":213,react:181}],192:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("../../common/components/input-list"),s=a(i);t.exports=o.default.createClass({displayName:"exports",propTypes:{categoricalOutcomes:o.default.PropTypes.array,errors:o.default.PropTypes.object,categoricalOutcomesMinNum:o.default.PropTypes.number,categoricalOutcomesMaxNum:o.default.PropTypes.number,categoricalOutcomeMaxLength:o.default.PropTypes.number,onValuesUpdated:o.default.PropTypes.func},render:function(){var e=this.props;return o.default.createElement("div",{className:"categorical"},o.default.createElement("h4",null,"What are the possible answers to your question? (required)"),o.default.createElement("p",null,'All possible outcomes to your question must be covered by these answers. You can add an "any other outcome" type answer at the end to ensure everything is covered.'),o.default.createElement(s.default,{className:"categorical-list",list:e.categoricalOutcomes,errors:e.errors&&e.errors.categoricalOutcomes||[],listMinElements:e.categoricalOutcomesMinNum,listMaxElements:e.categoricalOutcomesMaxNum,itemMaxLength:e.categoricalOutcomeMaxLength,onChange:function(t){return e.onValuesUpdated({categoricalOutcomes:t})}}))}})},{"../../common/components/input-list":188,react:181}],193:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("../../common/components/input"),s=a(i);t.exports=o.default.createClass({displayName:"exports",propTypes:{scalarSmallNum:o.default.PropTypes.string,scalarBigNum:o.default.PropTypes.string,onValuesUpdated:o.default.PropTypes.func},render:function(){var e=this.props;return o.default.createElement("div",{className:"scalar"},o.default.createElement("h4",null,"What are the minimum and maximum values allowed when answering?"),o.default.createElement("p",null,"The answer to your question must be a number that falls between the minimum and maximum values you're about to set."),o.default.createElement("div",{className:"scalar-num min"},o.default.createElement("label",null,"Minimum"),o.default.createElement(s.default,{type:"text",value:e.scalarSmallNum,placeholder:"Minimum answer",maxLength:6,onChange:function(t){return e.onValuesUpdated({scalarSmallNum:t})}}),e.errors.scalarSmallNum&&o.default.createElement("span",{className:"error-message"},e.errors.scalarSmallNum)),o.default.createElement("div",{className:"scalar-num min"},o.default.createElement("label",null,"Maximum"),o.default.createElement(s.default,{type:"text",value:e.scalarBigNum,placeholder:"Maximum answer",maxLength:6,onChange:function(t){return e.onValuesUpdated({scalarBigNum:t})}}),e.errors.scalarBigNum&&o.default.createElement("span",{className:"error-message"},e.errors.scalarBigNum)))}})},{"../../common/components/input":189,react:181}],194:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=(a(i),e("../../markets/constants/market-types")),l=e("./create-market-form-2-categorical"),u=a(l),c=e("./create-market-form-2-scalar"),d=a(c),p=e("../../create-market/components/create-market-form-buttons"),f=a(p),m=e("../../common/components/input"),h=a(m),v=e("react-date-picker"),g=a(v);t.exports=o.default.createClass({displayName:"exports",propTypes:{type:o.default.PropTypes.string,description:o.default.PropTypes.string,endDate:o.default.PropTypes.object,descriptionPlaceholder:o.default.PropTypes.string,descriptionMaxLength:o.default.PropTypes.number,minEndDate:o.default.PropTypes.object,isValid:o.default.PropTypes.bool,errors:o.default.PropTypes.object,onValuesUpdated:o.default.PropTypes.func},render:function(){var e,t=this,n=this.props;switch(n.type){case s.CATEGORICAL:e=o.default.createElement(u.default,n);break;case s.SCALAR:e=o.default.createElement(d.default,n)}return o.default.createElement("div",{className:"step-2"},o.default.createElement("div",{className:"description"},o.default.createElement("h1",null,"What do you want to ask?"),o.default.createElement(h.default,{type:"text",value:n.description,placeholder:n.descriptionPlaceholder,maxLength:n.descriptionMaxLength,onChange:function(e){return n.onValuesUpdated({description:e})}}),n.errors.description&&o.default.createElement("span",{className:"error-message"},n.errors.description)),e,o.default.createElement("div",{className:"end-date"},o.default.createElement("h4",null,"What's the end date for your question?"),o.default.createElement(g.default,{minDate:new Date,date:n.endDate,hideFooter:!0,onChange:function(e,t){return n.onValuesUpdated({endDate:t.toDate()})}}),n.errors.endDate&&o.default.createElement("span",{className:"error-message"},n.errors.endDate)),o.default.createElement(f.default,{disabled:!n.isValid,onNext:function(){return n.onValuesUpdated({step:t.props.step+1})},onPrev:function(){return n.onValuesUpdated({step:t.props.step-1})}}))}})},{"../../common/components/input":189,"../../create-market/components/create-market-form-buttons":198,"../../markets/constants/market-types":213,"./create-market-form-2-categorical":192,"./create-market-form-2-scalar":193,classnames:1,react:181,"react-date-picker":7}],195:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=a(i),l=e("../../create-market/constants/market-values-constraints"),u=e("../../common/components/input-list"),c=a(u),d=e("../../create-market/components/create-market-form-buttons"),p=a(d),f=e("../../common/components/input"),m=a(f);t.exports=o.default.createClass({displayName:"exports",propTypes:{expirySource:o.default.PropTypes.string,expirySourceUrl:o.default.PropTypes.string,tags:o.default.PropTypes.array,tagsMaxNum:o.default.PropTypes.number,tagMaxLength:o.default.PropTypes.number,resources:o.default.PropTypes.array,resourcesMaxNum:o.default.PropTypes.number,resourceMaxLength:o.default.PropTypes.number,description:o.default.PropTypes.string,detailsText:o.default.PropTypes.string,isValid:o.default.PropTypes.bool,errors:o.default.PropTypes.object,onValuesUpdated:o.default.PropTypes.func},render:function(){var e=this,t=this.props;return o.default.createElement("div",{className:"step-3"},o.default.createElement("h1",null,"Additional market information"),o.default.createElement("div",{className:"expiry"},o.default.createElement("h4",null,"What is the source of expiry information for your question?"),o.default.createElement("span",{className:"expiry-source-option"},o.default.createElement("input",{
value:l.EXPIRY_SOURCE_GENERIC,type:"radio",checked:t.expirySource===l.EXPIRY_SOURCE_GENERIC,onChange:function(){return t.onValuesUpdated({expirySource:l.EXPIRY_SOURCE_GENERIC})}}),o.default.createElement("span",null,"Outcome will be covered by local, national or international news media.")),o.default.createElement("span",{className:"expiry-source-option"},o.default.createElement("input",{value:l.EXPIRY_SOURCE_SPECIFIC,type:"radio",checked:t.expirySource===l.EXPIRY_SOURCE_SPECIFIC,onChange:function(){return t.onValuesUpdated({expirySource:l.EXPIRY_SOURCE_SPECIFIC})}}),o.default.createElement("span",null,"Outcome will be detailed on a specific publicly available website:")),o.default.createElement("div",{className:(0,s.default)("expiry-source-url",{displayNone:t.expirySource!==l.EXPIRY_SOURCE_SPECIFIC})},o.default.createElement(m.default,{type:"text",value:t.expirySourceUrl,placeholder:"http://www.boxofficemojo.com",onChange:function(e){return t.onValuesUpdated({expirySourceUrl:e})}})),(t.errors.expirySource||t.errors.expirySourceUrl)&&o.default.createElement("span",{className:"error-message"},t.errors.expirySource||t.errors.expirySourceUrl)),o.default.createElement("div",{className:"tags"},o.default.createElement("h4",null,"Add some tags to your market (optional)"),o.default.createElement("p",null,"Up to three tags can be added to categorize your market. For example: politics, sports, entertainment or technology."),o.default.createElement(c.default,{className:"tags-list",list:t.tags,errors:t.errors&&t.errors.tags,listMaxElements:t.tagsMaxNum,itemMaxLength:t.tagMaxLength,onChange:function(e){return t.onValuesUpdated({tags:e})}})),o.default.createElement("div",{className:"details-text"},o.default.createElement("h4",null,"Does your question need further explanation? (optional)"),o.default.createElement("p",null,"Your question: ",t.description),o.default.createElement(m.default,{className:"details-text-input",value:t.detailsText,isMultiline:!0,maxLength:500,placeholder:"Optional: enter a more detailed description of your market.",onChange:function(e){return t.onValuesUpdated({detailsText:e})}})),o.default.createElement("div",{className:"resources"},o.default.createElement("h4",null,"Are there any helpful links you want to add? (optional)"),o.default.createElement("p",null,"For example, if your question is about an election you could link to polling information or the webpages of candidates."),o.default.createElement(c.default,{className:"resources-list",list:t.resources,errors:t.errors&&t.errors.resources,listMaxElements:t.resourcesMaxNum,itemMaxLength:t.resourceMaxLength,onChange:function(e){return t.onValuesUpdated({resources:e})}})),o.default.createElement(p.default,{disabled:!t.isValid,onNext:function(){return t.onValuesUpdated({step:e.props.step+1})},onPrev:function(){return t.onValuesUpdated({step:e.props.step-1})}}))}})},{"../../common/components/input":189,"../../common/components/input-list":188,"../../create-market/components/create-market-form-buttons":198,"../../create-market/constants/market-values-constraints":201,classnames:1,react:181}],196:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=(a(i),e("../../create-market/components/create-market-form-buttons")),l=a(s),u=e("../../common/components/input"),c=a(u);t.exports=o.default.createClass({displayName:"exports",propTypes:{tradingFeePercent:o.default.PropTypes.any,initialLiquidity:o.default.PropTypes.any,errors:o.default.PropTypes.object,onValuesUpdated:o.default.PropTypes.func},render:function(){var e=this,t=this.props;return o.default.createElement("div",{className:"step-4"},o.default.createElement("div",{className:"fee"},o.default.createElement("h4",null,"Set the trading fee for your market"),o.default.createElement("p",null,"The Trading Fee is a percentage fee charged against the value of any trade made in the market. You'll receive 50% of all fees charged during the lifetime of your market - with the other 50% being awarded to those reporting the outcome."),o.default.createElement(c.default,{type:"text",value:t.tradingFeePercent,isClearable:!1,onChange:function(e){return t.onValuesUpdated({tradingFeePercent:e})}}),o.default.createElement("span",{className:"denomination"},"%"),t.errors.tradingFeePercent&&o.default.createElement("span",{className:"error-message"},t.errors.tradingFeePercent)),o.default.createElement("div",{className:"liquidity"},o.default.createElement("h4",null,"Set the amount of initial liquidity"),o.default.createElement("p",null,"Initial liquidity is the amount of ether you're putting into the market to get trading started. The Market Maker will use these funds to buy shares - which are then sold back to those wanting to trade your market when the market opens. Any initial liquidity remaining when the market is expired will be returned to you (along with any profit generated by the Market Maker from selling shares)."),o.default.createElement(c.default,{type:"text",value:t.initialLiquidity,isClearable:!1,onChange:function(e){return t.onValuesUpdated({initialLiquidity:e})}}),o.default.createElement("span",{className:"denomination"},"Eth"),t.errors.initialLiquidity&&o.default.createElement("span",{className:"error-message"},t.errors.initialLiquidity)),o.default.createElement(l.default,{disabled:!t.isValid,nextLabel:"review",onNext:function(){return t.onValuesUpdated({step:e.props.step+1})},onPrev:function(){return t.onValuesUpdated({step:e.props.step-1})}}))}})},{"../../common/components/input":189,"../../create-market/components/create-market-form-buttons":198,classnames:1,react:181}],197:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=(a(i),e("../../market/components/market-item")),l=a(s),u=e("../../create-market/components/create-market-form-buttons"),c=a(u);t.exports=o.default.createClass({displayName:"exports",propTypes:{onSubmit:o.default.PropTypes.func},render:function(){var e=this,t=this.props;return o.default.createElement("div",{className:"step-5"},o.default.createElement("h1",null,"Review and submit your new market"),o.default.createElement(l.default,t),o.default.createElement(c.default,{nextLabel:"submit new market",onNext:t.onSubmit,onPrev:function(){return t.onValuesUpdated({step:e.props.step-1})}}))}})},{"../../create-market/components/create-market-form-buttons":198,"../../market/components/market-item":205,classnames:1,react:181}],198:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r);t.exports=o.default.createClass({displayName:"exports",propTypes:{disabled:o.default.PropTypes.bool,nextLabel:o.default.PropTypes.string,prevLabel:o.default.PropTypes.string,onPrev:o.default.PropTypes.func,onNext:o.default.PropTypes.func},render:function(){var e=this.props;return o.default.createElement("div",{className:"buttons"},o.default.createElement("button",{className:"button prev",type:"button",onClick:e.onPrev},e.prevLabel||"back"),o.default.createElement("button",{className:"button next",type:"button",disabled:e.disabled,onClick:!e.disabled&&e.onNext},e.nextLabel||"Next"))}})},{react:181}],199:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=(a(i),e("./create-market-form-1")),l=a(s),u=e("./create-market-form-2"),c=a(u),d=e("./create-market-form-3"),p=a(d),f=e("./create-market-form-4"),m=a(f),h=e("./create-market-form-5"),v=a(h);t.exports=o.default.createClass({displayName:"exports",propTypes:{className:o.default.PropTypes.string,step:o.default.PropTypes.number},render:function(){var e,t=this.props;switch(t.step){case 1:e=o.default.createElement(l.default,t);break;case 2:e=o.default.createElement(c.default,t);break;case 3:e=o.default.createElement(p.default,t);break;case 4:e=o.default.createElement(m.default,t);break;case 5:e=o.default.createElement(v.default,t)}return o.default.createElement("section",{className:t.className},e)}})},{"./create-market-form-1":191,"./create-market-form-2":194,"./create-market-form-3":195,"./create-market-form-4":196,"./create-market-form-5":197,classnames:1,react:181}],200:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("../../site/components/site-header"),l=a(s),u=e("../../site/components/site-footer"),c=a(u),d=e("../../create-market/components/create-market-form"),p=a(d);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,siteHeader:i.default.PropTypes.object,createMarketForm:i.default.PropTypes.object},render:function(){var e=this.props;return i.default.createElement("main",{className:"page create-market"},i.default.createElement(l.default,e.siteHeader),i.default.createElement("header",{className:"page-header"},i.default.createElement("div",{className:"l-container"},i.default.createElement("span",{className:"big-line"},"Be the market maker"),". Earn fees by making markets for people to trade. The more people ",i.default.createElement("b",null,i.default.createElement("i",null,"trade"))," your markets, the more fees you will ",i.default.createElement("b",null,i.default.createElement("i",null,"make")),".")),i.default.createElement("div",{className:"page-content"},i.default.createElement("div",{className:"l-container"},i.default.createElement(p.default,r({className:"create-market-content"},e.createMarketForm)))),i.default.createElement(c.default,null))}})},{"../../create-market/components/create-market-form":199,"../../site/components/site-footer":221,"../../site/components/site-header":222,react:181}],201:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.DESCRIPTION_MIN_LENGTH=1,n.DESCRIPTION_MAX_LENGTH=256,n.CATEGORICAL_OUTCOMES_MIN_NUM=2,n.CATEGORICAL_OUTCOMES_MAX_NUM=8,n.CATEGORICAL_OUTCOME_MAX_LENGTH=250,n.TAGS_MAX_NUM=3,n.TAGS_MAX_LENGTH=25,n.RESOURCES_MAX_NUM=5,n.RESOURCES_MAX_LENGTH=1250,n.EXPIRY_SOURCE_GENERIC="generic",n.EXPIRY_SOURCE_SPECIFIC="specific",n.TRADING_FEE_MIN=1,n.TRADING_FEE_MAX=12.5,n.TRADING_FEE_DEFAULT=2,n.INITIAL_LIQUIDITY_MIN=50,n.INITIAL_LIQUIDITY_DEFAULT=500},{}],202:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=(a(i),e("../../common/components/checkbox")),l=a(s);t.exports=o.default.createClass({displayName:"exports",propTypes:{filters:o.default.PropTypes.array},render:function(){var e=this.props;return o.default.createElement("aside",{className:"filters"},e.filters.map(function(e){return o.default.createElement("div",{key:e.title,className:"filters-group"},o.default.createElement("span",{className:"title"},e.title),e.options.map(function(e){return o.default.createElement(l.default,{key:e.value,className:"filter",text:e.name,isChecked:e.isSelected,onClick:e.onClick})}))}))}})},{"../../common/components/checkbox":186,classnames:1,react:181}],203:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o);t.exports=i.default.createClass({displayName:"exports",handleClick:function(e){this.props.target||this.props.href&&0===this.props.href.indexOf("mailto:")||0===!e.button||e.metaKey||e.altKey||e.ctrlKey||e.shiftKey||(e.preventDefault(),this.props.onClick&&this.props.onClick(this.props.href))},render:function(){return i.default.createElement("a",r({},this.props,{href:this.props.href,className:"link "+this.props.className,onClick:this.handleClick}))}})},{react:181}],204:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=(a(s),e("../../common/components/value-denomination")),u=a(l);t.exports=i.default.createClass({displayName:"exports",propTypes:{description:i.default.PropTypes.string,endDate:i.default.PropTypes.object,tradingFeePercent:i.default.PropTypes.object,volume:i.default.PropTypes.object,tags:i.default.PropTypes.array},render:function(){var e=this.props;return i.default.createElement("section",{className:"basics"},!!e.tags&&!!e.tags.length&&i.default.createElement("ul",{className:"tags"},e.tags.map(function(e,t){return i.default.createElement("li",{key:t,className:"tag",onClick:e.onClick},e.name)})),i.default.createElement("span",{className:"description",title:e.description},e.description),i.default.createElement("ul",{className:"properties"},!!e.endDate&&i.default.createElement("li",{className:"property end-date"},i.default.createElement("span",{className:"property-label"},e.endDate&&e.endDate.value<new Date?"ended":"ends"),i.default.createElement(u.default,r({className:"property-value"},e.endDate))),i.default.createElement("li",{className:"property fee"},i.default.createElement("span",{className:"property-label"},"fee"),i.default.createElement(u.default,r({className:"property-value"},e.tradingFeePercent))),i.default.createElement("li",{className:"property volume"},i.default.createElement("span",{className:"property-label"},"volume"),i.default.createElement(u.default,r({className:"property-value"},e.volume,{formatted:e.volume.rounded})))))}})},{"../../common/components/value-denomination":190,classnames:1,react:181}],205:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=a(s),u=e("../../../utils/should-component-update-pure"),c=a(u),d=e("../../market/components/basics"),p=a(d),f=e("../../market/components/outcomes"),m=a(f),h=e("../../link/components/link"),v=a(h);t.exports=i.default.createClass({displayName:"exports",propTypes:{description:i.default.PropTypes.string,outcomes:i.default.PropTypes.array,isOpen:i.default.PropTypes.bool,isFavorite:i.default.PropTypes.bool,isPendingReport:i.default.PropTypes.bool,endDate:i.default.PropTypes.object,tradingFeePercent:i.default.PropTypes.object,volume:i.default.PropTypes.object,tags:i.default.PropTypes.array,marketLink:i.default.PropTypes.object,onClickToggleFavorite:i.default.PropTypes.func},shouldComponentUpdate:c.default,render:function(){var e=this.props;return i.default.createElement("article",{className:"market-item"},i.default.createElement("div",{className:"basics-container"},i.default.createElement(p.default,e),!!e.marketLink&&i.default.createElement("div",{className:"buttons"},i.default.createElement(v.default,r({},e.marketLink,{className:(0,l.default)("button",e.marketLink.className)}),e.marketLink.text))),e.outcomes&&i.default.createElement(m.default,{outcomes:e.outcomes}),e.onClickToggleFavorite&&i.default.createElement("button",{className:(0,l.default)("button","favorite-button",{on:e.isFavorite}),onClick:e.onClickToggleFavorite},""))}})},{"../../../utils/should-component-update-pure":230,"../../link/components/link":203,"../../market/components/basics":204,"../../market/components/outcomes":208,classnames:1,react:181}],206:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("../../../utils/should-component-update-pure"),l=a(s),u=e("../../site/components/site-header"),c=a(u),d=e("../../site/components/site-footer"),p=a(d),f=e("../../market/components/basics"),m=a(f),h=e("../../trade/components/trade-panel"),v=a(h),g=e("../../reports/components/report-panel"),y=a(g),b=e("../../market/components/market-positions"),E=a(b);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,siteHeader:i.default.PropTypes.object,market:i.default.PropTypes.object,priceTimeSeries:i.default.PropTypes.array,numPendingReports:i.default.PropTypes.number},shouldComponentUpdate:l.default,render:function(){var e=this.props,t=[];return e.market&&e.market.id?(t.push(i.default.createElement(m.default,r({key:"bascis"},e.market))),e.market.isPendingReport?t.push(i.default.createElement(y.default,r({key:"report-panel"},e.market,e.market.report,{numPendingReports:e.numPendingReports}))):e.market.isOpen&&(t.push(i.default.createElement(v.default,r({key:"trade-panel"},e.market,e.market.tradeSummary))),e.market.positionsSummary&&e.market.positionsSummary.numPositions&&e.market.positionsSummary.numPositions.value&&t.push(i.default.createElement(E.default,{key:"market-positions",className:"market-positions",positionsSummary:e.market.positionsSummary,positionOutcomes:e.market.positionOutcomes})))):t.push(i.default.createElement("section",{key:"no-market",className:"basics"},i.default.createElement("span",{className:"description"},"No market"))),i.default.createElement("main",{className:"page market"},i.default.createElement(c.default,e.siteHeader),i.default.createElement("article",{className:"page-content"},i.default.createElement("div",{className:"l-container"},t)),i.default.createElement(p.default,null))}})},{"../../../utils/should-component-update-pure":230,"../../market/components/basics":204,"../../market/components/market-positions":207,"../../reports/components/report-panel":220,"../../site/components/site-footer":221,"../../site/components/site-header":222,"../../trade/components/trade-panel":225,react:181}],207:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=(a(s),e("../../../utils/should-component-update-pure")),u=a(l),c=e("../../positions/components/positions"),d=a(c),p=e("../../positions/components/positions-summary"),f=a(p);t.exports=i.default.createClass({displayName:"exports",propTypes:{positionsSummary:i.default.PropTypes.object,positionOutcomes:i.default.PropTypes.array},shouldComponentUpdate:u.default,render:function(){var e=this.props;return i.default.createElement("section",{className:"market-positions"},i.default.createElement(f.default,r({},e.positionsSummary,{className:"market-section-header"})),i.default.createElement(d.default,{outcomes:e.positionOutcomes}))}})},{"../../../utils/should-component-update-pure":230,"../../positions/components/positions":218,"../../positions/components/positions-summary":217,classnames:1,react:181}],208:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=(a(s),e("../../../utils/should-component-update-pure")),u=a(l),c=e("../../common/components/value-denomination"),d=a(c);t.exports=i.default.createClass({displayName:"exports",propTypes:{outcomes:i.default.PropTypes.array},shouldComponentUpdate:u.default,render:function(){var e=this.props;return i.default.createElement("div",{className:"outcomes"},e.outcomes.map(function(e,t){return i.default.createElement("div",{key:e.id,className:"outcome"},!!e.lastPricePercent&&i.default.createElement(d.default,r({className:"outcome-price"},e.lastPricePercent,{formatted:e.lastPricePercent.rounded,formattedValue:e.lastPricePercent.roundedValue})),i.default.createElement("span",{className:"outcome-name"},e.name))}))}})},{"../../../utils/should-component-update-pure":230,"../../common/components/value-denomination":190,classnames:1,react:181}],209:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=a(i),l=e("../../../utils/should-component-update-pure"),u=a(l),c=e("../../markets/constants/markets-headers");t.exports=o.default.createClass({displayName:"exports",propTypes:{selectedMarketsHeader:o.default.PropTypes.string,numMarkets:o.default.PropTypes.number,numFavorites:o.default.PropTypes.number,numPendingReports:o.default.PropTypes.number,onClickAllMarkets:o.default.PropTypes.func,onClickFavorites:o.default.PropTypes.func,onClickPendingReports:o.default.PropTypes.func},shouldComponentUpdate:u.default,render:function(){var e=this.props;return o.default.createElement("header",{className:"markets-header"},o.default.createElement("div",{className:(0,s.default)("markets-header-item","all-markets",{active:!e.selectedMarketsHeader}),onClick:e.onClickAllMarkets},o.default.createElement("span",{className:"name"},"Markets"),(!!e.numMarkets||0===e.numMarkets)&&o.default.createElement("span",{className:"num"},"("+e.numMarkets+")")),!!e.numPendingReports&&o.default.createElement("div",{className:(0,s.default)("markets-header-item","pending-reports",{active:e.selectedMarketsHeader===c.PENDING_REPORTS}),onClick:e.onClickPendingReports},o.default.createElement("span",{className:"name"},"Pending Reports"),o.default.createElement("span",{className:"num"},"("+e.numPendingReports+")")),o.default.createElement("div",{className:(0,s.default)("markets-header-item","favorites",{active:e.selectedMarketsHeader===c.FAVORITES}),onClick:e.onClickFavorites},o.default.createElement("span",{className:"name"},"Favorites"),(!!e.numFavorites||0===e.numFavorites)&&o.default.createElement("span",{className:"num"},"("+e.numFavorites+")")))}})},{"../../../utils/should-component-update-pure":230,"../../markets/constants/markets-headers":214,classnames:1,react:181}],210:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("../../../utils/should-component-update-pure"),l=a(s),u=e("../../site/components/site-header"),c=a(u),d=e("../../site/components/site-footer"),p=a(d),f=e("../../markets/components/search-sort"),m=a(f),h=e("../../markets/components/markets"),v=a(h);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,siteHeader:i.default.PropTypes.object,createMarketLink:i.default.PropTypes.object,markets:i.default.PropTypes.array,favoriteMarkets:i.default.PropTypes.array,marketsHeader:i.default.PropTypes.object,keywords:i.default.PropTypes.string,filters:i.default.PropTypes.array,pagination:i.default.PropTypes.object,selectedSort:i.default.PropTypes.object,sortOptions:i.default.PropTypes.array,onChangeKeywords:i.default.PropTypes.func,onChangeSort:i.default.PropTypes.func},shouldComponentUpdate:l.default,render:function(){var e=this.props;return i.default.createElement("div",{className:"page markets"},i.default.createElement(c.default,e.siteHeader),i.default.createElement("header",{className:"page-header"},i.default.createElement("div",{className:"l-container"},i.default.createElement("span",{className:"big-line"},"Augur lets you trade any market"),". Find a market you can beat, and buy shares on the side that ",i.default.createElement("b",null,i.default.createElement("i",null,"you think"))," should go up. When you're right, you make money.")),i.default.createElement("div",{className:"page-content"},i.default.createElement(m.default,{keywords:e.keywords,selectedSort:e.selectedSort,sortOptions:e.sortOptions,onChangeKeywords:e.onChangeKeywords,onChangeSort:e.onChangeSort}),i.default.createElement(v.default,r({className:"page-content markets-content"},e))),i.default.createElement(p.default,null))}})},{"../../../utils/should-component-update-pure":230,"../../markets/components/markets":211,"../../markets/components/search-sort":212,"../../site/components/site-footer":221,"../../site/components/site-header":222,react:181}],211:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=(a(s),e("../../markets/components/markets-header")),u=a(l),c=e("../../filters/components/filters"),d=a(c),p=e("../../market/components/market-item"),f=a(p),m=e("../../link/components/link"),h=a(m);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,marketsHeader:i.default.PropTypes.object,markets:i.default.PropTypes.array,filters:i.default.PropTypes.array,pagination:i.default.PropTypes.object,sortOptions:i.default.PropTypes.array},render:function(){var e=this.props;return i.default.createElement("section",{className:e.className},i.default.createElement("div",{className:"markets-header-bar"},i.default.createElement(h.default,r({className:"button make"},e.createMarketLink),"Make a Market"),i.default.createElement(u.default,e.marketsHeader)),i.default.createElement(d.default,{filters:e.filters}),i.default.createElement("div",{className:"markets-list"},(e.markets||[]).map(function(e){return i.default.createElement(f.default,r({key:e.id},e))}),!!e.pagination&&!!e.pagination.numUnpaginated&&i.default.createElement("div",{className:"pagination"},!!e.pagination&&!!e.pagination.previousPageNum&&i.default.createElement("span",{className:"button-container prev",onClick:function(){return e.pagination.onUpdateSelectedPageNum(e.pagination.previousPageNum)}},i.default.createElement("button",{className:"button prev"},"")),i.default.createElement("span",{className:"displaying"},e.pagination.startItemNum+"-"+e.pagination.endItemNum+" of "+e.pagination.numUnpaginated),!!e.pagination&&!!e.pagination.nextPageNum&&i.default.createElement("span",{className:"button-container next",onClick:function(){return e.pagination.onUpdateSelectedPageNum(e.pagination.nextPageNum)}},i.default.createElement("button",{className:"button next"},"")))))}})},{"../../filters/components/filters":202,"../../link/components/link":203,"../../market/components/market-item":205,"../../markets/components/markets-header":209,classnames:1,react:181}],212:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=(a(i),e("../../common/components/input")),l=a(s),u=e("../../common/components/dropdown"),c=a(u);t.exports=o.default.createClass({displayName:"exports",propTypes:{keywords:o.default.PropTypes.string,selectedSort:o.default.PropTypes.object,sortOptions:o.default.PropTypes.array,onChangeKeywords:o.default.PropTypes.func,onChangeSort:o.default.PropTypes.func},render:function(){var e=this.props;return o.default.createElement("div",{className:"search-sort"},o.default.createElement("div",{className:"search-sort-content"},o.default.createElement(l.default,{className:"search-bar",value:e.keywords,placeholder:"Search",onChange:e.onChangeKeywords}),o.default.createElement("div",{className:"sort-container"},o.default.createElement("span",{className:"title"},"Sort By"),o.default.createElement(c.default,{className:"sort",selected:e.sortOptions.find(function(t){return t.value===e.selectedSort.prop}),options:e.sortOptions,onChange:function(t){var n=e.sortOptions.find(function(e){return e.value===t});e.onChangeSort(n.value,n.isDesc)}}),o.default.createElement("button",{className:"sort-direction-button",title:e.selectedSort.isDesc?"descending selected":"ascending selected",onClick:function(){return e.onChangeSort(e.selectedSort.prop,!e.selectedSort.isDesc)}},e.selectedSort.isDesc?o.default.createElement("span",null,""):o.default.createElement("span",null,"")))))}})},{"../../common/components/dropdown":187,"../../common/components/input":189,classnames:1,react:181}],213:[function(e,t,n){"use strict";function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(n,"__esModule",{value:!0});var r,o=n.BINARY="binary",i=n.CATEGORICAL="categorical",s=n.SCALAR="scalar";n.MARKET_TYPES=(r={},a(r,o,o),a(r,i,i),a(r,s,s),r)},{}],214:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.FAVORITES="favorites",n.PENDING_REPORTS="pending reports"},{}],215:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=(a(s),e("../../common/components/value-denomination")),u=a(l);t.exports=i.default.createClass({displayName:"exports",propTypes:{name:i.default.PropTypes.string,qtyShares:i.default.PropTypes.object,totalValue:i.default.PropTypes.object,gainPercent:i.default.PropTypes.object,lastPrice:i.default.PropTypes.object,purchasePrice:i.default.PropTypes.object,shareChange:i.default.PropTypes.object,totalCost:i.default.PropTypes.object,netChange:i.default.PropTypes.object},render:function(){var e=this.props;return i.default.createElement("div",{className:"position"},i.default.createElement("div",{className:"main-group"},i.default.createElement("span",{className:"position-name"},e.name),i.default.createElement(u.default,e.qtyShares),i.default.createElement("div",{className:"position-pair gain-percent"},i.default.createElement(u.default,r({},e.gainPercent,{formatted:e.gainPercent.minimized}))," ",i.default.createElement("span",{className:"title"},e.gainPercent.value>0?"gain":"loss"))),i.default.createElement("div",{className:"position-group"},i.default.createElement("div",{className:"position-pair per-share-gain"},i.default.createElement("span",{className:"title"},"per share gain/loss"),i.default.createElement(u.default,e.shareChange)),i.default.createElement("div",{className:"position-pair last-price"},i.default.createElement("span",{className:"title"},"last trade price"),i.default.createElement(u.default,e.lastPrice)),i.default.createElement("div",{className:"position-pair purchase-price"},i.default.createElement("span",{className:"title"},"avg. purchase price"),i.default.createElement(u.default,e.purchasePrice))),i.default.createElement("div",{className:"position-group"},i.default.createElement("div",{className:"position-pair net-change"},i.default.createElement("span",{className:"title"},"net gain/loss"),i.default.createElement(u.default,e.netChange)),i.default.createElement("div",{className:"position-pair total-value"},i.default.createElement("span",{className:"title"},"total value"),i.default.createElement(u.default,e.totalValue)),i.default.createElement("div",{className:"position-pair total-cost"},i.default.createElement("span",{className:"title"},"total cost"),i.default.createElement(u.default,e.totalCost))))}})},{"../../common/components/value-denomination":190,classnames:1,react:181}],216:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("../../site/components/site-header"),s=a(i),l=e("../../site/components/site-footer"),u=a(l),c=e("../../positions/components/positions"),d=a(c),p=e("../../positions/components/positions-summary"),f=a(p);t.exports=o.default.createClass({displayName:"exports",propTypes:{className:o.default.PropTypes.string,siteHeader:o.default.PropTypes.object,positionsSummary:o.default.PropTypes.object,markets:o.default.PropTypes.array},render:function(){var e=this.props;return o.default.createElement("main",{className:"page positions-page"},o.default.createElement(s.default,e.siteHeader),o.default.createElement("header",{className:"page-header"
},o.default.createElement("div",{className:"l-container"},o.default.createElement(f.default,e.positionsSummary))),o.default.createElement("section",{className:"page-content"},o.default.createElement("div",{className:"l-container"},!!e.markets&&!!e.markets.length&&e.markets.map(function(e){return o.default.createElement("div",{key:e.id,className:"positions-container"},o.default.createElement("span",{className:"description"},e.description),!!e.positionOutcomes&&!!e.positionOutcomes.length&&o.default.createElement(d.default,{className:"page-content positions-content",outcomes:e.positionOutcomes}))}))),o.default.createElement(u.default,null))}})},{"../../positions/components/positions":218,"../../positions/components/positions-summary":217,"../../site/components/site-footer":221,"../../site/components/site-header":222,react:181}],217:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=a(s),u=e("../../common/components/value-denomination"),c=a(u);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string},render:function(){var e=this.props;return i.default.createElement("div",{className:(0,l.default)("positions-summary",e.className)},!!e.numPositions&&i.default.createElement(c.default,r({},e.numPositions,{className:"num-positions"})),e.totalValue&&i.default.createElement(c.default,r({},e.totalValue,{className:"total-value"})),e.gainPercent&&i.default.createElement(c.default,r({},e.gainPercent,{className:"gain-percent",formatted:e.gainPercent.formatted})))}})},{"../../common/components/value-denomination":190,classnames:1,react:181}],218:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=(a(s),e("./position")),u=a(l);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,outcomes:i.default.PropTypes.array},render:function(){var e=this.props;return i.default.createElement("section",{className:"positions-list"},(e.outcomes||[]).map(function(e){return i.default.createElement(u.default,r({key:e.id},e,e.position))}))}})},{"./position":215,classnames:1,react:181}],219:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=a(i),l=e("../../common/components/checkbox"),u=a(l);t.exports=o.default.createClass({displayName:"exports",propTypes:{reportableOutcomes:o.default.PropTypes.array,reportedOutcomeID:o.default.PropTypes.any,isUnethical:o.default.PropTypes.bool,isReported:o.default.PropTypes.bool,onClickSubmit:o.default.PropTypes.func},getInitialState:function(){return{reportedOutcomeID:this.props.reportedOutcomeID,isUnethical:this.props.isUnethical,isReported:this.props.isReported}},componentWillReceiveProps:function(e){e.isReported!==this.state.isReported&&this.setState({isReported:e.isReported})},render:function(){var e=this,t=this.props,n=this.state;return o.default.createElement("section",{className:(0,s.default)("report-form",{reported:n.isReported})},o.default.createElement("div",{ref:"outcomeOptions",className:"outcome-options"},o.default.createElement("h4",null,n.isReported?"Outcome Reported":"Report the outcome"),(t.reportableOutcomes||[]).map(function(t){return o.default.createElement("label",{key:t.id,className:(0,s.default)("outcome-option",{disabled:n.isReported})},o.default.createElement("input",{type:"radio",className:"outcome-option-radio",name:"outcome-option-radio",value:t.id,checked:n.reportedOutcomeID===t.id,disabled:n.isReported,onChange:e.handleOutcomeChange}),t.name)})),o.default.createElement("div",{className:"unethical"},o.default.createElement("h4",null,"Is this question unethical?"),o.default.createElement(u.default,{ref:"unethical",className:(0,s.default)("unethical-checkbox",{disabled:n.isReported}),text:"Yes, this question is unethical",isChecked:!!n.isUnethical,onClick:!n.isReported&&function(){return e.setState({isUnethical:!n.isUnethical})}||null}),o.default.createElement("span",{className:"unethical-message"},"The consensus answer to this question will be over-ridden if the question is reported as unethical by 60% (or more) of those reporting this market.")),!n.isReported&&o.default.createElement("button",{className:"button report",disabled:!n.reportedOutcomeID,onClick:!!n.reportedOutcomeID&&!n.isReported&&this.handleSubmit||null},"Submit Report"),n.isReported&&o.default.createElement("button",{className:"button report-again",onClick:function(){return e.setState({isReported:!1})}},"Report Again"))},handleOutcomeChange:function(e){return this.setState({reportedOutcomeID:e.target.value})},handleSubmit:function(){this.props.onClickSubmit(this.state.reportedOutcomeID,this.state.isUnethical),this.setState({reportedOutcomeID:null,isUnethical:null,isReported:!1})}})},{"../../common/components/checkbox":186,classnames:1,react:181}],220:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=a(s),u=e("../../reports/components/report-form"),c=a(u);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,numPendingReports:i.default.PropTypes.number,outcomes:i.default.PropTypes.array,reportedOutcomeID:i.default.PropTypes.any,isUnethical:i.default.PropTypes.bool,isReported:i.default.PropTypes.bool,isReportSubmitted:i.default.PropTypes.bool,onSubmitReport:i.default.PropTypes.func},render:function(){var e=this.props;return i.default.createElement("section",{className:(0,l.default)("report-panel",e.className)},i.default.createElement("span",{className:"num-total-reports"},e.numPendingReports),i.default.createElement(c.default,r({},e,{isReported:e.isReported||e.isReportSubmitted,onClickSubmit:e.onSubmitReport})))}})},{"../../reports/components/report-form":219,classnames:1,react:181}],221:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r);t.exports=o.default.createClass({displayName:"exports",render:function(){return o.default.createElement("div",{className:"site-footer"},o.default.createElement("a",{className:"link",href:"https://sale.augur.net",target:"_blank"},"REP Login"),o.default.createElement("a",{className:"link",href:"http://docs.augur.net",target:"_blank"},"Documentation"),o.default.createElement("a",{className:"link",href:"http://blog.augur.net",target:"_blank"},"Blog"),o.default.createElement("a",{className:"link",href:"https://github.com/AugurProject",target:"_blank"},"Github"),o.default.createElement("a",{className:"link",href:"https://augur.zendesk.com/hc/en-us",target:"_blank"},"FAQ"),o.default.createElement("a",{className:"link",href:"http://augur.strikingly.com",target:"_blank"},"About"),o.default.createElement("a",{className:"link",href:"https://www.hamsterpad.com/chat/dyffy",target:"_blank"},"Slack"),o.default.createElement("a",{className:"link",href:"http://augur.link/augur-beta-ToS-v2.pdf",target:"_blank"},"Terms of Service"))}})},{react:181}],222:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=a(s),u=e("../../site/constants/pages"),c=e("../../auth/constants/auth-types"),d=e("../../link/components/link"),p=a(d),f=e("../../common/components/value-denomination"),m=a(f);t.exports=i.default.createClass({displayName:"exports",propTypes:{activePage:i.default.PropTypes.string,loginAccount:i.default.PropTypes.object,positionsSummary:i.default.PropTypes.object,transactionsTotals:i.default.PropTypes.object,isTransactionsWorking:i.default.PropTypes.bool,marketsLink:i.default.PropTypes.object,positionsLink:i.default.PropTypes.object,transactionsLink:i.default.PropTypes.object,authLink:i.default.PropTypes.object},render:function(){var e=this.props;return i.default.createElement("header",{className:"site-header"},i.default.createElement("nav",{className:"site-nav"},i.default.createElement(p.default,r({className:(0,l.default)("site-nav-link","augur",{active:e.activePage===u.MARKETS})},e.marketsLink),"augur"),i.default.createElement("span",{className:"spacer"}," "),!!e.loginAccount&&!!e.loginAccount.id&&i.default.createElement(p.default,r({className:(0,l.default)("site-nav-link",u.POSITIONS,{active:e.activePage===u.POSITIONS})},e.positionsLink),!!e.positionsSummary&&!!e.positionsSummary.numPositions&&i.default.createElement(m.default,r({className:"positions-num"},e.positionsSummary.numPositions,{formatted:e.positionsSummary.numPositions.rounded,formattedValue:e.positionsSummary.numPositions.roundedValue})),!!e.positionsSummary&&!!e.positionsSummary.gainPercent&&e.positionsSummary.numPositions.roundedValue>0&&i.default.createElement(m.default,r({className:"positions-gain"},e.positionsSummary.gainPercent,{formatted:e.positionsSummary.gainPercent.rounded,formattedValue:e.positionsSummary.gainPercent.roundedValue}))),!!e.loginAccount&&!!e.loginAccount.id&&i.default.createElement(p.default,r({className:(0,l.default)("site-nav-link",u.TRANSACTIONS,{active:e.activePage===u.TRANSACTIONS},{working:e.isTransactionsWorking}),title:e.loginAccount.realEther&&"real ether: "+e.loginAccount.realEther.full},e.transactionsLink),(!e.isTransactionsWorking||e.activePage===u.TRANSACTIONS)&&i.default.createElement(m.default,r({},e.loginAccount.rep||{},{formatted:e.loginAccount.rep&&e.loginAccount.rep.rounded,formattedValue:e.loginAccount.rep&&e.loginAccount.rep.roundedValue})),(!e.isTransactionsWorking||e.activePage===u.TRANSACTIONS)&&i.default.createElement(m.default,r({},e.loginAccount.ether||{},{formatted:e.loginAccount.ether&&e.loginAccount.ether.rounded,formattedValue:e.loginAccount.ether&&e.loginAccount.ether.roundedValue})),e.isTransactionsWorking&&e.activePage!==u.TRANSACTIONS&&i.default.createElement("span",{className:"link-text"},e.transactionsTotals.title)),i.default.createElement(p.default,r({className:(0,l.default)("site-nav-link",c.AUTH_TYPES[e.activePage],{active:!!c.AUTH_TYPES[e.activePage]})},e.authLink),e.loginAccount&&e.loginAccount.id?"Sign Out":"Sign Up / Login")))}})},{"../../auth/constants/auth-types":185,"../../common/components/value-denomination":190,"../../link/components/link":203,"../../site/constants/pages":223,classnames:1,react:181}],223:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=n.MARKETS="markets";n.MAKE="make",n.POSITIONS="positions",n.TRANSACTIONS="transactions",n.M="m",n.DEFAULT_PAGE=a},{}],224:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=a(s),u=e("../../common/components/value-denomination"),c=a(u),d=e("../../common/components/input"),p=a(d);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,name:i.default.PropTypes.string,numShares:i.default.PropTypes.number,limitPrice:i.default.PropTypes.number,lastPrice:i.default.PropTypes.object,topBid:i.default.PropTypes.object,topAsk:i.default.PropTypes.object,feeToPay:i.default.PropTypes.object,tradeSummary:i.default.PropTypes.object,sharesOwned:i.default.PropTypes.number,etherAvailable:i.default.PropTypes.number,onChangeTrade:i.default.PropTypes.func},render:function(){var e=this.props;return i.default.createElement("div",{className:(0,l.default)("trade-panel-item",e.className)},i.default.createElement("span",{className:"outcome-name"},e.name),i.default.createElement(c.default,r({className:"last-price"},e.lastPrice)),i.default.createElement(c.default,r({className:"top-bid"},e.topBid)),i.default.createElement(c.default,r({className:"top-ask"},e.topAsk)),i.default.createElement(p.default,{className:"num-shares",type:"text",value:e.numShares,isClearable:!1,onChange:function(t){return e.onChangeTrade(parseFloat(t)||0,parseFloat(e.limitPrice)||0)}}),i.default.createElement(p.default,{className:"limit-price",type:"text",value:e.limitPrice,isClearable:!1,onChange:function(t){return e.onChangeTrade(parseFloat(e.numShares)||0,parseFloat(t)||0)}}),i.default.createElement(c.default,r({className:"fee-to-pay"},e.feeToPay)),i.default.createElement(c.default,r({className:"total-cost"},e.tradeSummary.totalEther)))}})},{"../../common/components/input":189,"../../common/components/value-denomination":190,classnames:1,react:181}],225:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("./trade-panel-item"),l=a(s),u=e("../../transactions/components/transaction"),c=a(u);t.exports=i.default.createClass({displayName:"exports",propTypes:{outcomes:i.default.PropTypes.array,tradeOrders:i.default.PropTypes.array,onSubmitPlaceTrade:i.default.PropTypes.func},render:function(){var e=this.props;return i.default.createElement("section",{className:"trade-panel"},i.default.createElement("div",{className:"trade-builder"},i.default.createElement("div",{className:"trade-panel-item-header"},i.default.createElement("span",{className:"outcome-name"}," "),i.default.createElement("span",{className:"last-price"},"Last"),i.default.createElement("span",{className:"top-bid"},"Top Bid"),i.default.createElement("span",{className:"top-ask"},"Top Ask"),i.default.createElement("span",{className:"num-shares"},"Shares"),i.default.createElement("span",{className:"limit-price"},"Limit"),i.default.createElement("span",{className:"fee-to-pay"},"Fee"),i.default.createElement("span",{className:"total-cost"},"Cost")),e.outcomes&&e.outcomes.map(function(e){return i.default.createElement(l.default,r({key:e.id},e,e.trade))})),e.tradeOrders&&!!e.tradeOrders.length&&i.default.createElement("div",{className:"trade-orders"},i.default.createElement("h5",null,"Trade Summary"),e.tradeOrders&&e.tradeOrders.map(function(e,t){return i.default.createElement(c.default,r({key:t,className:"order"},e,{status:void 0}))}),i.default.createElement(c.default,{shares:e.totalShares,className:"order total",ether:e.totalEther,gas:e.totalGas,status:void 0})),i.default.createElement("div",{className:"place-trade-container"},i.default.createElement("button",{className:"button place-trade",disabled:!e.tradeOrders||!e.tradeOrders.length,onClick:e.onSubmitPlaceTrade},"Place Trade")))}})},{"../../transactions/components/transaction":226,"./trade-panel-item":224,react:181}],226:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=a(s),u=e("../../transactions/constants/types"),c=e("../../auth/constants/auth-types"),d=e("../../common/components/value-denomination"),p=a(d);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,index:i.default.PropTypes.number,type:i.default.PropTypes.string,status:i.default.PropTypes.string,data:i.default.PropTypes.object,shares:i.default.PropTypes.object,ether:i.default.PropTypes.object,asksToBuy:i.default.PropTypes.array},render:function(){var e=this.props,t={};switch(e.type){case u.BUY_SHARES:case u.BID_SHARES:case u.SELL_SHARES:case u.ASK_SHARES:switch(e.type){case u.BUY_SHARES:t.action="BUY";break;case u.BID_SHARES:t.action="BID";break;case u.SELL_SHARES:t.action="SELL";break;case u.ASK_SHARES:t.action="ASK"}t.description=i.default.createElement("span",{className:"description"},i.default.createElement("span",{className:"action"},t.action),i.default.createElement(p.default,r({className:"shares"},e.shares)),i.default.createElement("span",{className:"at"},"at"),i.default.createElement(p.default,r({className:"shares"},e.data.avgPrice)),i.default.createElement("span",{className:"of"},"of"),i.default.createElement("span",{className:"outcome-name"},e.data.outcomeName.substring(0,35)+(e.data.outcomeName.length>35&&"..."||"")),i.default.createElement("br",null),i.default.createElement("span",{className:"market-description",title:e.data.marketDescription},e.data.marketDescription.substring(0,100)+(e.data.marketDescription.length>100&&"..."||"")));break;case c.LOGIN:t.description=i.default.createElement("span",{className:"description"},"Login");break;case c.REGISTER:t.description=i.default.createElement("span",{className:"description"},"Load free beta assets");break;case u.CREATE_MARKET:t.description=i.default.createElement("span",{className:"description"},i.default.createElement("span",null,"Make"),i.default.createElement("strong",null,e.data.type),i.default.createElement("span",null,"market"),i.default.createElement("br",null),i.default.createElement("span",{className:"market-description",title:e.data.description},e.data.description.substring(0,100)+(e.data.description.length>100&&"..."||"")));break;case u.SUBMIT_REPORT:t.description=i.default.createElement("span",{className:"description"},i.default.createElement("span",null,"Report"),i.default.createElement("strong",null,e.data.outcome.name.substring(0,35)+(e.data.outcome.name.length>35&&"..."||"")),!!e.data.isUnethical&&i.default.createElement("strong",{className:"unethical"}," and Unethical"),i.default.createElement("br",null),i.default.createElement("span",{className:"market-description",title:e.data.market.description},e.data.market.description.substring(0,100)+(e.data.market.description.length>100&&"..."||"")));break;default:t.description=i.default.createElement("span",{className:"description"},e.type)}return i.default.createElement("article",{className:(0,l.default)("transaction-item",e.className,e.status)},e.index&&i.default.createElement("span",{className:"index"},e.index+"."),t.description,i.default.createElement("span",{className:"value-changes"},!!e.shares&&!!e.shares.value&&i.default.createElement(p.default,r({className:"value-change shares"},e.shares)),!!e.ether&&!!e.ether.value&&i.default.createElement(p.default,r({className:"value-change ether"},e.ether))),e.status&&i.default.createElement("div",{className:"status-and-message"},i.default.createElement("span",{className:"status"},e.status),i.default.createElement("br",null),i.default.createElement("span",{className:"message"},e.message)))}})},{"../../auth/constants/auth-types":185,"../../common/components/value-denomination":190,"../../transactions/constants/types":229,classnames:1,react:181}],227:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=e("react"),o=a(r),i=e("classnames"),s=(a(i),e("../../site/components/site-header")),l=a(s),u=e("../../site/components/site-footer"),c=a(u),d=e("../../transactions/components/transactions"),p=a(d);t.exports=o.default.createClass({displayName:"exports",propTypes:{className:o.default.PropTypes.string,siteHeader:o.default.PropTypes.object,transactions:o.default.PropTypes.array,transactionsTotals:o.default.PropTypes.object},render:function(){var e=this.props;return o.default.createElement("main",{className:"page transactions"},o.default.createElement(l.default,e.siteHeader),o.default.createElement("header",{className:"page-header"},o.default.createElement("div",{className:"l-container"},o.default.createElement("span",{className:"big-line"},e.transactionsTotals.title))),o.default.createElement("div",{className:"page-content"},o.default.createElement("div",{className:"l-container"},o.default.createElement(p.default,{className:"transactions-content",transactions:e.transactions}))),o.default.createElement(c.default,null))}})},{"../../site/components/site-footer":221,"../../site/components/site-header":222,"../../transactions/components/transactions":228,classnames:1,react:181}],228:[function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=e("react"),i=a(o),s=e("classnames"),l=a(s),u=e("./transaction"),c=a(u);t.exports=i.default.createClass({displayName:"exports",propTypes:{className:i.default.PropTypes.string,transactions:i.default.PropTypes.array},render:function(){var e=this.props;return i.default.createElement("section",{className:(0,l.default)(e.className)},(e.transactions||[]).map(function(t,n){return i.default.createElement(c.default,r({key:t.id},t,{index:e.transactions.length-n}))}),!!e.transactions.length&&i.default.createElement("span",{className:"feel-free"},"You can continue using the site and placing trades while transactions are running. Just don't close the browser before they're done!"))}})},{"./transaction":226,classnames:1,react:181}],229:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.BUY_SHARES="buy_shares",n.SELL_SHARES="sell_shares",n.BID_SHARES="bid_shares",n.ASK_SHARES="ask_shares",n.CREATE_MARKET="create_market",n.SUBMIT_REPORT="submit_report",n.REGISTER_ACCOUNT="register_account"},{}],230:[function(e,t,n){"use strict";function a(e,t){return r(e,this.props,!0)||r(t,this.state,!0)}function r(e,t,n){if(e===t)return!1;if("object"!==("undefined"==typeof e?"undefined":o(e))||null===e||"object"!==("undefined"==typeof t?"undefined":o(t))||null===t)return!0;var a=Object.keys(e),r=Object.keys(t),i=a.length;if(i!==r.length)return!0;for(var s=0;i>s;s++)if(e[a[s]]!==t[a[s]]&&"function"!=typeof e[a[s]])return!0;return!1}Object.defineProperty(n,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};n.default=function(e,t){return r(e,this.props)||r(t,this.state)},n.shouldComponentUpdateLog=a,n.isShallowUnEqual=r},{}]},{},[182])(182)});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
/*! bignumber.js v2.3.0 https://github.com/MikeMcl/bignumber.js/LICENCE */

;(function (globalObj) {
    'use strict';

    /*
      bignumber.js v2.3.0
      A JavaScript library for arbitrary-precision arithmetic.
      https://github.com/MikeMcl/bignumber.js
      Copyright (c) 2016 Michael Mclaughlin <M8ch88l@gmail.com>
      MIT Expat Licence
    */


    var cryptoObj, parseNumeric,
        isNumeric = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
        mathceil = Math.ceil,
        mathfloor = Math.floor,
        notBool = ' not a boolean or binary digit',
        roundingMode = 'rounding mode',
        tooManyDigits = 'number type has more than 15 significant digits',
        ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',
        BASE = 1e14,
        LOG_BASE = 14,
        MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
        // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
        POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
        SQRT_BASE = 1e7,

        /*
         * The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
         * the arguments to toExponential, toFixed, toFormat, and toPrecision, beyond which an
         * exception is thrown (if ERRORS is true).
         */
        MAX = 1E9;                                   // 0 to MAX_INT32

    if ( typeof crypto != 'undefined' ) cryptoObj = crypto;


    /*
     * Create and return a BigNumber constructor.
     */
    function constructorFactory(configObj) {
        var div,

            // id tracks the caller function, so its name can be included in error messages.
            id = 0,
            P = BigNumber.prototype,
            ONE = new BigNumber(1),


            /********************************* EDITABLE DEFAULTS **********************************/


            /*
             * The default values below must be integers within the inclusive ranges stated.
             * The values can also be changed at run-time using BigNumber.config.
             */

            // The maximum number of decimal places for operations involving division.
            DECIMAL_PLACES = 20,                     // 0 to MAX

            /*
             * The rounding mode used when rounding to the above decimal places, and when using
             * toExponential, toFixed, toFormat and toPrecision, and round (default value).
             * UP         0 Away from zero.
             * DOWN       1 Towards zero.
             * CEIL       2 Towards +Infinity.
             * FLOOR      3 Towards -Infinity.
             * HALF_UP    4 Towards nearest neighbour. If equidistant, up.
             * HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
             * HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
             * HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
             * HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
             */
            ROUNDING_MODE = 4,                       // 0 to 8

            // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

            // The exponent value at and beneath which toString returns exponential notation.
            // Number type: -7
            TO_EXP_NEG = -7,                         // 0 to -MAX

            // The exponent value at and above which toString returns exponential notation.
            // Number type: 21
            TO_EXP_POS = 21,                         // 0 to MAX

            // RANGE : [MIN_EXP, MAX_EXP]

            // The minimum exponent value, beneath which underflow to zero occurs.
            // Number type: -324  (5e-324)
            MIN_EXP = -1e7,                          // -1 to -MAX

            // The maximum exponent value, above which overflow to Infinity occurs.
            // Number type:  308  (1.7976931348623157e+308)
            // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
            MAX_EXP = 1e7,                           // 1 to MAX

            // Whether BigNumber Errors are ever thrown.
            ERRORS = true,                           // true or false

            // Change to intValidatorNoErrors if ERRORS is false.
            isValidInt = intValidatorWithErrors,     // intValidatorWithErrors/intValidatorNoErrors

            // Whether to use cryptographically-secure random number generation, if available.
            CRYPTO = false,                          // true or false

            /*
             * The modulo mode used when calculating the modulus: a mod n.
             * The quotient (q = a / n) is calculated according to the corresponding rounding mode.
             * The remainder (r) is calculated as: r = a - n * q.
             *
             * UP        0 The remainder is positive if the dividend is negative, else is negative.
             * DOWN      1 The remainder has the same sign as the dividend.
             *             This modulo mode is commonly known as 'truncated division' and is
             *             equivalent to (a % n) in JavaScript.
             * FLOOR     3 The remainder has the same sign as the divisor (Python %).
             * HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
             * EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
             *             The remainder is always positive.
             *
             * The truncated division, floored division, Euclidian division and IEEE 754 remainder
             * modes are commonly used for the modulus operation.
             * Although the other rounding modes can also be used, they may not give useful results.
             */
            MODULO_MODE = 1,                         // 0 to 9

            // The maximum number of significant digits of the result of the toPower operation.
            // If POW_PRECISION is 0, there will be unlimited significant digits.
            POW_PRECISION = 100,                     // 0 to MAX

            // The format specification used by the BigNumber.prototype.toFormat method.
            FORMAT = {
                decimalSeparator: '.',
                groupSeparator: ',',
                groupSize: 3,
                secondaryGroupSize: 0,
                fractionGroupSeparator: '\xA0',      // non-breaking space
                fractionGroupSize: 0
            };


        /******************************************************************************************/


        // CONSTRUCTOR


        /*
         * The BigNumber constructor and exported function.
         * Create and return a new instance of a BigNumber object.
         *
         * n {number|string|BigNumber} A numeric value.
         * [b] {number} The base of n. Integer, 2 to 64 inclusive.
         */
        function BigNumber( n, b ) {
            var c, e, i, num, len, str,
                x = this;

            // Enable constructor usage without new.
            if ( !( x instanceof BigNumber ) ) {

                // 'BigNumber() constructor call without new: {n}'
                if (ERRORS) raise( 26, 'constructor call without new', n );
                return new BigNumber( n, b );
            }

            // 'new BigNumber() base not an integer: {b}'
            // 'new BigNumber() base out of range: {b}'
            if ( b == null || !isValidInt( b, 2, 64, id, 'base' ) ) {

                // Duplicate.
                if ( n instanceof BigNumber ) {
                    x.s = n.s;
                    x.e = n.e;
                    x.c = ( n = n.c ) ? n.slice() : n;
                    id = 0;
                    return;
                }

                if ( ( num = typeof n == 'number' ) && n * 0 == 0 ) {
                    x.s = 1 / n < 0 ? ( n = -n, -1 ) : 1;

                    // Fast path for integers.
                    if ( n === ~~n ) {
                        for ( e = 0, i = n; i >= 10; i /= 10, e++ );
                        x.e = e;
                        x.c = [n];
                        id = 0;
                        return;
                    }

                    str = n + '';
                } else {
                    if ( !isNumeric.test( str = n + '' ) ) return parseNumeric( x, str, num );
                    x.s = str.charCodeAt(0) === 45 ? ( str = str.slice(1), -1 ) : 1;
                }
            } else {
                b = b | 0;
                str = n + '';

                // Ensure return value is rounded to DECIMAL_PLACES as with other bases.
                // Allow exponential notation to be used with base 10 argument.
                if ( b == 10 ) {
                    x = new BigNumber( n instanceof BigNumber ? n : str );
                    return round( x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE );
                }

                // Avoid potential interpretation of Infinity and NaN as base 44+ values.
                // Any number in exponential form will fail due to the [Ee][+-].
                if ( ( num = typeof n == 'number' ) && n * 0 != 0 ||
                  !( new RegExp( '^-?' + ( c = '[' + ALPHABET.slice( 0, b ) + ']+' ) +
                    '(?:\\.' + c + ')?$',b < 37 ? 'i' : '' ) ).test(str) ) {
                    return parseNumeric( x, str, num, b );
                }

                if (num) {
                    x.s = 1 / n < 0 ? ( str = str.slice(1), -1 ) : 1;

                    if ( ERRORS && str.replace( /^0\.0*|\./, '' ).length > 15 ) {

                        // 'new BigNumber() number type has more than 15 significant digits: {n}'
                        raise( id, tooManyDigits, n );
                    }

                    // Prevent later check for length on converted number.
                    num = false;
                } else {
                    x.s = str.charCodeAt(0) === 45 ? ( str = str.slice(1), -1 ) : 1;
                }

                str = convertBase( str, 10, b, x.s );
            }

            // Decimal point?
            if ( ( e = str.indexOf('.') ) > -1 ) str = str.replace( '.', '' );

            // Exponential form?
            if ( ( i = str.search( /e/i ) ) > 0 ) {

                // Determine exponent.
                if ( e < 0 ) e = i;
                e += +str.slice( i + 1 );
                str = str.substring( 0, i );
            } else if ( e < 0 ) {

                // Integer.
                e = str.length;
            }

            // Determine leading zeros.
            for ( i = 0; str.charCodeAt(i) === 48; i++ );

            // Determine trailing zeros.
            for ( len = str.length; str.charCodeAt(--len) === 48; );
            str = str.slice( i, len + 1 );

            if (str) {
                len = str.length;

                // Disallow numbers with over 15 significant digits if number type.
                // 'new BigNumber() number type has more than 15 significant digits: {n}'
                if ( num && ERRORS && len > 15 && ( n > MAX_SAFE_INTEGER || n !== mathfloor(n) ) ) {
                    raise( id, tooManyDigits, x.s * n );
                }

                e = e - i - 1;

                 // Overflow?
                if ( e > MAX_EXP ) {

                    // Infinity.
                    x.c = x.e = null;

                // Underflow?
                } else if ( e < MIN_EXP ) {

                    // Zero.
                    x.c = [ x.e = 0 ];
                } else {
                    x.e = e;
                    x.c = [];

                    // Transform base

                    // e is the base 10 exponent.
                    // i is where to slice str to get the first element of the coefficient array.
                    i = ( e + 1 ) % LOG_BASE;
                    if ( e < 0 ) i += LOG_BASE;

                    if ( i < len ) {
                        if (i) x.c.push( +str.slice( 0, i ) );

                        for ( len -= LOG_BASE; i < len; ) {
                            x.c.push( +str.slice( i, i += LOG_BASE ) );
                        }

                        str = str.slice(i);
                        i = LOG_BASE - str.length;
                    } else {
                        i -= len;
                    }

                    for ( ; i--; str += '0' );
                    x.c.push( +str );
                }
            } else {

                // Zero.
                x.c = [ x.e = 0 ];
            }

            id = 0;
        }


        // CONSTRUCTOR PROPERTIES


        BigNumber.another = constructorFactory;

        BigNumber.ROUND_UP = 0;
        BigNumber.ROUND_DOWN = 1;
        BigNumber.ROUND_CEIL = 2;
        BigNumber.ROUND_FLOOR = 3;
        BigNumber.ROUND_HALF_UP = 4;
        BigNumber.ROUND_HALF_DOWN = 5;
        BigNumber.ROUND_HALF_EVEN = 6;
        BigNumber.ROUND_HALF_CEIL = 7;
        BigNumber.ROUND_HALF_FLOOR = 8;
        BigNumber.EUCLID = 9;


        /*
         * Configure infrequently-changing library-wide settings.
         *
         * Accept an object or an argument list, with one or many of the following properties or
         * parameters respectively:
         *
         *   DECIMAL_PLACES  {number}  Integer, 0 to MAX inclusive
         *   ROUNDING_MODE   {number}  Integer, 0 to 8 inclusive
         *   EXPONENTIAL_AT  {number|number[]}  Integer, -MAX to MAX inclusive or
         *                                      [integer -MAX to 0 incl., 0 to MAX incl.]
         *   RANGE           {number|number[]}  Non-zero integer, -MAX to MAX inclusive or
         *                                      [integer -MAX to -1 incl., integer 1 to MAX incl.]
         *   ERRORS          {boolean|number}   true, false, 1 or 0
         *   CRYPTO          {boolean|number}   true, false, 1 or 0
         *   MODULO_MODE     {number}           0 to 9 inclusive
         *   POW_PRECISION   {number}           0 to MAX inclusive
         *   FORMAT          {object}           See BigNumber.prototype.toFormat
         *      decimalSeparator       {string}
         *      groupSeparator         {string}
         *      groupSize              {number}
         *      secondaryGroupSize     {number}
         *      fractionGroupSeparator {string}
         *      fractionGroupSize      {number}
         *
         * (The values assigned to the above FORMAT object properties are not checked for validity.)
         *
         * E.g.
         * BigNumber.config(20, 4) is equivalent to
         * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
         *
         * Ignore properties/parameters set to null or undefined.
         * Return an object with the properties current values.
         */
        BigNumber.config = function () {
            var v, p,
                i = 0,
                r = {},
                a = arguments,
                o = a[0],
                has = o && typeof o == 'object'
                  ? function () { if ( o.hasOwnProperty(p) ) return ( v = o[p] ) != null; }
                  : function () { if ( a.length > i ) return ( v = a[i++] ) != null; };

            // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
            // 'config() DECIMAL_PLACES not an integer: {v}'
            // 'config() DECIMAL_PLACES out of range: {v}'
            if ( has( p = 'DECIMAL_PLACES' ) && isValidInt( v, 0, MAX, 2, p ) ) {
                DECIMAL_PLACES = v | 0;
            }
            r[p] = DECIMAL_PLACES;

            // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
            // 'config() ROUNDING_MODE not an integer: {v}'
            // 'config() ROUNDING_MODE out of range: {v}'
            if ( has( p = 'ROUNDING_MODE' ) && isValidInt( v, 0, 8, 2, p ) ) {
                ROUNDING_MODE = v | 0;
            }
            r[p] = ROUNDING_MODE;

            // EXPONENTIAL_AT {number|number[]}
            // Integer, -MAX to MAX inclusive or [integer -MAX to 0 inclusive, 0 to MAX inclusive].
            // 'config() EXPONENTIAL_AT not an integer: {v}'
            // 'config() EXPONENTIAL_AT out of range: {v}'
            if ( has( p = 'EXPONENTIAL_AT' ) ) {

                if ( isArray(v) ) {
                    if ( isValidInt( v[0], -MAX, 0, 2, p ) && isValidInt( v[1], 0, MAX, 2, p ) ) {
                        TO_EXP_NEG = v[0] | 0;
                        TO_EXP_POS = v[1] | 0;
                    }
                } else if ( isValidInt( v, -MAX, MAX, 2, p ) ) {
                    TO_EXP_NEG = -( TO_EXP_POS = ( v < 0 ? -v : v ) | 0 );
                }
            }
            r[p] = [ TO_EXP_NEG, TO_EXP_POS ];

            // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
            // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
            // 'config() RANGE not an integer: {v}'
            // 'config() RANGE cannot be zero: {v}'
            // 'config() RANGE out of range: {v}'
            if ( has( p = 'RANGE' ) ) {

                if ( isArray(v) ) {
                    if ( isValidInt( v[0], -MAX, -1, 2, p ) && isValidInt( v[1], 1, MAX, 2, p ) ) {
                        MIN_EXP = v[0] | 0;
                        MAX_EXP = v[1] | 0;
                    }
                } else if ( isValidInt( v, -MAX, MAX, 2, p ) ) {
                    if ( v | 0 ) MIN_EXP = -( MAX_EXP = ( v < 0 ? -v : v ) | 0 );
                    else if (ERRORS) raise( 2, p + ' cannot be zero', v );
                }
            }
            r[p] = [ MIN_EXP, MAX_EXP ];

            // ERRORS {boolean|number} true, false, 1 or 0.
            // 'config() ERRORS not a boolean or binary digit: {v}'
            if ( has( p = 'ERRORS' ) ) {

                if ( v === !!v || v === 1 || v === 0 ) {
                    id = 0;
                    isValidInt = ( ERRORS = !!v ) ? intValidatorWithErrors : intValidatorNoErrors;
                } else if (ERRORS) {
                    raise( 2, p + notBool, v );
                }
            }
            r[p] = ERRORS;

            // CRYPTO {boolean|number} true, false, 1 or 0.
            // 'config() CRYPTO not a boolean or binary digit: {v}'
            // 'config() crypto unavailable: {crypto}'
            if ( has( p = 'CRYPTO' ) ) {

                if ( v === !!v || v === 1 || v === 0 ) {
                    CRYPTO = !!( v && cryptoObj );
                    if ( v && !CRYPTO && ERRORS ) raise( 2, 'crypto unavailable', cryptoObj );
                } else if (ERRORS) {
                    raise( 2, p + notBool, v );
                }
            }
            r[p] = CRYPTO;

            // MODULO_MODE {number} Integer, 0 to 9 inclusive.
            // 'config() MODULO_MODE not an integer: {v}'
            // 'config() MODULO_MODE out of range: {v}'
            if ( has( p = 'MODULO_MODE' ) && isValidInt( v, 0, 9, 2, p ) ) {
                MODULO_MODE = v | 0;
            }
            r[p] = MODULO_MODE;

            // POW_PRECISION {number} Integer, 0 to MAX inclusive.
            // 'config() POW_PRECISION not an integer: {v}'
            // 'config() POW_PRECISION out of range: {v}'
            if ( has( p = 'POW_PRECISION' ) && isValidInt( v, 0, MAX, 2, p ) ) {
                POW_PRECISION = v | 0;
            }
            r[p] = POW_PRECISION;

            // FORMAT {object}
            // 'config() FORMAT not an object: {v}'
            if ( has( p = 'FORMAT' ) ) {

                if ( typeof v == 'object' ) {
                    FORMAT = v;
                } else if (ERRORS) {
                    raise( 2, p + ' not an object', v );
                }
            }
            r[p] = FORMAT;

            return r;
        };


        /*
         * Return a new BigNumber whose value is the maximum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */
        BigNumber.max = function () { return maxOrMin( arguments, P.lt ); };


        /*
         * Return a new BigNumber whose value is the minimum of the arguments.
         *
         * arguments {number|string|BigNumber}
         */
        BigNumber.min = function () { return maxOrMin( arguments, P.gt ); };


        /*
         * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
         * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
         * zeros are produced).
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         *
         * 'random() decimal places not an integer: {dp}'
         * 'random() decimal places out of range: {dp}'
         * 'random() crypto unavailable: {crypto}'
         */
        BigNumber.random = (function () {
            var pow2_53 = 0x20000000000000;

            // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
            // Check if Math.random() produces more than 32 bits of randomness.
            // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
            // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
            var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
              ? function () { return mathfloor( Math.random() * pow2_53 ); }
              : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
                  (Math.random() * 0x800000 | 0); };

            return function (dp) {
                var a, b, e, k, v,
                    i = 0,
                    c = [],
                    rand = new BigNumber(ONE);

                dp = dp == null || !isValidInt( dp, 0, MAX, 14 ) ? DECIMAL_PLACES : dp | 0;
                k = mathceil( dp / LOG_BASE );

                if (CRYPTO) {

                    // Browsers supporting crypto.getRandomValues.
                    if ( cryptoObj && cryptoObj.getRandomValues ) {

                        a = cryptoObj.getRandomValues( new Uint32Array( k *= 2 ) );

                        for ( ; i < k; ) {

                            // 53 bits:
                            // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
                            // 11111 11111111 11111111 11111111 11100000 00000000 00000000
                            // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
                            //                                     11111 11111111 11111111
                            // 0x20000 is 2^21.
                            v = a[i] * 0x20000 + (a[i + 1] >>> 11);

                            // Rejection sampling:
                            // 0 <= v < 9007199254740992
                            // Probability that v >= 9e15, is
                            // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
                            if ( v >= 9e15 ) {
                                b = cryptoObj.getRandomValues( new Uint32Array(2) );
                                a[i] = b[0];
                                a[i + 1] = b[1];
                            } else {

                                // 0 <= v <= 8999999999999999
                                // 0 <= (v % 1e14) <= 99999999999999
                                c.push( v % 1e14 );
                                i += 2;
                            }
                        }
                        i = k / 2;

                    // Node.js supporting crypto.randomBytes.
                    } else if ( cryptoObj && cryptoObj.randomBytes ) {

                        // buffer
                        a = cryptoObj.randomBytes( k *= 7 );

                        for ( ; i < k; ) {

                            // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
                            // 0x100000000 is 2^32, 0x1000000 is 2^24
                            // 11111 11111111 11111111 11111111 11111111 11111111 11111111
                            // 0 <= v < 9007199254740992
                            v = ( ( a[i] & 31 ) * 0x1000000000000 ) + ( a[i + 1] * 0x10000000000 ) +
                                  ( a[i + 2] * 0x100000000 ) + ( a[i + 3] * 0x1000000 ) +
                                  ( a[i + 4] << 16 ) + ( a[i + 5] << 8 ) + a[i + 6];

                            if ( v >= 9e15 ) {
                                cryptoObj.randomBytes(7).copy( a, i );
                            } else {

                                // 0 <= (v % 1e14) <= 99999999999999
                                c.push( v % 1e14 );
                                i += 7;
                            }
                        }
                        i = k / 7;
                    } else if (ERRORS) {
                        raise( 14, 'crypto unavailable', cryptoObj );
                    }
                }

                // Use Math.random: CRYPTO is false or crypto is unavailable and ERRORS is false.
                if (!i) {

                    for ( ; i < k; ) {
                        v = random53bitInt();
                        if ( v < 9e15 ) c[i++] = v % 1e14;
                    }
                }

                k = c[--i];
                dp %= LOG_BASE;

                // Convert trailing digits to zeros according to dp.
                if ( k && dp ) {
                    v = POWS_TEN[LOG_BASE - dp];
                    c[i] = mathfloor( k / v ) * v;
                }

                // Remove trailing elements which are zero.
                for ( ; c[i] === 0; c.pop(), i-- );

                // Zero?
                if ( i < 0 ) {
                    c = [ e = 0 ];
                } else {

                    // Remove leading elements which are zero and adjust exponent accordingly.
                    for ( e = -1 ; c[0] === 0; c.shift(), e -= LOG_BASE);

                    // Count the digits of the first element of c to determine leading zeros, and...
                    for ( i = 1, v = c[0]; v >= 10; v /= 10, i++);

                    // adjust the exponent accordingly.
                    if ( i < LOG_BASE ) e -= LOG_BASE - i;
                }

                rand.e = e;
                rand.c = c;
                return rand;
            };
        })();


        // PRIVATE FUNCTIONS


        // Convert a numeric string of baseIn to a numeric string of baseOut.
        function convertBase( str, baseOut, baseIn, sign ) {
            var d, e, k, r, x, xc, y,
                i = str.indexOf( '.' ),
                dp = DECIMAL_PLACES,
                rm = ROUNDING_MODE;

            if ( baseIn < 37 ) str = str.toLowerCase();

            // Non-integer.
            if ( i >= 0 ) {
                k = POW_PRECISION;

                // Unlimited precision.
                POW_PRECISION = 0;
                str = str.replace( '.', '' );
                y = new BigNumber(baseIn);
                x = y.pow( str.length - i );
                POW_PRECISION = k;

                // Convert str as if an integer, then restore the fraction part by dividing the
                // result by its base raised to a power.
                y.c = toBaseOut( toFixedPoint( coeffToString( x.c ), x.e ), 10, baseOut );
                y.e = y.c.length;
            }

            // Convert the number as integer.
            xc = toBaseOut( str, baseIn, baseOut );
            e = k = xc.length;

            // Remove trailing zeros.
            for ( ; xc[--k] == 0; xc.pop() );
            if ( !xc[0] ) return '0';

            if ( i < 0 ) {
                --e;
            } else {
                x.c = xc;
                x.e = e;

                // sign is needed for correct rounding.
                x.s = sign;
                x = div( x, y, dp, rm, baseOut );
                xc = x.c;
                r = x.r;
                e = x.e;
            }

            d = e + dp + 1;

            // The rounding digit, i.e. the digit to the right of the digit that may be rounded up.
            i = xc[d];
            k = baseOut / 2;
            r = r || d < 0 || xc[d + 1] != null;

            r = rm < 4 ? ( i != null || r ) && ( rm == 0 || rm == ( x.s < 0 ? 3 : 2 ) )
                       : i > k || i == k &&( rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
                         rm == ( x.s < 0 ? 8 : 7 ) );

            if ( d < 1 || !xc[0] ) {

                // 1^-dp or 0.
                str = r ? toFixedPoint( '1', -dp ) : '0';
            } else {
                xc.length = d;

                if (r) {

                    // Rounding up may mean the previous digit has to be rounded up and so on.
                    for ( --baseOut; ++xc[--d] > baseOut; ) {
                        xc[d] = 0;

                        if ( !d ) {
                            ++e;
                            xc.unshift(1);
                        }
                    }
                }

                // Determine trailing zeros.
                for ( k = xc.length; !xc[--k]; );

                // E.g. [4, 11, 15] becomes 4bf.
                for ( i = 0, str = ''; i <= k; str += ALPHABET.charAt( xc[i++] ) );
                str = toFixedPoint( str, e );
            }

            // The caller will add the sign.
            return str;
        }


        // Perform division in the specified base. Called by div and convertBase.
        div = (function () {

            // Assume non-zero x and k.
            function multiply( x, k, base ) {
                var m, temp, xlo, xhi,
                    carry = 0,
                    i = x.length,
                    klo = k % SQRT_BASE,
                    khi = k / SQRT_BASE | 0;

                for ( x = x.slice(); i--; ) {
                    xlo = x[i] % SQRT_BASE;
                    xhi = x[i] / SQRT_BASE | 0;
                    m = khi * xlo + xhi * klo;
                    temp = klo * xlo + ( ( m % SQRT_BASE ) * SQRT_BASE ) + carry;
                    carry = ( temp / base | 0 ) + ( m / SQRT_BASE | 0 ) + khi * xhi;
                    x[i] = temp % base;
                }

                if (carry) x.unshift(carry);

                return x;
            }

            function compare( a, b, aL, bL ) {
                var i, cmp;

                if ( aL != bL ) {
                    cmp = aL > bL ? 1 : -1;
                } else {

                    for ( i = cmp = 0; i < aL; i++ ) {

                        if ( a[i] != b[i] ) {
                            cmp = a[i] > b[i] ? 1 : -1;
                            break;
                        }
                    }
                }
                return cmp;
            }

            function subtract( a, b, aL, base ) {
                var i = 0;

                // Subtract b from a.
                for ( ; aL--; ) {
                    a[aL] -= i;
                    i = a[aL] < b[aL] ? 1 : 0;
                    a[aL] = i * base + a[aL] - b[aL];
                }

                // Remove leading zeros.
                for ( ; !a[0] && a.length > 1; a.shift() );
            }

            // x: dividend, y: divisor.
            return function ( x, y, dp, rm, base ) {
                var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
                    yL, yz,
                    s = x.s == y.s ? 1 : -1,
                    xc = x.c,
                    yc = y.c;

                // Either NaN, Infinity or 0?
                if ( !xc || !xc[0] || !yc || !yc[0] ) {

                    return new BigNumber(

                      // Return NaN if either NaN, or both Infinity or 0.
                      !x.s || !y.s || ( xc ? yc && xc[0] == yc[0] : !yc ) ? NaN :

                        // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
                        xc && xc[0] == 0 || !yc ? s * 0 : s / 0
                    );
                }

                q = new BigNumber(s);
                qc = q.c = [];
                e = x.e - y.e;
                s = dp + e + 1;

                if ( !base ) {
                    base = BASE;
                    e = bitFloor( x.e / LOG_BASE ) - bitFloor( y.e / LOG_BASE );
                    s = s / LOG_BASE | 0;
                }

                // Result exponent may be one less then the current value of e.
                // The coefficients of the BigNumbers from convertBase may have trailing zeros.
                for ( i = 0; yc[i] == ( xc[i] || 0 ); i++ );
                if ( yc[i] > ( xc[i] || 0 ) ) e--;

                if ( s < 0 ) {
                    qc.push(1);
                    more = true;
                } else {
                    xL = xc.length;
                    yL = yc.length;
                    i = 0;
                    s += 2;

                    // Normalise xc and yc so highest order digit of yc is >= base / 2.

                    n = mathfloor( base / ( yc[0] + 1 ) );

                    // Not necessary, but to handle odd bases where yc[0] == ( base / 2 ) - 1.
                    // if ( n > 1 || n++ == 1 && yc[0] < base / 2 ) {
                    if ( n > 1 ) {
                        yc = multiply( yc, n, base );
                        xc = multiply( xc, n, base );
                        yL = yc.length;
                        xL = xc.length;
                    }

                    xi = yL;
                    rem = xc.slice( 0, yL );
                    remL = rem.length;

                    // Add zeros to make remainder as long as divisor.
                    for ( ; remL < yL; rem[remL++] = 0 );
                    yz = yc.slice();
                    yz.unshift(0);
                    yc0 = yc[0];
                    if ( yc[1] >= base / 2 ) yc0++;
                    // Not necessary, but to prevent trial digit n > base, when using base 3.
                    // else if ( base == 3 && yc0 == 1 ) yc0 = 1 + 1e-15;

                    do {
                        n = 0;

                        // Compare divisor and remainder.
                        cmp = compare( yc, rem, yL, remL );

                        // If divisor < remainder.
                        if ( cmp < 0 ) {

                            // Calculate trial digit, n.

                            rem0 = rem[0];
                            if ( yL != remL ) rem0 = rem0 * base + ( rem[1] || 0 );

                            // n is how many times the divisor goes into the current remainder.
                            n = mathfloor( rem0 / yc0 );

                            //  Algorithm:
                            //  1. product = divisor * trial digit (n)
                            //  2. if product > remainder: product -= divisor, n--
                            //  3. remainder -= product
                            //  4. if product was < remainder at 2:
                            //    5. compare new remainder and divisor
                            //    6. If remainder > divisor: remainder -= divisor, n++

                            if ( n > 1 ) {

                                // n may be > base only when base is 3.
                                if (n >= base) n = base - 1;

                                // product = divisor * trial digit.
                                prod = multiply( yc, n, base );
                                prodL = prod.length;
                                remL = rem.length;

                                // Compare product and remainder.
                                // If product > remainder.
                                // Trial digit n too high.
                                // n is 1 too high about 5% of the time, and is not known to have
                                // ever been more than 1 too high.
                                while ( compare( prod, rem, prodL, remL ) == 1 ) {
                                    n--;

                                    // Subtract divisor from product.
                                    subtract( prod, yL < prodL ? yz : yc, prodL, base );
                                    prodL = prod.length;
                                    cmp = 1;
                                }
                            } else {

                                // n is 0 or 1, cmp is -1.
                                // If n is 0, there is no need to compare yc and rem again below,
                                // so change cmp to 1 to avoid it.
                                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                                if ( n == 0 ) {

                                    // divisor < remainder, so n must be at least 1.
                                    cmp = n = 1;
                                }

                                // product = divisor
                                prod = yc.slice();
                                prodL = prod.length;
                            }

                            if ( prodL < remL ) prod.unshift(0);

                            // Subtract product from remainder.
                            subtract( rem, prod, remL, base );
                            remL = rem.length;

                             // If product was < remainder.
                            if ( cmp == -1 ) {

                                // Compare divisor and new remainder.
                                // If divisor < new remainder, subtract divisor from remainder.
                                // Trial digit n too low.
                                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                                while ( compare( yc, rem, yL, remL ) < 1 ) {
                                    n++;

                                    // Subtract divisor from remainder.
                                    subtract( rem, yL < remL ? yz : yc, remL, base );
                                    remL = rem.length;
                                }
                            }
                        } else if ( cmp === 0 ) {
                            n++;
                            rem = [0];
                        } // else cmp === 1 and n will be 0

                        // Add the next digit, n, to the result array.
                        qc[i++] = n;

                        // Update the remainder.
                        if ( rem[0] ) {
                            rem[remL++] = xc[xi] || 0;
                        } else {
                            rem = [ xc[xi] ];
                            remL = 1;
                        }
                    } while ( ( xi++ < xL || rem[0] != null ) && s-- );

                    more = rem[0] != null;

                    // Leading zero?
                    if ( !qc[0] ) qc.shift();
                }

                if ( base == BASE ) {

                    // To calculate q.e, first get the number of digits of qc[0].
                    for ( i = 1, s = qc[0]; s >= 10; s /= 10, i++ );
                    round( q, dp + ( q.e = i + e * LOG_BASE - 1 ) + 1, rm, more );

                // Caller is convertBase.
                } else {
                    q.e = e;
                    q.r = +more;
                }

                return q;
            };
        })();


        /*
         * Return a string representing the value of BigNumber n in fixed-point or exponential
         * notation rounded to the specified decimal places or significant digits.
         *
         * n is a BigNumber.
         * i is the index of the last digit required (i.e. the digit that may be rounded up).
         * rm is the rounding mode.
         * caller is caller id: toExponential 19, toFixed 20, toFormat 21, toPrecision 24.
         */
        function format( n, i, rm, caller ) {
            var c0, e, ne, len, str;

            rm = rm != null && isValidInt( rm, 0, 8, caller, roundingMode )
              ? rm | 0 : ROUNDING_MODE;

            if ( !n.c ) return n.toString();
            c0 = n.c[0];
            ne = n.e;

            if ( i == null ) {
                str = coeffToString( n.c );
                str = caller == 19 || caller == 24 && ne <= TO_EXP_NEG
                  ? toExponential( str, ne )
                  : toFixedPoint( str, ne );
            } else {
                n = round( new BigNumber(n), i, rm );

                // n.e may have changed if the value was rounded up.
                e = n.e;

                str = coeffToString( n.c );
                len = str.length;

                // toPrecision returns exponential notation if the number of significant digits
                // specified is less than the number of digits necessary to represent the integer
                // part of the value in fixed-point notation.

                // Exponential notation.
                if ( caller == 19 || caller == 24 && ( i <= e || e <= TO_EXP_NEG ) ) {

                    // Append zeros?
                    for ( ; len < i; str += '0', len++ );
                    str = toExponential( str, e );

                // Fixed-point notation.
                } else {
                    i -= ne;
                    str = toFixedPoint( str, e );

                    // Append zeros?
                    if ( e + 1 > len ) {
                        if ( --i > 0 ) for ( str += '.'; i--; str += '0' );
                    } else {
                        i += e - len;
                        if ( i > 0 ) {
                            if ( e + 1 == len ) str += '.';
                            for ( ; i--; str += '0' );
                        }
                    }
                }
            }

            return n.s < 0 && c0 ? '-' + str : str;
        }


        // Handle BigNumber.max and BigNumber.min.
        function maxOrMin( args, method ) {
            var m, n,
                i = 0;

            if ( isArray( args[0] ) ) args = args[0];
            m = new BigNumber( args[0] );

            for ( ; ++i < args.length; ) {
                n = new BigNumber( args[i] );

                // If any number is NaN, return NaN.
                if ( !n.s ) {
                    m = n;
                    break;
                } else if ( method.call( m, n ) ) {
                    m = n;
                }
            }

            return m;
        }


        /*
         * Return true if n is an integer in range, otherwise throw.
         * Use for argument validation when ERRORS is true.
         */
        function intValidatorWithErrors( n, min, max, caller, name ) {
            if ( n < min || n > max || n != truncate(n) ) {
                raise( caller, ( name || 'decimal places' ) +
                  ( n < min || n > max ? ' out of range' : ' not an integer' ), n );
            }

            return true;
        }


        /*
         * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
         * Called by minus, plus and times.
         */
        function normalise( n, c, e ) {
            var i = 1,
                j = c.length;

             // Remove trailing zeros.
            for ( ; !c[--j]; c.pop() );

            // Calculate the base 10 exponent. First get the number of digits of c[0].
            for ( j = c[0]; j >= 10; j /= 10, i++ );

            // Overflow?
            if ( ( e = i + e * LOG_BASE - 1 ) > MAX_EXP ) {

                // Infinity.
                n.c = n.e = null;

            // Underflow?
            } else if ( e < MIN_EXP ) {

                // Zero.
                n.c = [ n.e = 0 ];
            } else {
                n.e = e;
                n.c = c;
            }

            return n;
        }


        // Handle values that fail the validity test in BigNumber.
        parseNumeric = (function () {
            var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
                dotAfter = /^([^.]+)\.$/,
                dotBefore = /^\.([^.]+)$/,
                isInfinityOrNaN = /^-?(Infinity|NaN)$/,
                whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

            return function ( x, str, num, b ) {
                var base,
                    s = num ? str : str.replace( whitespaceOrPlus, '' );

                // No exception on ±Infinity or NaN.
                if ( isInfinityOrNaN.test(s) ) {
                    x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
                } else {
                    if ( !num ) {

                        // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
                        s = s.replace( basePrefix, function ( m, p1, p2 ) {
                            base = ( p2 = p2.toLowerCase() ) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
                            return !b || b == base ? p1 : m;
                        });

                        if (b) {
                            base = b;

                            // E.g. '1.' to '1', '.1' to '0.1'
                            s = s.replace( dotAfter, '$1' ).replace( dotBefore, '0.$1' );
                        }

                        if ( str != s ) return new BigNumber( s, base );
                    }

                    // 'new BigNumber() not a number: {n}'
                    // 'new BigNumber() not a base {b} number: {n}'
                    if (ERRORS) raise( id, 'not a' + ( b ? ' base ' + b : '' ) + ' number', str );
                    x.s = null;
                }

                x.c = x.e = null;
                id = 0;
            }
        })();


        // Throw a BigNumber Error.
        function raise( caller, msg, val ) {
            var error = new Error( [
                'new BigNumber',     // 0
                'cmp',               // 1
                'config',            // 2
                'div',               // 3
                'divToInt',          // 4
                'eq',                // 5
                'gt',                // 6
                'gte',               // 7
                'lt',                // 8
                'lte',               // 9
                'minus',             // 10
                'mod',               // 11
                'plus',              // 12
                'precision',         // 13
                'random',            // 14
                'round',             // 15
                'shift',             // 16
                'times',             // 17
                'toDigits',          // 18
                'toExponential',     // 19
                'toFixed',           // 20
                'toFormat',          // 21
                'toFraction',        // 22
                'pow',               // 23
                'toPrecision',       // 24
                'toString',          // 25
                'BigNumber'          // 26
            ][caller] + '() ' + msg + ': ' + val );

            error.name = 'BigNumber Error';
            id = 0;
            throw error;
        }


        /*
         * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
         * If r is truthy, it is known that there are more digits after the rounding digit.
         */
        function round( x, sd, rm, r ) {
            var d, i, j, k, n, ni, rd,
                xc = x.c,
                pows10 = POWS_TEN;

            // if x is not Infinity or NaN...
            if (xc) {

                // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
                // n is a base 1e14 number, the value of the element of array x.c containing rd.
                // ni is the index of n within x.c.
                // d is the number of digits of n.
                // i is the index of rd within n including leading zeros.
                // j is the actual index of rd within n (if < 0, rd is a leading zero).
                out: {

                    // Get the number of digits of the first element of xc.
                    for ( d = 1, k = xc[0]; k >= 10; k /= 10, d++ );
                    i = sd - d;

                    // If the rounding digit is in the first element of xc...
                    if ( i < 0 ) {
                        i += LOG_BASE;
                        j = sd;
                        n = xc[ ni = 0 ];

                        // Get the rounding digit at index j of n.
                        rd = n / pows10[ d - j - 1 ] % 10 | 0;
                    } else {
                        ni = mathceil( ( i + 1 ) / LOG_BASE );

                        if ( ni >= xc.length ) {

                            if (r) {

                                // Needed by sqrt.
                                for ( ; xc.length <= ni; xc.push(0) );
                                n = rd = 0;
                                d = 1;
                                i %= LOG_BASE;
                                j = i - LOG_BASE + 1;
                            } else {
                                break out;
                            }
                        } else {
                            n = k = xc[ni];

                            // Get the number of digits of n.
                            for ( d = 1; k >= 10; k /= 10, d++ );

                            // Get the index of rd within n.
                            i %= LOG_BASE;

                            // Get the index of rd within n, adjusted for leading zeros.
                            // The number of leading zeros of n is given by LOG_BASE - d.
                            j = i - LOG_BASE + d;

                            // Get the rounding digit at index j of n.
                            rd = j < 0 ? 0 : n / pows10[ d - j - 1 ] % 10 | 0;
                        }
                    }

                    r = r || sd < 0 ||

                    // Are there any non-zero digits after the rounding digit?
                    // The expression  n % pows10[ d - j - 1 ]  returns all digits of n to the right
                    // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
                      xc[ni + 1] != null || ( j < 0 ? n : n % pows10[ d - j - 1 ] );

                    r = rm < 4
                      ? ( rd || r ) && ( rm == 0 || rm == ( x.s < 0 ? 3 : 2 ) )
                      : rd > 5 || rd == 5 && ( rm == 4 || r || rm == 6 &&

                        // Check whether the digit to the left of the rounding digit is odd.
                        ( ( i > 0 ? j > 0 ? n / pows10[ d - j ] : 0 : xc[ni - 1] ) % 10 ) & 1 ||
                          rm == ( x.s < 0 ? 8 : 7 ) );

                    if ( sd < 1 || !xc[0] ) {
                        xc.length = 0;

                        if (r) {

                            // Convert sd to decimal places.
                            sd -= x.e + 1;

                            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                            xc[0] = pows10[ ( LOG_BASE - sd % LOG_BASE ) % LOG_BASE ];
                            x.e = -sd || 0;
                        } else {

                            // Zero.
                            xc[0] = x.e = 0;
                        }

                        return x;
                    }

                    // Remove excess digits.
                    if ( i == 0 ) {
                        xc.length = ni;
                        k = 1;
                        ni--;
                    } else {
                        xc.length = ni + 1;
                        k = pows10[ LOG_BASE - i ];

                        // E.g. 56700 becomes 56000 if 7 is the rounding digit.
                        // j > 0 means i > number of leading zeros of n.
                        xc[ni] = j > 0 ? mathfloor( n / pows10[ d - j ] % pows10[j] ) * k : 0;
                    }

                    // Round up?
                    if (r) {

                        for ( ; ; ) {

                            // If the digit to be rounded up is in the first element of xc...
                            if ( ni == 0 ) {

                                // i will be the length of xc[0] before k is added.
                                for ( i = 1, j = xc[0]; j >= 10; j /= 10, i++ );
                                j = xc[0] += k;
                                for ( k = 1; j >= 10; j /= 10, k++ );

                                // if i != k the length has increased.
                                if ( i != k ) {
                                    x.e++;
                                    if ( xc[0] == BASE ) xc[0] = 1;
                                }

                                break;
                            } else {
                                xc[ni] += k;
                                if ( xc[ni] != BASE ) break;
                                xc[ni--] = 0;
                                k = 1;
                            }
                        }
                    }

                    // Remove trailing zeros.
                    for ( i = xc.length; xc[--i] === 0; xc.pop() );
                }

                // Overflow? Infinity.
                if ( x.e > MAX_EXP ) {
                    x.c = x.e = null;

                // Underflow? Zero.
                } else if ( x.e < MIN_EXP ) {
                    x.c = [ x.e = 0 ];
                }
            }

            return x;
        }


        // PROTOTYPE/INSTANCE METHODS


        /*
         * Return a new BigNumber whose value is the absolute value of this BigNumber.
         */
        P.absoluteValue = P.abs = function () {
            var x = new BigNumber(this);
            if ( x.s < 0 ) x.s = 1;
            return x;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a whole
         * number in the direction of Infinity.
         */
        P.ceil = function () {
            return round( new BigNumber(this), this.e + 1, 2 );
        };


        /*
         * Return
         * 1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
         * -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
         * 0 if they have the same value,
         * or null if the value of either is NaN.
         */
        P.comparedTo = P.cmp = function ( y, b ) {
            id = 1;
            return compare( this, new BigNumber( y, b ) );
        };


        /*
         * Return the number of decimal places of the value of this BigNumber, or null if the value
         * of this BigNumber is ±Infinity or NaN.
         */
        P.decimalPlaces = P.dp = function () {
            var n, v,
                c = this.c;

            if ( !c ) return null;
            n = ( ( v = c.length - 1 ) - bitFloor( this.e / LOG_BASE ) ) * LOG_BASE;

            // Subtract the number of trailing zeros of the last number.
            if ( v = c[v] ) for ( ; v % 10 == 0; v /= 10, n-- );
            if ( n < 0 ) n = 0;

            return n;
        };


        /*
         *  n / 0 = I
         *  n / N = N
         *  n / I = 0
         *  0 / n = 0
         *  0 / 0 = N
         *  0 / N = N
         *  0 / I = 0
         *  N / n = N
         *  N / 0 = N
         *  N / N = N
         *  N / I = N
         *  I / n = I
         *  I / 0 = I
         *  I / N = N
         *  I / I = N
         *
         * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
         * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
         */
        P.dividedBy = P.div = function ( y, b ) {
            id = 3;
            return div( this, new BigNumber( y, b ), DECIMAL_PLACES, ROUNDING_MODE );
        };


        /*
         * Return a new BigNumber whose value is the integer part of dividing the value of this
         * BigNumber by the value of BigNumber(y, b).
         */
        P.dividedToIntegerBy = P.divToInt = function ( y, b ) {
            id = 4;
            return div( this, new BigNumber( y, b ), 0, 1 );
        };


        /*
         * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
         * otherwise returns false.
         */
        P.equals = P.eq = function ( y, b ) {
            id = 5;
            return compare( this, new BigNumber( y, b ) ) === 0;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a whole
         * number in the direction of -Infinity.
         */
        P.floor = function () {
            return round( new BigNumber(this), this.e + 1, 3 );
        };


        /*
         * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
         * otherwise returns false.
         */
        P.greaterThan = P.gt = function ( y, b ) {
            id = 6;
            return compare( this, new BigNumber( y, b ) ) > 0;
        };


        /*
         * Return true if the value of this BigNumber is greater than or equal to the value of
         * BigNumber(y, b), otherwise returns false.
         */
        P.greaterThanOrEqualTo = P.gte = function ( y, b ) {
            id = 7;
            return ( b = compare( this, new BigNumber( y, b ) ) ) === 1 || b === 0;

        };


        /*
         * Return true if the value of this BigNumber is a finite number, otherwise returns false.
         */
        P.isFinite = function () {
            return !!this.c;
        };


        /*
         * Return true if the value of this BigNumber is an integer, otherwise return false.
         */
        P.isInteger = P.isInt = function () {
            return !!this.c && bitFloor( this.e / LOG_BASE ) > this.c.length - 2;
        };


        /*
         * Return true if the value of this BigNumber is NaN, otherwise returns false.
         */
        P.isNaN = function () {
            return !this.s;
        };


        /*
         * Return true if the value of this BigNumber is negative, otherwise returns false.
         */
        P.isNegative = P.isNeg = function () {
            return this.s < 0;
        };


        /*
         * Return true if the value of this BigNumber is 0 or -0, otherwise returns false.
         */
        P.isZero = function () {
            return !!this.c && this.c[0] == 0;
        };


        /*
         * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
         * otherwise returns false.
         */
        P.lessThan = P.lt = function ( y, b ) {
            id = 8;
            return compare( this, new BigNumber( y, b ) ) < 0;
        };


        /*
         * Return true if the value of this BigNumber is less than or equal to the value of
         * BigNumber(y, b), otherwise returns false.
         */
        P.lessThanOrEqualTo = P.lte = function ( y, b ) {
            id = 9;
            return ( b = compare( this, new BigNumber( y, b ) ) ) === -1 || b === 0;
        };


        /*
         *  n - 0 = n
         *  n - N = N
         *  n - I = -I
         *  0 - n = -n
         *  0 - 0 = 0
         *  0 - N = N
         *  0 - I = -I
         *  N - n = N
         *  N - 0 = N
         *  N - N = N
         *  N - I = N
         *  I - n = I
         *  I - 0 = I
         *  I - N = N
         *  I - I = N
         *
         * Return a new BigNumber whose value is the value of this BigNumber minus the value of
         * BigNumber(y, b).
         */
        P.minus = P.sub = function ( y, b ) {
            var i, j, t, xLTy,
                x = this,
                a = x.s;

            id = 10;
            y = new BigNumber( y, b );
            b = y.s;

            // Either NaN?
            if ( !a || !b ) return new BigNumber(NaN);

            // Signs differ?
            if ( a != b ) {
                y.s = -b;
                return x.plus(y);
            }

            var xe = x.e / LOG_BASE,
                ye = y.e / LOG_BASE,
                xc = x.c,
                yc = y.c;

            if ( !xe || !ye ) {

                // Either Infinity?
                if ( !xc || !yc ) return xc ? ( y.s = -b, y ) : new BigNumber( yc ? x : NaN );

                // Either zero?
                if ( !xc[0] || !yc[0] ) {

                    // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                    return yc[0] ? ( y.s = -b, y ) : new BigNumber( xc[0] ? x :

                      // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
                      ROUNDING_MODE == 3 ? -0 : 0 );
                }
            }

            xe = bitFloor(xe);
            ye = bitFloor(ye);
            xc = xc.slice();

            // Determine which is the bigger number.
            if ( a = xe - ye ) {

                if ( xLTy = a < 0 ) {
                    a = -a;
                    t = xc;
                } else {
                    ye = xe;
                    t = yc;
                }

                t.reverse();

                // Prepend zeros to equalise exponents.
                for ( b = a; b--; t.push(0) );
                t.reverse();
            } else {

                // Exponents equal. Check digit by digit.
                j = ( xLTy = ( a = xc.length ) < ( b = yc.length ) ) ? a : b;

                for ( a = b = 0; b < j; b++ ) {

                    if ( xc[b] != yc[b] ) {
                        xLTy = xc[b] < yc[b];
                        break;
                    }
                }
            }

            // x < y? Point xc to the array of the bigger number.
            if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;

            b = ( j = yc.length ) - ( i = xc.length );

            // Append zeros to xc if shorter.
            // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
            if ( b > 0 ) for ( ; b--; xc[i++] = 0 );
            b = BASE - 1;

            // Subtract yc from xc.
            for ( ; j > a; ) {

                if ( xc[--j] < yc[j] ) {
                    for ( i = j; i && !xc[--i]; xc[i] = b );
                    --xc[i];
                    xc[j] += BASE;
                }

                xc[j] -= yc[j];
            }

            // Remove leading zeros and adjust exponent accordingly.
            for ( ; xc[0] == 0; xc.shift(), --ye );

            // Zero?
            if ( !xc[0] ) {

                // Following IEEE 754 (2008) 6.3,
                // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
                y.s = ROUNDING_MODE == 3 ? -1 : 1;
                y.c = [ y.e = 0 ];
                return y;
            }

            // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
            // for finite x and y.
            return normalise( y, xc, ye );
        };


        /*
         *   n % 0 =  N
         *   n % N =  N
         *   n % I =  n
         *   0 % n =  0
         *  -0 % n = -0
         *   0 % 0 =  N
         *   0 % N =  N
         *   0 % I =  0
         *   N % n =  N
         *   N % 0 =  N
         *   N % N =  N
         *   N % I =  N
         *   I % n =  N
         *   I % 0 =  N
         *   I % N =  N
         *   I % I =  N
         *
         * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
         * BigNumber(y, b). The result depends on the value of MODULO_MODE.
         */
        P.modulo = P.mod = function ( y, b ) {
            var q, s,
                x = this;

            id = 11;
            y = new BigNumber( y, b );

            // Return NaN if x is Infinity or NaN, or y is NaN or zero.
            if ( !x.c || !y.s || y.c && !y.c[0] ) {
                return new BigNumber(NaN);

            // Return x if y is Infinity or x is zero.
            } else if ( !y.c || x.c && !x.c[0] ) {
                return new BigNumber(x);
            }

            if ( MODULO_MODE == 9 ) {

                // Euclidian division: q = sign(y) * floor(x / abs(y))
                // r = x - qy    where  0 <= r < abs(y)
                s = y.s;
                y.s = 1;
                q = div( x, y, 0, 3 );
                y.s = s;
                q.s *= s;
            } else {
                q = div( x, y, 0, MODULO_MODE );
            }

            return x.minus( q.times(y) );
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber negated,
         * i.e. multiplied by -1.
         */
        P.negated = P.neg = function () {
            var x = new BigNumber(this);
            x.s = -x.s || null;
            return x;
        };


        /*
         *  n + 0 = n
         *  n + N = N
         *  n + I = I
         *  0 + n = n
         *  0 + 0 = 0
         *  0 + N = N
         *  0 + I = I
         *  N + n = N
         *  N + 0 = N
         *  N + N = N
         *  N + I = N
         *  I + n = I
         *  I + 0 = I
         *  I + N = N
         *  I + I = I
         *
         * Return a new BigNumber whose value is the value of this BigNumber plus the value of
         * BigNumber(y, b).
         */
        P.plus = P.add = function ( y, b ) {
            var t,
                x = this,
                a = x.s;

            id = 12;
            y = new BigNumber( y, b );
            b = y.s;

            // Either NaN?
            if ( !a || !b ) return new BigNumber(NaN);

            // Signs differ?
             if ( a != b ) {
                y.s = -b;
                return x.minus(y);
            }

            var xe = x.e / LOG_BASE,
                ye = y.e / LOG_BASE,
                xc = x.c,
                yc = y.c;

            if ( !xe || !ye ) {

                // Return ±Infinity if either ±Infinity.
                if ( !xc || !yc ) return new BigNumber( a / 0 );

                // Either zero?
                // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
                if ( !xc[0] || !yc[0] ) return yc[0] ? y : new BigNumber( xc[0] ? x : a * 0 );
            }

            xe = bitFloor(xe);
            ye = bitFloor(ye);
            xc = xc.slice();

            // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
            if ( a = xe - ye ) {
                if ( a > 0 ) {
                    ye = xe;
                    t = yc;
                } else {
                    a = -a;
                    t = xc;
                }

                t.reverse();
                for ( ; a--; t.push(0) );
                t.reverse();
            }

            a = xc.length;
            b = yc.length;

            // Point xc to the longer array, and b to the shorter length.
            if ( a - b < 0 ) t = yc, yc = xc, xc = t, b = a;

            // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
            for ( a = 0; b; ) {
                a = ( xc[--b] = xc[b] + yc[b] + a ) / BASE | 0;
                xc[b] %= BASE;
            }

            if (a) {
                xc.unshift(a);
                ++ye;
            }

            // No need to check for zero, as +x + +y != 0 && -x + -y != 0
            // ye = MAX_EXP + 1 possible
            return normalise( y, xc, ye );
        };


        /*
         * Return the number of significant digits of the value of this BigNumber.
         *
         * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
         */
        P.precision = P.sd = function (z) {
            var n, v,
                x = this,
                c = x.c;

            // 'precision() argument not a boolean or binary digit: {z}'
            if ( z != null && z !== !!z && z !== 1 && z !== 0 ) {
                if (ERRORS) raise( 13, 'argument' + notBool, z );
                if ( z != !!z ) z = null;
            }

            if ( !c ) return null;
            v = c.length - 1;
            n = v * LOG_BASE + 1;

            if ( v = c[v] ) {

                // Subtract the number of trailing zeros of the last element.
                for ( ; v % 10 == 0; v /= 10, n-- );

                // Add the number of digits of the first element.
                for ( v = c[0]; v >= 10; v /= 10, n++ );
            }

            if ( z && x.e + 1 > n ) n = x.e + 1;

            return n;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a maximum of
         * dp decimal places using rounding mode rm, or to 0 and ROUNDING_MODE respectively if
         * omitted.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'round() decimal places out of range: {dp}'
         * 'round() decimal places not an integer: {dp}'
         * 'round() rounding mode not an integer: {rm}'
         * 'round() rounding mode out of range: {rm}'
         */
        P.round = function ( dp, rm ) {
            var n = new BigNumber(this);

            if ( dp == null || isValidInt( dp, 0, MAX, 15 ) ) {
                round( n, ~~dp + this.e + 1, rm == null ||
                  !isValidInt( rm, 0, 8, 15, roundingMode ) ? ROUNDING_MODE : rm | 0 );
            }

            return n;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
         * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
         *
         * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
         *
         * If k is out of range and ERRORS is false, the result will be ±0 if k < 0, or ±Infinity
         * otherwise.
         *
         * 'shift() argument not an integer: {k}'
         * 'shift() argument out of range: {k}'
         */
        P.shift = function (k) {
            var n = this;
            return isValidInt( k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER, 16, 'argument' )

              // k < 1e+21, or truncate(k) will produce exponential notation.
              ? n.times( '1e' + truncate(k) )
              : new BigNumber( n.c && n.c[0] && ( k < -MAX_SAFE_INTEGER || k > MAX_SAFE_INTEGER )
                ? n.s * ( k < 0 ? 0 : 1 / 0 )
                : n );
        };


        /*
         *  sqrt(-n) =  N
         *  sqrt( N) =  N
         *  sqrt(-I) =  N
         *  sqrt( I) =  I
         *  sqrt( 0) =  0
         *  sqrt(-0) = -0
         *
         * Return a new BigNumber whose value is the square root of the value of this BigNumber,
         * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
         */
        P.squareRoot = P.sqrt = function () {
            var m, n, r, rep, t,
                x = this,
                c = x.c,
                s = x.s,
                e = x.e,
                dp = DECIMAL_PLACES + 4,
                half = new BigNumber('0.5');

            // Negative/NaN/Infinity/zero?
            if ( s !== 1 || !c || !c[0] ) {
                return new BigNumber( !s || s < 0 && ( !c || c[0] ) ? NaN : c ? x : 1 / 0 );
            }

            // Initial estimate.
            s = Math.sqrt( +x );

            // Math.sqrt underflow/overflow?
            // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
            if ( s == 0 || s == 1 / 0 ) {
                n = coeffToString(c);
                if ( ( n.length + e ) % 2 == 0 ) n += '0';
                s = Math.sqrt(n);
                e = bitFloor( ( e + 1 ) / 2 ) - ( e < 0 || e % 2 );

                if ( s == 1 / 0 ) {
                    n = '1e' + e;
                } else {
                    n = s.toExponential();
                    n = n.slice( 0, n.indexOf('e') + 1 ) + e;
                }

                r = new BigNumber(n);
            } else {
                r = new BigNumber( s + '' );
            }

            // Check for zero.
            // r could be zero if MIN_EXP is changed after the this value was created.
            // This would cause a division by zero (x/t) and hence Infinity below, which would cause
            // coeffToString to throw.
            if ( r.c[0] ) {
                e = r.e;
                s = e + dp;
                if ( s < 3 ) s = 0;

                // Newton-Raphson iteration.
                for ( ; ; ) {
                    t = r;
                    r = half.times( t.plus( div( x, t, dp, 1 ) ) );

                    if ( coeffToString( t.c   ).slice( 0, s ) === ( n =
                         coeffToString( r.c ) ).slice( 0, s ) ) {

                        // The exponent of r may here be one less than the final result exponent,
                        // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
                        // are indexed correctly.
                        if ( r.e < e ) --s;
                        n = n.slice( s - 3, s + 1 );

                        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
                        // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
                        // iteration.
                        if ( n == '9999' || !rep && n == '4999' ) {

                            // On the first iteration only, check to see if rounding up gives the
                            // exact result as the nines may infinitely repeat.
                            if ( !rep ) {
                                round( t, t.e + DECIMAL_PLACES + 2, 0 );

                                if ( t.times(t).eq(x) ) {
                                    r = t;
                                    break;
                                }
                            }

                            dp += 4;
                            s += 4;
                            rep = 1;
                        } else {

                            // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
                            // result. If not, then there are further digits and m will be truthy.
                            if ( !+n || !+n.slice(1) && n.charAt(0) == '5' ) {

                                // Truncate to the first rounding digit.
                                round( r, r.e + DECIMAL_PLACES + 2, 1 );
                                m = !r.times(r).eq(x);
                            }

                            break;
                        }
                    }
                }
            }

            return round( r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m );
        };


        /*
         *  n * 0 = 0
         *  n * N = N
         *  n * I = I
         *  0 * n = 0
         *  0 * 0 = 0
         *  0 * N = N
         *  0 * I = N
         *  N * n = N
         *  N * 0 = N
         *  N * N = N
         *  N * I = N
         *  I * n = I
         *  I * 0 = N
         *  I * N = N
         *  I * I = I
         *
         * Return a new BigNumber whose value is the value of this BigNumber times the value of
         * BigNumber(y, b).
         */
        P.times = P.mul = function ( y, b ) {
            var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
                base, sqrtBase,
                x = this,
                xc = x.c,
                yc = ( id = 17, y = new BigNumber( y, b ) ).c;

            // Either NaN, ±Infinity or ±0?
            if ( !xc || !yc || !xc[0] || !yc[0] ) {

                // Return NaN if either is NaN, or one is 0 and the other is Infinity.
                if ( !x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc ) {
                    y.c = y.e = y.s = null;
                } else {
                    y.s *= x.s;

                    // Return ±Infinity if either is ±Infinity.
                    if ( !xc || !yc ) {
                        y.c = y.e = null;

                    // Return ±0 if either is ±0.
                    } else {
                        y.c = [0];
                        y.e = 0;
                    }
                }

                return y;
            }

            e = bitFloor( x.e / LOG_BASE ) + bitFloor( y.e / LOG_BASE );
            y.s *= x.s;
            xcL = xc.length;
            ycL = yc.length;

            // Ensure xc points to longer array and xcL to its length.
            if ( xcL < ycL ) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;

            // Initialise the result array with zeros.
            for ( i = xcL + ycL, zc = []; i--; zc.push(0) );

            base = BASE;
            sqrtBase = SQRT_BASE;

            for ( i = ycL; --i >= 0; ) {
                c = 0;
                ylo = yc[i] % sqrtBase;
                yhi = yc[i] / sqrtBase | 0;

                for ( k = xcL, j = i + k; j > i; ) {
                    xlo = xc[--k] % sqrtBase;
                    xhi = xc[k] / sqrtBase | 0;
                    m = yhi * xlo + xhi * ylo;
                    xlo = ylo * xlo + ( ( m % sqrtBase ) * sqrtBase ) + zc[j] + c;
                    c = ( xlo / base | 0 ) + ( m / sqrtBase | 0 ) + yhi * xhi;
                    zc[j--] = xlo % base;
                }

                zc[j] = c;
            }

            if (c) {
                ++e;
            } else {
                zc.shift();
            }

            return normalise( y, zc, e );
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber rounded to a maximum of
         * sd significant digits using rounding mode rm, or ROUNDING_MODE if rm is omitted.
         *
         * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toDigits() precision out of range: {sd}'
         * 'toDigits() precision not an integer: {sd}'
         * 'toDigits() rounding mode not an integer: {rm}'
         * 'toDigits() rounding mode out of range: {rm}'
         */
        P.toDigits = function ( sd, rm ) {
            var n = new BigNumber(this);
            sd = sd == null || !isValidInt( sd, 1, MAX, 18, 'precision' ) ? null : sd | 0;
            rm = rm == null || !isValidInt( rm, 0, 8, 18, roundingMode ) ? ROUNDING_MODE : rm | 0;
            return sd ? round( n, sd, rm ) : n;
        };


        /*
         * Return a string representing the value of this BigNumber in exponential notation and
         * rounded using ROUNDING_MODE to dp fixed decimal places.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toExponential() decimal places not an integer: {dp}'
         * 'toExponential() decimal places out of range: {dp}'
         * 'toExponential() rounding mode not an integer: {rm}'
         * 'toExponential() rounding mode out of range: {rm}'
         */
        P.toExponential = function ( dp, rm ) {
            return format( this,
              dp != null && isValidInt( dp, 0, MAX, 19 ) ? ~~dp + 1 : null, rm, 19 );
        };


        /*
         * Return a string representing the value of this BigNumber in fixed-point notation rounding
         * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
         *
         * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
         * but e.g. (-0.00001).toFixed(0) is '-0'.
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toFixed() decimal places not an integer: {dp}'
         * 'toFixed() decimal places out of range: {dp}'
         * 'toFixed() rounding mode not an integer: {rm}'
         * 'toFixed() rounding mode out of range: {rm}'
         */
        P.toFixed = function ( dp, rm ) {
            return format( this, dp != null && isValidInt( dp, 0, MAX, 20 )
              ? ~~dp + this.e + 1 : null, rm, 20 );
        };


        /*
         * Return a string representing the value of this BigNumber in fixed-point notation rounded
         * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
         * of the FORMAT object (see BigNumber.config).
         *
         * FORMAT = {
         *      decimalSeparator : '.',
         *      groupSeparator : ',',
         *      groupSize : 3,
         *      secondaryGroupSize : 0,
         *      fractionGroupSeparator : '\xA0',    // non-breaking space
         *      fractionGroupSize : 0
         * };
         *
         * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toFormat() decimal places not an integer: {dp}'
         * 'toFormat() decimal places out of range: {dp}'
         * 'toFormat() rounding mode not an integer: {rm}'
         * 'toFormat() rounding mode out of range: {rm}'
         */
        P.toFormat = function ( dp, rm ) {
            var str = format( this, dp != null && isValidInt( dp, 0, MAX, 21 )
              ? ~~dp + this.e + 1 : null, rm, 21 );

            if ( this.c ) {
                var i,
                    arr = str.split('.'),
                    g1 = +FORMAT.groupSize,
                    g2 = +FORMAT.secondaryGroupSize,
                    groupSeparator = FORMAT.groupSeparator,
                    intPart = arr[0],
                    fractionPart = arr[1],
                    isNeg = this.s < 0,
                    intDigits = isNeg ? intPart.slice(1) : intPart,
                    len = intDigits.length;

                if (g2) i = g1, g1 = g2, g2 = i, len -= i;

                if ( g1 > 0 && len > 0 ) {
                    i = len % g1 || g1;
                    intPart = intDigits.substr( 0, i );

                    for ( ; i < len; i += g1 ) {
                        intPart += groupSeparator + intDigits.substr( i, g1 );
                    }

                    if ( g2 > 0 ) intPart += groupSeparator + intDigits.slice(i);
                    if (isNeg) intPart = '-' + intPart;
                }

                str = fractionPart
                  ? intPart + FORMAT.decimalSeparator + ( ( g2 = +FORMAT.fractionGroupSize )
                    ? fractionPart.replace( new RegExp( '\\d{' + g2 + '}\\B', 'g' ),
                      '$&' + FORMAT.fractionGroupSeparator )
                    : fractionPart )
                  : intPart;
            }

            return str;
        };


        /*
         * Return a string array representing the value of this BigNumber as a simple fraction with
         * an integer numerator and an integer denominator. The denominator will be a positive
         * non-zero value less than or equal to the specified maximum denominator. If a maximum
         * denominator is not specified, the denominator will be the lowest value necessary to
         * represent the number exactly.
         *
         * [md] {number|string|BigNumber} Integer >= 1 and < Infinity. The maximum denominator.
         *
         * 'toFraction() max denominator not an integer: {md}'
         * 'toFraction() max denominator out of range: {md}'
         */
        P.toFraction = function (md) {
            var arr, d0, d2, e, exp, n, n0, q, s,
                k = ERRORS,
                x = this,
                xc = x.c,
                d = new BigNumber(ONE),
                n1 = d0 = new BigNumber(ONE),
                d1 = n0 = new BigNumber(ONE);

            if ( md != null ) {
                ERRORS = false;
                n = new BigNumber(md);
                ERRORS = k;

                if ( !( k = n.isInt() ) || n.lt(ONE) ) {

                    if (ERRORS) {
                        raise( 22,
                          'max denominator ' + ( k ? 'out of range' : 'not an integer' ), md );
                    }

                    // ERRORS is false:
                    // If md is a finite non-integer >= 1, round it to an integer and use it.
                    md = !k && n.c && round( n, n.e + 1, 1 ).gte(ONE) ? n : null;
                }
            }

            if ( !xc ) return x.toString();
            s = coeffToString(xc);

            // Determine initial denominator.
            // d is a power of 10 and the minimum max denominator that specifies the value exactly.
            e = d.e = s.length - x.e - 1;
            d.c[0] = POWS_TEN[ ( exp = e % LOG_BASE ) < 0 ? LOG_BASE + exp : exp ];
            md = !md || n.cmp(d) > 0 ? ( e > 0 ? d : n1 ) : n;

            exp = MAX_EXP;
            MAX_EXP = 1 / 0;
            n = new BigNumber(s);

            // n0 = d1 = 0
            n0.c[0] = 0;

            for ( ; ; )  {
                q = div( n, d, 0, 1 );
                d2 = d0.plus( q.times(d1) );
                if ( d2.cmp(md) == 1 ) break;
                d0 = d1;
                d1 = d2;
                n1 = n0.plus( q.times( d2 = n1 ) );
                n0 = d2;
                d = n.minus( q.times( d2 = d ) );
                n = d2;
            }

            d2 = div( md.minus(d0), d1, 0, 1 );
            n0 = n0.plus( d2.times(n1) );
            d0 = d0.plus( d2.times(d1) );
            n0.s = n1.s = x.s;
            e *= 2;

            // Determine which fraction is closer to x, n0/d0 or n1/d1
            arr = div( n1, d1, e, ROUNDING_MODE ).minus(x).abs().cmp(
                  div( n0, d0, e, ROUNDING_MODE ).minus(x).abs() ) < 1
                    ? [ n1.toString(), d1.toString() ]
                    : [ n0.toString(), d0.toString() ];

            MAX_EXP = exp;
            return arr;
        };


        /*
         * Return the value of this BigNumber converted to a number primitive.
         */
        P.toNumber = function () {
            return +this;
        };


        /*
         * Return a BigNumber whose value is the value of this BigNumber raised to the power n.
         * If m is present, return the result modulo m.
         * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
         * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using
         * ROUNDING_MODE.
         *
         * The modular power operation works efficiently when x, n, and m are positive integers,
         * otherwise it is equivalent to calculating x.toPower(n).modulo(m) (with POW_PRECISION 0).
         *
         * n {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
         * [m] {number|string|BigNumber} The modulus.
         *
         * 'pow() exponent not an integer: {n}'
         * 'pow() exponent out of range: {n}'
         *
         * Performs 54 loop iterations for n of 9007199254740991.
         */
        P.toPower = P.pow = function ( n, m ) {
            var k, y, z,
                i = mathfloor( n < 0 ? -n : +n ),
                x = this;

            if ( m != null ) {
                id = 23;
                m = new BigNumber(m);
            }

            // Pass ±Infinity to Math.pow if exponent is out of range.
            if ( !isValidInt( n, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER, 23, 'exponent' ) &&
              ( !isFinite(n) || i > MAX_SAFE_INTEGER && ( n /= 0 ) ||
                parseFloat(n) != n && !( n = NaN ) ) || n == 0 ) {
                k = Math.pow( +x, n );
                return new BigNumber( m ? k % m : k );
            }

            if (m) {
                if ( n > 1 && x.gt(ONE) && x.isInt() && m.gt(ONE) && m.isInt() ) {
                    x = x.mod(m);
                } else {
                    z = m;

                    // Nullify m so only a single mod operation is performed at the end.
                    m = null;
                }
            } else if (POW_PRECISION) {

                // Truncating each coefficient array to a length of k after each multiplication
                // equates to truncating significant digits to POW_PRECISION + [28, 41],
                // i.e. there will be a minimum of 28 guard digits retained.
                // (Using + 1.5 would give [9, 21] guard digits.)
                k = mathceil( POW_PRECISION / LOG_BASE + 2 );
            }

            y = new BigNumber(ONE);

            for ( ; ; ) {
                if ( i % 2 ) {
                    y = y.times(x);
                    if ( !y.c ) break;
                    if (k) {
                        if ( y.c.length > k ) y.c.length = k;
                    } else if (m) {
                        y = y.mod(m);
                    }
                }

                i = mathfloor( i / 2 );
                if ( !i ) break;
                x = x.times(x);
                if (k) {
                    if ( x.c && x.c.length > k ) x.c.length = k;
                } else if (m) {
                    x = x.mod(m);
                }
            }

            if (m) return y;
            if ( n < 0 ) y = ONE.div(y);

            return z ? y.mod(z) : k ? round( y, POW_PRECISION, ROUNDING_MODE ) : y;
        };


        /*
         * Return a string representing the value of this BigNumber rounded to sd significant digits
         * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
         * necessary to represent the integer part of the value in fixed-point notation, then use
         * exponential notation.
         *
         * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
         * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
         *
         * 'toPrecision() precision not an integer: {sd}'
         * 'toPrecision() precision out of range: {sd}'
         * 'toPrecision() rounding mode not an integer: {rm}'
         * 'toPrecision() rounding mode out of range: {rm}'
         */
        P.toPrecision = function ( sd, rm ) {
            return format( this, sd != null && isValidInt( sd, 1, MAX, 24, 'precision' )
              ? sd | 0 : null, rm, 24 );
        };


        /*
         * Return a string representing the value of this BigNumber in base b, or base 10 if b is
         * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
         * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
         * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
         * TO_EXP_NEG, return exponential notation.
         *
         * [b] {number} Integer, 2 to 64 inclusive.
         *
         * 'toString() base not an integer: {b}'
         * 'toString() base out of range: {b}'
         */
        P.toString = function (b) {
            var str,
                n = this,
                s = n.s,
                e = n.e;

            // Infinity or NaN?
            if ( e === null ) {

                if (s) {
                    str = 'Infinity';
                    if ( s < 0 ) str = '-' + str;
                } else {
                    str = 'NaN';
                }
            } else {
                str = coeffToString( n.c );

                if ( b == null || !isValidInt( b, 2, 64, 25, 'base' ) ) {
                    str = e <= TO_EXP_NEG || e >= TO_EXP_POS
                      ? toExponential( str, e )
                      : toFixedPoint( str, e );
                } else {
                    str = convertBase( toFixedPoint( str, e ), b | 0, 10, s );
                }

                if ( s < 0 && n.c[0] ) str = '-' + str;
            }

            return str;
        };


        /*
         * Return a new BigNumber whose value is the value of this BigNumber truncated to a whole
         * number.
         */
        P.truncated = P.trunc = function () {
            return round( new BigNumber(this), this.e + 1, 1 );
        };



        /*
         * Return as toString, but do not accept a base argument, and include the minus sign for
         * negative zero.
         */
        P.valueOf = P.toJSON = function () {
            var str,
                n = this,
                e = n.e;

            if ( e === null ) return n.toString();

            str = coeffToString( n.c );

            str = e <= TO_EXP_NEG || e >= TO_EXP_POS
                ? toExponential( str, e )
                : toFixedPoint( str, e );

            return n.s < 0 ? '-' + str : str;
        };


        // Aliases for BigDecimal methods.
        //P.add = P.plus;         // P.add included above
        //P.subtract = P.minus;   // P.sub included above
        //P.multiply = P.times;   // P.mul included above
        //P.divide = P.div;
        //P.remainder = P.mod;
        //P.compareTo = P.cmp;
        //P.negate = P.neg;


        if ( configObj != null ) BigNumber.config(configObj);

        return BigNumber;
    }


    // PRIVATE HELPER FUNCTIONS


    function bitFloor(n) {
        var i = n | 0;
        return n > 0 || n === i ? i : i - 1;
    }


    // Return a coefficient array as a string of base 10 digits.
    function coeffToString(a) {
        var s, z,
            i = 1,
            j = a.length,
            r = a[0] + '';

        for ( ; i < j; ) {
            s = a[i++] + '';
            z = LOG_BASE - s.length;
            for ( ; z--; s = '0' + s );
            r += s;
        }

        // Determine trailing zeros.
        for ( j = r.length; r.charCodeAt(--j) === 48; );
        return r.slice( 0, j + 1 || 1 );
    }


    // Compare the value of BigNumbers x and y.
    function compare( x, y ) {
        var a, b,
            xc = x.c,
            yc = y.c,
            i = x.s,
            j = y.s,
            k = x.e,
            l = y.e;

        // Either NaN?
        if ( !i || !j ) return null;

        a = xc && !xc[0];
        b = yc && !yc[0];

        // Either zero?
        if ( a || b ) return a ? b ? 0 : -j : i;

        // Signs differ?
        if ( i != j ) return i;

        a = i < 0;
        b = k == l;

        // Either Infinity?
        if ( !xc || !yc ) return b ? 0 : !xc ^ a ? 1 : -1;

        // Compare exponents.
        if ( !b ) return k > l ^ a ? 1 : -1;

        j = ( k = xc.length ) < ( l = yc.length ) ? k : l;

        // Compare digit by digit.
        for ( i = 0; i < j; i++ ) if ( xc[i] != yc[i] ) return xc[i] > yc[i] ^ a ? 1 : -1;

        // Compare lengths.
        return k == l ? 0 : k > l ^ a ? 1 : -1;
    }


    /*
     * Return true if n is a valid number in range, otherwise false.
     * Use for argument validation when ERRORS is false.
     * Note: parseInt('1e+1') == 1 but parseFloat('1e+1') == 10.
     */
    function intValidatorNoErrors( n, min, max ) {
        return ( n = truncate(n) ) >= min && n <= max;
    }


    function isArray(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }


    /*
     * Convert string of baseIn to an array of numbers of baseOut.
     * Eg. convertBase('255', 10, 16) returns [15, 15].
     * Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
     */
    function toBaseOut( str, baseIn, baseOut ) {
        var j,
            arr = [0],
            arrL,
            i = 0,
            len = str.length;

        for ( ; i < len; ) {
            for ( arrL = arr.length; arrL--; arr[arrL] *= baseIn );
            arr[ j = 0 ] += ALPHABET.indexOf( str.charAt( i++ ) );

            for ( ; j < arr.length; j++ ) {

                if ( arr[j] > baseOut - 1 ) {
                    if ( arr[j + 1] == null ) arr[j + 1] = 0;
                    arr[j + 1] += arr[j] / baseOut | 0;
                    arr[j] %= baseOut;
                }
            }
        }

        return arr.reverse();
    }


    function toExponential( str, e ) {
        return ( str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str ) +
          ( e < 0 ? 'e' : 'e+' ) + e;
    }


    function toFixedPoint( str, e ) {
        var len, z;

        // Negative exponent?
        if ( e < 0 ) {

            // Prepend zeros.
            for ( z = '0.'; ++e; z += '0' );
            str = z + str;

        // Positive exponent
        } else {
            len = str.length;

            // Append zeros.
            if ( ++e > len ) {
                for ( z = '0', e -= len; --e; z += '0' );
                str += z;
            } else if ( e < len ) {
                str = str.slice( 0, e ) + '.' + str.slice(e);
            }
        }

        return str;
    }


    function truncate(n) {
        n = parseFloat(n);
        return n < 0 ? mathceil(n) : mathfloor(n);
    }


    // EXPORT


   // AMD.
    if ( typeof define == 'function' && define.amd ) {
        define( function () { return constructorFactory(); } );

    // Node.js and other environments that support module.exports.
    } else if ( typeof module != 'undefined' && module.exports ) {
        module.exports = constructorFactory();

        // Split string stops browserify adding crypto shim.
        if ( !cryptoObj ) try { cryptoObj = require('cry' + 'pto'); } catch (e) {}

    // Browser.
    } else {
        if ( !globalObj ) globalObj = typeof self != 'undefined' ? self : Function('return this')();
        globalObj.BigNumber = constructorFactory();
    }
})(this);

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; i++) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = 0; byteOffset + i < arrLength; i++) {
    if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }
  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; i++) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; i++) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":5,"ieee754":6,"isarray":7}],5:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],6:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],7:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],8:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],9:[function(require,module,exports){
(function (process){
if (typeof Map !== 'function' || (process && process.env && process.env.TEST_MAPORSIMILAR === 'true')) {
	module.exports = require('./similar');
}
else {
	module.exports = Map;
}
}).call(this,require('_process'))

},{"./similar":10,"_process":8}],10:[function(require,module,exports){
function Similar() {
	this.list = [];
	this.lastItem = undefined;
	this.size = 0;

	return this;
}

Similar.prototype.get = function(key) {
	var index;

	if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
		return this.lastItem.val;
	}

	index = this.indexOf(key);
	if (index >= 0) {
		this.lastItem = this.list[index];
		return this.list[index].val;
	}

	return undefined;
};

Similar.prototype.set = function(key, val) {
	var index;

	if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
		this.lastItem.val = val;
		return this;
	}

	index = this.indexOf(key);
	if (index >= 0) {
		this.lastItem = this.list[index];
		this.list[index].val = val;
		return this;
	}

	this.lastItem = { key: key, val: val };
	this.list.push(this.lastItem);
	this.size++;

	return this;
};

Similar.prototype.delete = function(key) {
	var index;

	if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
		this.lastItem = undefined;
	}

	index = this.indexOf(key);
	if (index >= 0) {
		this.size--;
		return this.list.splice(index, 1)[0];
	}

	return undefined;
};


// important that has() doesn't use get() in case an existing key has a falsy value, in which case has() would return false
Similar.prototype.has = function(key) {
	var index;

	if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
		return true;
	}

	index = this.indexOf(key);
	if (index >= 0) {
		this.lastItem = this.list[index];
		return true;
	}

	return false;
};

Similar.prototype.forEach = function(callback, thisArg) {
	var i;
	for (i = 0; i < this.size; i++) {
		callback.call(thisArg || this, this.list[i].val, this.list[i].key, this);
	}
};

Similar.prototype.indexOf = function(key) {
	var i;
	for (i = 0; i < this.size; i++) {
		if (this.isEqual(this.list[i].key, key)) {
			return i;
		}
	}
	return -1;
};

// check if the numbers are equal, or whether they are both precisely NaN (isNaN returns true for all non-numbers)
Similar.prototype.isEqual = function(val1, val2) {
	return val1 === val2 || (val1 !== val1 && val2 !== val2);
};

module.exports = Similar;
},{}],11:[function(require,module,exports){
var MapOrSimilar = require('map-or-similar');

module.exports = function (limit) {
	var cache = new MapOrSimilar(),
		lru = [];

	return function (fn) {
		var memoizerific = function () {
			var currentCache = cache,
				newMap,
				fnResult,
				argsLengthMinusOne = arguments.length - 1,
				lruPath = Array(argsLengthMinusOne + 1),
				isMemoized = true,
				i;

			// loop through each argument to traverse the map tree
			for (i = 0; i < argsLengthMinusOne; i++) {
				lruPath[i] = {
					cacheItem: currentCache,
					arg: arguments[i]
				};

				// if all arguments exist in map tree, the memoized result will be last value to be retrieved
				if (currentCache.has(arguments[i])) {
					currentCache = currentCache.get(arguments[i]);
					continue;
				}

				isMemoized = false;

				// make maps until last value
				newMap = new MapOrSimilar();
				currentCache.set(arguments[i], newMap);
				currentCache = newMap;
			}

			// we are at the last arg, check if it is really memoized
			if (isMemoized) {
				if (currentCache.has(arguments[argsLengthMinusOne])) {
					fnResult = currentCache.get(arguments[argsLengthMinusOne]);
				}
				else {
					isMemoized = false;
				}
			}

			if (!isMemoized) {
				fnResult = fn.apply(null, arguments);
				currentCache.set(arguments[argsLengthMinusOne], fnResult);
			}

			if (limit > 0) {
				lruPath[argsLengthMinusOne] = {
					cacheItem: currentCache,
					arg: arguments[argsLengthMinusOne]
				};

				if (isMemoized) {
					moveToMostRecentLru(lru, lruPath);
				}
				else {
					lru.push(lruPath);
				}

				if (lru.length > limit) {
					removeCachedResult(lru.shift());
				}
			}

			memoizerific.wasMemoized = isMemoized;

			return fnResult;
		};

		memoizerific.limit = limit;
		memoizerific.wasMemoized = false;
		memoizerific.cache = cache;
		memoizerific.lru = lru;

		return memoizerific;
	};
};

// move current args to most recent position
function moveToMostRecentLru(lru, lruPath) {
	var lruLen = lru.length,
		lruPathLen = lruPath.length,
		isMatch,
		i, ii;

	for (i = 0; i < lruLen; i++) {
		isMatch = true;
		for (ii = 0; ii < lruPathLen; ii++) {
			if (!isEqual(lru[i][ii].arg, lruPath[ii].arg)) {
				isMatch = false;
				break;
			}
		}
		if (isMatch) {
			break;
		}
	}

	lru.push(lru.splice(i, 1)[0]);
}

// remove least recently used cache item and all dead branches
function removeCachedResult(removedLru) {
	var removedLruLen = removedLru.length,
		currentLru = removedLru[removedLruLen - 1],
		tmp,
		i;

	currentLru.cacheItem.delete(currentLru.arg);

	// walk down the tree removing dead branches (size 0) along the way
	for (i = removedLruLen - 2; i >= 0; i--) {
		currentLru = removedLru[i];
		tmp = currentLru.cacheItem.get(currentLru.arg);

		if (!tmp || !tmp.size) {
			currentLru.cacheItem.delete(currentLru.arg);
		} else {
			break;
		}
	}
}

// check if the numbers are equal, or whether they are both precisely NaN (isNaN returns true for all non-numbers)
function isEqual(val1, val2) {
	return val1 === val2 || (val1 !== val1 && val2 !== val2);
}
},{"map-or-similar":9}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

exports['default'] = thunk;
},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports["default"] = applyMiddleware;

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, initialState, enhancer) {
      var store = createStore(reducer, initialState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
},{"./compose":16}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
},{}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = combineReducers;

var _createStore = require('./createStore');

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!(0, _isPlainObject2["default"])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key);
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if ("development" !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
      if (warningMessage) {
        (0, _warning2["default"])(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
},{"./createStore":17,"./utils/warning":19,"lodash/isPlainObject":23}],16:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  } else {
    var _ret = function () {
      var last = funcs[funcs.length - 1];
      var rest = funcs.slice(0, -1);
      return {
        v: function v() {
          return rest.reduceRight(function (composed, f) {
            return f(composed);
          }, last.apply(undefined, arguments));
        }
      };
    }();

    if (typeof _ret === "object") return _ret.v;
  }
}
},{}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ActionTypes = undefined;
exports["default"] = createStore;

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = exports.ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [initialState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, initialState, enhancer) {
  var _ref2;

  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState;
    initialState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, initialState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = initialState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!(0, _isPlainObject2["default"])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */

      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[_symbolObservable2["default"]] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[_symbolObservable2["default"]] = observable, _ref2;
}
},{"lodash/isPlainObject":23,"symbol-observable":24}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _combineReducers = require('./combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

var _bindActionCreators = require('./bindActionCreators');

var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

var _applyMiddleware = require('./applyMiddleware');

var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _warning = require('./utils/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if ("development" !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = _createStore2["default"];
exports.combineReducers = _combineReducers2["default"];
exports.bindActionCreators = _bindActionCreators2["default"];
exports.applyMiddleware = _applyMiddleware2["default"];
exports.compose = _compose2["default"];
},{"./applyMiddleware":13,"./bindActionCreators":14,"./combineReducers":15,"./compose":16,"./createStore":17,"./utils/warning":19}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports["default"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
},{}],20:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetPrototype = Object.getPrototypeOf;

/**
 * Gets the `[[Prototype]]` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {null|Object} Returns the `[[Prototype]]`.
 */
function getPrototype(value) {
  return nativeGetPrototype(Object(value));
}

module.exports = getPrototype;

},{}],21:[function(require,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],22:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],23:[function(require,module,exports){
var getPrototype = require('./_getPrototype'),
    isHostObject = require('./_isHostObject'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object,
 *  else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_getPrototype":20,"./_isHostObject":21,"./isObjectLike":22}],24:[function(require,module,exports){
(function (global){
/* global window */
'use strict';

module.exports = require('./ponyfill')(global || window || this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./ponyfill":25}],25:[function(require,module,exports){
'use strict';

module.exports = function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

},{}],26:[function(require,module,exports){
(function (process,Buffer){
!function(globals){
'use strict'

//*** UMD BEGIN
if (typeof define !== 'undefined' && define.amd) { //require.js / AMD
  define([], function() {
    return secureRandom
  })
} else if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = secureRandom
} else { //script / browser
  globals.secureRandom = secureRandom
}
//*** UMD END

//options.type is the only valid option
function secureRandom(count, options) {
  options = options || {type: 'Array'}
  //we check for process.pid to prevent browserify from tricking us
  if (typeof process != 'undefined' && typeof process.pid == 'number') {
    return nodeRandom(count, options)
  } else {
    var crypto = window.crypto || window.msCrypto
    if (!crypto) throw new Error("Your browser does not support window.crypto.")
    return browserRandom(count, options)
  }
}

function nodeRandom(count, options) {
  var crypto = require('crypto')
  var buf = crypto.randomBytes(count)

  switch (options.type) {
    case 'Array':
      return [].slice.call(buf)
    case 'Buffer':
      return buf
    case 'Uint8Array':
      var arr = new Uint8Array(count)
      for (var i = 0; i < count; ++i) { arr[i] = buf.readUInt8(i) }
      return arr
    default:
      throw new Error(options.type + " is unsupported.")
  }
}

function browserRandom(count, options) {
  var nativeArr = new Uint8Array(count)
  var crypto = window.crypto || window.msCrypto
  crypto.getRandomValues(nativeArr)

  switch (options.type) {
    case 'Array':
      return [].slice.call(nativeArr)
    case 'Buffer':
      try { var b = new Buffer(1) } catch(e) { throw new Error('Buffer not supported in this environment. Use Node.js or Browserify for browser support.')}
      return new Buffer(nativeArr)
    case 'Uint8Array':
      return nativeArr
    default:
      throw new Error(options.type + " is unsupported.")
  }
}

secureRandom.randomArray = function(byteCount) {
  return secureRandom(byteCount, {type: 'Array'})
}

secureRandom.randomUint8Array = function(byteCount) {
  return secureRandom(byteCount, {type: 'Uint8Array'})
}

secureRandom.randomBuffer = function(byteCount) {
  return secureRandom(byteCount, {type: 'Buffer'})
}


}(this);

}).call(this,require('_process'),require("buffer").Buffer)

},{"_process":8,"buffer":4,"crypto":3}],27:[function(require,module,exports){
'use strict';

var _augurUiReactComponents = require('augur-ui-react-components');

var _augurUiReactComponents2 = _interopRequireDefault(_augurUiReactComponents);

var _selectors = require('./selectors');

var _selectors2 = _interopRequireDefault(_selectors);

var _initAugur = require('./modules/app/actions/init-augur');

var _showLink = require('./modules/link/actions/show-link');

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appElement = document.getElementById('app');
// import * as selectors from './selectors';

if ("development" === 'development') {
  Object.defineProperty(window, 'state', { get: _store2.default.getState, enumerable: true });
  window.selectors = _selectors2.default;
  window.App = _augurUiReactComponents2.default;
  console.log('*********************************************\n DEVELOPMENT MODE\n window.selectors\n window.state\n window.augurjs\n *********************************************\n');
}

_store2.default.dispatch((0, _showLink.showLink)(window.location.pathname + window.location.search));
_store2.default.dispatch((0, _initAugur.initAugur)());

// store.dispatch(MarketsActions.listenToMarkets());

_store2.default.subscribe(function () {
  return new _augurUiReactComponents2.default(appElement, _selectors2.default);
});

window.onpopstate = function (e) {
  _store2.default.dispatch((0, _showLink.showLink)(window.location.pathname + window.location.search));
};

},{"./modules/app/actions/init-augur":28,"./modules/link/actions/show-link":65,"./selectors":153,"./store":155,"augur-ui-react-components":1}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initAugur = initAugur;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _network = require('../../app/constants/network');

var _updateConnection = require('../../app/actions/update-connection');

var _updateBranch = require('../../app/actions/update-branch');

var _updateBlockchain = require('../../app/actions/update-blockchain');

var _listenToUpdates = require('../../app/actions/listen-to-updates');

var _loadLoginAccount = require('../../auth/actions/load-login-account');

var _loadMarkets = require('../../markets/actions/load-markets');

var _loadFullMarket = require('../../market/actions/load-full-market');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function initAugur() {
	return function (dispatch, getState) {
		AugurJS.connect(function (err, connected) {
			if (err) {
				return console.error('connect failure:', err);
			}

			dispatch((0, _updateConnection.updateConnectionStatus)(connected));
			dispatch((0, _loadLoginAccount.loadLoginAccount)());

			AugurJS.loadBranch(_network.BRANCH_ID, function (error, branch) {
				if (error) {
					return console.log('ERROR loadBranch', error);
				}

				dispatch((0, _updateBranch.updateBranch)(branch));

				dispatch((0, _loadMarkets.loadMarkets)());

				var _getState = getState();

				var selectedMarketID = _getState.selectedMarketID;

				if (selectedMarketID !== null) {
					dispatch((0, _loadFullMarket.loadFullMarket)(selectedMarketID));
				}

				dispatch((0, _updateBlockchain.updateBlockchain)(function () {
					dispatch((0, _listenToUpdates.listenToUpdates)());
				}));
			});
		});
	};
}

},{"../../../services/augurjs":154,"../../app/actions/listen-to-updates":29,"../../app/actions/update-blockchain":30,"../../app/actions/update-branch":31,"../../app/actions/update-connection":32,"../../app/constants/network":33,"../../auth/actions/load-login-account":41,"../../market/actions/load-full-market":69,"../../markets/actions/load-markets":81}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.listenToUpdates = listenToUpdates;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _updateAssets = require('../../auth/actions/update-assets');

var _updateBlockchain = require('../../app/actions/update-blockchain');

var _loadMarket = require('../../market/actions/load-market');

var _updateOutcomePrice = require('../../markets/actions/update-outcome-price');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function listenToUpdates() {
	return function (dispatch, getState) {
		AugurJS.listenToUpdates(

		// new block
		function () {
			dispatch((0, _updateAssets.updateAssets)());
			dispatch((0, _updateBlockchain.updateBlockchain)());
		},

		// transactions involving augur contracts
		function () {
			// console.log('augur contracts:', filtrate)
		},

		// outcome price update, { marketId, outcome (id), price }
		function (errNone, outcomePriceChange) {
			if (!outcomePriceChange || !outcomePriceChange.marketId || !outcomePriceChange.outcome || !outcomePriceChange.price) {
				return;
			}
			dispatch((0, _updateOutcomePrice.updateOutcomePrice)(outcomePriceChange.marketId, outcomePriceChange.outcome, parseFloat(outcomePriceChange.price)));
		},

		// new market, result = { blockNumber, marketId }
		function (errNone, result) {
			if (!result.marketId) {
				return;
			}
			dispatch((0, _loadMarket.loadMarket)(result.marketId));
		});
	};
}

},{"../../../services/augurjs":154,"../../app/actions/update-blockchain":30,"../../auth/actions/update-assets":45,"../../market/actions/load-market":70,"../../markets/actions/update-outcome-price":87}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_BLOCKCHAIN = undefined;
exports.incrementReportPeriod = incrementReportPeriod;
exports.updateBlockchain = updateBlockchain;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _network = require('../../app/constants/network');

var _commitReports = require('../../reports/actions/commit-reports');

var _penalizeTooFewReports = require('../../reports/actions/penalize-too-few-reports');

var _collectFees = require('../../reports/actions/collect-fees');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var UPDATE_BLOCKCHAIN = exports.UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN';

var isAlreadyUpdatingBlockchain = false;

function incrementReportPeriod(cb) {
	return function (dispatch, getState) {
		var _getState = getState();

		var blockchain = _getState.blockchain;

		var expectedReportPeriod = blockchain.currentPeriod - 1;

		// if the report period is as expected, exit
		if (blockchain.reportPeriod === expectedReportPeriod) {
			return cb && cb();
		}

		// load report period from chain to see if that one is as expected
		AugurJS.getReportPeriod(_network.BRANCH_ID, function (error, chainReportPeriod) {
			if (error) {
				console.log('ERROR getReportPeriod1', _network.BRANCH_ID, error);
				return cb && cb();
			}

			var parsedChainReportPeriod = parseInt(chainReportPeriod, 10);

			// if the report period on chain is up-to-date, update ours to match and exit
			if (parsedChainReportPeriod === expectedReportPeriod) {
				dispatch({ type: UPDATE_BLOCKCHAIN, data: { reportPeriod: expectedReportPeriod } });
				return cb && cb();
			}

			// if we are the first to encounter the new period, we get the
			// honor of incrementing it on chain for everyone
			AugurJS.incrementPeriodAfterReporting(_network.BRANCH_ID, function (err, res) {
				if (err) {
					console.error('ERROR incrementPeriodAfterReporting()', err);
					return cb && cb();
				}

				// check if it worked out
				AugurJS.getReportPeriod(_network.BRANCH_ID, function (er, verifyReportPeriod) {
					if (er) {
						console.log('ERROR getReportPeriod2', er);
						return cb && cb();
					}
					if (parseInt(verifyReportPeriod, 10) !== expectedReportPeriod) {
						console.warn('Report period not as expected after being incremented, actual:', verifyReportPeriod, 'expected:', expectedReportPeriod);
						return cb && cb();
					}
					dispatch({ type: UPDATE_BLOCKCHAIN, data: { reportPeriod: expectedReportPeriod } });
					return cb && cb();
				});
			});
		});
	};
}

function updateBlockchain(cb) {
	return function (dispatch, getState) {
		if (isAlreadyUpdatingBlockchain) {
			return; // don't trigger cb on this failure
		}

		isAlreadyUpdatingBlockchain = true;

		// load latest block number
		AugurJS.loadCurrentBlock(function (currentBlockNumber) {
			var _getState2 = getState();

			var branch = _getState2.branch;
			var blockchain = _getState2.blockchain;

			var currentPeriod = Math.floor(currentBlockNumber / branch.periodLength);
			var isChangedCurrentPeriod = currentPeriod !== blockchain.currentPeriod;
			var isReportConfirmationPhase = currentBlockNumber % branch.periodLength > branch.periodLength / 2;
			var isChangedReportPhase = isReportConfirmationPhase !== blockchain.isReportConfirmationPhase;

			if (!currentBlockNumber || currentBlockNumber !== parseInt(currentBlockNumber, 10)) {
				return; // don't trigger cb on this failure
			}

			// update blockchain state
			dispatch({
				type: UPDATE_BLOCKCHAIN,
				data: {
					currentBlockNumber: currentBlockNumber,
					currentBlockMillisSinceEpoch: Date.now(),
					currentPeriod: currentPeriod,
					isReportConfirmationPhase: isReportConfirmationPhase
				}
			});

			// if the report *period* changed this block, do some extra stuff (also triggers the first time blockchain is being set)
			if (isChangedCurrentPeriod) {
				dispatch(incrementReportPeriod(function () {
					// if the report *phase* changed this block, do some extra stuff
					if (isChangedReportPhase) {
						dispatch((0, _commitReports.commitReports)());
						dispatch((0, _penalizeTooFewReports.penalizeTooFewReports)());
						dispatch((0, _collectFees.collectFees)());
					}

					isAlreadyUpdatingBlockchain = false;
					return cb && cb();
				}));
			} else {
				isAlreadyUpdatingBlockchain = false;
				return cb && cb();
			}
		});
	};
}

},{"../../../services/augurjs":154,"../../app/constants/network":33,"../../reports/actions/collect-fees":125,"../../reports/actions/commit-reports":126,"../../reports/actions/penalize-too-few-reports":128}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateBranch = updateBranch;
var UPDATE_BRANCH = exports.UPDATE_BRANCH = 'UPDATE_BRANCH';

function updateBranch(branch) {
	return { type: UPDATE_BRANCH, branch: branch };
}

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateConnectionStatus = updateConnectionStatus;
var UPDATE_CONNECTION_STATUS = exports.UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS';

/**
 * @param {Boolean} isConnected
 * @return {{type: string, isConnected: *}} returns action
 */
function updateConnectionStatus(isConnected) {
	return {
		type: UPDATE_CONNECTION_STATUS,
		isConnected: isConnected
	};
}

},{}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MILLIS_PER_BLOCK = exports.MILLIS_PER_BLOCK = 12000;
var BRANCH_ID = exports.BRANCH_ID = 1010101;

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var MARKETS = exports.MARKETS = 'markets';
var MAKE = exports.MAKE = 'make';
var POSITIONS = exports.POSITIONS = 'positions';
var TRANSACTIONS = exports.TRANSACTIONS = 'transactions';
var M = exports.M = 'm';

var DEFAULT_PAGE = exports.DEFAULT_PAGE = MARKETS;

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var activePage = arguments.length <= 0 || arguments[0] === undefined ? _pages.DEFAULT_PAGE : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _showLink.SHOW_LINK:
			return _paths.PATHS_PAGES[action.parsedURL.pathArray[0]] || _pages.DEFAULT_PAGE;

		default:
			return activePage;
	}
};

var _showLink = require('../../link/actions/show-link');

var _pages = require('../../app/constants/pages');

var _paths = require('../../link/constants/paths');

},{"../../app/constants/pages":34,"../../link/actions/show-link":65,"../../link/constants/paths":67}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var blockchain = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateBlockchain.UPDATE_BLOCKCHAIN:
			return _extends({}, blockchain, action.data);

		default:
			return blockchain;
	}
};

var _updateBlockchain = require('../../app/actions/update-blockchain');

},{"../../app/actions/update-blockchain":30}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var branch = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateBranch.UPDATE_BRANCH:
			return _extends({}, branch, action.branch);

		default:
			return branch;}
};

var _updateBranch = require('../../app/actions/update-branch');

},{"../../app/actions/update-branch":31}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   * Author: priecint
                                                                                                                                                                                                                                                                   */

exports.default = function () {
	var connection = arguments.length <= 0 || arguments[0] === undefined ? { isConnected: false } : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateConnection.UPDATE_CONNECTION_STATUS:
			return _extends({}, connection, {
				isConnected: action.isConnected
			});

		default:
			return connection;
	}
};

var _updateConnection = require('../../app/actions/update-connection');

},{"../../app/actions/update-connection":32}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var activePage = _store$getState.activePage;

	return activePage;
};

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../../../store":155}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.authError = authError;
var AUTH_ERROR = exports.AUTH_ERROR = 'AUTH_ERROR';

function authError(err) {
	return { type: AUTH_ERROR, err: err };
}

},{}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadLoginAccountDependents = loadLoginAccountDependents;
exports.loadLoginAccountLocalStorage = loadLoginAccountLocalStorage;
exports.loadLoginAccount = loadLoginAccount;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _statuses = require('../../transactions/constants/statuses');

var _updateLoginAccount = require('../../auth/actions/update-login-account');

var _updateAssets = require('../../auth/actions/update-assets');

var _loadAccountTrades = require('../../positions/actions/load-account-trades');

var _loadReports = require('../../reports/actions/load-reports');

var _updateReports = require('../../reports/actions/update-reports');

var _updateFavorites = require('../../markets/actions/update-favorites');

var _updateAccountTradesData = require('../../positions/actions/update-account-trades-data');

var _updateTransactionsData = require('../../transactions/actions/update-transactions-data');

var _commitReports = require('../../reports/actions/commit-reports');

var _penalizeTooFewReports = require('../../reports/actions/penalize-too-few-reports');

var _penalizeWrongReports = require('../../reports/actions/penalize-wrong-reports');

var _collectFees = require('../../reports/actions/collect-fees');

var _closeMarkets = require('../../reports/actions/close-markets');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function loadLoginAccountDependents() {
	return function (dispatch, getState) {
		var _getState = getState();

		var marketsData = _getState.marketsData;

		// dispatch(loadMeanTradePrices());

		dispatch((0, _updateAssets.updateAssets)());
		dispatch((0, _loadAccountTrades.loadAccountTrades)());

		// clear and load reports for any markets that have been loaded
		// (partly to handle signing out of one account and into another)
		dispatch((0, _updateReports.clearReports)());
		dispatch((0, _loadReports.loadReports)(marketsData));

		dispatch((0, _commitReports.commitReports)());
		dispatch((0, _penalizeTooFewReports.penalizeTooFewReports)());
		dispatch((0, _collectFees.collectFees)());
		dispatch((0, _penalizeWrongReports.penalizeWrongReports)(marketsData));
		dispatch((0, _closeMarkets.closeMarkets)(marketsData));
	};
}

function loadLoginAccountLocalStorage(accountID) {
	return function (dispatch, getState) {
		var localStorageRef = typeof window !== 'undefined' && window.localStorage;

		if (!localStorageRef || !localStorageRef.getItem || !accountID) {
			return;
		}

		var localState = JSON.parse(localStorageRef.getItem(accountID));

		if (!localState) {
			return;
		}

		if (localState.favorites) {
			dispatch((0, _updateFavorites.updateFavorites)(localState.favorites));
		}
		if (localState.accountTrades) {
			dispatch((0, _updateAccountTradesData.updateAccountTradesData)(localState.accountTrades));
		}
		if (localState.transactionsData) {
			Object.keys(localState.transactionsData).forEach(function (key) {
				if ([_statuses.SUCCESS, _statuses.FAILED, _statuses.PENDING, _statuses.INTERRUPTED].indexOf(localState.transactionsData[key].status) < 0) {
					localState.transactionsData[key].status = _statuses.INTERRUPTED;
					localState.transactionsData[key].message = 'unknown if completed';
				}
			});
			dispatch((0, _updateTransactionsData.updateTransactionsData)(localState.transactionsData));
		}
	};
}

function loadLoginAccount() {
	return function (dispatch) {
		AugurJS.loadLoginAccount(true, function (err, loginAccount) {
			if (err) {
				return console.error('ERR loadLoginAccount():', err);
			}
			if (!loginAccount || !loginAccount.id) {
				return;
			}

			dispatch(loadLoginAccountLocalStorage(loginAccount.id));
			dispatch((0, _updateLoginAccount.updateLoginAccount)(loginAccount));
			dispatch(loadLoginAccountDependents());
			return;
		});
	};
}

},{"../../../services/augurjs":154,"../../auth/actions/update-assets":45,"../../auth/actions/update-login-account":46,"../../markets/actions/update-favorites":84,"../../positions/actions/load-account-trades":119,"../../positions/actions/update-account-trades-data":120,"../../reports/actions/close-markets":124,"../../reports/actions/collect-fees":125,"../../reports/actions/commit-reports":126,"../../reports/actions/load-reports":127,"../../reports/actions/penalize-too-few-reports":128,"../../reports/actions/penalize-wrong-reports":129,"../../reports/actions/update-reports":131,"../../transactions/actions/update-transactions-data":145,"../../transactions/constants/statuses":146}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.login = login;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _loadLoginAccount = require('../../auth/actions/load-login-account');

var _updateLoginAccount = require('../../auth/actions/update-login-account');

var _authError = require('../../auth/actions/auth-error');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function login(username, password) {
	return function (dispatch, getState) {
		var _require = require('../../../selectors');

		var links = _require.links;

		AugurJS.login(username, password, true, function (err, loginAccount) {
			if (err) {
				return dispatch((0, _authError.authError)(err));
			}
			if (!loginAccount || !loginAccount.id) {
				return;
			}

			dispatch((0, _loadLoginAccount.loadLoginAccountLocalStorage)(loginAccount.id));
			dispatch((0, _updateLoginAccount.updateLoginAccount)(loginAccount));
			dispatch((0, _loadLoginAccount.loadLoginAccountDependents)());
			links.marketsLink.onClick();
			return;
		});
	};
}

},{"../../../selectors":153,"../../../services/augurjs":154,"../../auth/actions/auth-error":40,"../../auth/actions/load-login-account":41,"../../auth/actions/update-login-account":46}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.logout = logout;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _updateLoginAccount = require('../../auth/actions/update-login-account');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function logout() {
	return function (dispatch, getState) {
		AugurJS.logout();
		dispatch((0, _updateLoginAccount.clearLoginAccount)());
	};
}

},{"../../../services/augurjs":154,"../../auth/actions/update-login-account":46}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.register = register;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _authTypes = require('../../auth/constants/auth-types');

var _formErrors = require('../../auth/constants/form-errors');

var _statuses = require('../../transactions/constants/statuses');

var _updateAssets = require('../../auth/actions/update-assets');

var _authError = require('../../auth/actions/auth-error');

var _updateLoginAccount = require('../../auth/actions/update-login-account');

var _updateTransactionsData = require('../../transactions/actions/update-transactions-data');

var _updateExistingTransaction = require('../../transactions/actions/update-existing-transaction');

var _addTransactions = require('../../transactions/actions/add-transactions');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function register(username, password, password2) {
	return function (dispatch, getState) {
		var _require = require('../../../selectors');

		var links = _require.links;

		var transactionID = (0, _addTransactions.makeTransactionID)();
		var numAssetsLoaded = -1;

		if (!username || !username.length) {
			return dispatch((0, _authError.authError)({ code: _formErrors.USERNAME_REQUIRED }));
		}

		if (password !== password2) {
			return dispatch((0, _authError.authError)({ code: _formErrors.PASSWORDS_DO_NOT_MATCH }));
		}

		function makeTransactionUpdate() {
			var transactionObj = {};

			transactionObj.type = _authTypes.REGISTER;

			if (numAssetsLoaded < 3) {
				transactionObj.status = 'loading ether & rep...';
			} else {
				transactionObj.status = _statuses.SUCCESS;
			}

			return transactionObj;
		}

		AugurJS.register(username, password, true, function (err, loginAccount) {
			if (err) {
				if (numAssetsLoaded === -1) {
					dispatch((0, _authError.authError)(err));
				} else {
					dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: _statuses.FAILED, message: err.message }));
				}
				return;
			}
			numAssetsLoaded++;
			links.marketsLink.onClick();
			dispatch((0, _updateTransactionsData.updateTransactionsData)(_defineProperty({}, transactionID, makeTransactionUpdate())));
			dispatch((0, _updateLoginAccount.updateLoginAccount)(loginAccount));
		}, function () {
			numAssetsLoaded++;
			dispatch((0, _updateAssets.updateAssets)());
			dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, makeTransactionUpdate()));
		});
	};
}

},{"../../../selectors":153,"../../../services/augurjs":154,"../../auth/actions/auth-error":40,"../../auth/actions/update-assets":45,"../../auth/actions/update-login-account":46,"../../auth/constants/auth-types":47,"../../auth/constants/form-errors":48,"../../transactions/actions/add-transactions":142,"../../transactions/actions/update-existing-transaction":144,"../../transactions/actions/update-transactions-data":145,"../../transactions/constants/statuses":146}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateAssets = updateAssets;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _network = require('../../app/constants/network');

var _updateLoginAccount = require('../../auth/actions/update-login-account');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function updateAssets() {
	return function (dispatch, getState) {
		var _getState = getState();

		var loginAccount = _getState.loginAccount;

		if (!loginAccount.id) {
			return dispatch((0, _updateLoginAccount.updateLoginAccount)({
				ether: undefined,
				realEther: undefined,
				rep: undefined }));
		}
		AugurJS.loadAssets(_network.BRANCH_ID, loginAccount.id, function (err, ether) {
			// const { loginAccount } = getState();
			if (err) {
				console.info('!! ERROR updateAssets() ether', err);
				return;
			}

			if (!loginAccount.ether || loginAccount.ether.value !== ether) {
				return dispatch((0, _updateLoginAccount.updateLoginAccount)({ ether: ether }));
			}
		}, function (err, rep) {
			if (err) {
				console.info('!! ERROR updateAssets() rep', err);
				return;
			}
			if (!loginAccount.rep || loginAccount.rep.value !== rep) {
				return dispatch((0, _updateLoginAccount.updateLoginAccount)({ rep: rep }));
			}
		}, function (err, realEther) {
			if (err) {
				console.info('!! ERROR updateAssets() real-ether', realEther);
				return;
			}

			if (!loginAccount.realEther || loginAccount.realEther.value !== realEther) {
				return dispatch((0, _updateLoginAccount.updateLoginAccount)({ realEther: realEther }));
			}
		});
	};
}

},{"../../../services/augurjs":154,"../../app/constants/network":33,"../../auth/actions/update-login-account":46}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateLoginAccount = updateLoginAccount;
exports.clearLoginAccount = clearLoginAccount;
var UPDATE_LOGIN_ACCOUNT = exports.UPDATE_LOGIN_ACCOUNT = 'UPDATE_LOGIN_ACCOUNT';
var CLEAR_LOGIN_ACCOUNT = exports.CLEAR_LOGIN_ACCOUNT = 'CLEAR_LOGIN_ACCOUNT';

function updateLoginAccount(loginAccount) {
	return { type: UPDATE_LOGIN_ACCOUNT, data: loginAccount };
}

function clearLoginAccount() {
	return { type: CLEAR_LOGIN_ACCOUNT };
}

},{}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _AUTH_TYPES;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var REGISTER = exports.REGISTER = 'register';
var LOGIN = exports.LOGIN = 'login';

var AUTH_TYPES = exports.AUTH_TYPES = (_AUTH_TYPES = {}, _defineProperty(_AUTH_TYPES, REGISTER, REGISTER), _defineProperty(_AUTH_TYPES, LOGIN, LOGIN), _AUTH_TYPES);

var DEFAULT_AUTH_TYPE = exports.DEFAULT_AUTH_TYPE = REGISTER;

},{}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var INVALID_USERNAME_OR_PASSWORD = exports.INVALID_USERNAME_OR_PASSWORD = 403;
var PASSWORD_TOO_SHORT = exports.PASSWORD_TOO_SHORT = 405;
var USERNAME_TAKEN = exports.USERNAME_TAKEN = 422;
var USERNAME_REQUIRED = exports.USERNAME_REQUIRED = 'USERNAME_REQUIRED';
var PASSWORDS_DO_NOT_MATCH = exports.PASSWORDS_DO_NOT_MATCH = 'PASSWORDS_DO_NOT_MATCH';

var INVALID_USERNAME = exports.INVALID_USERNAME = 'INVALID_USERNAME';
var INVALID_USER = exports.INVALID_USER = 'INVALID_USER';

},{}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var auth = arguments.length <= 0 || arguments[0] === undefined ? { selectedAuthType: _authTypes.DEFAULT_AUTH_TYPE, err: null } : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _showLink.SHOW_LINK:
			return _extends({}, auth, {
				selectedAuthType: _paths.PATHS_AUTH[action.parsedURL.pathArray[0]] || _authTypes.DEFAULT_AUTH_TYPE,
				err: null
			});

		case _authError.AUTH_ERROR:
			return _extends({}, auth, {
				err: action.err
			});

		default:
			return auth;
	}
};

var _authTypes = require('../../auth/constants/auth-types');

var _paths = require('../../link/constants/paths');

var _showLink = require('../../link/actions/show-link');

var _authError = require('../../auth/actions/auth-error');

},{"../../auth/actions/auth-error":40,"../../auth/constants/auth-types":47,"../../link/actions/show-link":65,"../../link/constants/paths":67}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var loginAccount = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateLoginAccount.UPDATE_LOGIN_ACCOUNT:
			return _extends({}, loginAccount, action.data || {});

		case _updateLoginAccount.CLEAR_LOGIN_ACCOUNT:
			return {};

		default:
			return loginAccount;
	}
};

var _updateLoginAccount = require('../../auth/actions/update-login-account');

},{"../../auth/actions/update-login-account":46}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectAuthForm = exports.selectAuthType = exports.selectLogin = exports.selectRegister = exports.selectErrMsg = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var auth = _store$getState.auth;

	var _require = require('../../../selectors');

	var links = _require.links;

	return selectAuthForm(auth, links, _store2.default.dispatch);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _authTypes = require('../../auth/constants/auth-types');

var _formErrors = require('../../auth/constants/form-errors');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

var _register = require('../../auth/actions/register');

var _login = require('../../auth/actions/login');

var _links = require('../../link/selectors/links');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectErrMsg = exports.selectErrMsg = function selectErrMsg(err) {
	if (!err) {
		return null;
	}

	switch (err.code) {
		case _formErrors.INVALID_USERNAME_OR_PASSWORD:
			return 'invalid username or password';
		case _formErrors.USERNAME_REQUIRED:
			return 'username is required';
		case _formErrors.PASSWORDS_DO_NOT_MATCH:
			return 'passwords do not match';
		case _formErrors.PASSWORD_TOO_SHORT:
			return err.message; // use message so we dont have to update length requiremenets here
		case _formErrors.USERNAME_TAKEN:
			return 'username already registered';
		default:
			return err.message;
	}
};

var selectRegister = exports.selectRegister = function selectRegister(auth, dispatch) {
	var errMsg = selectErrMsg(auth.err);
	return {
		title: 'Sign Up',

		isVisibleUsername: true,
		isVisiblePassword: true,
		isVisiblePassword2: true,

		topLinkText: 'Login',
		topLink: (0, _links.selectAuthLink)(_authTypes.LOGIN, false, dispatch),

		msg: errMsg,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Sign Up',
		submitButtonClass: 'register-button',

		onSubmit: function onSubmit(username, password, password2) {
			return dispatch((0, _register.register)(username, password, password2));
		}
	};
};

var selectLogin = exports.selectLogin = function selectLogin(auth, dispatch) {
	var errMsg = selectErrMsg(auth.err);
	return {
		title: 'Login',

		isVisibleUsername: true,
		isVisiblePassword: true,
		isVisiblePassword2: false,

		topLinkText: 'Sign Up',
		topLink: (0, _links.selectAuthLink)(_authTypes.REGISTER, false, dispatch),

		msg: errMsg,
		msgClass: errMsg ? 'error' : 'success',

		submitButtonText: 'Login',
		submitButtonClass: 'login-button',

		onSubmit: function onSubmit(username, password) {
			return dispatch((0, _login.login)(username, password));
		}
	};
};

var selectAuthType = exports.selectAuthType = function selectAuthType(auth, dispatch) {
	switch (auth.selectedAuthType) {
		case _authTypes.REGISTER:
			return selectRegister(auth, dispatch);
		case _authTypes.LOGIN:
			return selectLogin(auth, dispatch);
		default:
			return;
	}
};

var selectAuthForm = exports.selectAuthForm = (0, _memoizerific2.default)(1)(function (auth, link, dispatch) {
	var obj = _extends({}, selectAuthType(auth, dispatch), {
		closeLink: link.previousLink
	});
	return obj;
});

},{"../../../selectors":153,"../../../store":155,"../../auth/actions/login":42,"../../auth/actions/register":44,"../../auth/constants/auth-types":47,"../../auth/constants/form-errors":48,"../../link/selectors/links":68,"memoizerific":11}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var loginAccount = _store$getState.loginAccount;

	return _extends({}, loginAccount, {
		rep: (0, _formatNumber.formatRep)(loginAccount.rep, { zeroStyled: false, decimalsRounded: 0 }),
		ether: (0, _formatNumber.formatEther)(loginAccount.ether, { zeroStyled: false, decimalsRounded: 0 }),
		realEther: (0, _formatNumber.formatEther)(loginAccount.realEther, { zeroStyled: false, decimalsRounded: 0 })
	});
};

var _formatNumber = require('../../../utils/format-number');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../../../store":155,"../../../utils/format-number":160}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateBidsAsks = updateBidsAsks;
var UPDATE_BIDSASKS_DATA = exports.UPDATE_BIDSASKS_DATA = 'UPDATE_BIDSASKS_DATA';

function updateBidsAsks(bidsAsksData) {
	return { type: UPDATE_BIDSASKS_DATA, bidsAsksData: bidsAsksData };
}

},{}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var bidsAsks = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	var newBidAsk = void 0;
	var curr = void 0;
	switch (action.type) {
		case _updateBidsAsks.UPDATE_BIDSASKS_DATA:
			newBidAsk = _extends({}, bidsAsks);
			Object.keys(action.bidsAsksData || {}).forEach(function (transactionID) {
				curr = action.bidsAsksData[transactionID];
				if (!curr.id || !curr.marketID || !curr.outcomeID || !curr.action || !curr.accountID || !curr.bidOrAsk || !curr.numShares || !curr.limitPrice) {
					return;
				}

				newBidAsk[curr.marketID] = _extends({}, newBidAsk[curr.marketID]);
				newBidAsk[curr.marketID][curr.outcomeID] = _extends({}, newBidAsk[curr.marketID][curr.outcomeID]);
				newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk] = _extends({}, newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk]);

				// remove from order book
				if (['canceled', 'executed'].indexOf(curr.action)) {
					if (!newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice] || !newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID]) {
						return;
					}
					newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID] -= curr.numShares;
					if (newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID] < 0) {
						delete newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID];
					}
					return;
				}

				// add to order book
				newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice] = _extends({}, newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice]);
				newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID] = newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID] || 0;
				newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID] += curr.numShares;
			});

			return newBidAsk;
		default:
			return bidsAsks;
	}
};

var _updateBidsAsks = require('../actions/update-bids-asks');

},{"../actions/update-bids-asks":53}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.submitGenerateOrderBook = submitGenerateOrderBook;
exports.createOrderBook = createOrderBook;

var _statuses = require('../../transactions/constants/statuses');

var _updateExistingTransaction = require('../../transactions/actions/update-existing-transaction');

var _addGenerateOrderBookTransaction = require('../../transactions/actions/add-generate-order-book-transaction');

var _augurjs = require('../../../services/augurjs');

var _augurjs2 = _interopRequireDefault(_augurjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function submitGenerateOrderBook(marketData) {
    return function (dispatch) {
        dispatch((0, _addGenerateOrderBookTransaction.addGenerateOrderBookTransaction)(marketData));
    };
}

function createOrderBook(transactionID, marketData) {
    return function (dispatch) {
        dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: _statuses.GENERATING_ORDER_BOOK }));

        _augurjs2.default.generateOrderBook(marketData, function (err, res) {
            if (err) {
                dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: _statuses.FAILED, message: err.message }));

                return;
            }

            var p = res.payload,
                message = null;

            switch (res.status) {
                case _statuses.COMPLETE_SET_BOUGHT:
                    dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, {
                        status: _statuses.COMPLETE_SET_BOUGHT,
                        message: message
                    }));

                    break;
                case _statuses.ORDER_BOOK_ORDER_COMPLETE:
                    message = (!!p.buyPrice ? 'Bid' : 'Ask') + ' for ' + p.amount + ' share' + (p.amount > 1 ? 's' : '') + ' of outcome \'' + marketData.outcomes[p.outcome - 1].name + '\' at ' + (p.buyPrice || p.sellPrice) + ' ETH created.';

                    dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, {
                        status: _statuses.ORDER_BOOK_ORDER_COMPLETE,
                        message: message
                    }));

                    break;
                case _statuses.ORDER_BOOK_OUTCOME_COMPLETE:
                    message = 'Order book creation for outcome \'' + marketData.outcomes[p.outcome - 1].name + '\' completed.';

                    dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, {
                        status: _statuses.ORDER_BOOK_OUTCOME_COMPLETE,
                        message: message
                    }));

                    break;
                case _statuses.SUCCESS:
                    dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, {
                        status: _statuses.SUCCESS,
                        message: message
                    }));

                    break;
            }
        });
    };
}

},{"../../../services/augurjs":154,"../../transactions/actions/add-generate-order-book-transaction":139,"../../transactions/actions/update-existing-transaction":144,"../../transactions/constants/statuses":146}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // import { makeDescriptionFromCategoricalOutcomeNames } from '../../../utils/parse-market-data';

exports.submitNewMarket = submitNewMarket;
exports.createMarket = createMarket;

var _network = require('../../app/constants/network');

var _marketTypes = require('../../markets/constants/market-types');

var _statuses = require('../../transactions/constants/statuses');

var _augurjs = require('../../../services/augurjs');

var _augurjs2 = _interopRequireDefault(_augurjs);

var _loadMarket = require('../../market/actions/load-market');

var _updateExistingTransaction = require('../../transactions/actions/update-existing-transaction');

var _addCreateMarketTransaction = require('../../transactions/actions/add-create-market-transaction');

var _links = require('../../link/selectors/links');

var _generateOrderBook = require('../../create-market/actions/generate-order-book');

var _updateMakeInProgress = require('../../create-market/actions/update-make-in-progress');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function submitNewMarket(newMarket) {
	return function (dispatch) {
		(0, _links.selectTransactionsLink)(dispatch).onClick();
		dispatch((0, _addCreateMarketTransaction.addCreateMarketTransaction)(newMarket));
	};
}

function createMarket(transactionID, newMarket) {
	return function (dispatch) {
		if (newMarket.type === _marketTypes.BINARY) {
			newMarket.minValue = 1;
			newMarket.maxValue = 2;
			newMarket.numOutcomes = 2;
		} else if (newMarket.type === _marketTypes.SCALAR) {
			newMarket.minValue = newMarket.scalarSmallNum;
			newMarket.maxValue = newMarket.scalarBigNum;
			newMarket.numOutcomes = 2;
		} else if (newMarket.type === _marketTypes.CATEGORICAL) {
			newMarket.minValue = 1;
			newMarket.maxValue = 2;
			newMarket.numOutcomes = newMarket.outcomes.length;
			// newMarket.description = makeDescriptionFromCategoricalOutcomeNames(newMarket);
		} else {
				console.warn('createMarket unsupported type:', newMarket.type);
				return;
			}

		dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: 'sending...' }));

		_augurjs2.default.createMarket(_network.BRANCH_ID, newMarket, function (err, res) {
			if (err) {

				dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: _statuses.FAILED, message: err.message }));
				return;
			}
			if (res.status === _statuses.CREATING_MARKET) {
				dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: _statuses.CREATING_MARKET }));
			} else {
				dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: res.status }));

				if (res.status === _statuses.SUCCESS) {
					dispatch((0, _updateMakeInProgress.clearMakeInProgress)());
					setTimeout(function () {
						return dispatch((0, _loadMarket.loadMarket)(res.marketID));
					}, 5000);

					newMarket = _extends({}, newMarket, {
						id: res.marketID,
						tx: res.tx
					});

					dispatch((0, _generateOrderBook.submitGenerateOrderBook)(newMarket));
				}
			}
		});
	};
}

},{"../../../services/augurjs":154,"../../app/constants/network":33,"../../create-market/actions/generate-order-book":55,"../../create-market/actions/update-make-in-progress":57,"../../link/selectors/links":68,"../../market/actions/load-market":70,"../../markets/constants/market-types":93,"../../transactions/actions/add-create-market-transaction":138,"../../transactions/actions/update-existing-transaction":144,"../../transactions/constants/statuses":146}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateMakeInProgress = updateMakeInProgress;
exports.clearMakeInProgress = clearMakeInProgress;
var UPDATE_MAKE_IN_PROGRESS = exports.UPDATE_MAKE_IN_PROGRESS = 'UPDATE_MAKE_IN_PROGRESS';
var CLEAR_MAKE_IN_PROGRESS = exports.CLEAR_MAKE_IN_PROGRESS = 'CLEAR_MAKE_IN_PROGRESS';

function updateMakeInProgress(data) {
	return { type: UPDATE_MAKE_IN_PROGRESS, data: data };
}

function clearMakeInProgress() {
	return { type: CLEAR_MAKE_IN_PROGRESS };
}

},{}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DESCRIPTION_MIN_LENGTH = exports.DESCRIPTION_MIN_LENGTH = 1;
var DESCRIPTION_MAX_LENGTH = exports.DESCRIPTION_MAX_LENGTH = 256;

var CATEGORICAL_OUTCOMES_MIN_NUM = exports.CATEGORICAL_OUTCOMES_MIN_NUM = 2;
var CATEGORICAL_OUTCOMES_MAX_NUM = exports.CATEGORICAL_OUTCOMES_MAX_NUM = 8;
var CATEGORICAL_OUTCOME_MAX_LENGTH = exports.CATEGORICAL_OUTCOME_MAX_LENGTH = 250;

var TAGS_MAX_NUM = exports.TAGS_MAX_NUM = 3;
var TAGS_MAX_LENGTH = exports.TAGS_MAX_LENGTH = 25;

var RESOURCES_MAX_NUM = exports.RESOURCES_MAX_NUM = 5;
var RESOURCES_MAX_LENGTH = exports.RESOURCES_MAX_LENGTH = 1250;

var EXPIRY_SOURCE_GENERIC = exports.EXPIRY_SOURCE_GENERIC = 'generic';
var EXPIRY_SOURCE_SPECIFIC = exports.EXPIRY_SOURCE_SPECIFIC = 'specific';

var INITIAL_LIQUIDITY_DEFAULT = exports.INITIAL_LIQUIDITY_DEFAULT = 500;
var INITIAL_LIQUIDITY_MIN = exports.INITIAL_LIQUIDITY_MIN = 50;

var TRADING_FEE_DEFAULT = exports.TRADING_FEE_DEFAULT = 2;
var TRADING_FEE_MIN = exports.TRADING_FEE_MIN = 1;
var TRADING_FEE_MAX = exports.TRADING_FEE_MAX = 12.5;

var MAKER_FEE_DEFAULT = exports.MAKER_FEE_DEFAULT = 0.5;
var MAKER_FEE_MIN = exports.MAKER_FEE_MIN = 0;
var MAKER_FEE_MAX = exports.MAKER_FEE_MAX = 100;

// Advanced Market Creation Defaults
var STARTING_QUANTITY_DEFAULT = exports.STARTING_QUANTITY_DEFAULT = 10;
var STARTING_QUANTITY_MIN = exports.STARTING_QUANTITY_MIN = 0.1;

var BEST_STARTING_QUANTITY_DEFAULT = exports.BEST_STARTING_QUANTITY_DEFAULT = 20;
var BEST_STARTING_QUANTITY_MIN = exports.BEST_STARTING_QUANTITY_MIN = 0.1;

var PRICE_WIDTH_DEFAULT = exports.PRICE_WIDTH_DEFAULT = 0.1;
var PRICE_WIDTH_MIN = exports.PRICE_WIDTH_MIN = 0.01;

var PRICE_DEPTH_DEFAULT = exports.PRICE_DEPTH_DEFAULT = 0.1; // Not used yet

var IS_SIMULATION = exports.IS_SIMULATION = false; // Not used yet

},{}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var createMarketInProgress = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateMakeInProgress.UPDATE_MAKE_IN_PROGRESS:
			return _extends({}, createMarketInProgress, action.data);

		case _updateMakeInProgress.CLEAR_MAKE_IN_PROGRESS:
			return {};

		default:
			return createMarketInProgress;
	}
};

var _updateMakeInProgress = require('../actions/update-make-in-progress');

},{"../actions/update-make-in-progress":57}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectCreateMarketForm = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var createMarketInProgress = _store$getState.createMarketInProgress;
	var blockchain = _store$getState.blockchain;

	return selectCreateMarketForm(createMarketInProgress, blockchain.currentBlockNumber, blockchain.currentBlockMillisSinceEpoch, _store2.default.dispatch);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _marketTypes = require('../../markets/constants/market-types');

var _updateMakeInProgress = require('../../create-market/actions/update-make-in-progress');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

var _step = require('../../create-market/selectors/form-steps/step-2');

var Step2 = _interopRequireWildcard(_step);

var _step2 = require('../../create-market/selectors/form-steps/step-3');

var Step3 = _interopRequireWildcard(_step2);

var _step3 = require('../../create-market/selectors/form-steps/step-4');

var Step4 = _interopRequireWildcard(_step3);

var _step4 = require('../../create-market/selectors/form-steps/step-5');

var Step5 = _interopRequireWildcard(_step4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectCreateMarketForm = exports.selectCreateMarketForm = (0, _memoizerific2.default)(1)(function (createMarketInProgress, currentBlockNumber, currentBlockMillisSinceEpoch, dispatch) {
	var formState = _extends({}, createMarketInProgress, {
		creatingMarket: true,
		errors: {}
	});

	// next step handler
	formState.onValuesUpdated = function (newValues) {
		return dispatch((0, _updateMakeInProgress.updateMakeInProgress)(newValues));
	};

	// init
	if (!formState.step || !(formState.step >= 1)) {
		formState.step = 1;
		return formState;
	}

	// step 1
	if (!(formState.step > 1) || !_marketTypes.MARKET_TYPES[formState.type]) {
		formState.step = 1;
		return formState;
	}

	// step 2
	formState = _extends({}, formState, Step2.initialFairPrices(formState), Step2.select(formState));
	formState.isValid = Step2.isValid(formState);
	if (!(formState.step > 2) || !formState.isValid) {
		formState.step = 2;
		formState.errors = _extends({}, formState.errors, Step2.errors(formState));
		return formState;
	}

	// step 3
	formState = _extends({}, formState, Step3.select(formState));
	formState.isValid = Step3.isValid(formState);
	if (!(formState.step > 3) || !formState.isValid) {
		formState.step = 3;
		formState.errors = _extends({}, formState.errors, Step3.errors(formState));
		return formState;
	}

	// step 4
	formState = _extends({}, formState, Step4.select(formState));
	formState.isValid = Step4.isValid(formState);
	if (!(formState.step > 4) || !formState.isValid) {
		formState.step = 4;
		formState.errors = _extends({}, formState.errors, Step4.errors(formState));
		return formState;
	}

	// step 5
	return _extends({}, formState, Step5.select(formState, currentBlockNumber, currentBlockMillisSinceEpoch, dispatch), {
		step: 5
	});
});

},{"../../../store":155,"../../create-market/actions/update-make-in-progress":57,"../../create-market/selectors/form-steps/step-2":61,"../../create-market/selectors/form-steps/step-3":62,"../../create-market/selectors/form-steps/step-4":63,"../../create-market/selectors/form-steps/step-5":64,"../../markets/constants/market-types":93,"memoizerific":11}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.errors = exports.isValid = exports.initialFairPrices = exports.selectCombinatorial = exports.selectScalar = exports.selectCategorical = exports.selectBinary = exports.select = undefined;

var _marketTypes = require('../../../markets/constants/market-types');

var _marketValuesConstraints = require('../../../create-market/constants/market-values-constraints');

var _validateDescription = require('../../../market/validators/validate-description');

var _validateDescription2 = _interopRequireDefault(_validateDescription);

var _validateEndDate = require('../../../market/validators/validate-end-date');

var _validateEndDate2 = _interopRequireDefault(_validateEndDate);

var _validateScalarSmallNum = require('../../../market/validators/validate-scalar-small-num');

var _validateScalarSmallNum2 = _interopRequireDefault(_validateScalarSmallNum);

var _validateScalarBigNum = require('../../../market/validators/validate-scalar-big-num');

var _validateScalarBigNum2 = _interopRequireDefault(_validateScalarBigNum);

var _validateCategoricalOutcomes = require('../../../market/validators/validate-categorical-outcomes');

var _validateCategoricalOutcomes2 = _interopRequireDefault(_validateCategoricalOutcomes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var select = exports.select = function select(formState) {
	switch (formState.type) {
		case _marketTypes.BINARY:
			return selectBinary(formState);
		case _marketTypes.CATEGORICAL:
			return selectCategorical(formState);
		case _marketTypes.SCALAR:
			return selectScalar(formState);
		case _marketTypes.COMBINATORIAL:
			return selectCombinatorial(formState);
		default:
			break;
	}
};
// import { FAILED } from '../../../transactions/constants/statuses';

var selectBinary = exports.selectBinary = function selectBinary(formState) {
	var obj = {
		descriptionPlaceholder: 'Will "Batman v Superman: Dawn of Justice" take more' + ' than $150 million box in office receipts opening weekend?',
		descriptionMinLength: _marketValuesConstraints.DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: _marketValuesConstraints.DESCRIPTION_MAX_LENGTH
	};
	return obj;
};

var selectCategorical = exports.selectCategorical = function selectCategorical(formState) {
	var obj = {
		descriptionPlaceholder: 'Who will win the Four Nations Rugby Championship in 2016?',
		descriptionMinLength: _marketValuesConstraints.DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: _marketValuesConstraints.DESCRIPTION_MAX_LENGTH,
		categoricalOutcomesMinNum: _marketValuesConstraints.CATEGORICAL_OUTCOMES_MIN_NUM,
		categoricalOutcomesMaxNum: _marketValuesConstraints.CATEGORICAL_OUTCOMES_MAX_NUM,
		categoricalOutcomeMaxLength: _marketValuesConstraints.CATEGORICAL_OUTCOME_MAX_LENGTH
	};
	return obj;
};

var selectScalar = exports.selectScalar = function selectScalar(formState) {
	var obj = {
		descriptionPlaceholder: 'What will the temperature (in degrees Fahrenheit)' + ' be in San Francisco, California, on July 1, 2016?',
		descriptionMinLength: _marketValuesConstraints.DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: _marketValuesConstraints.DESCRIPTION_MAX_LENGTH,
		scalarSmallNum: formState.scalarSmallNum,
		scalarBigNum: formState.scalarBigNum
	};
	return obj;
};

var selectCombinatorial = exports.selectCombinatorial = function selectCombinatorial(formState) {
	var obj = {
		descriptionPlaceholder: 'Combinatorial',
		descriptionMinLength: _marketValuesConstraints.DESCRIPTION_MIN_LENGTH,
		descriptionMaxLength: _marketValuesConstraints.DESCRIPTION_MAX_LENGTH
	};
	return obj;
};

var initialFairPrices = exports.initialFairPrices = function initialFairPrices(formState) {
	if (!!!formState.initialFairPrices || formState.type != formState.initialFairPrices.type) {
		return {
			initialFairPrices: {
				type: formState.type,
				values: [],
				raw: []
			}
		};
	}
};

var isValid = exports.isValid = function isValid(formState) {
	if ((0, _validateDescription2.default)(formState.description)) {
		return false;
	}

	if ((0, _validateEndDate2.default)(formState.endDate)) {
		return false;
	}

	switch (formState.type) {
		case _marketTypes.CATEGORICAL:
			if ((0, _validateCategoricalOutcomes2.default)(formState.categoricalOutcomes).some(function (error) {
				return !!error;
			})) {
				return false;
			}
			break;
		case _marketTypes.SCALAR:
			if ((0, _validateScalarSmallNum2.default)(formState.scalarSmallNum, formState.scalarBigNum)) {
				return false;
			}
			if ((0, _validateScalarBigNum2.default)(formState.scalarSmallNum, formState.scalarBigNum)) {
				return false;
			}
			break;
		case _marketTypes.COMBINATORIAL:
			break;
		default:
			break;
	}

	return true;
};

var errors = exports.errors = function errors(formState) {
	var errs = {};

	if (formState.description !== undefined) {
		errs.description = (0, _validateDescription2.default)(formState.description);
	}

	if (formState.endDate !== undefined) {
		errs.endDate = (0, _validateEndDate2.default)(formState.endDate);
	}

	switch (formState.type) {
		case _marketTypes.CATEGORICAL:
			if (formState.categoricalOutcomes && formState.categoricalOutcomes.some(function (val) {
				return !!val;
			})) {
				errs.categoricalOutcomes = (0, _validateCategoricalOutcomes2.default)(formState.categoricalOutcomes);
			}
			break;
		case _marketTypes.SCALAR:
			if (formState.scalarSmallNum !== undefined) {
				errs.scalarSmallNum = (0, _validateScalarSmallNum2.default)(formState.scalarSmallNum, formState.scalarBigNum);
			}
			if (formState.scalarBigNum !== undefined) {
				errs.scalarBigNum = (0, _validateScalarBigNum2.default)(formState.scalarSmallNum, formState.scalarBigNum);
			}
			break;
		case _marketTypes.COMBINATORIAL:
			break;
		default:
			break;
	}

	return errs;
};

},{"../../../create-market/constants/market-values-constraints":58,"../../../market/validators/validate-categorical-outcomes":75,"../../../market/validators/validate-description":76,"../../../market/validators/validate-end-date":77,"../../../market/validators/validate-scalar-big-num":78,"../../../market/validators/validate-scalar-small-num":79,"../../../markets/constants/market-types":93}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.errors = exports.isValid = exports.validateExpirySourceUrl = exports.validateExpirySource = exports.select = undefined;

var _marketValuesConstraints = require('../../../create-market/constants/market-values-constraints');

// import { FAILED } from '../../../transactions/constants/statuses';

var select = exports.select = function select(formState) {
	var obj = {
		tagsMaxNum: _marketValuesConstraints.TAGS_MAX_NUM,
		tagMaxLength: _marketValuesConstraints.TAGS_MAX_LENGTH,
		resourcesMaxNum: _marketValuesConstraints.RESOURCES_MAX_NUM,
		resourceMaxLength: _marketValuesConstraints.RESOURCES_MAX_LENGTH
	};
	return obj;
};

var validateExpirySource = exports.validateExpirySource = function validateExpirySource(expirySource) {
	if (!expirySource || [_marketValuesConstraints.EXPIRY_SOURCE_GENERIC, _marketValuesConstraints.EXPIRY_SOURCE_SPECIFIC].indexOf(expirySource) < 0) {
		return 'Please choose an expiry source';
	}
};

var validateExpirySourceUrl = exports.validateExpirySourceUrl = function validateExpirySourceUrl(expirySourceUrl, expirySource) {
	if (expirySource === _marketValuesConstraints.EXPIRY_SOURCE_SPECIFIC && (!expirySourceUrl || !expirySourceUrl.length)) {
		return 'Please enter the full URL of the website';
	}
};

var isValid = exports.isValid = function isValid(formState) {
	if (validateExpirySource(formState.expirySource)) {
		return false;
	}

	if (validateExpirySourceUrl(formState.expirySourceUrl, formState.expirySource)) {
		return false;
	}

	return true;
};

var errors = exports.errors = function errors(formState) {
	var errs = {};

	if (formState.expirySource !== undefined) {
		errs.expirySource = validateExpirySource(formState.expirySource);
	}

	if (formState.endDate !== undefined) {
		errs.expirySourceUrl = validateExpirySourceUrl(formState.expirySourceUrl, formState.expirySource);
	}

	return errs;
};

},{"../../../create-market/constants/market-values-constraints":58}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.errors = exports.isValid = exports.validatePriceWidth = exports.validateStartingQuantity = exports.validateBestStartingQuantity = exports.validateInitialFairPrices = exports.validateInitialLiquidity = exports.validateMakerFee = exports.validateTradingFee = exports.initialFairPrices = exports.select = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _formatNumber = require('../../../../utils/format-number');

var _marketTypes = require('../../../markets/constants/market-types');

var _marketValuesConstraints = require('../../../create-market/constants/market-values-constraints');

var select = exports.select = function select(formState) {
	var obj = {
		tradingFeePercent: formState.tradingFeePercent || _marketValuesConstraints.TRADING_FEE_DEFAULT,
		makerFee: formState.makerFee || _marketValuesConstraints.MAKER_FEE_DEFAULT,
		initialLiquidity: formState.initialLiquidity || _marketValuesConstraints.INITIAL_LIQUIDITY_DEFAULT,
		initialFairPrices: !!formState.initialFairPrices.raw.length ? formState.initialFairPrices : _extends({}, formState.initialFairPrices, initialFairPrices(formState)),
		startingQuantity: formState.startingQuantity || _marketValuesConstraints.STARTING_QUANTITY_DEFAULT,
		bestStartingQuantity: formState.bestStartingQuantity || _marketValuesConstraints.BEST_STARTING_QUANTITY_DEFAULT,
		priceWidth: formState.priceWidth || _marketValuesConstraints.PRICE_WIDTH_DEFAULT,
		halfPriceWidth: !!formState.priceWidth ? parseFloat(formState.priceWidth) / 2 : _marketValuesConstraints.PRICE_WIDTH_DEFAULT / 2,
		priceDepth: _marketValuesConstraints.PRICE_DEPTH_DEFAULT,
		isSimulation: formState.isSimulation || _marketValuesConstraints.IS_SIMULATION
	};

	return obj;
};

var initialFairPrices = exports.initialFairPrices = function initialFairPrices(formState) {
	var setInitialFairPrices = function setInitialFairPrices(labels) {
		var halfPriceWidth = _marketValuesConstraints.PRICE_WIDTH_DEFAULT / 2,
		    defaultValue = formState.type === _marketTypes.SCALAR ? // Sets the initialFairPrices to midpoint of min/max
		(parseFloat(formState.scalarBigNum) + halfPriceWidth + (parseFloat(formState.scalarSmallNum) - halfPriceWidth)) / 2 : (1 - halfPriceWidth + halfPriceWidth) / 2;

		var values = [],
		    raw = [];

		labels.map(function (cV, i) {
			values[i] = {
				label: cV,
				value: defaultValue
			};
			raw[i] = defaultValue;
		});

		return { values: values, raw: raw };
	};

	switch (formState.type) {
		case _marketTypes.BINARY:
			return setInitialFairPrices(['Yes', 'No']);
		case _marketTypes.SCALAR:
			return setInitialFairPrices(['⇧', '⇩']);
		case _marketTypes.CATEGORICAL:
			var labels = [];

			formState.categoricalOutcomes.map(function (val, i) {
				labels[i] = val;
			});

			return setInitialFairPrices(labels);

		default:
			break;
	}
};

var validateTradingFee = exports.validateTradingFee = function validateTradingFee(tradingFeePercent) {
	var parsed = parseFloat(tradingFeePercent);

	if (!tradingFeePercent) return 'Please specify a trading fee %';
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) return 'Trading fee must be a number';
	if (parsed < _marketValuesConstraints.TRADING_FEE_MIN || parsed > _marketValuesConstraints.TRADING_FEE_MAX) return 'Trading fee must be between ' + (0, _formatNumber.formatPercent)(_marketValuesConstraints.TRADING_FEE_MIN, true).full + ' and ' + (0, _formatNumber.formatPercent)(_marketValuesConstraints.TRADING_FEE_MAX, true).full;
};

var validateMakerFee = exports.validateMakerFee = function validateMakerFee(makerFee) {
	var parsed = parseFloat(makerFee);

	if (!makerFee) return 'Please specify a maker fee %';
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) return 'Maker fee must be as number';
	if (parsed < _marketValuesConstraints.MAKER_FEE_MIN || parsed > _marketValuesConstraints.MAKER_FEE_MAX) return 'Maker fee must be between ' + (0, _formatNumber.formatPercent)(_marketValuesConstraints.MAKER_FEE_MIN, true).full + ' and ' + (0, _formatNumber.formatPercent)(_marketValuesConstraints.MAKER_FEE_MAX, true).full;
};

var validateInitialLiquidity = exports.validateInitialLiquidity = function validateInitialLiquidity(type, liquidity, start, best, halfWidth, scalarMin, scalarMax) {
	var parsed = parseFloat(liquidity),
	    priceDepth = type === _marketTypes.SCALAR ? parseFloat(start) * (parseFloat(scalarMin) + parseFloat(scalarMax) - halfWidth) / (parseFloat(liquidity) - 2 * parseFloat(best)) : parseFloat(start) * (1 - halfWidth) / (parseFloat(liquidity) - 2 * parseFloat(best));

	if (!liquidity) return 'Please provide some initial liquidity';
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) return 'Initial liquidity must be numeric';
	if (priceDepth < 0 || !Number.isFinite(priceDepth)) return 'Insufficient liquidity based on advanced parameters';
	if (parsed < _marketValuesConstraints.INITIAL_LIQUIDITY_MIN) return 'Initial liquidity must be at least ' + (0, _formatNumber.formatEther)(_marketValuesConstraints.INITIAL_LIQUIDITY_MIN).full;
};

var validateInitialFairPrices = exports.validateInitialFairPrices = function validateInitialFairPrices(type, initialFairPrices, width, halfWidth, scalarMin, scalarMax) {
	// -- Constraints --
	// 	Binary + Categorical:
	//		min: priceWidth / 2
	//  	max: 1 - (priceWidth / 2)
	// 	Scalar:
	// 		min: scalarMin + (priceWidth / 2)
	// 		max: scalarMax - (priceWidth / 2)

	var max = type === _marketTypes.SCALAR ? parseFloat(scalarMax) - halfWidth : 1 - halfWidth,
	    min = type === _marketTypes.SCALAR ? parseFloat(scalarMin) + halfWidth : halfWidth;

	var fairPriceErrors = {};

	initialFairPrices.map(function (cV, i) {
		var parsed = parseFloat(cV);

		if (!cV) fairPriceErrors['' + i] = 'Please provide some initial liquidity';
		if (Number.isNaN(parsed) && !Number.isFinite(parsed)) fairPriceErrors['' + i] = 'Initial liquidity must be numeric';
		if (cV < min || cV > max) fairPriceErrors['' + i] = 'Initial prices must be between ' + min + ' - ' + max + ' based on the price width of ' + width;
	});

	if (!!Object.keys(fairPriceErrors).length) return fairPriceErrors;
};

var validateBestStartingQuantity = exports.validateBestStartingQuantity = function validateBestStartingQuantity(bestStartingQuantity) {
	var parsed = parseFloat(bestStartingQuantity);

	if (!bestStartingQuantity) return 'Please provide a best starting quantity';
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) return 'Best starting quantity must be numeric';
	if (parsed < _marketValuesConstraints.BEST_STARTING_QUANTITY_MIN) return 'Starting quantity must be at least ' + (0, _formatNumber.formatShares)(_marketValuesConstraints.BEST_STARTING_QUANTITY_MIN).full;
};

var validateStartingQuantity = exports.validateStartingQuantity = function validateStartingQuantity(startingQuantity) {
	var parsed = parseFloat(startingQuantity);

	if (!startingQuantity) return 'Please provide a starting quantity';
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) return 'Starting quantity must be numeric';
	if (parsed < _marketValuesConstraints.STARTING_QUANTITY_MIN) return 'Starting quantity must be at least ' + (0, _formatNumber.formatShares)(_marketValuesConstraints.STARTING_QUANTITY_MIN).full;
};

var validatePriceWidth = exports.validatePriceWidth = function validatePriceWidth(priceWidth) {
	var parsed = parseFloat(priceWidth);

	if (!priceWidth) return 'Please provide a price width';
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) return 'Price width must be numeric';
	if (parsed < _marketValuesConstraints.PRICE_WIDTH_MIN) {
		return 'Price width must be at least ' + (0, _formatNumber.formatEther)(_marketValuesConstraints.PRICE_WIDTH_MIN).full;
	}
};

var isValid = exports.isValid = function isValid(formState) {
	if (validateTradingFee(formState.tradingFeePercent) || validateMakerFee(formState.makerFee) || validateInitialLiquidity(formState.type, formState.initialLiquidity, formState.startingQuantity, formState.bestStartingQuantity, formState.halfPriceWidth, formState.scalarSmallNum, formState.scalarBigNum) || validateInitialFairPrices(formState.type, formState.initialFairPrices.raw, formState.priceWidth, formState.halfPriceWidth, formState.scalarSmallNum, formState.scalarBigNum) || validateBestStartingQuantity(formState.bestStartingQuantity) || validateStartingQuantity(formState.startingQuantity) || validatePriceWidth(formState.priceWidth)) return false;

	return true;
};

var errors = exports.errors = function errors(formState) {
	var errs = {};

	if (formState.hasOwnProperty('tradingFeePercent')) errs.tradingFeePercent = validateTradingFee(formState.tradingFeePercent);
	if (formState.hasOwnProperty('makerFeePercent')) errs.makerFee = validateMakerFee(formState.makerFee);
	if (formState.hasOwnProperty('initialLiquidity')) errs.initialLiquidity = validateInitialLiquidity(formState.type, formState.initialLiquidity, formState.startingQuantity, formState.bestStartingQuantity, formState.halfPriceWidth, formState.scalarSmallNum, formState.scalarBigNum);
	if (formState.hasOwnProperty('initialFairPrices')) errs.initialFairPrice = validateInitialFairPrices(formState.type, formState.initialFairPrices.raw, formState.priceWidth, formState.halfPriceWidth, formState.scalarSmallNum, formState.scalarBigNum);
	if (formState.hasOwnProperty('bestStartingQuantity')) errs.bestStartingQuantity = validateBestStartingQuantity(formState.bestStartingQuantity);
	if (formState.hasOwnProperty('startingQuantity')) errs.startingQuantity = validateStartingQuantity(formState.startingQuantity);
	if (formState.hasOwnProperty('priceWidth')) errs.priceWidth = validatePriceWidth(formState.priceWidth);

	return errs;
};

},{"../../../../utils/format-number":160,"../../../create-market/constants/market-values-constraints":58,"../../../markets/constants/market-types":93}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectOutcomesFromForm = exports.selectEndBlockFromEndDate = exports.select = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _formatNumber = require('../../../../utils/format-number');

var _formatDate = require('../../../../utils/format-date');

var _network = require('../../../app/constants/network');

var _marketTypes = require('../../../markets/constants/market-types');

var _marketValuesConstraints = require('../../../create-market/constants/market-values-constraints');

var _submitNewMarket = require('../../../create-market/actions/submit-new-market');

var select = exports.select = function select(formState, currentBlockNumber, currentBlockMillisSinceEpoch, dispatch) {
	var o = _extends({}, formState);

	o.type = formState.type;
	o.endDate = (0, _formatDate.formatDate)(formState.endDate);
	o.endBlock = selectEndBlockFromEndDate(formState.endDate.getTime(), currentBlockNumber, currentBlockMillisSinceEpoch);

	o.tradingFee = formState.tradingFeePercent / 100;
	o.tradingFeePercent = (0, _formatNumber.formatPercent)(formState.tradingFeePercent);
	o.makerFee = formState.makerFee / 100;
	o.makerFeePercent = (0, _formatNumber.formatPercent)(formState.makerFee);
	o.takerFeePercent = (0, _formatNumber.formatPercent)(100 - formState.makerFee);
	o.volume = (0, _formatNumber.formatNumber)(0);
	o.expirySource = formState.expirySource === _marketValuesConstraints.EXPIRY_SOURCE_SPECIFIC ? formState.expirySourceUrl : formState.expirySource;

	o.outcomes = selectOutcomesFromForm(formState.type, formState.categoricalOutcomes, formState.scalarSmallNum, formState.scalarBigNum);
	o.isFavorite = false;

	var formattedFairPrices = [];

	o.initialFairPrices.values.map(function (cV, i) {
		formattedFairPrices[i] = (0, _formatNumber.formatNumber)(cV.value, { decimals: 2, minimized: true, denomination: 'ETH | ' + cV.label });
	});

	o.initialFairPrices = _extends({}, o.initialFairPrices, {
		formatted: formattedFairPrices
	});

	o.bestStartingQuantityFormatted = (0, _formatNumber.formatNumber)(o.bestStartingQuantity, { denomination: 'Shares' });
	o.startingQuantityFormatted = (0, _formatNumber.formatNumber)(o.startingQuantity, { denomination: 'Shares' });
	o.priceWidthFormatted = (0, _formatNumber.formatNumber)(o.priceWidth, { decimals: 2, minimized: true, denomination: 'ETH' });

	o.onSubmit = function () {
		return dispatch((0, _submitNewMarket.submitNewMarket)(o));
	};

	return o;
};

var selectEndBlockFromEndDate = exports.selectEndBlockFromEndDate = function selectEndBlockFromEndDate(endDateMillisSinceEpoch, currentBlockNumber, currentBlockMillisSinceEpoch) {
	return currentBlockNumber + Math.ceil((endDateMillisSinceEpoch - currentBlockMillisSinceEpoch) / _network.MILLIS_PER_BLOCK);
};

var selectOutcomesFromForm = exports.selectOutcomesFromForm = function selectOutcomesFromForm(type, categoricalOutcomes, scalarSmallNum, scalarBigNum) {
	switch (type) {
		case _marketTypes.BINARY:
			return [{ id: 1, name: 'No' }, { id: 2, name: 'Yes' }];
		case _marketTypes.CATEGORICAL:
			return categoricalOutcomes.map(function (outcome, i) {
				var obj = { id: i, name: outcome };
				return obj;
			});
		case _marketTypes.SCALAR:
			return [{ id: 1, name: scalarSmallNum }, { id: 2, name: scalarBigNum }];
		default:
			break;
	}
};

},{"../../../../utils/format-date":159,"../../../../utils/format-number":160,"../../../app/constants/network":33,"../../../create-market/actions/submit-new-market":56,"../../../create-market/constants/market-values-constraints":58,"../../../markets/constants/market-types":93}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SHOW_LINK = undefined;
exports.showLink = showLink;
exports.showPreviousLink = showPreviousLink;

var _parseUrl = require('../../../utils/parse-url');

var _loadFullMarket = require('../../market/actions/load-full-market');

var SHOW_LINK = exports.SHOW_LINK = 'SHOW_LINK';

/**
 * @param {String} url URL to display in address bar
 * @param {=Object} options
 * @return {Function}
 */
function showLink(url) {
	var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	return function (dispatch, getState) {
		dispatch({ type: SHOW_LINK, parsedURL: (0, _parseUrl.parseURL)(url) });

		var _getState = getState();

		var selectedMarketID = _getState.selectedMarketID;
		var connection = _getState.connection;

		if (selectedMarketID != null && connection.isConnected) {
			dispatch((0, _loadFullMarket.loadFullMarket)(selectedMarketID));
		}

		if (url !== window.location.pathname + window.location.search) {
			window.history.pushState(null, null, url);
		}
		if (!options.preventScrollTop) {
			window.scrollTo(0, 0);
		}
	};
}

function showPreviousLink(url) {
	return function (dispatch) {
		dispatch({ type: SHOW_LINK, parsedURL: (0, _parseUrl.parseURL)(url) });
		window.scrollTo(0, 0);
	};
}

},{"../../../utils/parse-url":163,"../../market/actions/load-full-market":69}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Author: priecint
 */
var SEARCH_PARAM_NAME = exports.SEARCH_PARAM_NAME = 'search';
var SORT_PARAM_NAME = exports.SORT_PARAM_NAME = 'sort';
var PAGE_PARAM_NAME = exports.PAGE_PARAM_NAME = 'page';
var TAGS_PARAM_NAME = exports.TAGS_PARAM_NAME = 'tags';
var FILTERS_PARAM_NAME = exports.FILTERS_PARAM_NAME = 'filters';

},{}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AUTH_PATHS = exports.PATHS_AUTH = exports.PAGES_PATHS = exports.PATHS_PAGES = undefined;

var _pages = require('../../app/constants/pages');

var _authTypes = require('../../auth/constants/auth-types');

var PATHS_PAGES = exports.PATHS_PAGES = {
	'/': _pages.MARKETS,
	'/make': _pages.MAKE,
	'/positions': _pages.POSITIONS,
	'/transactions': _pages.TRANSACTIONS,
	'/register': _authTypes.REGISTER,
	'/login': _authTypes.LOGIN,
	'/m': _pages.M
};

var PAGES_PATHS = exports.PAGES_PATHS = Object.keys(PATHS_PAGES).reduce(function (finalObj, key) {
	finalObj[PATHS_PAGES[key]] = key;
	return finalObj;
}, {});

var PATHS_AUTH = exports.PATHS_AUTH = {
	'/register': _authTypes.REGISTER,
	'/login': _authTypes.LOGIN
};

var AUTH_PATHS = exports.AUTH_PATHS = Object.keys(PATHS_AUTH).reduce(function (finalObj, key) {
	finalObj[PATHS_AUTH[key]] = key;
	return finalObj;
}, {});

},{"../../app/constants/pages":34,"../../auth/constants/auth-types":47}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectCreateMarketLink = exports.selectTransactionsLink = exports.selectPositionsLink = exports.selectMarketLink = exports.selectMarketsLink = exports.selectAuthLink = exports.selectPreviousLink = undefined;

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var
	// import * as selectors from '../../../selectors';

	keywords = _store$getState.keywords;
	var selectedFilters = _store$getState.selectedFilters;
	var selectedSort = _store$getState.selectedSort;
	var selectedTags = _store$getState.selectedTags;
	var pagination = _store$getState.pagination;
	var loginAccount = _store$getState.loginAccount;

	var _require = require('../../../selectors');

	var market = _require.market;


	return {
		authLink: selectAuthLink(loginAccount.id ? _authTypes.LOGIN : _authTypes.REGISTER, !!loginAccount.id, _store2.default.dispatch),
		createMarketLink: selectCreateMarketLink(_store2.default.dispatch),
		marketsLink: selectMarketsLink(keywords, selectedFilters, selectedSort, selectedTags, pagination.selectedPageNum, _store2.default.dispatch),
		positionsLink: selectPositionsLink(_store2.default.dispatch),
		transactionsLink: selectTransactionsLink(_store2.default.dispatch),
		marketLink: selectMarketLink(market, _store2.default.dispatch),
		previousLink: selectPreviousLink(_store2.default.dispatch)
	};
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _listWordsUnderLength = require('../../../utils/list-words-under-length');

var _parseUrl = require('../../../utils/parse-url');

var _paths = require('../../link/constants/paths');

var _pages = require('../../app/constants/pages');

var _authTypes = require('../../auth/constants/auth-types');

var _paramNames = require('../../link/constants/param-names');

var _sort = require('../../markets/constants/sort');

var _showLink = require('../../link/actions/show-link');

var _logout = require('../../auth/actions/logout');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectPreviousLink = exports.selectPreviousLink = (0, _memoizerific2.default)(1)(function (dispatch) {
	var obj = {
		href: _paths.PAGES_PATHS[_pages.MARKETS],
		onClick: function onClick(href) {
			return dispatch((0, _showLink.showPreviousLink)(href));
		}
	};
	return obj;
});

var selectAuthLink = exports.selectAuthLink = (0, _memoizerific2.default)(1)(function (authType, alsoLogout, dispatch) {
	var href = _paths.PAGES_PATHS[authType];
	return {
		href: href,
		onClick: function onClick() {
			if (!!alsoLogout) {
				dispatch((0, _logout.logout)());
			}
			dispatch((0, _showLink.showLink)(href));
		}
	};
});

var selectMarketsLink = exports.selectMarketsLink = (0, _memoizerific2.default)(1)(function (keywords, selectedFilters, selectedSort, selectedTags, selectedPageNum, dispatch) {
	var params = {};

	// search
	if (keywords != null && keywords.length > 0) {
		params[_paramNames.SEARCH_PARAM_NAME] = keywords;
	}

	// sort
	if (selectedSort.prop !== _sort.DEFAULT_SORT_PROP || selectedSort.isDesc !== _sort.DEFAULT_IS_SORT_DESC) {
		params[_paramNames.SORT_PARAM_NAME] = selectedSort.prop + '|' + selectedSort.isDesc;
	}

	// pagination
	if (selectedPageNum > 1) {
		params[_paramNames.PAGE_PARAM_NAME] = selectedPageNum;
	}

	// status and type filters
	var filtersParams = Object.keys(selectedFilters).filter(function (filter) {
		return !!selectedFilters[filter];
	}).join(',');
	if (filtersParams.length) {
		params[_paramNames.FILTERS_PARAM_NAME] = filtersParams;
	}

	// tags
	var tagsParams = Object.keys(selectedTags).filter(function (tag) {
		return !!selectedTags[tag];
	}).join(',');
	if (tagsParams.length) {
		params[_paramNames.TAGS_PARAM_NAME] = tagsParams;
	}

	var href = (0, _parseUrl.makeLocation)([_paths.PAGES_PATHS[_pages.MARKETS]], params).url;

	return {
		href: href,
		onClick: function onClick() {
			return dispatch((0, _showLink.showLink)(href));
		}
	};
});

var selectMarketLink = exports.selectMarketLink = (0, _memoizerific2.default)(1)(function (market, dispatch) {
	var words = (0, _listWordsUnderLength.listWordsUnderLength)(market.description, 300).map(function (word) {
		return encodeURIComponent(word);
	}).join('_');
	var href = _paths.PAGES_PATHS[_pages.M] + '/' + words + '_' + market.id;
	var link = {
		href: href,
		onClick: function onClick() {
			return dispatch((0, _showLink.showLink)(href));
		}
	};

	if (market.isReported) {
		link.text = 'Reported';
		link.className = 'reported';
	} else if (market.isMissedReport) {
		link.text = 'Missed Report';
		link.className = 'missed-report';
	} else if (market.isPendingReport) {
		link.text = 'Report';
		link.className = 'report';
	} else if (!market.isOpen) {
		link.text = 'View';
		link.className = 'view';
	} else {
		link.text = 'Trade';
		link.className = 'trade';
	}

	return link;
});

var selectPositionsLink = exports.selectPositionsLink = (0, _memoizerific2.default)(1)(function (dispatch) {
	var href = _paths.PAGES_PATHS[_pages.POSITIONS];
	return {
		href: href,
		onClick: function onClick() {
			return dispatch((0, _showLink.showLink)(href));
		}
	};
});

var selectTransactionsLink = exports.selectTransactionsLink = (0, _memoizerific2.default)(1)(function (dispatch) {
	var href = _paths.PAGES_PATHS[_pages.TRANSACTIONS];
	return {
		href: href,
		onClick: function onClick() {
			return dispatch((0, _showLink.showLink)(href));
		}
	};
});

var selectCreateMarketLink = exports.selectCreateMarketLink = (0, _memoizerific2.default)(1)(function (dispatch) {
	var href = _paths.PAGES_PATHS[_pages.MAKE];
	return {
		href: href,
		onClick: function onClick() {
			return dispatch((0, _showLink.showLink)(href));
		}
	};
});

},{"../../../selectors":153,"../../../store":155,"../../../utils/list-words-under-length":162,"../../../utils/parse-url":163,"../../app/constants/pages":34,"../../auth/actions/logout":43,"../../auth/constants/auth-types":47,"../../link/actions/show-link":65,"../../link/constants/param-names":66,"../../link/constants/paths":67,"../../markets/constants/sort":96,"memoizerific":11}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadFullMarket = loadFullMarket;

var _loadMarket = require('../../market/actions/load-market');

var _loadPriceHistory = require('../../market/actions/load-price-history');

function loadFullMarket(marketId) {
	return function (dispatch, getState) {
		var _getState = getState();

		var marketsData = _getState.marketsData;
		// load price history, and other non-basic market details here, dispatching
		// the necessary actions to save each part in relevant state

		var loadDetails = function loadDetails() {
			return dispatch((0, _loadPriceHistory.loadPriceHistory)(marketId));
		};

		// if the basic data hasn't loaded yet, load it first
		if (!marketsData[marketId]) {
			dispatch((0, _loadMarket.loadMarket)(marketId, loadDetails));
		} else {
			// if the basic data is already loaded, just load the details
			loadDetails();
		}
	};
}

},{"../../market/actions/load-market":70,"../../market/actions/load-price-history":71}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadMarket = loadMarket;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _updateMarketsData2 = require('../../markets/actions/update-markets-data');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function loadMarket(marketID, cb) {
	return function (dispatch, getState) {
		AugurJS.loadMarket(marketID, function (err, marketData) {
			if (err) {
				console.info('ERROR: loadMarket()', err);
				return cb && cb();
			}
			if (marketData) {
				dispatch((0, _updateMarketsData2.updateMarketsData)(_defineProperty({}, marketID, marketData)));
			}
			return cb && cb();
		});
	};
}

},{"../../../services/augurjs":154,"../../markets/actions/update-markets-data":86}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadPriceHistory = loadPriceHistory;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _updateMarketPriceHistory = require('../../market/actions/update-market-price-history');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function loadPriceHistory(marketID) {
	return function (dispatch, getState) {
		AugurJS.loadPriceHistory(marketID, function (err, priceHistory) {
			if (err) {
				return console.info('ERROR: loadPriceHistory()', err);
			}
			dispatch((0, _updateMarketPriceHistory.updateMarketPriceHistory)(marketID, priceHistory));
		});
	};
}

},{"../../../services/augurjs":154,"../../market/actions/update-market-price-history":72}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMarketPriceHistory = updateMarketPriceHistory;
/*
 * Author: priecint
 */

var UPDATE_MARKET_PRICE_HISTORY = exports.UPDATE_MARKET_PRICE_HISTORY = 'UPDATE_MARKET_PRICE_HISTORY';

function updateMarketPriceHistory(marketID, priceHistory) {
  return { type: UPDATE_MARKET_PRICE_HISTORY, marketID: marketID, priceHistory: priceHistory };
}

},{}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.assembleMarket = exports.selectMarketFromEventID = exports.selectMarket = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                  This is one of the most important and sensitive selectors in the app.
                                                                                                                                                                                                                                                                  It builds the fat, heavy, rigid, hierarchical market objects,
                                                                                                                                                                                                                                                                  that are used to render and display many parts of the ui.
                                                                                                                                                                                                                                                                  This is the point where the shallow, light, loose, flexible, independent
                                                                                                                                                                                                                                                                  pieces of state come together to make each market.
                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                  IMPORTANT
                                                                                                                                                                                                                                                                  The assembleMarket() function (where all the action happens) is heavily
                                                                                                                                                                                                                                                                   memoized, and performance sensitive.
                                                                                                                                                                                                                                                                  Doing things sub-optimally here will cause noticeable performance degradation in the app.
                                                                                                                                                                                                                                                                  The "trick" is to maximize memoization cache hits as much a spossible, and not have assembleMarket()
                                                                                                                                                                                                                                                                  run any more than it has to.
                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                  To achieve that, we pass in the minimum number of the shallowest arguments possible.
                                                                                                                                                                                                                                                                  For example, instead of passing in the entire `favorites` collection and letting the
                                                                                                                                                                                                                                                                  function find the one it needs for the market, we instead find the specific fvorite
                                                                                                                                                                                                                                                                  for that market in advance, and only pass in a boolean: `!!favorites[marketID]`
                                                                                                                                                                                                                                                                  That way the market only gets re-assembled when that specific favorite changes.
                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                  This is true for all selectors, but especially important for this one.
                                                                                                                                                                                                                                                                  */

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var selectedMarketID = _store$getState.selectedMarketID;

	return selectMarket(selectedMarketID);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _formatNumber = require('../../../utils/format-number');

var _formatDate = require('../../../utils/format-date');

var _isMarketDataOpen = require('../../../utils/is-market-data-open');

var _marketTypes = require('../../markets/constants/market-types');

var _marketOutcomes = require('../../markets/constants/market-outcomes');

var _updateFavorites = require('../../markets/actions/update-favorites');

var _placeTrade = require('../../trade/actions/place-trade');

var _updateTradesInProgress = require('../../trade/actions/update-trades-in-progress');

var _submitReport = require('../../reports/actions/submit-report');

var _toggleTag = require('../../markets/actions/toggle-tag');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

var _links = require('../../link/selectors/links');

var _tradeOrders = require('../../trade/selectors/trade-orders');

var _tradeSummary = require('../../trade/selectors/trade-summary');

var _positionsSummary = require('../../positions/selectors/positions-summary');

var _priceTimeSeries = require('../../market/selectors/price-time-series');

var _position = require('../../positions/selectors/position');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectMarket = exports.selectMarket = function selectMarket(marketID) {
	var _store$getState2 = _store2.default.getState();

	var marketsData = _store$getState2.marketsData;
	var favorites = _store$getState2.favorites;
	var reports = _store$getState2.reports;
	var outcomes = _store$getState2.outcomes;
	var accountTrades = _store$getState2.accountTrades;
	var tradesInProgress = _store$getState2.tradesInProgress;
	var blockchain = _store$getState2.blockchain;
	var priceHistory = _store$getState2.priceHistory;


	if (!marketID || !marketsData || !marketsData[marketID]) {
		return {};
	}

	var endDate = new Date(marketsData[marketID].endDate * 1000 || 0);

	return assembleMarket(marketID, marketsData[marketID], priceHistory[marketID], (0, _isMarketDataOpen.isMarketDataOpen)(marketsData[marketID], blockchain && blockchain.currentBlockNumber), !!favorites[marketID], outcomes[marketID], reports[marketsData[marketID].eventID], accountTrades[marketID], tradesInProgress[marketID],

	// the reason we pass in the date parts broken up like this, is because date objects are never equal, thereby always triggering re-assembly, and never hitting the memoization cache
	endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), blockchain && blockchain.isReportConfirmationPhase, _store2.default.dispatch);
};

var selectMarketFromEventID = exports.selectMarketFromEventID = function selectMarketFromEventID(eventID) {
	var _store$getState3 = _store2.default.getState();

	var marketsData = _store$getState3.marketsData;

	return selectMarket(Object.keys(marketsData).find(function (marketID) {
		return marketsData[marketID].eventID === eventID;
	}));
};

var assembleMarket = exports.assembleMarket = (0, _memoizerific2.default)(1000)(function (marketID, marketData, marketPriceHistory, isOpen, isFavorite, marketOutcomes, marketReport, marketAccountTrades, marketTradeInProgress, endDateYear, endDateMonth, endDateDay, isReportConfirmationPhase, dispatch) {
	// console.log('>>assembleMarket<<');

	var o = _extends({}, marketData, {
		id: marketID
	});
	var tradeOrders = [];
	var positions = { qtyShares: 0, totalValue: 0, totalCost: 0, list: [] };

	o.type = marketData.type;
	switch (o.type) {
		case _marketTypes.BINARY:
			o.isBinary = true;
			o.isCategorical = false;
			o.isScalar = false;
			break;
		case _marketTypes.CATEGORICAL:
			o.isBinary = false;
			o.isCategorical = true;
			o.isScalar = false;
			break;
		case _marketTypes.SCALAR:
			o.isBinary = false;
			o.isCategorical = false;
			o.isScalar = true;
			break;
		default:
			break;
	}
	o.endDate = endDateYear >= 0 && endDateMonth >= 0 && endDateDay >= 0 && (0, _formatDate.formatDate)(new Date(endDateYear, endDateMonth, endDateDay)) || null;
	o.isOpen = isOpen;
	o.isExpired = !isOpen;

	o.isFavorite = isFavorite;

	o.tradingFeePercent = (0, _formatNumber.formatPercent)(marketData.tradingFee * 100, { positiveSign: false });
	o.volume = (0, _formatNumber.formatNumber)(marketData.volume, { positiveSign: false });

	o.isRequiredToReportByAccount = !!marketReport;
	// was the user chosen to report on this market
	o.isPendingReport = o.isRequiredToReportByAccount && !marketReport.reportHash && !isReportConfirmationPhase;
	// account is required to report on this unreported market during reporting phase
	o.isReportSubmitted = o.isRequiredToReportByAccount && !!marketReport.reportHash;
	// the user submitted a report that is not yet confirmed (reportHash === true)
	o.isReported = o.isReportSubmitted && !!marketReport.reportHash.length;
	// the user fully reported on this market (reportHash === [string])
	o.isMissedReport = o.isRequiredToReportByAccount && !o.isReported && !o.isReportSubmitted && isReportConfirmationPhase;
	// the user submitted a report that is not yet confirmed
	o.isMissedOrReported = o.isMissedReport || o.isReported;

	o.marketLink = (0, _links.selectMarketLink)(o, dispatch);
	o.onClickToggleFavorite = function () {
		return dispatch((0, _updateFavorites.toggleFavorite)(marketID));
	};
	o.onSubmitPlaceTrade = function () {
		return dispatch((0, _placeTrade.placeTrade)(marketID));
	};

	o.report = _extends({}, marketReport, {
		onSubmitReport: function onSubmitReport(reportedOutcomeID, isUnethical) {
			return dispatch((0, _submitReport.submitReport)(o, reportedOutcomeID, isUnethical));
		}
	});

	o.outcomes = [];

	o.outcomes = Object.keys(marketOutcomes || {}).map(function (outcomeID) {
		var outcomeData = marketOutcomes[outcomeID];
		var outcomeTradeInProgress = marketTradeInProgress && marketTradeInProgress[outcomeID];

		var outcome = _extends({}, outcomeData, {
			id: outcomeID,
			marketID: marketID,
			lastPrice: (0, _formatNumber.formatEther)(outcomeData.price || 0, { positiveSign: false }),
			lastPricePercent: (0, _formatNumber.formatPercent)((outcomeData.price || 0) * 100, { positiveSign: false })
		});

		var outcomeTradeOrders = (0, _tradeOrders.selectOutcomeTradeOrders)(o, outcome, outcomeTradeInProgress, dispatch);

		outcome.trade = {
			numShares: outcomeTradeInProgress && outcomeTradeInProgress.numShares || 0,
			limitPrice: outcomeTradeInProgress && outcomeTradeInProgress.limitPrice || 0,
			tradeSummary: (0, _tradeSummary.selectTradeSummary)(outcomeTradeOrders),
			onChangeTrade: function onChangeTrade(numShares, limitPrice) {
				return dispatch((0, _updateTradesInProgress.updateTradesInProgress)(marketID, outcome.id, numShares, limitPrice));
			}
		};

		if (marketAccountTrades && marketAccountTrades[outcomeID]) {
			outcome.position = (0, _position.selectPositionFromOutcomeAccountTrades)(marketAccountTrades[outcomeID], outcome.price);
			if (outcome.position && outcome.position.qtyShares && outcome.position.qtyShares.value) {
				positions.qtyShares += outcome.position.qtyShares.value;
				positions.totalValue += outcome.position.totalValue.value || 0;
				positions.totalCost += outcome.position.totalCost.value || 0;
				positions.list.push(outcome);
			}
		}

		tradeOrders = tradeOrders.concat(outcomeTradeOrders);

		return outcome;
	}).sort(function (a, b) {
		return b.lastPrice.value - a.lastPrice.value || (a.name < b.name ? -1 : 1);
	});

	o.tags = (o.tags || []).map(function (tag) {
		var obj = {
			name: tag && tag.toString().toLowerCase().trim(),
			onClick: function onClick() {
				return dispatch((0, _toggleTag.toggleTag)(tag));
			}
		};
		return obj;
	}).filter(function (tag) {
		return !!tag.name;
	});

	o.priceTimeSeries = (0, _priceTimeSeries.selectPriceTimeSeries)(o.outcomes, marketPriceHistory);

	o.reportableOutcomes = o.outcomes.slice();
	o.reportableOutcomes.push({ id: _marketOutcomes.INDETERMINATE_OUTCOME_ID, name: _marketOutcomes.INDETERMINATE_OUTCOME_NAME });

	o.tradeSummary = (0, _tradeSummary.selectTradeSummary)(tradeOrders);
	o.positionsSummary = (0, _positionsSummary.selectPositionsSummary)(positions.list.length, positions.qtyShares, positions.totalValue, positions.totalCost);
	o.positionOutcomes = positions.list;

	return o;
});

},{"../../../store":155,"../../../utils/format-date":159,"../../../utils/format-number":160,"../../../utils/is-market-data-open":161,"../../link/selectors/links":68,"../../market/selectors/price-time-series":74,"../../markets/actions/toggle-tag":83,"../../markets/actions/update-favorites":84,"../../markets/constants/market-outcomes":92,"../../markets/constants/market-types":93,"../../positions/selectors/position":122,"../../positions/selectors/positions-summary":123,"../../reports/actions/submit-report":130,"../../trade/actions/place-trade":133,"../../trade/actions/update-trades-in-progress":134,"../../trade/selectors/trade-orders":136,"../../trade/selectors/trade-summary":137,"memoizerific":11}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectPriceTimeSeries = undefined;

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

var _dateToBlockToDate = require('../../../utils/date-to-block-to-date');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Prepares data structure for Highcharts
 *
 * @param {Array} outcomes List of outcomes for market
 * @param {Object} marketPriceHistory
 * @return {Array}
 */
var selectPriceTimeSeries = exports.selectPriceTimeSeries = (0, _memoizerific2.default)(1)(function (outcomes, marketPriceHistory) {
	var _store$getState = _store2.default.getState();

	var blockchain = _store$getState.blockchain;


	if (marketPriceHistory == null) {
		return [];
	}

	return outcomes.map(function (outcome) {
		var outcomePriceHistory = marketPriceHistory[outcome.id] || [];

		return {
			name: outcome.name,
			data: outcomePriceHistory.map(function (priceTimePoint) {
				return [(0, _dateToBlockToDate.blockToDate)(priceTimePoint.blockNumber, blockchain.currentBlockNumber), Number(priceTimePoint.price)];
			})
		};
	});
});

},{"../../../store":155,"../../../utils/date-to-block-to-date":158,"memoizerific":11}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (categoricalOutcomes) {
	var errors = null;

	if (!categoricalOutcomes || !categoricalOutcomes.length) {
		return [];
	}

	errors = Array(categoricalOutcomes.length);
	errors.fill('');

	categoricalOutcomes.forEach(function (outcome, i) {
		if (!outcome.length) {
			errors[i] = 'Answer cannot be blank';
		}
	});

	return errors;
};

},{}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (description) {
	if (!description || !description.length) {
		return 'Please enter your question';
	}

	if (description.length < _marketValuesConstraints.DESCRIPTION_MIN_LENGTH) {
		return 'Text must be a minimum length of ' + _marketValuesConstraints.DESCRIPTION_MIN_LENGTH;
	}

	if (description.length > _marketValuesConstraints.DESCRIPTION_MAX_LENGTH) {
		return 'Text exceeds the maximum length of ' + _marketValuesConstraints.DESCRIPTION_MAX_LENGTH;
	}

	return null;
};

var _marketValuesConstraints = require('../../create-market/constants/market-values-constraints');

},{"../../create-market/constants/market-values-constraints":58}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (endDate) {
	if (!endDate) {
		return 'Please choose an end date';
	}
	return null;
};

},{}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (scalarSmallNum, scalarBigNum) {
	var parsedBig = parseFloat(scalarBigNum);

	if (!scalarBigNum) {
		return 'Please provide a maximum value';
	}
	if (Number.isNaN(parsedBig) && !Number.isFinite(parsedBig)) {
		return 'Maximum value must be a number';
	}
	if (parseFloat(scalarSmallNum) === scalarSmallNum && parsedBig <= parseFloat(scalarSmallNum)) {
		return 'Maximum must be greater than minimum';
	}
	return null;
};

},{}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (scalarSmallNum, scalarBigNum) {
	var parsedSmall = parseFloat(scalarSmallNum);
	if (!scalarSmallNum) {
		return 'Please provide a minimum value';
	}
	if (Number.isNaN(parsedSmall) && !Number.isFinite(parsedSmall)) {
		return 'Minimum value must be a number';
	}
	if (parseFloat(scalarBigNum) === scalarBigNum && parsedSmall >= parseFloat(scalarBigNum)) {
		return 'Minimum must be less than maximum';
	}
	return null;
};

},{}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadMarketsInfo = loadMarketsInfo;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _marketTypes = require('../../markets/constants/market-types');

var _marketOutcomes = require('../../markets/constants/market-outcomes');

var _updateMarketsData = require('../../markets/actions/update-markets-data');

var _updateOutcomesData = require('../../markets/actions/update-outcomes-data');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// import { BRANCH_ID } from '../../app/constants/network';
function loadMarketsInfo(marketIDs) {
	return function (dispatch, getState) {
		AugurJS.batchGetMarketInfo(marketIDs, function (err, marketsData) {
			if (err) {
				console.error('ERROR loadMarketsInfo()', err);
				return;
			}
			if (!marketsData) {
				return;
			}

			var finalMarketsData = {};
			var finalOutcomesData = {};
			var marketData = void 0;

			Object.keys(marketsData).forEach(function (marketID) {
				marketData = marketsData[marketID];

				// parse out event, currently we only support single event markets, no combinatorial
				parseEvent(marketData);

				// transform array of outcomes into an object and add their names
				finalOutcomesData[marketID] = parseOutcomes(marketData);

				// save market (without outcomes)
				finalMarketsData[marketID] = marketData;
			});

			dispatch((0, _updateMarketsData.updateMarketsData)(finalMarketsData));
			dispatch((0, _updateOutcomesData.updateOutcomesData)(finalOutcomesData));
		});
	};

	function parseEvent(marketData) {
		if (!marketData.events || marketData.events.length !== 1) {
			console.warn('Market does not have correct number of events:', marketData);
			delete marketData.events;
			return;
		}

		var event = marketData.events[0];
		marketData.eventID = event.id;
		marketData.minValue = event.minValue;
		marketData.maxValue = event.maxValue;
		marketData.numOutcomes = event.numOutcomes;
		marketData.reportedOutcome = event.outcome;
		delete marketData.events;
	}

	function parseOutcomes(marketData) {
		if (!marketData.outcomes || !marketData.outcomes.length) {
			console.warn('Market does not have outcomes: ', marketData);
			return undefined;
		}

		var outcomes = void 0;
		var splitDescription = void 0;
		var categoricalOutcomeNames = void 0;

		switch (marketData.type) {
			case _marketTypes.BINARY:
				outcomes = marketData.outcomes.map(function (outcome) {
					if (outcome.id === _marketOutcomes.BINARY_NO_ID) {
						outcome.name = 'No';
					} else if (outcome.id === _marketOutcomes.BINARY_YES_ID) {
						outcome.name = 'Yes';
					} else {
						console.warn('Invalid outcome ID for binary market: ', outcome, marketData);
					}
					return outcome;
				});
				break;

			case _marketTypes.CATEGORICAL:
				// parse outcome names from description
				splitDescription = marketData.description.split(_marketOutcomes.CATEGORICAL_OUTCOMES_SEPARATOR);
				if (splitDescription.length < 2) {
					console.warn('Missing outcome names in description for categorical market: ', marketData);
					break;
				}

				// parse individual outcomes from outcomes string
				categoricalOutcomeNames = splitDescription.pop().split(_marketOutcomes.CATEGORICAL_OUTCOME_SEPARATOR);
				if (categoricalOutcomeNames.length !== marketData.outcomes.length) {
					console.warn('Number of outcomes parsed from description do not match number of outcomes in market for for categorical market: ', marketData);
					break;
				}

				// add names to outcomes
				outcomes = marketData.outcomes.map(function (outcome, i) {
					outcome.name = categoricalOutcomeNames[i].toString().trim();
					return outcome;
				});

				// update market description to exclude outcome names
				marketData.description = splitDescription.join();
				break;

			case _marketTypes.SCALAR:
				outcomes = marketData.outcomes.map(function (outcome) {
					if (outcome.id === _marketOutcomes.SCALAR_DOWN_ID) {
						outcome.name = '⇩';
					} else if (outcome.id === _marketOutcomes.SCALAR_UP_ID) {
						outcome.name = '⇧';
					} else {
						console.warn('Invalid outcome ID for scalar market: ', outcome, marketData);
					}
					return outcome;
				});
				break;

			default:
				console.warn('Unknown market type:', marketData.type, marketData);
				outcomes = undefined;
				break;
		}

		delete marketData.outcomes;

		return outcomes.reduce(function (p, outcome) {
			p[outcome.id] = outcome;
			delete outcome.id;
			return p;
		}, {});
	}
}

},{"../../../services/augurjs":154,"../../markets/actions/update-markets-data":86,"../../markets/actions/update-outcomes-data":88,"../../markets/constants/market-outcomes":92,"../../markets/constants/market-types":93}],81:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadMarkets = loadMarkets;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _network = require('../../app/constants/network');

var _updateMarketsData = require('../../markets/actions/update-markets-data');

var _loadMarketsInfo = require('../../markets/actions/load-markets-info');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*
import { loadReports } from '../../reports/actions/load-reports';
import { penalizeWrongReports } from '../../reports/actions/penalize-wrong-reports';
import { closeMarkets } from '../../reports/actions/close-markets';
*/

function loadMarkets() {
	var chunkSize = 10;

	return function (dispatch, getState) {
		AugurJS.loadMarkets(_network.BRANCH_ID, chunkSize, true, function (err, marketsData) {
			if (err) {
				console.log('ERROR loadMarkets()', err);
				return;
			}
			if (!marketsData) {
				console.log('WARN loadMarkets()', 'no markets data returned');
				return;
			}

			dispatch((0, _updateMarketsData.updateMarketsData)(marketsData));
			dispatch((0, _loadMarketsInfo.loadMarketsInfo)(Object.keys(marketsData)));

			/*
   dispatch(loadReports(marketsData));
   dispatch(penalizeWrongReports(marketsData));
   dispatch(closeMarkets(marketsData));
   */
		});
	};
}

},{"../../../services/augurjs":154,"../../app/constants/network":33,"../../markets/actions/load-markets-info":80,"../../markets/actions/update-markets-data":86}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TOGGLE_FILTER = undefined;
exports.toggleFilter = toggleFilter;

var _showLink = require('../../link/actions/show-link');

var TOGGLE_FILTER = exports.TOGGLE_FILTER = 'TOGGLE_FILTER';

function toggleFilter(filterID) {
	return function (dispatch, getState) {
		dispatch({ type: TOGGLE_FILTER, filterID: filterID });

		var _require = require('../../../selectors');

		var links = _require.links;

		dispatch((0, _showLink.showLink)(links.marketsLink.href, { preventScrollTop: true }));
	};
}

},{"../../../selectors":153,"../../link/actions/show-link":65}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TOGGLE_TAG = undefined;
exports.toggleTag = toggleTag;

var _showLink = require('../../link/actions/show-link');

var TOGGLE_TAG = exports.TOGGLE_TAG = 'TOGGLE_TAG';

function toggleTag(filterID) {
	return function (dispatch, getState) {
		dispatch({ type: TOGGLE_TAG, filterID: filterID });

		var _require = require('../../../selectors');

		var links = _require.links;

		dispatch((0, _showLink.showLink)(links.marketsLink.href, { preventScrollTop: true }));
	};
}

},{"../../../selectors":153,"../../link/actions/show-link":65}],84:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateFavorites = updateFavorites;
exports.toggleFavorite = toggleFavorite;
var UPDATE_FAVORITES = exports.UPDATE_FAVORITES = 'UPDATE_FAVORITES';
var TOGGLE_FAVORITE = exports.TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

function updateFavorites(favorites) {
	return { type: UPDATE_FAVORITES, favorites: favorites };
}

function toggleFavorite(marketID) {
	return { type: TOGGLE_FAVORITE, marketID: marketID };
}

},{}],85:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_KEYWORDS = undefined;
exports.updateKeywords = updateKeywords;

var _showLink = require('../../link/actions/show-link');

var UPDATE_KEYWORDS = exports.UPDATE_KEYWORDS = 'UPDATE_KEYWORDS';

function updateKeywords(keywords) {
	return function (dispatch, getState) {
		dispatch({ type: UPDATE_KEYWORDS, keywords: keywords });

		var _require = require('../../../selectors');

		var links = _require.links;

		dispatch((0, _showLink.showLink)(links.marketsLink.href, { preventScrollTop: true }));
	};
}

},{"../../../selectors":153,"../../link/actions/show-link":65}],86:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateMarketsData = updateMarketsData;
exports.updateMarketData = updateMarketData;
var UPDATE_MARKETS_DATA = exports.UPDATE_MARKETS_DATA = 'UPDATE_MARKETS_DATA';
var UPDATE_MARKET_DATA = exports.UPDATE_MARKET_DATA = 'UPDATE_MARKET_DATA';

function updateMarketsData(marketsData) {
	return { type: UPDATE_MARKETS_DATA, marketsData: marketsData };
}

function updateMarketData(marketData) {
	return { type: UPDATE_MARKET_DATA, marketData: marketData };
}

},{}],87:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateOutcomePrice = updateOutcomePrice;
var UPDATE_OUTCOME_PRICE = exports.UPDATE_OUTCOME_PRICE = 'UPDATE_OUTCOME_PRICE';

function updateOutcomePrice(marketID, outcomeID, price) {
	return { type: UPDATE_OUTCOME_PRICE, marketID: marketID, outcomeID: outcomeID, price: price };
}

},{}],88:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateOutcomesData = updateOutcomesData;
var UPDATE_OUTCOMES_DATA = exports.UPDATE_OUTCOMES_DATA = 'UPDATE_OUTCOMES_DATA';

function updateOutcomesData(outcomesData) {
	return { type: UPDATE_OUTCOMES_DATA, outcomesData: outcomesData };
}

},{}],89:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateSelectedMarketsHeader = updateSelectedMarketsHeader;
var UPDATED_SELECTED_MARKETS_HEADER = exports.UPDATED_SELECTED_MARKETS_HEADER = 'UPDATED_SELECTED_MARKETS_HEADER';

function updateSelectedMarketsHeader(selectedMarketsHeader) {
	return { type: UPDATED_SELECTED_MARKETS_HEADER, selectedMarketsHeader: selectedMarketsHeader };
}

},{}],90:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_SELECTED_PAGE_NUM = undefined;
exports.updateSelectedPageNum = updateSelectedPageNum;

var _showLink = require('../../link/actions/show-link');

var UPDATE_SELECTED_PAGE_NUM = exports.UPDATE_SELECTED_PAGE_NUM = 'UPDATE_SELECTED_PAGE_NUM';

function updateSelectedPageNum(selectedPageNum) {
	return function (dispatch, getState) {
		dispatch({ type: UPDATE_SELECTED_PAGE_NUM, selectedPageNum: selectedPageNum });

		var _require = require('../../../selectors');

		var links = _require.links;

		dispatch((0, _showLink.showLink)(links.marketsLink.href));
	};
}

},{"../../../selectors":153,"../../link/actions/show-link":65}],91:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_SELECTED_SORT = undefined;
exports.updateSelectedSort = updateSelectedSort;

var _showLink = require('../../link/actions/show-link');

var UPDATE_SELECTED_SORT = exports.UPDATE_SELECTED_SORT = 'UPDATE_SELECTED_SORT';

function updateSelectedSort(selectedSort) {
	return function (dispatch, getState) {
		dispatch({ type: UPDATE_SELECTED_SORT, selectedSort: selectedSort });

		var _require = require('../../../selectors');

		var links = _require.links;

		dispatch((0, _showLink.showLink)(links.marketsLink.href, { preventScrollTop: true }));
	};
}

},{"../../../selectors":153,"../../link/actions/show-link":65}],92:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BINARY_NO_ID = exports.BINARY_NO_ID = 1;
var BINARY_YES_ID = exports.BINARY_YES_ID = 2;

var CATEGORICAL_OUTCOMES_SEPARATOR = exports.CATEGORICAL_OUTCOMES_SEPARATOR = '~|>';
var CATEGORICAL_OUTCOME_SEPARATOR = exports.CATEGORICAL_OUTCOME_SEPARATOR = '|';

var SCALAR_DOWN_ID = exports.SCALAR_DOWN_ID = 1;
var SCALAR_UP_ID = exports.SCALAR_UP_ID = 2;

var INDETERMINATE_OUTCOME_ID = exports.INDETERMINATE_OUTCOME_ID = '1.5';
var INDETERMINATE_OUTCOME_NAME = exports.INDETERMINATE_OUTCOME_NAME = 'indeterminate';

},{}],93:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _MARKET_TYPES;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BINARY = exports.BINARY = 'binary';
var CATEGORICAL = exports.CATEGORICAL = 'categorical';
var SCALAR = exports.SCALAR = 'scalar';
var COMBINATORIAL = exports.COMBINATORIAL = 'combinatorial';

var MARKET_TYPES = exports.MARKET_TYPES = (_MARKET_TYPES = {}, _defineProperty(_MARKET_TYPES, BINARY, BINARY), _defineProperty(_MARKET_TYPES, CATEGORICAL, CATEGORICAL), _defineProperty(_MARKET_TYPES, SCALAR, SCALAR), _defineProperty(_MARKET_TYPES, COMBINATORIAL, COMBINATORIAL), _MARKET_TYPES);

},{}],94:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FAVORITES = exports.FAVORITES = 'favorites';
var PENDING_REPORTS = exports.PENDING_REPORTS = 'pending reports';

},{}],95:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Author: priecint
 */
var DEFAULT_PAGE = exports.DEFAULT_PAGE = 1;

},{}],96:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Author: priecint
 */
var DEFAULT_SORT_PROP = exports.DEFAULT_SORT_PROP = 'volume';
var DEFAULT_IS_SORT_DESC = exports.DEFAULT_IS_SORT_DESC = true;

},{}],97:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var favorites = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	var newFavorites = void 0;

	switch (action.type) {
		case _updateFavorites.UPDATE_FAVORITES:
			return _extends({}, favorites, action.favorites);

		case _updateFavorites.TOGGLE_FAVORITE:
			newFavorites = _extends({}, favorites);
			if (newFavorites[action.marketID]) {
				delete newFavorites[action.marketID];
			} else {
				newFavorites[action.marketID] = Date.now();
			}
			return newFavorites;

		default:
			return favorites;
	}
};

var _updateFavorites = require('../../markets/actions/update-favorites');

},{"../../markets/actions/update-favorites":84}],98:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var keywords = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	var action = arguments[1];

	var params = void 0;
	switch (action.type) {
		case _updateKeywords.UPDATE_KEYWORDS:
			return action.keywords;

		case _showLink.SHOW_LINK:
			params = action.parsedURL.searchParams;
			if (params[_paramNames.SEARCH_PARAM_NAME] != null && params[_paramNames.SEARCH_PARAM_NAME] !== '') {
				return params[_paramNames.SEARCH_PARAM_NAME];
			}
			return '';

		default:
			return keywords;
	}
};

var _updateKeywords = require('../../markets/actions/update-keywords');

var _showLink = require('../../link/actions/show-link');

var _paramNames = require('../../link/constants/param-names');

},{"../../link/actions/show-link":65,"../../link/constants/param-names":66,"../../markets/actions/update-keywords":85}],99:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var marketsData = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateMarketsData.UPDATE_MARKETS_DATA:
			return _extends({}, marketsData, action.marketsData);

		case _updateMarketsData.UPDATE_MARKET_DATA:
			return _extends({}, marketsData, _defineProperty({}, action.marketData.id, _extends({}, marketsData[action.marketData.id], action.marketData)));

		default:
			return marketsData;
	}
};

var _updateMarketsData = require('../../markets/actions/update-markets-data');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

},{"../../markets/actions/update-markets-data":86}],100:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var outcomes = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateOutcomesData.UPDATE_OUTCOMES_DATA:
			return _extends({}, outcomes, action.outcomesData);

		case _updateOutcomePrice.UPDATE_OUTCOME_PRICE:
			if (!outcomes || !outcomes[action.marketID] || !outcomes[action.marketID][action.outcomeID]) {
				return outcomes;
			}
			return _extends({}, outcomes, _defineProperty({}, action.marketID, _extends({}, outcomes[action.marketID], _defineProperty({}, action.outcomeID, _extends({}, outcomes[action.marketID][action.outcomeID], {
				price: action.price
			})))));

		default:
			return outcomes;
	}
};

var _updateOutcomesData = require('../../markets/actions/update-outcomes-data');

var _updateOutcomePrice = require('../../markets/actions/update-outcome-price');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

},{"../../markets/actions/update-outcome-price":87,"../../markets/actions/update-outcomes-data":88}],101:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var pagination = arguments.length <= 0 || arguments[0] === undefined ? { selectedPageNum: _pagination.DEFAULT_PAGE, numPerPage: 10 } : arguments[0];
	var action = arguments[1];

	var params = void 0;
	var newPageNum = void 0;
	switch (action.type) {
		case _updateSelectedPageNum.UPDATE_SELECTED_PAGE_NUM:
			return _extends({}, pagination, {
				selectedPageNum: action.selectedPageNum
			});

		case _updateSelectedSort.UPDATE_SELECTED_SORT:
		case _updateKeywords.UPDATE_KEYWORDS:
		case _toggleFilter.TOGGLE_FILTER:
		case _toggleTag.TOGGLE_TAG:
		case _updateSelectedMarketsHeader.UPDATED_SELECTED_MARKETS_HEADER:
			return _extends({}, pagination, {
				selectedPageNum: _pagination.DEFAULT_PAGE
			});

		case _showLink.SHOW_LINK:
			params = action.parsedURL.searchParams;
			newPageNum = params[_paramNames.PAGE_PARAM_NAME];
			if (newPageNum != null && newPageNum !== '' && parseInt(newPageNum, 10) !== _pagination.DEFAULT_PAGE) {
				return _extends({}, pagination, {
					selectedPageNum: parseInt(newPageNum, 10)
				});
			}

			return pagination;

		default:
			return pagination;
	}
};

var _updateSelectedPageNum = require('../../markets/actions/update-selected-page-num');

var _updateSelectedSort = require('../../markets/actions/update-selected-sort');

var _updateKeywords = require('../../markets/actions/update-keywords');

var _toggleFilter = require('../../markets/actions/toggle-filter');

var _toggleTag = require('../../markets/actions/toggle-tag');

var _updateSelectedMarketsHeader = require('../../markets/actions/update-selected-markets-header');

var _paramNames = require('../../link/constants/param-names');

var _pagination = require('../../markets/constants/pagination');

var _showLink = require('../../link/actions/show-link');

},{"../../link/actions/show-link":65,"../../link/constants/param-names":66,"../../markets/actions/toggle-filter":82,"../../markets/actions/toggle-tag":83,"../../markets/actions/update-keywords":85,"../../markets/actions/update-selected-markets-header":89,"../../markets/actions/update-selected-page-num":90,"../../markets/actions/update-selected-sort":91,"../../markets/constants/pagination":95}],102:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var priceHistory = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateMarketPriceHistory.UPDATE_MARKET_PRICE_HISTORY:
			return _extends({}, priceHistory, _defineProperty({}, action.marketID, action.priceHistory));

		default:
			return priceHistory;
	}
};

var _updateMarketPriceHistory = require('../../market/actions/update-market-price-history');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

},{"../../market/actions/update-market-price-history":72}],103:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var selectedFilters = arguments.length <= 0 || arguments[0] === undefined ? { isOpen: true } : arguments[0];
	var action = arguments[1];

	var newSelectedFilters = void 0;

	switch (action.type) {
		case _toggleFilter.TOGGLE_FILTER:
			newSelectedFilters = _extends({}, selectedFilters);
			if (newSelectedFilters[action.filterID]) {
				delete newSelectedFilters[action.filterID];
			} else {
				newSelectedFilters[action.filterID] = true;
			}
			return newSelectedFilters;

		case _showLink.SHOW_LINK:
			if (!action.parsedURL.searchParams[_paramNames.FILTERS_PARAM_NAME]) {
				return {};
			}
			return action.parsedURL.searchParams[_paramNames.FILTERS_PARAM_NAME].split(',').reduce(function (p, param) {
				p[param] = true;
				return p;
			}, _extends({}, selectedFilters));

		default:
			return selectedFilters;
	}
};

var _showLink = require('../../link/actions/show-link');

var _toggleFilter = require('../../markets/actions/toggle-filter');

var _paramNames = require('../../link/constants/param-names');

},{"../../link/actions/show-link":65,"../../link/constants/param-names":66,"../../markets/actions/toggle-filter":82}],104:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var selectedMarketID = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _showLink.SHOW_LINK:
			if ([_pages.M].indexOf(_paths.PATHS_PAGES[action.parsedURL.pathArray[0]]) >= 0 && action.parsedURL.pathArray[1]) {
				return action.parsedURL.pathArray[1].substring(1).split('_').pop();
			}
			return null;

		default:
			return selectedMarketID;
	}
};

var _showLink = require('../../link/actions/show-link');

var _pages = require('../../app/constants/pages');

var _paths = require('../../link/constants/paths');

},{"../../app/constants/pages":34,"../../link/actions/show-link":65,"../../link/constants/paths":67}],105:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var selectedMarketsHeader = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateSelectedMarketsHeader.UPDATED_SELECTED_MARKETS_HEADER:
			return action.selectedMarketsHeader;

		default:
			return selectedMarketsHeader;
	}
};

var _updateSelectedMarketsHeader = require('../../markets/actions/update-selected-markets-header');

},{"../../markets/actions/update-selected-markets-header":89}],106:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var selectedSort = arguments.length <= 0 || arguments[0] === undefined ? {
		prop: _sort.DEFAULT_SORT_PROP,
		isDesc: _sort.DEFAULT_IS_SORT_DESC
	} : arguments[0];
	var action = arguments[1];

	var params = void 0;
	switch (action.type) {
		case _updateSelectedSort.UPDATE_SELECTED_SORT:
			return _extends({}, selectedSort, action.selectedSort);

		case _showLink.SHOW_LINK:
			params = action.parsedURL.searchParams;
			if (params[_paramNames.SORT_PARAM_NAME] != null && params[_paramNames.SORT_PARAM_NAME] !== '') {
				var sortSplit = params[_paramNames.SORT_PARAM_NAME].split('|');
				return _extends({}, selectedSort, {
					prop: sortSplit[0],
					isDesc: sortSplit[1] === 'true'
				});
			}

			return selectedSort;

		default:
			return selectedSort;
	}
};

var _showLink = require('../../link/actions/show-link');

var _paramNames = require('../../link/constants/param-names');

var _sort = require('../../markets/constants/sort');

var _updateSelectedSort = require('../../markets/actions/update-selected-sort');

},{"../../link/actions/show-link":65,"../../link/constants/param-names":66,"../../markets/actions/update-selected-sort":91,"../../markets/constants/sort":96}],107:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var selectedTags = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	var newSelectedTags = void 0;
	switch (action.type) {
		case _toggleTag.TOGGLE_TAG:
			newSelectedTags = _extends({}, selectedTags);
			if (newSelectedTags[action.filterID]) {
				delete newSelectedTags[action.filterID];
			} else {
				newSelectedTags[action.filterID] = true;
			}
			return newSelectedTags;

		case _showLink.SHOW_LINK:
			if (!action.parsedURL.searchParams[_paramNames.TAGS_PARAM_NAME]) {
				return {};
			}
			return action.parsedURL.searchParams[_paramNames.TAGS_PARAM_NAME].split(',').reduce(function (p, param) {
				p[param] = true;
				return p;
			}, _extends({}, selectedTags));

		default:
			return selectedTags;
	}
};

var _showLink = require('../../link/actions/show-link');

var _toggleTag = require('../../markets/actions/toggle-tag');

var _paramNames = require('../../link/constants/param-names');

},{"../../link/actions/show-link":65,"../../link/constants/param-names":66,"../../markets/actions/toggle-tag":83}],108:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectFilters = undefined;

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var selectedFilters = _store$getState.selectedFilters;
	var selectedTags = _store$getState.selectedTags;

	var _require = require('../../../selectors');

	var filteredMarkets = _require.filteredMarkets;


	return selectFilters(filteredMarkets, selectedFilters, selectedTags, _store2.default.dispatch);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _toggleFilter = require('../../markets/actions/toggle-filter');

var _toggleTag = require('../../markets/actions/toggle-tag');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectFilters = exports.selectFilters = (0, _memoizerific2.default)(1)(function (markets, selectedFilters, selectedTags, dispatch) {
	var basicCounts = {
		isOpen: 0,
		isExpired: 0,
		isMissedOrReported: 0,
		isBinary: 0,
		isCategorical: 0,
		isScalar: 0
	};
	var tagCounts = {};

	// count matches for each filter and tag
	markets.forEach(function (market) {
		if (market.isOpen) {
			basicCounts.isOpen++;
		}
		if (market.isExpired) {
			basicCounts.isExpired++;
		}
		if (market.isMissedOrReported) {
			basicCounts.isMissedOrReported++;
		}
		if (market.isBinary) {
			basicCounts.isBinary++;
		}
		if (market.isCategorical) {
			basicCounts.isCategorical++;
		}
		if (market.isScalar) {
			basicCounts.isScalar++;
		}

		market.tags.forEach(function (tag) {
			tagCounts[tag.name] = tagCounts[tag.name] || 0;
			tagCounts[tag.name]++;
		});
	});

	var filters = [{
		title: 'Status',
		className: 'status',
		options: [{
			name: 'Open',
			value: 'Open',
			numMatched: basicCounts.isOpen,
			isSelected: !!selectedFilters.isOpen,
			onClick: function onClick() {
				return dispatch((0, _toggleFilter.toggleFilter)('isOpen'));
			}
		}, {
			name: 'Expired',
			value: 'Expired',
			numMatched: basicCounts.isOpen,
			isSelected: !!selectedFilters.isExpired,
			onClick: function onClick() {
				return dispatch((0, _toggleFilter.toggleFilter)('isExpired'));
			}
		}, {
			name: 'Reported / Missed',
			value: 'Reported / Missed',
			numMatched: basicCounts.isOpen,
			isSelected: !!selectedFilters.isMissedOrReported,
			onClick: function onClick() {
				return dispatch((0, _toggleFilter.toggleFilter)('isMissedOrReported'));
			}
		}]
	}, {
		title: 'Type',
		className: 'type',
		options: [{
			name: 'Yes / No',
			value: 'Yes / No',
			numMatched: basicCounts.isBinary,
			isSelected: !!selectedFilters.isBinary,
			onClick: function onClick() {
				return dispatch((0, _toggleFilter.toggleFilter)('isBinary'));
			}
		}, {
			name: 'Categorical',
			value: 'Categorical',
			numMatched: basicCounts.isCategorical,
			isSelected: !!selectedFilters.isCategorical,
			onClick: function onClick() {
				return dispatch((0, _toggleFilter.toggleFilter)('isCategorical'));
			}
		}, {
			name: 'Numerical',
			value: 'Numerical',
			numMatched: basicCounts.isScalar,
			isSelected: !!selectedFilters.isScalar,
			onClick: function onClick() {
				return dispatch((0, _toggleFilter.toggleFilter)('isScalar'));
			}
		}]
	}];

	var tagOptions = Object.keys(tagCounts).filter(function (tag) {
		return tagCounts[tag] > 0;
	}).sort(function (a, b) {
		return tagCounts[b] - tagCounts[a] || (a < b ? -1 : 1);
	}).map(function (tag) {
		var obj = {
			name: tag,
			value: tag,
			numMatched: tagCounts[tag],
			isSelected: !!selectedTags[tag],
			onClick: function onClick() {
				return dispatch((0, _toggleTag.toggleTag)(tag));
			}
		};
		return obj;
	});

	if (tagOptions.length) {
		filters.push({
			title: 'Tags',
			className: 'tags',
			options: tagOptions
		});
	}

	return filters;
});

},{"../../../selectors":153,"../../../store":155,"../../markets/actions/toggle-filter":82,"../../markets/actions/toggle-tag":83,"memoizerific":11}],109:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectOnChangeKeywords = undefined;

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var keywords = _store$getState.keywords;

	return {
		value: keywords,
		onChangeKeywords: selectOnChangeKeywords(_store2.default.dispatch)
	};
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _updateKeywords = require('../../markets/actions/update-keywords');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Author: priecint
 */
var selectOnChangeKeywords = exports.selectOnChangeKeywords = (0, _memoizerific2.default)(1)(function (dispatch) {
	return function (keywords) {
		return dispatch((0, _updateKeywords.updateKeywords)(keywords));
	};
});

},{"../../../store":155,"../../markets/actions/update-keywords":85,"memoizerific":11}],110:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectMarkets = undefined;

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var marketsData = _store$getState.marketsData;
	var favorites = _store$getState.favorites;
	var reports = _store$getState.reports;
	var outcomes = _store$getState.outcomes;
	var accountTrades = _store$getState.accountTrades;
	var tradesInProgress = _store$getState.tradesInProgress;
	var blockchain = _store$getState.blockchain;
	var selectedSort = _store$getState.selectedSort;
	var priceHistory = _store$getState.priceHistory;

	return selectMarkets(marketsData, favorites, reports, outcomes, accountTrades, tradesInProgress, blockchain, selectedSort, priceHistory, _store2.default.dispatch);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _isMarketDataOpen = require('../../../utils/is-market-data-open');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

var _market = require('../../market/selectors/market');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectMarkets = exports.selectMarkets = (0, _memoizerific2.default)(1)(function (marketsData, favorites, reports, outcomes, accountTrades, tradesInProgress, blockchain, selectedSort, priceHistory, dispatch) {
	if (!marketsData) {
		return [];
	}

	return Object.keys(marketsData).map(function (marketID) {
		if (!marketID || !marketsData[marketID]) {
			return {};
		}

		var endDate = new Date(marketsData[marketID].endDate * 1000 || 0);

		return (0, _market.assembleMarket)(marketID, marketsData[marketID], priceHistory[marketID], (0, _isMarketDataOpen.isMarketDataOpen)(marketsData[marketID], blockchain && blockchain.currentBlockNumber), !!favorites[marketID], outcomes[marketID], reports[marketsData[marketID].eventID], accountTrades[marketID], tradesInProgress[marketID],

		// the reason we pass in the date parts broken up like this, is because date objects are never equal, thereby always triggering re-assembly, and never hitting the memoization cache
		endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), blockchain && blockchain.isReportConfirmationPhase, dispatch);
	}).sort(function (a, b) {
		var aVal = cleanSortVal(a[selectedSort.prop]);
		var bVal = cleanSortVal(b[selectedSort.prop]);

		if (bVal < aVal) {
			return selectedSort.isDesc ? -1 : 1;
		} else if (bVal > aVal) {
			return selectedSort.isDesc ? 1 : -1;
		}
		return a.id < b.id ? -1 : 1;
	});
});
// import { makeDateFromBlock } from '../../../utils/format-number';

function cleanSortVal(val) {
	// if a falsy simple value return it to sort as-is
	if (!val) {
		return val;
	}

	// if this is a formatted number object, with a `value` prop, use that for sorting
	if (val.value || val.value === 0) {
		return val.value;
	}

	// if the val is a string, lowercase it
	if (val.toLowerCase) {
		return val.toLowerCase();
	}

	// otherwise the val is probably a number, either way return it as-is
	return val;
}

},{"../../../store":155,"../../../utils/is-market-data-open":161,"../../market/selectors/market":73,"memoizerific":11}],111:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectFavoriteMarkets = undefined;

exports.default = function () {
	var _require = require('../../../selectors');

	var filteredMarkets = _require.filteredMarkets;

	return selectFavoriteMarkets(filteredMarkets);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectFavoriteMarkets = exports.selectFavoriteMarkets = (0, _memoizerific2.default)(1)(function (markets) {
	return markets.filter(function (market) {
		return !!market.isFavorite;
	});
});

},{"../../../selectors":153,"memoizerific":11}],112:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isMarketFiltersMatch = exports.selectFilteredMarkets = undefined;

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var keywords = _store$getState.keywords;
	var selectedFilters = _store$getState.selectedFilters;
	var selectedTags = _store$getState.selectedTags;

	var _require = require('../../../selectors');

	var allMarkets = _require.allMarkets;

	return selectFilteredMarkets(allMarkets, keywords, selectedFilters, selectedTags);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _cleanKeywords = require('../../../utils/clean-keywords');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectFilteredMarkets = exports.selectFilteredMarkets = (0, _memoizerific2.default)(3)(function (markets, keywords, selectedFilters, selectedTags) {
	return markets.filter(function (market) {
		return isMarketFiltersMatch(market, keywords, selectedFilters, selectedTags);
	});
});

var isMarketFiltersMatch = exports.isMarketFiltersMatch = (0, _memoizerific2.default)(3)(function (market, keywords, selectedFilters, selectedTags) {
	return isMatchKeywords(market, keywords) && isMatchFilters(market, selectedFilters) && isMatchTags(market, selectedTags);

	function isMatchKeywords(market, keys) {
		var keywordsArray = (0, _cleanKeywords.cleanKeywordsArray)(keys);
		if (!keywordsArray.length) {
			return true;
		}
		return keywordsArray.every(function (keyword) {
			return market.description.toLowerCase().indexOf(keyword) >= 0 || market.outcomes.some(function (outcome) {
				return outcome.name.indexOf(keyword) >= 0;
			}) || market.tags.some(function (tag) {
				return tag.name.indexOf(keyword) >= 0;
			});
		});
	}

	function isMatchFilters(market, selFilters) {
		var selectedStatusProps = ['isOpen', 'isExpired', 'isMissedOrReported', 'isPendingReport'].filter(function (statusProp) {
			return !!selFilters[statusProp];
		});
		var selectedTypeProps = ['isBinary', 'isCategorical', 'isScalar'].filter(function (typeProp) {
			return !!selFilters[typeProp];
		});

		return (!selectedStatusProps.length || selectedStatusProps.some(function (status) {
			return !!market[status];
		})) && (!selectedTypeProps.length || selectedTypeProps.some(function (type) {
			return !!market[type];
		}));
	}

	function isMatchTags(market, selTags) {
		if (!Object.keys(selTags).length) {
			return true;
		}
		return market.tags.some(function (tag) {
			return !!selTags[tag.name];
		});
	}
});

},{"../../../selectors":153,"../../../store":155,"../../../utils/clean-keywords":157,"memoizerific":11}],113:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectMarketsHeader = undefined;

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var selectedMarketsHeader = _store$getState.selectedMarketsHeader;

	var _require = require('../../../selectors');

	var marketsTotals = _require.marketsTotals;

	return selectMarketsHeader(selectedMarketsHeader, marketsTotals.numFiltered, marketsTotals.numFavorites, marketsTotals.numPendingReports, _store2.default.dispatch);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _marketsHeaders = require('../../markets/constants/markets-headers');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

var _updateSelectedMarketsHeader = require('../../markets/actions/update-selected-markets-header');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectMarketsHeader = exports.selectMarketsHeader = (0, _memoizerific2.default)(1)(function (selectedMarketsHeader, numFiltered, numFavorites, numPendingReports, dispatch) {
	var obj = {
		selectedMarketsHeader: selectedMarketsHeader,
		numMarkets: numFiltered,
		numFavorites: numFavorites,
		numPendingReports: numPendingReports,
		onClickAllMarkets: function onClickAllMarkets() {
			return dispatch((0, _updateSelectedMarketsHeader.updateSelectedMarketsHeader)(null));
		},
		onClickFavorites: function onClickFavorites() {
			return dispatch((0, _updateSelectedMarketsHeader.updateSelectedMarketsHeader)(_marketsHeaders.FAVORITES));
		},
		onClickPendingReports: function onClickPendingReports() {
			return dispatch((0, _updateSelectedMarketsHeader.updateSelectedMarketsHeader)(_marketsHeaders.PENDING_REPORTS));
		}
	};
	return obj;
});

},{"../../../selectors":153,"../../../store":155,"../../markets/actions/update-selected-markets-header":89,"../../markets/constants/markets-headers":94,"memoizerific":11}],114:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectMarketsTotals = undefined;

exports.default = function () {
	var _require = require('../../../selectors');

	var allMarkets = _require.allMarkets;
	var filteredMarkets = _require.filteredMarkets;
	var unpaginatedMarkets = _require.unpaginatedMarkets;
	var favoriteMarkets = _require.favoriteMarkets;

	return selectMarketsTotals(allMarkets, filteredMarkets.length, unpaginatedMarkets.length, favoriteMarkets.length);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _positionsSummary = require('../../positions/selectors/positions-summary');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectMarketsTotals = exports.selectMarketsTotals = (0, _memoizerific2.default)(1)(function (allMarkets, filteredMarketsLength, unpaginatedMarketsLength, favoriteMarketsLength) {
	var positions = { numPositions: 0, qtyShares: 0, totalValue: 0, totalCost: 0 };

	var totals = allMarkets.reduce(function (p, market) {
		p.numAll++;
		if (market.isPendingReport) {
			p.numPendingReports++;
		}

		if (market.positionsSummary && market.positionsSummary.qtyShares && market.positionsSummary.qtyShares.value) {
			positions.numPositions += market.positionsSummary.numPositions.value;
			positions.qtyShares += market.positionsSummary.qtyShares.value;
			positions.totalValue += market.positionsSummary.totalValue.value || 0;
			positions.totalCost += market.positionsSummary.totalCost.value || 0;
		}

		return p;
	}, {
		numAll: 0,
		numFavorites: 0,
		numPendingReports: 0,
		numUnpaginated: 0,
		numFiltered: 0
	});

	totals.numUnpaginated = unpaginatedMarketsLength;
	totals.numFiltered = filteredMarketsLength;
	totals.numFavorites = favoriteMarketsLength;
	totals.positionsSummary = (0, _positionsSummary.selectPositionsSummary)(positions.numPositions, positions.qtyShares, positions.totalValue, positions.totalCost);

	return totals;
});

},{"../../../selectors":153,"../../positions/selectors/positions-summary":123,"memoizerific":11}],115:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectUnpaginatedMarkets = exports.selectPositions = exports.selectPendingReports = undefined;

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var activePage = _store$getState.activePage;
	var selectedMarketsHeader = _store$getState.selectedMarketsHeader;

	var _require = require('../../../selectors');

	var allMarkets = _require.allMarkets;
	var filteredMarkets = _require.filteredMarkets;
	var favoriteMarkets = _require.favoriteMarkets;


	return selectUnpaginatedMarkets(allMarkets, filteredMarkets, favoriteMarkets, activePage, selectedMarketsHeader);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _pages = require('../../app/constants/pages');

var _marketsHeaders = require('../../markets/constants/markets-headers');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectPendingReports = exports.selectPendingReports = (0, _memoizerific2.default)(1)(function (markets) {
	return markets.filter(function (market) {
		return !!market.isPendingReport;
	});
});

var selectPositions = exports.selectPositions = (0, _memoizerific2.default)(1)(function (markets) {
	return markets.filter(function (market) {
		return market.positionsSummary && market.positionsSummary.qtyShares.value;
	});
});

var selectUnpaginatedMarkets = exports.selectUnpaginatedMarkets = (0, _memoizerific2.default)(1)(function (allMarkets, filteredMarkets, favoriteMarkets, activePage, selectedMarketsHeader) {
	if (activePage === _pages.POSITIONS) {
		return selectPositions(allMarkets);
	}

	if (selectedMarketsHeader === _marketsHeaders.PENDING_REPORTS) {
		return selectPendingReports(allMarkets);
	}

	if (selectedMarketsHeader === _marketsHeaders.FAVORITES) {
		return favoriteMarkets;
	}

	return filteredMarkets;
});

},{"../../../selectors":153,"../../../store":155,"../../app/constants/pages":34,"../../markets/constants/markets-headers":94,"memoizerific":11}],116:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectPaginated = undefined;

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var activePage = _store$getState.activePage;
	var selectedMarketsHeader = _store$getState.selectedMarketsHeader;
	var pagination = _store$getState.pagination;

	var _require = require('../../../selectors');

	var unpaginatedMarkets = _require.unpaginatedMarkets;


	if (activePage !== _pages.POSITIONS && selectedMarketsHeader !== _marketsHeaders.PENDING_REPORTS) {
		return selectPaginated(unpaginatedMarkets, pagination.selectedPageNum, pagination.numPerPage);
	}
	return unpaginatedMarkets;
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _pages = require('../../app/constants/pages');

var _marketsHeaders = require('../../markets/constants/markets-headers');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectPaginated = exports.selectPaginated = (0, _memoizerific2.default)(1)(function (markets, pageNum, numPerPage) {
	return markets.slice((pageNum - 1) * numPerPage, pageNum * numPerPage);
});

},{"../../../selectors":153,"../../../store":155,"../../app/constants/pages":34,"../../markets/constants/markets-headers":94,"memoizerific":11}],117:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var pagination = _store$getState.pagination;

	var _require = require('../../../selectors');

	var marketsTotals = _require.marketsTotals;


	if (!pagination || !marketsTotals.numUnpaginated) {
		return {};
	}

	var o = {
		numUnpaginated: marketsTotals.numUnpaginated,
		selectedPageNum: pagination.selectedPageNum,
		numPerPage: pagination.numPerPage,
		numPages: Math.ceil(marketsTotals.numUnpaginated / pagination.numPerPage),
		startItemNum: (pagination.selectedPageNum - 1) * pagination.numPerPage + 1,
		endItemNum: Math.min(pagination.selectedPageNum * pagination.numPerPage, marketsTotals.numUnpaginated),
		onUpdateSelectedPageNum: function onUpdateSelectedPageNum(pageNum) {
			return _store2.default.dispatch((0, _updateSelectedPageNum.updateSelectedPageNum)(pageNum));
		}
	};

	if (marketsTotals.numUnpaginated > o.numPerPage) {
		o.nextPageNum = o.selectedPageNum < o.numPages ? o.selectedPageNum + 1 : undefined;
		o.previousPageNum = o.selectedPageNum >= 2 ? o.selectedPageNum - 1 : undefined;

		o.nextItemNum = o.selectedPageNum < o.numPages ? o.endItemNum + 1 : undefined;
		o.previousItemNum = o.selectedPageNum >= 2 ? o.startItemNum - o.numPerPage : undefined;
	}

	return o;
};

var _updateSelectedPageNum = require('../../markets/actions/update-selected-page-num');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../../../selectors":153,"../../../store":155,"../../markets/actions/update-selected-page-num":90}],118:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectOnChangeSort = exports.selectSortOptions = undefined;

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var selectedSort = _store$getState.selectedSort;

	return {
		selectedSort: selectedSort,
		sortOptions: selectSortOptions(selectedSort),
		onChangeSort: selectOnChangeSort(_store2.default.dispatch)
	};
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _updateSelectedSort = require('../../markets/actions/update-selected-sort');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectSortOptions = exports.selectSortOptions = (0, _memoizerific2.default)(10)(function () {
	var selectedSort = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var creationTime = { label: 'Newest Market', value: 'creationTime', isDesc: true };
	var endDate = { label: 'Soonest Expiry', value: 'endDate', isDesc: false };
	var volume = { label: 'Most Volume', value: 'volume', isDesc: true };
	var tradingFeePercent = { label: 'Lowest Fee', value: 'tradingFeePercent', isDesc: false };

	switch (selectedSort.prop) {
		case creationTime.value:
			creationTime.label = selectedSort.isDesc ? 'Newest Market' : 'Oldest Market';
			creationTime.isDesc = selectedSort.isDesc;
			break;
		case endDate.value:
			endDate.label = selectedSort.isDesc ? 'Furthest Expiry' : 'Soonest Expiry';
			endDate.isDesc = selectedSort.isDesc;
			break;
		case volume.value:
			volume.label = selectedSort.isDesc ? 'Most Volume' : 'Least Volume';
			volume.isDesc = selectedSort.isDesc;
			break;
		case tradingFeePercent.value:
			tradingFeePercent.label = selectedSort.isDesc ? 'Highest Fee' : 'Lowest Fee';
			tradingFeePercent.isDesc = selectedSort.isDesc;
			break;
		default:
			break;
	}

	return [creationTime, endDate, volume, tradingFeePercent];
});

var selectOnChangeSort = exports.selectOnChangeSort = (0, _memoizerific2.default)(1)(function (dispatch) {
	return function (prop, isDesc) {
		var o = {};

		if (prop) {
			o.prop = prop;
		}
		if (isDesc || isDesc === false) {
			o.isDesc = isDesc;
		}

		dispatch((0, _updateSelectedSort.updateSelectedSort)(o));
	};
});

},{"../../../store":155,"../../markets/actions/update-selected-sort":91,"memoizerific":11}],119:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadAccountTrades = loadAccountTrades;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _updateAccountTradesData = require('../../positions/actions/update-account-trades-data');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function loadAccountTrades() {
	return function (dispatch, getState) {
		AugurJS.loadAccountTrades(getState().loginAccount.id, function (err, accountTrades) {
			if (err) {
				console.log('ERROR loadAccountTrades', err);
				return;
			}
			if (!accountTrades) {
				return;
			}

			var trades = Object.keys(accountTrades).reduce(function (p, accountTradeID) {
				Object.keys(accountTrades[accountTradeID]).forEach(function (outcomeID) {
					accountTrades[accountTradeID][outcomeID].forEach(function (trade) {
						if (!p[trade.market]) {
							p[trade.market] = {};
						}
						if (!p[trade.market][outcomeID]) {
							p[trade.market][outcomeID] = [];
						}

						p[trade.market][outcomeID].push({
							qtyShares: parseFloat(trade.shares),
							purchasePrice: Math.abs(trade.cost)
						});
					});
				});
				return p;
			}, {});

			dispatch((0, _updateAccountTradesData.updateAccountTradesData)(trades));
		});
	};
}

/*
export function loadMeanTradePrices() {
    return (dispatch, getState) => {
        var { loginAccount } = getState();
        AugurJS.loadMeanTradePrices(loginAccount.id, (err, meanTradePrices) => {
console.log('========loadMeanTradePrices>>>>', err, meanTradePrices);
            if (err) {
                return console.info('ERR loadMeanTradePrices():', err);
            }

            if (meanTradePrices) {
                dispatch(updatePositionsData(meanTradePrices));
            }
        });
    };
}
*/

},{"../../../services/augurjs":154,"../../positions/actions/update-account-trades-data":120}],120:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateAccountTradesData = updateAccountTradesData;
var UPDATE_ACCOUNT_TRADES_DATA = exports.UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA';

function updateAccountTradesData(data) {
	return { type: UPDATE_ACCOUNT_TRADES_DATA, data: data };
}

},{}],121:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var accountTrades = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateAccountTradesData.UPDATE_ACCOUNT_TRADES_DATA:
			return _extends({}, accountTrades, action.data);

		case _updateLoginAccount.CLEAR_LOGIN_ACCOUNT:
			return {};

		default:
			return accountTrades;
	}
};

var _updateAccountTradesData = require('../../positions/actions/update-account-trades-data');

var _updateLoginAccount = require('../../auth/actions/update-login-account');

},{"../../auth/actions/update-login-account":46,"../../positions/actions/update-account-trades-data":120}],122:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectPositionFromOutcomeAccountTrades = undefined;

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _positionsSummary = require('../../positions/selectors/positions-summary');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectPositionFromOutcomeAccountTrades = exports.selectPositionFromOutcomeAccountTrades = (0, _memoizerific2.default)(100)(function (outcomeAccountTrades, lastPrice) {
	var qtyShares = 0;
	var totalValue = 0;
	var totalCost = 0;

	if (!outcomeAccountTrades || !outcomeAccountTrades.length) {
		return null;
	}

	outcomeAccountTrades.forEach(function (outcomeAccountTrade) {
		qtyShares += outcomeAccountTrade.qtyShares;
		totalCost += outcomeAccountTrade.qtyShares * outcomeAccountTrade.purchasePrice;
		totalValue += outcomeAccountTrade.qtyShares * lastPrice;
	});

	var position = (0, _positionsSummary.selectPositionsSummary)(outcomeAccountTrades.length, qtyShares, totalValue, totalCost);

	return position;
});

},{"../../positions/selectors/positions-summary":123,"memoizerific":11}],123:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectPositionsSummary = undefined;

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _formatNumber = require('../../../utils/format-number');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectPositionsSummary = exports.selectPositionsSummary = (0, _memoizerific2.default)(20)(function (numPositions, qtyShares, totalValue, totalCost, positions) {
	var purchasePrice = qtyShares && totalCost / qtyShares || 0;
	var valuePrice = qtyShares && totalValue / qtyShares || 0;
	var shareChange = valuePrice - purchasePrice;
	var gainPercent = totalCost && (totalValue - totalCost) / totalCost * 100 || 0;
	var netChange = totalValue - totalCost;

	return {
		numPositions: (0, _formatNumber.formatNumber)(numPositions, {
			decimals: 0,
			decimalsRounded: 0,
			denomination: 'Positions',
			positiveSign: false,
			zeroStyled: false
		}),
		qtyShares: (0, _formatNumber.formatShares)(qtyShares),
		purchasePrice: (0, _formatNumber.formatEther)(purchasePrice),
		totalValue: (0, _formatNumber.formatEther)(totalValue),
		totalCost: (0, _formatNumber.formatEther)(totalCost),
		shareChange: (0, _formatNumber.formatEther)(shareChange),
		gainPercent: (0, _formatNumber.formatPercent)(gainPercent),
		netChange: (0, _formatNumber.formatEther)(netChange),
		positions: positions
	};
});

},{"../../../utils/format-number":160,"memoizerific":11}],124:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.closeMarkets = closeMarkets;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _network = require('../../app/constants/network');

var _isMarketDataOpen = require('../../../utils/is-market-data-open');

var _updateMarketsData = require('../../markets/actions/update-markets-data');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function closeMarkets(marketsData) {
	return function (dispatch, getState) {
		var _getState = getState();

		var loginAccount = _getState.loginAccount;
		var blockchain = _getState.blockchain;
		var branch = _getState.branch;


		if (blockchain.isReportConfirmationPhase || !loginAccount.ether) {
			return;
		}

		var unparsedMarkets = Object.keys(marketsData).filter(function (marketID) {
			return (0, _isMarketDataOpen.isMarketDataPreviousReportPeriod)(marketsData[marketID], blockchain.currentPeriod, branch.periodLength);
		}).map(function (marketID) {
			return marketsData[marketID];
		});

		if (!unparsedMarkets || !unparsedMarkets.length) {
			return;
		}

		(function process() {
			function next() {
				if (unparsedMarkets.length) {
					setTimeout(process, 2000);
				}
			}

			var unparsedMarket = unparsedMarkets.pop();

			// check if this market has been determined and closed
			AugurJS.getOutcome(unparsedMarket.eventID, function (reportedOutcome) {
				// if a reported outcome exists, that means market has been determined and closed
				if (reportedOutcome !== '0') {
					dispatch((0, _updateMarketsData.updateMarketData)({ id: unparsedMarket._id, isClosed: true }));
					return next();
				}

				AugurJS.closeMarket(_network.BRANCH_ID, unparsedMarket._id, function (err, res) {
					if (err) {
						console.log('ERROR closeMarkets()', err);
						return next();
					}
					dispatch((0, _updateMarketsData.updateMarketData)({ id: unparsedMarket._id, isClosed: true }));
					console.log('------> closed market', res);
					return next();
				});
			});
		})();
	};
}

},{"../../../services/augurjs":154,"../../../utils/is-market-data-open":161,"../../app/constants/network":33,"../../markets/actions/update-markets-data":86}],125:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.collectFees = collectFees;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _network = require('../../app/constants/network');

var _updateAssets = require('../../auth/actions/update-assets');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function collectFees() {
	return function (dispatch, getState) {
		var _getState = getState();

		var blockchain = _getState.blockchain;

		var branchID = _network.BRANCH_ID;

		if (!blockchain.isReportConfirmationPhase) {
			return;
		}

		AugurJS.collectFees(branchID, function (err, res) {
			console.log('------> collectFees result', err, res);
			dispatch((0, _updateAssets.updateAssets)());
		});
	};
}

},{"../../../services/augurjs":154,"../../app/constants/network":33,"../../auth/actions/update-assets":45}],126:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import { isMarketDataPreviousReportPeriod } from '../../../utils/is-market-data-open';

exports.commitReports = commitReports;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _network = require('../../app/constants/network');

var _updateReports2 = require('../../reports/actions/update-reports');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function commitReports() {
	return function (dispatch, getState) {
		var _getState = getState();

		var blockchain = _getState.blockchain;
		var loginAccount = _getState.loginAccount;
		var reports = _getState.reports;

		var branchID = _network.BRANCH_ID;
		var prevPeriod = blockchain.reportPeriod - 1;

		// if we're in the first half of the reporting period
		if (!blockchain.isReportConfirmationPhase || !loginAccount.rep || !reports) {
			return;
		}

		var committableReports = Object.keys(reports).filter(function (eventID) {
			return reports[eventID].reportHash && reports[eventID].reportHash.length && !reports[eventID].isCommitted;
		}).map(function (eventID) {
			var obj = _extends({}, reports[eventID], { eventID: eventID });
			return obj;
		});

		if (!committableReports || !committableReports.length) {
			return;
		}

		(function process() {
			// if there are more event ids, continue
			function next() {
				if (committableReports.length) {
					setTimeout(process, 1000);
				}
			}
			var report = committableReports.pop();

			AugurJS.getEventIndex(prevPeriod, report.eventID, function (eventIndex) {
				if (!eventIndex || eventIndex.error) {
					console.log('ERROR getEventIndex()', eventIndex && eventIndex.error);
					return next();
				}

				AugurJS.submitReport({
					branch: branchID,
					reportPeriod: prevPeriod,
					eventIndex: eventIndex,
					salt: report.salt,
					report: report.reportedOutcomeID,
					eventID: report.eventID,
					ethics: Number(!report.isUnethical),
					indeterminate: report.isIndeterminate,
					isScalar: report.isScalar,
					onSent: function onSent(res) {},
					onSuccess: function onSuccess(res) {
						dispatch((0, _updateReports2.updateReports)(_defineProperty({}, report.eventID, { isCommited: true })));
						console.log('------> committed report', res);
						return next();
					},
					onFailed: function onFailed(err) {
						console.log('ERROR submitReport()', err);
						return next();
					}
				});
			});
		})();
	};
}

},{"../../../services/augurjs":154,"../../app/constants/network":33,"../../reports/actions/update-reports":131}],127:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadReports = loadReports;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _network = require('../../app/constants/network');

var _isMarketDataOpen = require('../../../utils/is-market-data-open');

var _updateReports = require('../../reports/actions/update-reports');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function loadReports(marketsData) {
	return function (dispatch, getState) {
		var _getState = getState();

		var loginAccount = _getState.loginAccount;
		var blockchain = _getState.blockchain;


		if (!loginAccount || !loginAccount.id) {
			return;
		}

		var eventIDs = Object.keys(marketsData).filter(function (marketID) {
			return marketsData[marketID].eventID && !(0, _isMarketDataOpen.isMarketDataOpen)(marketsData[marketID], blockchain.currentBlockNumber);
		}).map(function (marketID) {
			return marketsData[marketID].eventID;
		});

		if (!eventIDs || !eventIDs.length) {
			return;
		}

		AugurJS.loadPendingReportEventIDs(eventIDs, loginAccount.id, blockchain.reportPeriod, _network.BRANCH_ID, function (err, evtIDs) {
			if (err) {
				console.log('ERROR loadReports', err);
				return;
			}
			dispatch((0, _updateReports.updateReports)(evtIDs));
		});
	};
}

},{"../../../services/augurjs":154,"../../../utils/is-market-data-open":161,"../../app/constants/network":33,"../../reports/actions/update-reports":131}],128:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.penalizeTooFewReports = penalizeTooFewReports;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _updateAssets = require('../../auth/actions/update-assets');

var _network = require('../../app/constants/network');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function penalizeTooFewReports() {
	return function (dispatch, getState) {
		var _getState = getState();

		var blockchain = _getState.blockchain;
		var loginAccount = _getState.loginAccount;

		var branchID = _network.BRANCH_ID;
		var previousReportPeriod = blockchain.reportPeriod - 1;

		if (blockchain.isReportConfirmationPhase || !loginAccount.rep) {
			return;
		}

		AugurJS.getReportedPeriod(branchID, previousReportPeriod, loginAccount, function (reported) {
			// if the reporter submitted a report during the previous period,
			// penalize if they did not submit enough reports.
			if (reported === '1') {
				AugurJS.penalizeNotEnoughReports(branchID, function (err, res) {
					if (err) {
						console.log('ERROR getReportedPeriod', err);
						return;
					}
					console.log('------> penalizeNotEnoughReports', res);
					dispatch((0, _updateAssets.updateAssets)());
				});
			} else {
				// if the reporter did not submit a report during the previous period,
				// dock 10% for each report-less period.
				AugurJS.penalizationCatchup(branchID, function (err, res) {
					if (err) {
						console.log('ERROR penalizationCatchup', err);
						return;
					}
					console.log('------> penalizationCatchup', res);
					dispatch((0, _updateAssets.updateAssets)());
				});
			}
		});
	};
}

},{"../../../services/augurjs":154,"../../app/constants/network":33,"../../auth/actions/update-assets":45}],129:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.penalizeWrongReports = penalizeWrongReports;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _isMarketDataOpen = require('../../../utils/is-market-data-open');

var _network = require('../../app/constants/network');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function penalizeWrongReports(marketsData) {
	return function (dispatch, getState) {
		var _getState = getState();

		var blockchain = _getState.blockchain;
		var loginAccount = _getState.loginAccount;

		var branchID = _network.BRANCH_ID;
		var prevPeriod = blockchain.reportPeriod - 1;

		if (blockchain.isReportConfirmationPhase || !loginAccount.rep) {
			return;
		}

		var eventIDs = Object.keys(marketsData).filter(function (marketID) {
			return marketsData[marketID].eventID && !(0, _isMarketDataOpen.isMarketDataPreviousReportPeriod)(marketsData[marketID], blockchain.currentBlockNumber);
		}).map(function (marketID) {
			return marketsData[marketID].eventID;
		});

		(function process() {
			// if there are more event ids, continue
			function next() {
				if (eventIDs.length) {
					setTimeout(process, 1000);
				}
			}
			var eventID = eventIDs.pop();
			AugurJS.penalizeWrong(branchID, prevPeriod, eventID, function (err, res) {
				if (err) {
					console.log('ERROR penalizeWrong()', err);
					return next();
				}
				console.log('------> penalizeWrong', res);
				return next();
			});
		})();
	};
}

},{"../../../services/augurjs":154,"../../../utils/is-market-data-open":161,"../../app/constants/network":33}],130:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.submitReport = submitReport;
exports.processReport = processReport;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _secureRandom = require('secure-random');

var _secureRandom2 = _interopRequireDefault(_secureRandom);

var _bytesToHex = require('../../../utils/bytes-to-hex');

var _network = require('../../app/constants/network');

var _marketOutcomes = require('../../markets/constants/market-outcomes');

var _marketTypes = require('../../markets/constants/market-types');

var _statuses = require('../../transactions/constants/statuses');

var _addReportTransaction = require('../../transactions/actions/add-report-transaction');

var _updateExistingTransaction = require('../../transactions/actions/update-existing-transaction');

var _updateReports4 = require('../../reports/actions/update-reports');

var _market = require('../../market/selectors/market');

var _links = require('../../link/selectors/links');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function submitReport(market, reportedOutcomeID, isUnethical) {
	return function (dispatch, getState) {
		var _getState = getState();

		var marketsData = _getState.marketsData;
		var reports = _getState.reports;

		var currentEventID = marketsData[market.id].eventID;

		dispatch((0, _updateReports4.updateReports)(_defineProperty({}, currentEventID, { reportHash: true })));
		dispatch((0, _addReportTransaction.addReportTransaction)(market, reportedOutcomeID, isUnethical));

		var nextPendingReportEventID = Object.keys(reports).find(function (eventID) {
			return !reports[eventID].reportHash;
		});
		var nextPendingReportMarket = (0, _market.selectMarketFromEventID)(nextPendingReportEventID);

		if (nextPendingReportMarket) {
			(0, _links.selectMarketLink)(nextPendingReportMarket, dispatch).onClick();
		} else {
			(0, _links.selectMarketsLink)(dispatch).onClick();
		}
	};
}

function processReport(transactionID, market, reportedOutcomeID, isUnethical) {
	return function (dispatch, getState) {
		var _getState2 = getState();

		var loginAccount = _getState2.loginAccount;
		var blockchain = _getState2.blockchain;

		var eventID = market.eventID;

		if (!loginAccount || !loginAccount.id || !eventID || !event || !market || !reportedOutcomeID) {
			return dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: _statuses.FAILED, message: 'Missing data' }));
		}

		dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: 'sending...' }));

		var report = {
			reportPeriod: blockchain.reportPeriod.toString(),
			reportedOutcomeID: reportedOutcomeID,
			isIndeterminate: reportedOutcomeID === _marketOutcomes.INDETERMINATE_OUTCOME_ID,
			isCategorical: market.type === _marketTypes.CATEGORICAL,
			isScalar: market.type === _marketTypes.SCALAR,
			isUnethical: isUnethical,
			salt: (0, _bytesToHex.bytesToHex)((0, _secureRandom2.default)(32)),
			reportHash: true
		};

		dispatch((0, _updateReports4.updateReports)(_defineProperty({}, eventID, report)));

		AugurJS.submitReportHash(_network.BRANCH_ID, loginAccount.id, _extends({}, event, { id: eventID }), report, function (err, res) {
			if (err) {
				console.log('ERROR submitReportHash', err);
				return dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: _statuses.FAILED, message: err.message }));
			}

			dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: res.status }));

			if (res.status === _statuses.SUCCESS) {
				dispatch((0, _updateReports4.updateReports)(_defineProperty({}, eventID, { reportHash: res.reportHash })));
			}

			return;
		});
	};
}

},{"../../../services/augurjs":154,"../../../utils/bytes-to-hex":156,"../../app/constants/network":33,"../../link/selectors/links":68,"../../market/selectors/market":73,"../../markets/constants/market-outcomes":92,"../../markets/constants/market-types":93,"../../reports/actions/update-reports":131,"../../transactions/actions/add-report-transaction":140,"../../transactions/actions/update-existing-transaction":144,"../../transactions/constants/statuses":146,"secure-random":26}],131:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateReports = updateReports;
exports.clearReports = clearReports;
var UPDATE_REPORTS = exports.UPDATE_REPORTS = 'UPDATE_REPORTS';
var CLEAR_REPORTS = exports.CLEAR_REPORTS = 'CLEAR_REPORTS';

function updateReports(reports) {
	return { type: UPDATE_REPORTS, reports: reports };
}

function clearReports() {
	return { type: CLEAR_REPORTS };
}

},{}],132:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
Keys are eventID, values can be:
   - { reportHash: null }: user is required to report and has not yet reported
   - { reportHash: true }: report sent, but not yet confirmed
   - { reportHash: xyz... }: report submitted and confirmed
*/


exports.default = function () {
	var reports = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateReports.UPDATE_REPORTS:
			return _extends({}, reports, Object.keys(action.reports).reduce(function (p, eventID) {
				p[eventID] = _extends({}, reports[eventID], action.reports[eventID]);
				return p;
			}, {}));

		case _updateReports.CLEAR_REPORTS:
			return {};

		default:
			return reports;
	}
};

var _updateReports = require('../../reports/actions/update-reports');

},{"../../reports/actions/update-reports":131}],133:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.placeTrade = placeTrade;
exports.tradeShares = tradeShares;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

var _network = require('../../app/constants/network');

var _statuses = require('../../transactions/constants/statuses');

var _addTransactions = require('../../transactions/actions/add-transactions');

var _updateExistingTransaction = require('../../transactions/actions/update-existing-transaction');

var _updateTradesInProgress = require('../../trade/actions/update-trades-in-progress');

var _loadAccountTrades = require('../../positions/actions/load-account-trades');

var _market = require('../../market/selectors/market');

var _links = require('../../link/selectors/links');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function placeTrade(marketID) {
	return function (dispatch, getState) {
		var market = (0, _market.selectMarket)(marketID);
		dispatch((0, _addTransactions.addTransactions)(market.tradeSummary.tradeOrders));
		dispatch((0, _updateTradesInProgress.clearTradeInProgress)(marketID));
		(0, _links.selectTransactionsLink)(dispatch).onClick();
	};
}

function tradeShares(transactionID, marketID, outcomeID, numShares, limitPrice, cap) {
	return function (dispatch, getState) {
		dispatch((0, _updateExistingTransaction.updateExistingTransaction)(_defineProperty({}, transactionID, { status: 'sending...' })));

		AugurJS.tradeShares(_network.BRANCH_ID, marketID, outcomeID, numShares, null, null, function (err, res) {
			if (err) {
				dispatch((0, _updateExistingTransaction.updateExistingTransaction)(_defineProperty({}, transactionID, { status: _statuses.FAILED, message: err && err.message })));
				return;
			}

			dispatch((0, _loadAccountTrades.loadAccountTrades)());
			dispatch((0, _updateExistingTransaction.updateExistingTransaction)(transactionID, { status: res.status }));
		});
	};
}

},{"../../../services/augurjs":154,"../../app/constants/network":33,"../../link/selectors/links":68,"../../market/selectors/market":73,"../../positions/actions/load-account-trades":119,"../../trade/actions/update-trades-in-progress":134,"../../transactions/actions/add-transactions":142,"../../transactions/actions/update-existing-transaction":144,"../../transactions/constants/statuses":146}],134:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CLEAR_TRADE_IN_PROGRESS = exports.UPDATE_TRADE_IN_PROGRESS = undefined;
exports.updateTradesInProgress = updateTradesInProgress;
exports.clearTradeInProgress = clearTradeInProgress;

var _augurjs = require('../../../services/augurjs');

var AugurJS = _interopRequireWildcard(_augurjs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var UPDATE_TRADE_IN_PROGRESS = exports.UPDATE_TRADE_IN_PROGRESS = 'UPDATE_TRADE_IN_PROGRESS';
var CLEAR_TRADE_IN_PROGRESS = exports.CLEAR_TRADE_IN_PROGRESS = 'CLEAR_TRADE_IN_PROGRESS';

function updateTradesInProgress(marketID, outcomeID, numShares, limitPrice) {
	return function (dispatch, getState) {
		var tradesInProgress = getState().tradesInProgress;
		var simulation = void 0;

		if (tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID] && tradesInProgress[marketID][outcomeID].numShares === numShares && tradesInProgress[marketID][outcomeID].limitPrice === limitPrice) {
			return;
		}

		if (numShares >= 0) {
			simulation = AugurJS.getSimulatedBuy(marketID, outcomeID, numShares);
		} else {
			simulation = AugurJS.getSimulatedSell(marketID, outcomeID, Math.abs(numShares));
		}

		dispatch({ type: UPDATE_TRADE_IN_PROGRESS, data: {
				marketID: marketID,
				outcomeID: outcomeID,
				details: {
					numShares: numShares,
					limitPrice: limitPrice,
					totalCost: simulation[0],
					newPrice: simulation[1]
				}
			} });
	};
}

function clearTradeInProgress(marketID) {
	return { type: CLEAR_TRADE_IN_PROGRESS, marketID: marketID };
}

},{"../../../services/augurjs":154}],135:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var tradesInProgress = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateTradesInProgress.UPDATE_TRADE_IN_PROGRESS:
			return _extends({}, tradesInProgress, _defineProperty({}, action.data.marketID, _extends({}, tradesInProgress[action.data.marketID], _defineProperty({}, action.data.outcomeID, _extends({}, action.data.details)))));

		case _updateTradesInProgress.CLEAR_TRADE_IN_PROGRESS:
			return _extends({}, tradesInProgress, _defineProperty({}, action.marketID, {}));

		case _updateLoginAccount.CLEAR_LOGIN_ACCOUNT:
			return {};

		default:
			return tradesInProgress;
	}
};

var _updateTradesInProgress = require('../../trade/actions/update-trades-in-progress');

var _updateLoginAccount = require('../../auth/actions/update-login-account');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

},{"../../auth/actions/update-login-account":46,"../../trade/actions/update-trades-in-progress":134}],136:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectTradeOrders = exports.selectOutcomeTradeOrders = undefined;

var _formatNumber = require('../../../utils/format-number');

var _addTradeTransaction = require('../../transactions/actions/add-trade-transaction');

// import memoizerific from 'memoizerific';
var selectOutcomeTradeOrders = exports.selectOutcomeTradeOrders = function selectOutcomeTradeOrders(market, outcome, outcomeTradeInProgress, dispatch) {
	var orders = [];

	if (!outcomeTradeInProgress || !outcomeTradeInProgress.numShares) {
		return orders;
	}

	var numShares = outcomeTradeInProgress.numShares;
	var totalCost = outcomeTradeInProgress.totalCost;
	var tradeTransaction = (0, _addTradeTransaction.makeTradeTransaction)(numShares < 0, market, outcome, numShares, totalCost, 0.9, -0.3, dispatch);

	tradeTransaction.gas = (0, _formatNumber.formatEther)(tradeTransaction.gas);
	tradeTransaction.ether = (0, _formatNumber.formatEther)(tradeTransaction.ether);
	tradeTransaction.shares = (0, _formatNumber.formatShares)(tradeTransaction.shares);

	orders.push(tradeTransaction);

	return orders;
};
// import store from '../../../store';
// import {
// 	selectOutcomeBids,
// 	selectOutcomeAsks
// } from '../../bids-asks/selectors/select-bids-asks';


var selectTradeOrders = exports.selectTradeOrders = function selectTradeOrders(market, marketTradeInProgress, dispatch) {
	var orders = [];

	if (!market || !marketTradeInProgress || !market.outcomes.length) {
		return orders;
	}

	market.outcomes.forEach(function (outcome) {
		orders.concat(selectOutcomeTradeOrders(market, outcome, marketTradeInProgress[outcome.id], dispatch));
	});

	return orders;

	/* for limit-based system
 	market.outcomes.forEach(outcome => {
 		if (!tradeInProgress[outcome.id] || !tradeInProgress[outcome.id].numShares) {
 			return;
 		}
 
 		orders = orders.concat(selectOutcomeTransactions(
 			market,
 			outcome,
 			tradeInProgress[outcome.id].numShares,
 			tradeInProgress[outcome.id].limitPrice,
 			selectOutcomeBids(marketID, outcome.id, bidsAsks),
 			selectOutcomeAsks(marketID, outcome.id, bidsAsks),
 			dispatch
 		));
 	});
 */
};
/*
export const selectOutcomeTransactions = memoizerific(5)(
function(market, outcome, numShares, limitPrice, outcomeBids, outcomeAsks, dispatch) {
	var isSell = numShares < 0,
		outcomeBidsOrAsks = !isSell ? outcomeAsks : outcomeBids,
		o = {
			shares: 0,
			ether: 0,
			ordersToTrade: [],
			feeToPay: 0,
			sharesRemaining: Math.abs(numShares) || 0
		},
		sharesToTrade = 0,
		orders = [];

	if (!outcomeBidsOrAsks || !outcomeBidsOrAsks.some) {
		return orders;
	}

	outcomeBidsOrAsks.some(outcomeBidOrAsk => {
		if (o.sharesRemaining <= 0) {
			return true;
		}

		sharesToTrade = outcomeBidOrAsk.numShares - Math.max(
			0,
			outcomeBidOrAsk.numShares - o.sharesRemaining);

		if (!isSell) {
			if (!limitPrice || outcomeBidOrAsk.price <= limitPrice) {
				o.shares += sharesToTrade;
				o.feeToPay -= sharesToTrade * outcomeBidOrAsk.price * market.tradingFee;
				o.ether -= sharesToTrade * outcomeBidOrAsk.price;
				o.ordersToTrade.push({ bidAsk: outcomeBidOrAsk, numShares: sharesToTrade });
				o.sharesRemaining -= sharesToTrade;
			}
		}
		else {
			if (!limitPrice || outcomeBidOrAsk.price >= limitPrice) {
				o.shares -= sharesToTrade;
				o.feeToPay -= sharesToTrade * outcomeBidOrAsk.price * market.tradingFee;
				o.ether += sharesToTrade * outcomeBidOrAsk.price;
				o.ordersToTrade.push({ bidAsk: outcomeBidOrAsk, numShares: sharesToTrade });
				o.sharesRemaining -= sharesToTrade;
			}
		}
	});

	if (o.ordersToTrade.length) {
		orders.push(selectNewTransaction(
			!isSell ? BUY_SHARES : SELL_SHARES,
			o.ordersToTrade.length * -0.1,
			o.shares,
			o.ether + o.feeToPay,
			0,
			{
				marketID: market.id,
				outcomeID: outcome.id,
				marketDescription: market.description,
				outcomeName: outcome.name.toUpperCase(),
				avgPrice: formatEther(Math.abs(o.ether / o.shares)),
				feeToPay: formatEther(o.feeToPay)
			},
			(transactionID) => dispatch(tradeShares(
				transactionID, market.id,
				outcome.id, o.shares,
				limitPrice, null))
		));
	}

	if (o.sharesRemaining && limitPrice) {
		o.ether = !isSell ? 0 - (o.sharesRemaining * limitPrice) : o.sharesRemaining * limitPrice;
		o.shares = !isSell ? o.sharesRemaining : 0 - o.sharesRemaining;
		orders.push(selectNewTransaction(
			!isSell ? BID_SHARES : ASK_SHARES,
			-0.1,
			o.shares,
			o.ether,
			0,
			{
				marketID: market.id,
				outcomeID: outcome.id,
				marketDescription: market.description,
				outcomeName: outcome.name.toUpperCase(),
				avgPrice: formatEther(limitPrice),
				feeToPay: formatNumber(0, { zeroStyled: false }) // no fee for market-making
			},
			(transactionID) => dispatch(tradeShares(
				transactionID, market.id, outcome.id,
				o.sharesRemaining, limitPrice, null))
		));
	}

	return orders;
});
*/

},{"../../../utils/format-number":160,"../../transactions/actions/add-trade-transaction":141}],137:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectTradeSummary = undefined;

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _formatNumber = require('../../../utils/format-number');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectTradeSummary = exports.selectTradeSummary = (0, _memoizerific2.default)(5)(function (tradeOrders) {
	var totals = { shares: 0, ether: 0, gas: 0 };
	var len = tradeOrders && tradeOrders.length || 0;
	var shares = void 0;
	var ether = void 0;
	var gas = void 0;
	var tradeOrder = void 0;
	var i = void 0;

	for (i = 0; i < len; i++) {
		tradeOrder = tradeOrders[i];
		shares = tradeOrder.shares && tradeOrder.shares.value || 0;
		ether = tradeOrder.ether && tradeOrder.ether.value || 0;
		gas = tradeOrder.gas && tradeOrder.gas.value || 0;

		totals.shares += shares;
		totals.ether += shares >= 0 ? ether * -1 : ether;
		totals.gas += gas;
	}

	return {
		totalShares: (0, _formatNumber.formatShares)(totals.shares),
		totalEther: (0, _formatNumber.formatEther)(totals.ether),
		totalGas: (0, _formatNumber.formatEther)(totals.gas),
		tradeOrders: tradeOrders
	};
});

},{"../../../utils/format-number":160,"memoizerific":11}],138:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.addCreateMarketTransaction = exports.makeCreateMarketTransaction = undefined;

var _types = require('../../transactions/constants/types');

var _submitNewMarket = require('../../create-market/actions/submit-new-market');

var _addTransactions = require('../../transactions/actions/add-transactions');

var makeCreateMarketTransaction = exports.makeCreateMarketTransaction = function makeCreateMarketTransaction(marketData, gas, etherWithoutGas, dispatch) {
	var obj = {
		type: _types.CREATE_MARKET,
		gas: gas,
		ether: etherWithoutGas,
		data: marketData,
		action: function action(transactionID) {
			return dispatch((0, _submitNewMarket.createMarket)(transactionID, marketData));
		}
	};

	return obj;
};

var addCreateMarketTransaction = exports.addCreateMarketTransaction = function addCreateMarketTransaction(marketData, gas, etherWithoutGas) {
	return function (dispatch, getState) {
		return dispatch((0, _addTransactions.addTransaction)(makeCreateMarketTransaction(marketData, gas, etherWithoutGas, dispatch)));
	};
};

},{"../../create-market/actions/submit-new-market":56,"../../transactions/actions/add-transactions":142,"../../transactions/constants/types":147}],139:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addGenerateOrderBookTransaction = exports.makeGenerateOrderBookTransaction = undefined;

var _types = require('../../transactions/constants/types');

var _generateOrderBook = require('../../create-market/actions/generate-order-book');

var _addTransactions = require('../../transactions/actions/add-transactions');

var makeGenerateOrderBookTransaction = exports.makeGenerateOrderBookTransaction = function makeGenerateOrderBookTransaction(marketData, dispatch) {
    var obj = {
        type: _types.GENERATE_ORDER_BOOK,
        data: marketData,
        action: function action(transactionID) {
            return dispatch((0, _generateOrderBook.createOrderBook)(transactionID, marketData));
        }
    };

    return obj;
};

var addGenerateOrderBookTransaction = exports.addGenerateOrderBookTransaction = function addGenerateOrderBookTransaction(marketData) {
    return function (dispatch) {
        dispatch((0, _addTransactions.addTransaction)(makeGenerateOrderBookTransaction(marketData, dispatch)));
    };
};

},{"../../create-market/actions/generate-order-book":55,"../../transactions/actions/add-transactions":142,"../../transactions/constants/types":147}],140:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.addReportTransaction = exports.makeReportTransaction = undefined;

var _types = require('../../transactions/constants/types');

var _submitReport = require('../../reports/actions/submit-report');

var _addTransactions = require('../../transactions/actions/add-transactions');

var makeReportTransaction = exports.makeReportTransaction = function makeReportTransaction(market, reportedOutcomeID, isUnethical, gas, etherWithoutGas, dispatch) {
	var obj = {
		type: _types.SUBMIT_REPORT,
		gas: gas,
		ether: etherWithoutGas,
		data: {
			market: market,
			outcome: market.reportableOutcomes.find(function (outcome) {
				return outcome.id === reportedOutcomeID;
			}) || {},
			reportedOutcomeID: reportedOutcomeID,
			isUnethical: isUnethical
		},
		action: function action(transactionID) {
			return dispatch((0, _submitReport.processReport)(transactionID, market, reportedOutcomeID, isUnethical));
		}
	};
	return obj;
};

var addReportTransaction = exports.addReportTransaction = function addReportTransaction(market, reportedOutcomeID, isUnethical, gas, etherWithoutGas) {
	return function (dispatch, getState) {
		return dispatch((0, _addTransactions.addTransaction)(makeReportTransaction(market, reportedOutcomeID, isUnethical, gas, etherWithoutGas, dispatch)));
	};
};

},{"../../reports/actions/submit-report":130,"../../transactions/actions/add-transactions":142,"../../transactions/constants/types":147}],141:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.addTradeTransaction = exports.makeTradeTransaction = undefined;

var _formatNumber = require('../../../utils/format-number');

var _types = require('../../transactions/constants/types');

var _placeTrade = require('../../trade/actions/place-trade');

var _addTransactions = require('../../transactions/actions/add-transactions');

var makeTradeTransaction = exports.makeTradeTransaction = function makeTradeTransaction(isSell, market, outcome, numShares, totalCostWithoutFeeEther, feeEther, gas, dispatch) {
	var obj = {
		type: !isSell ? _types.BUY_SHARES : _types.SELL_SHARES,
		shares: numShares,
		ether: totalCostWithoutFeeEther + feeEther,
		gas: gas,
		data: {
			marketID: market.id,
			outcomeID: outcome.id,
			marketDescription: market.description,
			outcomeName: outcome.name,
			avgPrice: (0, _formatNumber.formatEther)(totalCostWithoutFeeEther / numShares),
			feeToPay: (0, _formatNumber.formatEther)(feeEther)
		},
		action: function action(transactionID) {
			return dispatch((0, _placeTrade.tradeShares)(transactionID, market.id, outcome.id, numShares, null, null));
		}
	};
	return obj;
};

var addTradeTransaction = exports.addTradeTransaction = function addTradeTransaction(isSell, market, outcome, numShares, totalCostWithoutFeeEther, feeEther, gas) {
	return function (dispatch, getState) {
		return dispatch((0, _addTransactions.addTransaction)(makeTradeTransaction(isSell, market, outcome, numShares, totalCostWithoutFeeEther, feeEther, gas, dispatch)));
	};
};

},{"../../../utils/format-number":160,"../../trade/actions/place-trade":133,"../../transactions/actions/add-transactions":142,"../../transactions/constants/types":147}],142:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.makeTransactionID = makeTransactionID;
exports.addTransactions = addTransactions;
exports.addTransaction = addTransaction;

var _statuses = require('../../transactions/constants/statuses');

var _updateTransactionsData = require('../../transactions/actions/update-transactions-data');

function makeTransactionID() {
	return Math.round(Date.now() + window.performance.now() * 100);
}

function addTransactions(transactionsArray) {
	return function (dispatch, getState) {
		dispatch((0, _updateTransactionsData.updateTransactionsData)(transactionsArray.reduce(function (p, transaction) {
			transaction.status = _statuses.PENDING;
			p[makeTransactionID()] = transaction;
			return p;
		}, {})));
	};
}

function addTransaction(transaction) {
	return addTransactions([transaction]);
}

},{"../../transactions/actions/update-transactions-data":145,"../../transactions/constants/statuses":146}],143:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.processTransactions = processTransactions;

var _statuses = require('../../transactions/constants/statuses');

function processTransactions() {
	return function (dispatch, getState) {
		var _require = require('../../../selectors');

		var transactions = _require.transactions;

		transactions.forEach(function (transaction) {
			return transaction.status === _statuses.PENDING && transaction.action(transaction.id);
		});
	};
}

},{"../../../selectors":153,"../../transactions/constants/statuses":146}],144:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.updateExistingTransaction = updateExistingTransaction;

var _updateTransactionsData = require('../../transactions/actions/update-transactions-data');

var _updateAssets = require('../../auth/actions/update-assets');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function updateExistingTransaction(transactionID, newTransactionData) {
	return function (dispatch, getState) {
		var _getState = getState();

		var transactionsData = _getState.transactionsData;

		// if the transaction doesn't already exist, probably/perhaps because user
		// logged out while a transaction was running and it just completed now,
		// do not update, ignore it

		if (!transactionID || !newTransactionData || !transactionsData || !transactionsData[transactionID]) {
			return;
		}

		dispatch((0, _updateTransactionsData.updateTransactionsData)(_defineProperty({}, transactionID, newTransactionData)));
		dispatch((0, _updateAssets.updateAssets)());
	};
}

},{"../../auth/actions/update-assets":45,"../../transactions/actions/update-transactions-data":145}],145:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_TRANSACTIONS_DATA = undefined;
exports.updateTransactionsData = updateTransactionsData;

var _processTransactions = require('../../transactions/actions/process-transactions');

var UPDATE_TRANSACTIONS_DATA = exports.UPDATE_TRANSACTIONS_DATA = 'UPDATE_TRANSACTIONS_DATA';

function updateTransactionsData(transactionsData) {
	return function (dispatch, getState) {
		dispatch({ type: UPDATE_TRANSACTIONS_DATA, transactionsData: transactionsData });
		dispatch((0, _processTransactions.processTransactions)());
	};
}

},{"../../transactions/actions/process-transactions":143}],146:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var PENDING = exports.PENDING = 'pending';
var SUCCESS = exports.SUCCESS = 'success';
var FAILED = exports.FAILED = 'failed';
var INTERRUPTED = exports.INTERRUPTED = 'interrupted';

// Market Creation
var CREATING_MARKET = exports.CREATING_MARKET = 'creating market...';

// Order Book Generation
var GENERATING_ORDER_BOOK = exports.GENERATING_ORDER_BOOK = 'generating order book...';

var SIMULATED_ORDER_BOOK = exports.SIMULATED_ORDER_BOOK = 'order book simulated';

var COMPLETE_SET_BOUGHT = exports.COMPLETE_SET_BOUGHT = 'complete set bought';
var ORDER_BOOK_ORDER_COMPLETE = exports.ORDER_BOOK_ORDER_COMPLETE = 'order creation complete';
var ORDER_BOOK_OUTCOME_COMPLETE = exports.ORDER_BOOK_OUTCOME_COMPLETE = 'outcome creation complete';

},{}],147:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BUY_SHARES = exports.BUY_SHARES = 'buy_shares';
var SELL_SHARES = exports.SELL_SHARES = 'sell_shares';

var BID_SHARES = exports.BID_SHARES = 'bid_shares';
var ASK_SHARES = exports.ASK_SHARES = 'ask_shares';

var CREATE_MARKET = exports.CREATE_MARKET = 'create_market';
var SUBMIT_REPORT = exports.SUBMIT_REPORT = 'submit_report';
var GENERATE_ORDER_BOOK = exports.GENERATE_ORDER_BOOK = 'generate_order_book';

var REGISTER_ACCOUNT = exports.REGISTER_ACCOUNT = 'register_account';

},{}],148:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var transactionsData = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var action = arguments[1];

	switch (action.type) {
		case _updateTransactionsData.UPDATE_TRANSACTIONS_DATA:
			return Object.keys(action.transactionsData).reduce(function (p, transactionID) {
				p[transactionID] = _extends({}, transactionsData[transactionID], action.transactionsData[transactionID], {
					id: transactionID
				});
				return p;
			}, _extends({}, transactionsData));

		case _updateLoginAccount.CLEAR_LOGIN_ACCOUNT:
			return {};

		default:
			return transactionsData;
	}
};

var _updateTransactionsData = require('../../transactions/actions/update-transactions-data');

var _updateLoginAccount = require('../../auth/actions/update-login-account');

},{"../../auth/actions/update-login-account":46,"../../transactions/actions/update-transactions-data":145}],149:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectIsWorking = undefined;

exports.default = function () {
	var _store$getState = _store2.default.getState();

	var transactionsData = _store$getState.transactionsData;

	return selectIsWorking(transactionsData);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _statuses = require('../../transactions/constants/statuses');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectIsWorking = exports.selectIsWorking = (0, _memoizerific2.default)(1)(function (transactionsData) {
	return Object.keys(transactionsData || {}).some(function (id) {
		return [_statuses.PENDING, _statuses.SUCCESS, _statuses.FAILED, _statuses.INTERRUPTED].indexOf(transactionsData[id].status) < 0;
	});
});

},{"../../../store":155,"../../transactions/constants/statuses":146,"memoizerific":11}],150:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectTransactionsTotals = undefined;

exports.default = function () {
	var _require = require('../../../selectors');

	var transactions = _require.transactions;

	return selectTransactionsTotals(transactions);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _statuses = require('../../transactions/constants/statuses');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectTransactionsTotals = exports.selectTransactionsTotals = (0, _memoizerific2.default)(1)(function (transactions) {
	var o = {
		numWorking: 0,
		numPending: 0,
		numComplete: 0,
		numWorkingAndPending: 0,
		numTotal: 0,
		title: ''
	};

	o.transactions = transactions.forEach(function (transaction) {
		o.numTotal++;
		if (transaction.status === _statuses.PENDING) {
			o.numPending++;
		} else if ([_statuses.SUCCESS, _statuses.FAILED, _statuses.INTERRUPTED].indexOf(transaction.status) >= 0) {
			o.numComplete++;
		} else {
			o.numWorking++;
		}
	});

	o.numWorkingAndPending = o.numPending + o.numWorking;

	if (o.numWorkingAndPending) {
		o.title = o.numWorkingAndPending + ' Transaction' + (o.numWorkingAndPending !== 1 ? 's' : '') + ' Working';
		o.shortTitle = o.numPending + ' Working';
	} else {
		o.title = o.numTotal + ' Transaction' + (o.numTotal !== 1 ? 's' : '');
		o.shortTitle = o.numTotal + ' Total';
	}

	return o;
});

},{"../../../selectors":153,"../../transactions/constants/statuses":146,"memoizerific":11}],151:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.selectTransactions = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';


exports.default = function () {
	var _store$getState = _store2.default.getState();

	var transactionsData = _store$getState.transactionsData;

	return selectTransactions(transactionsData);
};

var _memoizerific = require('memoizerific');

var _memoizerific2 = _interopRequireDefault(_memoizerific);

var _formatNumber = require('../../../utils/format-number');

var _store = require('../../../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectTransactions = exports.selectTransactions = (0, _memoizerific2.default)(1)(function (transactionsData) {
	return Object.keys(transactionsData || {}).sort(function (a, b) {
		return parseFloat(b) - parseFloat(a);
	}).map(function (id) {
		var obj = _extends({}, transactionsData[id], {
			gas: transactionsData[id].gas && (0, _formatNumber.formatEther)(transactionsData[id].gas),
			ether: transactionsData[id].etherWithoutGas && (0, _formatNumber.formatEther)(transactionsData[id].etherWithoutGas),
			shares: transactionsData[id].sharesChange && (0, _formatNumber.formatShares)(transactionsData[id].sharesChange),
			rep: transactionsData[id].repChange && (0, _formatNumber.formatRep)(transactionsData[id].repChange)
		});
		return obj;
	});
});

},{"../../../store":155,"../../../utils/format-number":160,"memoizerific":11}],152:[function(require,module,exports){
'use strict';

var _blockchain = require('./modules/app/reducers/blockchain');

var _blockchain2 = _interopRequireDefault(_blockchain);

var _branch = require('./modules/app/reducers/branch');

var _branch2 = _interopRequireDefault(_branch);

var _connection = require('./modules/app/reducers/connection');

var _connection2 = _interopRequireDefault(_connection);

var _auth = require('./modules/auth/reducers/auth');

var _auth2 = _interopRequireDefault(_auth);

var _loginAccount = require('./modules/auth/reducers/login-account');

var _loginAccount2 = _interopRequireDefault(_loginAccount);

var _activePage = require('./modules/app/reducers/active-page');

var _activePage2 = _interopRequireDefault(_activePage);

var _marketsData = require('./modules/markets/reducers/markets-data');

var _marketsData2 = _interopRequireDefault(_marketsData);

var _favorites = require('./modules/markets/reducers/favorites');

var _favorites2 = _interopRequireDefault(_favorites);

var _pagination = require('./modules/markets/reducers/pagination');

var _pagination2 = _interopRequireDefault(_pagination);

var _reports = require('./modules/reports/reducers/reports');

var _reports2 = _interopRequireDefault(_reports);

var _outcomes = require('./modules/markets/reducers/outcomes');

var _outcomes2 = _interopRequireDefault(_outcomes);

var _bidsAsks = require('./modules/bids-asks/reducers/bids-asks');

var _bidsAsks2 = _interopRequireDefault(_bidsAsks);

var _accountTrades = require('./modules/positions/reducers/account-trades');

var _accountTrades2 = _interopRequireDefault(_accountTrades);

var _transactionsData = require('./modules/transactions/reducers/transactions-data');

var _transactionsData2 = _interopRequireDefault(_transactionsData);

var _selectedMarketsHeader = require('./modules/markets/reducers/selected-markets-header');

var _selectedMarketsHeader2 = _interopRequireDefault(_selectedMarketsHeader);

var _selectedMarketId = require('./modules/markets/reducers/selected-market-id');

var _selectedMarketId2 = _interopRequireDefault(_selectedMarketId);

var _tradesInProgress = require('./modules/trade/reducers/trades-in-progress');

var _tradesInProgress2 = _interopRequireDefault(_tradesInProgress);

var _createMarketInProgress = require('./modules/create-market/reducers/create-market-in-progress');

var _createMarketInProgress2 = _interopRequireDefault(_createMarketInProgress);

var _keywords = require('./modules/markets/reducers/keywords');

var _keywords2 = _interopRequireDefault(_keywords);

var _selectedFilters = require('./modules/markets/reducers/selected-filters');

var _selectedFilters2 = _interopRequireDefault(_selectedFilters);

var _selectedTags = require('./modules/markets/reducers/selected-tags');

var _selectedTags2 = _interopRequireDefault(_selectedTags);

var _selectedSort = require('./modules/markets/reducers/selected-sort');

var _selectedSort2 = _interopRequireDefault(_selectedSort);

var _priceHistory = require('./modules/markets/reducers/price-history');

var _priceHistory2 = _interopRequireDefault(_priceHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
	blockchain: _blockchain2.default,
	branch: _branch2.default,
	connection: _connection2.default,

	auth: _auth2.default,
	loginAccount: _loginAccount2.default,
	activePage: _activePage2.default,

	marketsData: _marketsData2.default,
	favorites: _favorites2.default,
	pagination: _pagination2.default,

	reports: _reports2.default,

	selectedMarketID: _selectedMarketId2.default,
	selectedMarketsHeader: _selectedMarketsHeader2.default,
	keywords: _keywords2.default,
	selectedFilters: _selectedFilters2.default,
	selectedTags: _selectedTags2.default,
	selectedSort: _selectedSort2.default,
	priceHistory: _priceHistory2.default,

	tradesInProgress: _tradesInProgress2.default,
	createMarketInProgress: _createMarketInProgress2.default,

	outcomes: _outcomes2.default,
	bidsAsks: _bidsAsks2.default,
	accountTrades: _accountTrades2.default,
	transactionsData: _transactionsData2.default
};

},{"./modules/app/reducers/active-page":35,"./modules/app/reducers/blockchain":36,"./modules/app/reducers/branch":37,"./modules/app/reducers/connection":38,"./modules/auth/reducers/auth":49,"./modules/auth/reducers/login-account":50,"./modules/bids-asks/reducers/bids-asks":54,"./modules/create-market/reducers/create-market-in-progress":59,"./modules/markets/reducers/favorites":97,"./modules/markets/reducers/keywords":98,"./modules/markets/reducers/markets-data":99,"./modules/markets/reducers/outcomes":100,"./modules/markets/reducers/pagination":101,"./modules/markets/reducers/price-history":102,"./modules/markets/reducers/selected-filters":103,"./modules/markets/reducers/selected-market-id":104,"./modules/markets/reducers/selected-markets-header":105,"./modules/markets/reducers/selected-sort":106,"./modules/markets/reducers/selected-tags":107,"./modules/positions/reducers/account-trades":121,"./modules/reports/reducers/reports":132,"./modules/trade/reducers/trades-in-progress":135,"./modules/transactions/reducers/transactions-data":148}],153:[function(require,module,exports){
'use strict';

var _activePage = require('./modules/app/selectors/active-page');

var _activePage2 = _interopRequireDefault(_activePage);

var _loginAccount = require('./modules/auth/selectors/login-account');

var _loginAccount2 = _interopRequireDefault(_loginAccount);

var _links = require('./modules/link/selectors/links');

var _links2 = _interopRequireDefault(_links);

var _authForm = require('./modules/auth/selectors/auth-form');

var _authForm2 = _interopRequireDefault(_authForm);

var _marketsHeader = require('./modules/markets/selectors/markets-header');

var _marketsHeader2 = _interopRequireDefault(_marketsHeader);

var _markets = require('./modules/markets/selectors/markets');

var _markets2 = _interopRequireDefault(_markets);

var _marketsAll = require('./modules/markets/selectors/markets-all');

var _marketsAll2 = _interopRequireDefault(_marketsAll);

var _marketsFavorite = require('./modules/markets/selectors/markets-favorite');

var _marketsFavorite2 = _interopRequireDefault(_marketsFavorite);

var _marketsFiltered = require('./modules/markets/selectors/markets-filtered');

var _marketsFiltered2 = _interopRequireDefault(_marketsFiltered);

var _marketsUnpaginated = require('./modules/markets/selectors/markets-unpaginated');

var _marketsUnpaginated2 = _interopRequireDefault(_marketsUnpaginated);

var _marketsTotals = require('./modules/markets/selectors/markets-totals');

var _marketsTotals2 = _interopRequireDefault(_marketsTotals);

var _pagination = require('./modules/markets/selectors/pagination');

var _pagination2 = _interopRequireDefault(_pagination);

var _market = require('./modules/market/selectors/market');

var _market2 = _interopRequireDefault(_market);

var _filters = require('./modules/markets/selectors/filters');

var _filters2 = _interopRequireDefault(_filters);

var _searchSort = require('./modules/markets/selectors/search-sort');

var _searchSort2 = _interopRequireDefault(_searchSort);

var _keywords = require('./modules/markets/selectors/keywords');

var _keywords2 = _interopRequireDefault(_keywords);

var _transactions = require('./modules/transactions/selectors/transactions');

var _transactions2 = _interopRequireDefault(_transactions);

var _transactionsTotals = require('./modules/transactions/selectors/transactions-totals');

var _transactionsTotals2 = _interopRequireDefault(_transactionsTotals);

var _isTransactionsWorking = require('./modules/transactions/selectors/is-transactions-working');

var _isTransactionsWorking2 = _interopRequireDefault(_isTransactionsWorking);

var _createMarketForm = require('./modules/create-market/selectors/create-market-form');

var _createMarketForm2 = _interopRequireDefault(_createMarketForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectors = {
	activePage: _activePage2.default,
	loginAccount: _loginAccount2.default,
	links: _links2.default,

	authForm: _authForm2.default,
	createMarketForm: _createMarketForm2.default,

	marketsHeader: _marketsHeader2.default,
	markets: _markets2.default,
	allMarkets: _marketsAll2.default,
	favoriteMarkets: _marketsFavorite2.default,
	filteredMarkets: _marketsFiltered2.default,
	unpaginatedMarkets: _marketsUnpaginated2.default,
	marketsTotals: _marketsTotals2.default,
	pagination: _pagination2.default,

	market: _market2.default,

	filters: _filters2.default,
	searchSort: _searchSort2.default,
	keywords: _keywords2.default,

	transactions: _transactions2.default,
	transactionsTotals: _transactionsTotals2.default,
	isTransactionsWorking: _isTransactionsWorking2.default
};

module.exports = {};

Object.keys(selectors).forEach(function (selectorKey) {
	return Object.defineProperty(module.exports, selectorKey, { get: selectors[selectorKey], enumerable: true });
});

},{"./modules/app/selectors/active-page":39,"./modules/auth/selectors/auth-form":51,"./modules/auth/selectors/login-account":52,"./modules/create-market/selectors/create-market-form":60,"./modules/link/selectors/links":68,"./modules/market/selectors/market":73,"./modules/markets/selectors/filters":108,"./modules/markets/selectors/keywords":109,"./modules/markets/selectors/markets":116,"./modules/markets/selectors/markets-all":110,"./modules/markets/selectors/markets-favorite":111,"./modules/markets/selectors/markets-filtered":112,"./modules/markets/selectors/markets-header":113,"./modules/markets/selectors/markets-totals":114,"./modules/markets/selectors/markets-unpaginated":115,"./modules/markets/selectors/pagination":117,"./modules/markets/selectors/search-sort":118,"./modules/transactions/selectors/is-transactions-working":149,"./modules/transactions/selectors/transactions":151,"./modules/transactions/selectors/transactions-totals":150}],154:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _augur = (typeof window !== "undefined" ? window['augur'] : typeof global !== "undefined" ? global['augur'] : null);

var _augur2 = _interopRequireDefault(_augur);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _statuses = require('../modules/transactions/constants/statuses');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TIMEOUT_MILLIS = 50;
var ex = {};

ex.connect = function connect(cb) {
	if ("http://127.0.0.1:8545") {
		_augur2.default.rpc.nodes.hosted = ["http://127.0.0.1:8545"];
	}
	var options = {
		http: "http://127.0.0.1:8545",
		ws: "ws://127.0.0.1:8546"
	};
	if ("true") {
		if ("{{ $BUILD_AZURE_WSURL }}" && "{{ $BUILD_AZURE_WSURL }}" !== 'null') {
			options.ws = "{{ $BUILD_AZURE_WSURL }}";
		}
		if ("{{ $BUILD_AZURE_LOCALNODE }}" && "{{ $BUILD_AZURE_LOCALNODE }}" !== 'null') {
			options.http = "{{ $BUILD_AZURE_LOCALNODE }}";
		}
		if ("true" && "{{ $BUILD_AZURE_CONTRACTS }}" !== 'null') {
			options.contracts = JSON.parse("{{ $BUILD_AZURE_CONTRACTS }}");
		}
	}
	_augur2.default.connect(options, function (connection) {
		if (!connection) return cb('could not connect to ethereum');
		console.log("connected:", connection);
		cb(null, connection);
	});
};

ex.loadCurrentBlock = function loadCurrentBlock(cb) {
	_augur2.default.rpc.blockNumber(function (blockNumber) {
		return cb(parseInt(blockNumber, 16));
	});
};

ex.loadBranches = function loadBranches(cb) {
	_augur2.default.getBranches(function (branches) {
		if (!branches || branches.error) {
			console.log('ERROR getBranches', branches);
			cb(branches);
		}
		cb(null, branches);
	});
};

ex.loadBranch = function loadBranch(branchID, cb) {
	var branch = {};

	function finish() {
		if (branch.periodLength && branch.description) {
			cb(null, branch);
		}
	}

	_augur2.default.getPeriodLength(branchID, function (periodLength) {
		if (!periodLength || periodLength.error) {
			console.info('ERROR getPeriodLength', periodLength);
			return cb(periodLength);
		}
		branch.periodLength = periodLength;
		finish();
	});

	_augur2.default.getDescription(branchID, function (description) {
		if (!description || description.error) {
			console.info('ERROR getDescription', description);
			return cb(description);
		}
		branch.description = description;
		finish();
	});
};

ex.loadLoginAccount = function loadLoginAccount(isHosted, cb) {
	// if available, use the client-side account
	if (_augur2.default.web.account.address && _augur2.default.web.account.privateKey) {
		console.log('using client-side account:', _augur2.default.web.account.address);
		return cb(null, _extends({}, _augur2.default.web.account, {
			id: _augur2.default.web.account.address
		}));
	}

	// hosted node: no unlocked account available
	if (isHosted) {
		// if the user has a persistent login, use it
		var account = _augur2.default.web.persist();
		if (account && account.privateKey) {
			console.log('using persistent login:', account);
			return cb(null, _extends({}, _augur2.default.web.account, {
				id: _augur2.default.web.account.address
			}));
		}
		return cb(null);
	}

	// local node: if it's unlocked, use the coinbase account
	// check to make sure the account is unlocked
	_augur2.default.rpc.unlocked(_augur2.default.from, function (unlocked) {
		// use from/coinbase if unlocked
		if (unlocked && !unlocked.error) {
			console.log('using unlocked account:', _augur2.default.from);
			return cb(null, {
				id: _augur2.default.from
			});
		}

		// otherwise, no account available
		console.log('account is locked: ', _augur2.default.from);
		return cb(null);
	});
};

ex.loadAssets = function loadAssets(branchID, accountID, cbEther, cbRep, cbRealEther) {
	_augur2.default.getCashBalance(accountID, function (result) {
		if (!result || result.error) {
			return cbEther(result);
		}
		return cbEther(null, _augur2.default.abi.bignum(result).toNumber());
	});

	_augur2.default.getRepBalance(branchID, accountID, function (result) {
		if (!result || result.error) {
			return cbRep(result);
		}
		return cbRep(null, _augur2.default.abi.bignum(result).toNumber());
	});

	_augur2.default.rpc.balance(accountID, function (wei) {
		if (!wei || wei.error) {
			return cbRealEther(wei);
		}
		return cbRealEther(null, _augur2.default.abi.bignum(wei).dividedBy(new _bignumber2.default(10).toPower(18)).toNumber());
	});
};

ex.loadMarkets = function loadMarkets(branchID, chunkSize, isDesc, chunkCB) {

	// load the total number of markets
	_augur2.default.getNumMarketsBranch(branchID, function (numMarketsRaw) {
		var numMarkets = parseInt(numMarketsRaw, 10);
		var firstStartIndex = isDesc ? Math.max(numMarkets - chunkSize + 1, 0) : 0;

		// load markets in batches
		getMarketsInfo(branchID, firstStartIndex, chunkSize, numMarkets, isDesc);
	});

	// load each batch of marketdata sequentially and recursively until complete
	function getMarketsInfo(branchID, startIndex, chunkSize, numMarkets, isDesc) {
		_augur2.default.getMarketsInfo({
			branch: branchID,
			offset: startIndex,
			numMarketsToLoad: chunkSize
		}, function (marketsData) {
			if (!marketsData || marketsData.error) {
				chunkCB(marketsData);
			} else {
				chunkCB(null, marketsData);
			}

			if (isDesc && startIndex > 0) {
				setTimeout(function () {
					return getMarketsInfo(branchID, Math.max(startIndex - chunkSize, 0), chunkSize, numMarkets, isDesc);
				}, TIMEOUT_MILLIS);
			} else if (!isDesc && startIndex < numMarkets) {
				setTimeout(function () {
					return getMarketsInfo(branchID, startIndex + chunkSize, chunkSize, numMarkets, isDesc);
				}, TIMEOUT_MILLIS);
			}
		});
	}
};

ex.batchGetMarketInfo = function batchGetMarketInfo(marketIDs, cb) {
	_augur2.default.batchGetMarketInfo(marketIDs, function (res) {
		if (res && res.error) {
			cb(res);
		}
		cb(null, res);
	});
};

ex.loadMarket = function loadMarket(marketID, cb) {
	_augur2.default.getMarketInfo(marketID, function (marketInfo) {
		if (marketInfo && marketInfo.error) {
			return cb(marketInfo);
		}
		cb(null, marketInfo);
	});
};

ex.listenToUpdates = function listenToUpdates(cbBlock, cbContracts, cbPrice, cbCreation) {
	_augur2.default.filters.listen({
		// listen for new blocks
		block: function block(blockHash) {
			return cbBlock(null, blockHash);
		},
		// listen for augur transactions
		contracts: function contracts(filtrate) {
			return cbContracts(null, filtrate);
		},
		// update market when a price change has been detected
		price: function price(result) {
			return cbPrice(null, result);
		},
		// listen for new markets
		creation: function creation(result) {
			return cbCreation(null, result);
		}
	}, function (filters) {
		return console.log('### listen to filters:', filters);
	});
};

ex.loadAccountTrades = function loadAccountTrades(accountID, cb) {
	_augur2.default.getAccountTrades(accountID, null, function (accountTrades) {
		if (!accountTrades) {
			return cb();
		}
		if (accountTrades.error) {
			return cb(accountTrades);
		}
		return cb(null, accountTrades);
	});
};

ex.listenToBidsAsks = function listenToBidsAsks() {};

ex.login = function login(handle, password, persist, cb) {
	_augur2.default.web.login(handle, password, { persist: persist }, function (account) {
		if (!account) {
			return cb({ code: 0, message: 'failed to login' });
		}
		if (account.error) {
			return cb({ code: account.error, message: account.message });
		}
		return cb(null, _extends({}, account, {
			id: account.address
		}));
	});
};

ex.logout = function logout() {
	_augur2.default.web.logout();
};

ex.register = function register(handle, password, persist, cb, cbExtras) {
	_augur2.default.web.register(handle, password, { persist: persist }, {
		onRegistered: function onRegistered(account) {
			if (!account) {
				return cb({ code: 0, message: 'failed to register' });
			}
			if (account.error) {
				return cb({ code: account.error, message: account.message });
			}
			return cb(null, _extends({}, account, {
				id: account.address
			}));
		},
		onSendEther: function onSendEther(res) {
			if (res.error) {
				return cb({ code: res.error, message: res.message });
			}
			cbExtras(res);
		},
		onSent: function onSent(res) {
			if (res.error) {
				return cb({ code: res.error, message: res.message });
			}
			cbExtras(res);
		},
		onSuccess: function onSuccess(res) {
			if (res.error) {
				return cb({ code: res.error, message: res.message });
			}
			cbExtras(res);
		},
		onFailed: function onFailed(err) {
			cb(err);
		}
	});
};

ex.loadMeanTradePrices = function loadMeanTradePrices(accountID, cb) {
	if (!accountID) {
		cb('AccountID required');
	}
	_augur2.default.getAccountMeanTradePrices(accountID, function (meanTradePrices) {
		if (meanTradePrices && meanTradePrices.error) {
			return cb(meanTradePrices);
		}
		cb(null, meanTradePrices);
	});
};

ex.tradeShares = function tradeShares(branchID, marketID, outcomeID, numShares, limit, cap, cb) {
	_augur2.default.trade({
		branch: branchID,
		market: _augur2.default.abi.hex(marketID),
		outcome: outcomeID,
		amount: numShares,
		limit: limit,
		stop: false,
		cap: null,
		expiration: 0,
		callbacks: {
			onMarketHash: function onMarketHash(marketHash) {
				return cb(null, { status: 'sending...', data: marketHash });
			},
			onCommitTradeSent: function onCommitTradeSent(res) {
				return cb(null, { status: 'committing...', data: res });
			},
			onCommitTradeSuccess: function onCommitTradeSuccess(res) {
				return cb(null, { status: 'broadcasting...', data: res });
			},
			onCommitTradeFailed: function onCommitTradeFailed(err) {
				return cb(err);
			},
			onTradeSent: function onTradeSent(res) {
				return cb(null, { status: 'confirming...', data: res });
			},
			onTradeSuccess: function onTradeSuccess(res) {
				return cb(null, { status: _statuses.SUCCESS, data: res });
			},
			onTradeFailed: function onTradeFailed(err) {
				return cb(err);
			},
			onOrderCreated: function onOrderCreated(res) {
				return console.log('onOrderCreated', res);
			}
		}
	});
};

ex.getSimulatedBuy = function getSimulatedBuy(marketID, outcomeID, numShares) {
	return _augur2.default.getSimulatedBuy(marketID, outcomeID, numShares);
};

ex.getSimulatedSell = function getSimulatedSell(marketID, outcomeID, numShares) {
	return _augur2.default.getSimulatedSell(marketID, outcomeID, numShares);
};

ex.loadPriceHistory = function loadPriceHistory(marketID, cb) {
	if (!marketID) {
		cb('ERROR: loadPriceHistory() marketID required');
	}
	_augur2.default.getMarketPriceHistory(marketID, function (priceHistory) {
		if (priceHistory && priceHistory.error) {
			return cb(priceHistory.error);
		}
		cb(null, priceHistory);
	});
};

ex.createMarket = function createMarket(branchId, newMarket, cb) {
	_augur2.default.createSingleEventMarket({
		description: newMarket.description,
		expDate: newMarket.endDate.value.getTime() / 1000,
		minValue: newMarket.minValue,
		maxValue: newMarket.maxValue,
		numOutcomes: newMarket.numOutcomes,
		resolution: newMarket.expirySource,
		tradingFee: newMarket.tradingFee,
		tags: newMarket.tags,
		makerFees: newMarket.makerFee,
		extraInfo: newMarket.extraInfo,
		onSent: function onSent(r) {
			return cb(null, { status: _statuses.CREATING_MARKET, txHash: r.txHash });
		},
		onSuccess: function onSuccess(r) {
			return cb(null, { status: _statuses.SUCCESS, marketID: r.marketID, tx: r });
		},
		onFailed: function onFailed(r) {
			return cb(r);
		},
		branchId: branchId
	});
};

ex.generateOrderBook = function generateOrderBook(marketData, cb) {
	_augur2.default.generateOrderBook({
		market: marketData.id,
		liquidity: marketData.initialLiquidity,
		initialFairPrices: marketData.initialFairPrices.raw,
		startingQuantity: marketData.startingQuantity,
		bestStartingQuantity: marketData.bestStartingQuantity,
		priceWidth: marketData.priceWidth,
		isSimulation: marketData.isSimulation
	}, {
		onSimulate: function onSimulate(r) {
			return cb(null, { status: _statuses.SIMULATED_ORDER_BOOK, payload: r });
		},
		onBuyCompleteSets: function onBuyCompleteSets(r) {
			return cb(null, { status: _statuses.COMPLETE_SET_BOUGHT, payload: r });
		},
		onSetupOutcome: function onSetupOutcome(r) {
			return cb(null, { status: _statuses.ORDER_BOOK_OUTCOME_COMPLETE, payload: r });
		},
		onSetupOrder: function onSetupOrder(r) {
			return cb(null, { status: _statuses.ORDER_BOOK_ORDER_COMPLETE, payload: r });
		},
		onSuccess: function onSuccess(r) {
			return cb(null, { status: _statuses.SUCCESS, payload: r });
		},
		onFailed: function onFailed(err) {
			return cb(err);
		}
	});
};

ex.createMarketMetadata = function createMarketMetadata(newMarket, cb) {
	console.log('--createMarketMetadata', newMarket.id, ' --- ', newMarket.detailsText, ' --- ', newMarket.tags, ' --- ', newMarket.resources, ' --- ', newMarket.expirySource);
	var tag1 = void 0;
	var tag2 = void 0;
	var tag3 = void 0;
	if (newMarket.tags && newMarket.tags.constructor === Array && newMarket.tags.length) {
		tag1 = newMarket.tags[0];
		if (newMarket.tags.length > 1) tag2 = newMarket.tags[1];
		if (newMarket.tags.length > 2) tag3 = newMarket.tags[2];
	}
	_augur2.default.setMetadata({
		market: newMarket.id,
		details: newMarket.detailsText,
		tag1: tag1,
		tag2: tag2,
		tag3: tag3,
		links: newMarket.resources,
		source: newMarket.expirySource
	}, function (res) {
		return cb(null, { status: 'processing metadata...', metadata: res });
	}, function (res) {
		return cb(null, { status: _statuses.SUCCESS, metadata: res });
	}, function (err) {
		return cb(err);
	});
};

ex.getReport = function getReport(branchID, reportPeriod, eventID) {
	_augur2.default.getReport(branchID, reportPeriod, eventID, function (report) {
		return console.log('*************report', report);
	});
};

ex.loadPendingReportEventIDs = function loadPendingReportEventIDs(eventIDs, accountID, reportPeriod, branchID, cb) {
	var pendingReportEventIDs = {};

	if (!eventIDs || !eventIDs.length) {
		return cb(null, {});
	}

	// load market-ids related to each event-id one at a time
	(function processEventID() {
		var eventID = eventIDs.pop();
		var randomNumber = _augur2.default.abi.hex(_augur2.default.abi.bignum(accountID).plus(_augur2.default.abi.bignum(eventID)));
		var diceroll = _augur2.default.rpc.sha3(randomNumber, true);

		function finish() {
			// if there are more event ids, re-run this function to get their market ids
			if (eventIDs.length) {
				setTimeout(processEventID, TIMEOUT_MILLIS);
			} else {
				// if no more event ids to process, exit this loop and callback
				cb(null, pendingReportEventIDs);
			}
		}

		if (!diceroll) {
			console.log('WARN: couldn\'t get sha3 for', randomNumber, diceroll);
			return finish();
		}

		_augur2.default.calculateReportingThreshold(branchID, eventID, reportPeriod, function (threshold) {
			if (!threshold) {
				console.log('WARN: couldn\'t get reporting threshold for', eventID);
				return finish();
			}
			if (threshold.error) {
				console.log('ERROR: calculateReportingThreshold', threshold);
				return finish();
			}
			if (_augur2.default.abi.bignum(diceroll).lt(_augur2.default.abi.bignum(threshold))) {
				_augur2.default.getReportHash(branchID, reportPeriod, accountID, eventID, function (reportHash) {
					if (reportHash && reportHash !== '0x0') {
						pendingReportEventIDs[eventID] = { reportHash: reportHash };
					} else {
						pendingReportEventIDs[eventID] = { reportHash: null };
					}
					finish();
				});
			} else {
				finish();
			}
		});
	})();
};

ex.submitReportHash = function submitReportHash(branchID, accountID, event, report, cb) {
	var minValue = _augur2.default.abi.bignum(event.minValue);
	var maxValue = _augur2.default.abi.bignum(event.maxValue);
	var numOutcomes = _augur2.default.abi.bignum(event.numOutcomes);
	var rescaledReportedOutcome = void 0;

	// Re-scale scalar/categorical reports so they fall between 0 and 1
	if (report.isIndeterminate) {
		rescaledReportedOutcome = report.reportedOutcomeID;
	} else {
		if (report.isScalar) {
			rescaledReportedOutcome = _augur2.default.abi.bignum(report.reportedOutcomeID).minus(minValue).dividedBy(maxValue.minus(minValue)).toFixed();
		} else if (report.isCategorical) {
			rescaledReportedOutcome = _augur2.default.abi.bignum(report.reportedOutcomeID).minus(_augur2.default.abi.bignum(1)).dividedBy(numOutcomes.minus(_augur2.default.abi.bignum(1))).toFixed();
		} else {
			rescaledReportedOutcome = report.reportedOutcomeID;
		}
	}

	var reportHash = _augur2.default.makeHash(report.salt, rescaledReportedOutcome, event.id, accountID, report.isIndeterminate, report.isScalar);

	_augur2.default.submitReportHash({
		branch: branchID,
		reportHash: reportHash,
		reportPeriod: report.reportPeriod,
		eventID: event.id,
		eventIndex: event.index,
		onSent: function onSent(res) {
			return cb(null, _extends({}, res, { reportHash: reportHash, status: 'processing...' }));
		},
		onSuccess: function onSuccess(res) {
			return cb(null, _extends({}, res, { reportHash: reportHash, status: _statuses.SUCCESS }));
		},
		onFailed: function onFailed(err) {
			return cb(err);
		}
	});
};

ex.penalizationCatchup = function penalizationCatchup(branchID, cb) {
	_augur2.default.penalizationCatchup({
		branch: branchID,
		onSent: function onSent(res) {
			console.log('penalizationCatchup sent:', res);
		},
		onSuccess: function onSuccess(res) {
			console.log('penalizationCatchup success:', res);
			cb(null, res);
		},
		onFailed: function onFailed(err) {
			console.error('penalizationCatchup failed:', err);
			if (err.error === '0') {
				// already caught up
			}
			cb(err);
		}
	});
};

ex.penalizeNotEnoughReports = function penalizeNotEnoughReports(branchID, cb) {
	var self = this;
	_augur2.default.penalizeNotEnoughReports({
		branch: branchID,
		onSent: function onSent(res) {
			console.log('penalizeNotEnoughReports sent:', res);
		},
		onSuccess: function onSuccess(res) {
			console.log('penalizeNotEnoughReports success:', res);
			cb(null, res);
		},
		onFailed: function onFailed(err) {
			console.error('penalizeNotEnoughReports failed:', err);
			if (err.error === '-1') {
				// already called
				return cb(err);
			} else if (err.error === '-2') {
				// need to catch up
				return self.penalizationCatchup(branchID, cb);
			}
			cb(err);
		}
	});
};

ex.penalizeWrong = function penalizeWrong(branchID, period, event, cb) {
	var self = this;
	_augur2.default.getMarkets(event, function (markets) {
		if (!markets || markets.error) return console.error('getMarkets:', markets);
		_augur2.default.getOutcome(event, function (outcome) {
			if (outcome !== '0' && !outcome.error) {
				console.log('Calling penalizeWrong for:', branchID, period, event);
				_augur2.default.penalizeWrong({
					branch: branchID,
					event: event,
					onSent: function onSent(res) {
						console.log('penalizeWrong sent for event ' + event, res);
					},
					onSuccess: function onSuccess(res) {
						console.log('penalizeWrong success for event ' + event, res);
						cb(null, res);
					},
					onFailed: function onFailed(err) {
						console.error('penalizeWrong failed for event ' + event, err);
						if (err.error === '-3') {
							_augur2.default.penalizeNotEnoughReports(branchID, function (error, res) {
								self.penalizeWrong(branchID, period, event, cb);
							});
						}
						cb(err);
					}
				});
			} else {
				self.closeMarket(branchID, markets[0], function (err, res) {
					if (err) return cb(err);
					self.penalizeWrong(branchID, period, event, cb);
				});
			}
		});
	});
};

ex.closeMarket = function closeMarket(branchID, marketID, cb) {
	_augur2.default.closeMarket({
		branch: branchID,
		market: marketID,
		onSent: function onSent(res) {
			// console.log('closeMarket sent:', res);
		},
		onSuccess: function onSuccess(res) {
			// console.log('closeMarket success:', res);
			cb(null, res);
		},
		onFailed: function onFailed(err) {
			// console.error('closeMarket error:', err);
			cb(err);
		}
	});
};

ex.collectFees = function collectFees(branchID, cb) {
	_augur2.default.collectFees({
		branch: branchID,
		onSent: function onSent(res) {},
		onSuccess: function onSuccess(res) {
			cb(null, res);
		},
		onFailed: function onFailed(err) {
			cb(err);
		}
	});
};

ex.incrementPeriodAfterReporting = function incrementPeriodAfterReporting(branchID, cb) {
	_augur2.default.incrementPeriodAfterReporting({
		branch: branchID,
		onSent: function onSent(result) {},
		onFailed: function onFailed(err) {
			return cb(err);
		},
		onSuccess: function onSuccess(result) {
			return cb(null, result);
		}
	});
};

ex.getReportPeriod = function getReportPeriod(branchID, cb) {
	_augur2.default.getReportPeriod(branchID, function (res) {
		if (res.error) {
			return cb(res);
		}
		return cb(null, res);
	});
};

ex.getOutcome = _augur2.default.getOutcome.bind(_augur2.default);
ex.getEventIndex = _augur2.default.getEventIndex.bind(_augur2.default);
ex.submitReport = _augur2.default.submitReport.bind(_augur2.default);
ex.getEvents = _augur2.default.getEvents.bind(_augur2.default);
ex.getReportedPeriod = _augur2.default.getReportedPeriod.bind(_augur2.default);
ex.rpc = _augur2.default.rpc;
module.exports = ex;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../modules/transactions/constants/statuses":146,"bignumber.js":2}],155:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var windowRef = typeof window === 'undefined' ? {} : window;
// console log middleware
var consoleLog = function consoleLog(store) {
	return function (next) {
		return function (action) {
			if (typeof action !== 'function') {
				console.log(action);
			}
			return next(action);
		};
	};
};

// local storage middleware
var localStorageMiddleware = function localStorageMiddleware(store) {
	return function (next) {
		return function (action) {
			next(action);
			var state = store.getState();

			if (!state || !state.loginAccount || !state.loginAccount.id) {
				return;
			}

			if (windowRef.localStorage && windowRef.localStorage.setItem) {
				windowRef.localStorage.setItem(state.loginAccount.id, JSON.stringify({
					favorites: state.favorites,
					transactionsData: state.transactionsData,
					accountTrades: state.accountTrades
				}));
			}
		};
	};
};
var middleWare = void 0;
if ("development" !== 'production') {
	middleWare = (0, _redux.applyMiddleware)(consoleLog, _reduxThunk2.default, localStorageMiddleware);
} else {
	middleWare = (0, _redux.applyMiddleware)(_reduxThunk2.default, localStorageMiddleware);
}
// middleware
exports.default = (0, _redux.createStore)((0, _redux.combineReducers)(_reducers2.default), middleWare);

},{"./reducers":152,"redux":18,"redux-thunk":12}],156:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.bytesToHex = bytesToHex;
function bytesToHex(byteArray) {
	return '0x' + byteArray.reduce(function (hexString, byte) {
		return hexString + byte.toString(16);
	}, '');
}

},{}],157:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.cleanKeywords = cleanKeywords;
exports.cleanKeywordsArray = cleanKeywordsArray;
function cleanKeywords(keywords) {
	return (keywords || '').replace(/\s+/g, ' ').trim();
}

function cleanKeywordsArray(keywords) {
	var CleanKeywords = cleanKeywords(keywords).toLowerCase();
	return CleanKeywords ? CleanKeywords.split(' ').sort() : [];
}

},{}],158:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blockToDate = blockToDate;
exports.dateToBlock = dateToBlock;

var _network = require('../modules/app/constants/network');

/**
 * @param {Number} block
 * @param {Number} currentBlock
 * @return {Date}
 */
function blockToDate(block, currentBlock) {
  var seconds = (block - currentBlock) * (_network.MILLIS_PER_BLOCK / 1000);
  var now = new Date();
  now.setSeconds(now.getSeconds() + seconds);
  return now;
}

/**
 * @param {Date} date
 * @param {Number} currentBlock
 * @return {Number}
 */
function dateToBlock(date, currentBlock) {
  var now = new Date();
  var secondsDelta = date.getSeconds() - now.getSeconds();
  var blockDelta = parseInt(secondsDelta / (_network.MILLIS_PER_BLOCK / 1000), 10);
  return currentBlock + blockDelta;
}

},{"../modules/app/constants/network":33}],159:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.formatDate = formatDate;
function formatDate(d) {
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var date = d instanceof Date ? d : new Date(0);
	return {
		value: date,
		formatted: months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(),
		full: d.toISOString()
	};
}

},{}],160:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.formatEther = formatEther;
exports.formatPercent = formatPercent;
exports.formatShares = formatShares;
exports.formatRep = formatRep;
exports.formatNone = formatNone;
exports.formatNumber = formatNumber;
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	Produces a formatted number object used for display and calculations
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

The main function is `formatNumber`, however there are top-level functions that wrap for common cases like `formatEther`, `formatShares`, etc.

A formatted number generally has three parts: the sign (+ or -), the stylized number, and a denomination (Eth, Rep, %, etc.)

The formatted number object that is returned looks something like this:
	{
		value: the parsed number in numerical form, 0 if a bad input was passed in, can be used in calculations

		formattedValue: the value in numerical form, possibly rounded, can be used in calculations
		formatted: the value in string form with possibly additional formatting, like comma separator, used for display

		o.roundedValue: the value in numerical form, with extra rounding, can be used in calculations
		o.rounded: the value in string form, with extra rounding and possibly additional formatting, like comma separator, used for display

		o.minimized: the value in string form, with trailing 0 decimals omitted, for example if the `formatted` value is 1.00, this minimized value would be 1
	}

The reason the number object has multiple states of rounding simultaneously,
is because the ui can use it for multiple purposes. For example, when showing ether,
we generally like to show it with 2 decimals, however when used in totals,
maximum precision is not necessary, and we can opt to show the `rounded` display, which is only 1 decimal.
Similar logic applies for `minimized`, sometimes we don't need to be consistent with the decimals
and just show the prettiest, smallest representation of the value.

The options object that is passed into `formatNumber` that enables all of this looks like:
	{
		decimals: the number of decimals for the precise case, can be 0-infinity
		decimalsRounded: the number of decimals for the prettier case, can be 0-infinity
		denomination: the string denomination of the number (ex. Eth, Rep, %), can be blank
		positiveSign: boolean whether to include a plus sign at the beginning of positive numbers
		zeroStyled: boolean, if true, when the value is 0, it formates it as a dash (-) instead
	}

TIP
Sometimes (not always) it is a good idea to use the formatted values in calculations,
rather than the original input number, so that values match up in the ui. For example, if you are
adding the numbers 1.11 and 1.44, but displaying them as 1.1 and 1.4, it may look awkward
if 1.1 + 1.4 = 2.6. If perfect precision isn't necessary, consider adding them using the formatted values.

*/

function formatEther(num, opts) {
	return formatNumber(num, _extends({
		decimals: 2,
		decimalsRounded: 1,
		denomination: 'Eth',
		positiveSign: true,
		zeroStyled: false
	}, opts));
}

function formatPercent(num, opts) {
	return formatNumber(num, _extends({
		decimals: 1,
		decimalsRounded: 0,
		denomination: '%',
		positiveSign: true,
		zeroStyled: false
	}, opts));
}

function formatShares(num, opts) {
	return formatNumber(num, _extends({
		decimals: 2,
		decimalsRounded: 0,
		denomination: 'Shares',
		minimized: true,
		zeroStyled: false
	}, opts));
}

function formatRep(num, opts) {
	return formatNumber(num, _extends({
		decimals: 0,
		decimalsRounded: 0,
		denomination: 'Rep',
		positiveSign: true,
		zeroStyled: false
	}, opts));
}

function formatNone() {
	return {
		value: 0,
		formattedValue: 0,
		formatted: '-',
		roundedValue: 0,
		rounded: '-',
		minimized: '-',
		denomination: '',
		full: '-'
	};
}

function formatNumber(num) {
	var opts = arguments.length <= 1 || arguments[1] === undefined ? { decimals: 0, decimalsRounded: 0, denomination: '', positiveSign: false, zeroStyled: true, minimized: false } : arguments[1];
	var minimized = opts.minimized;

	var o = {};
	var value = opts.value;
	var decimals = opts.decimals;
	var decimalsRounded = opts.decimalsRounded;
	var denomination = opts.denomination;
	var positiveSign = opts.positiveSign;
	var zeroStyled = opts.zeroStyled;


	decimals = decimals || 0;
	decimalsRounded = decimalsRounded || 0;
	denomination = denomination || '';
	positiveSign = !!positiveSign;
	zeroStyled = zeroStyled !== false;
	value = parseFloat(num) || 0;

	if (!value && zeroStyled) {
		return formatNone();
	}

	o.value = value;
	o.formattedValue = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
	o.formatted = o.formattedValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
	o.roundedValue = Math.round(value * Math.pow(10, decimalsRounded)) / Math.pow(10, decimalsRounded);
	o.rounded = o.roundedValue.toLocaleString(undefined, { minimumFractionDigits: decimalsRounded, maximumFractionDigits: decimalsRounded });
	o.minimized = o.formattedValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals });

	if (positiveSign) {
		if (o.formattedValue > 0) {
			o.formatted = '+' + o.formatted;
			o.minimized = '+' + o.minimized;
		}
		if (o.roundedValue > 0) {
			o.rounded = '+' + o.rounded;
		}
	}

	if (minimized) {
		o.formatted = o.minimized;
	}

	o.denomination = denomination;
	o.full = o.formatted + o.denomination;

	return o;
}

},{}],161:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isMarketDataOpen = isMarketDataOpen;
exports.isMarketDataPreviousReportPeriod = isMarketDataPreviousReportPeriod;
function isMarketDataOpen(marketData, currentBlockNumber) {
	return parseInt(marketData.endDate, 10) > currentBlockNumber;
}

function isMarketDataPreviousReportPeriod(marketData, currentPeriod, periodLength) {
	return parseInt(marketData.endDate, 10) <= (currentPeriod - 2) * periodLength;
}

},{}],162:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.listWordsUnderLength = listWordsUnderLength;
function listWordsUnderLength(str, maxLength) {
	var wordsList = [];
	var currentLength = 0;

	if (!str || !str.length) {
		return wordsList;
	}

	str.toString().split(' ').some(function (word) {
		var cleanWord = word.replace(/[^a-zA-Z0-9\-]/ig, '');

		if (!cleanWord || !cleanWord.length) {
			return false;
		}

		currentLength += cleanWord.length;

		if (currentLength <= maxLength) {
			wordsList.push(cleanWord);
			return false;
		}
		return true;
	});

	return wordsList;
}

},{}],163:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.makeLocation = makeLocation;
exports.parseURL = parseURL;
/**
 * @param {Array} pathArray
 * @param {Object} searchParams
 * @return {{pathArray: Array, searchParams: Object, url: String}}
 */
function makeLocation() {
	var pathArray = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	var searchParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	var search = searchParams && Object.keys(searchParams).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(searchParams[key]);
	}).join('&') || '';
	var pathname = pathArray.join('');
	var url = void 0;

	if (!pathname.length) {
		pathname = '/';
	}

	if (search.length) {
		url = pathname + '?' + search;
	} else {
		url = pathname;
	}

	return {
		pathArray: pathArray,
		searchParams: searchParams,
		url: url
	};
}

function parsePath(pathString) {
	if (!pathString || pathString === '/') {
		return ['/'];
	}
	return pathString.split('/').filter(function (pathItem) {
		return pathItem && pathItem.indexOf('.') <= -1;
	}).map(function (pathItem) {
		return '/' + pathItem;
	});
}

function parseSearch(searchString) {
	var pairSplit = void 0;
	return (searchString || '').replace(/^\?/, '').split('&').reduce(function (p, pair) {
		pairSplit = pair.split('=');
		if (pairSplit.length >= 1) {
			if (pairSplit[0].length) {
				if (pairSplit.length >= 2 && pairSplit[1]) {
					p[decodeURIComponent(pairSplit[0])] = decodeURIComponent(pairSplit[1]);
				} else {
					p[decodeURIComponent(pairSplit[0])] = '';
				}
			}
		}
		return p;
	}, {});
}

/**
 * @param {String} url
 * @return {{pathArray: Array, searchParams: Object, url: String}}
 */
function parseURL(url) {
	var splitURL = url.split('?');
	var parsed = {};

	if (splitURL.length >= 1) {
		parsed.pathArray = parsePath(splitURL[0]);
	}
	if (splitURL.length >= 2) {
		parsed.searchParams = parseSearch(splitURL[1]);
	}

	return makeLocation(parsed.pathArray, parsed.searchParams);
}

},{}]},{},[27])
//# sourceMappingURL=build.js.map
