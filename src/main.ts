import $ from 'jquery';

const NOW = new Date();
const OLDEST = new Date(NOW.getFullYear() - 5, NOW.getMonth(), NOW.getDate(), NOW.getHours(), NOW.getMinutes(), NOW.getSeconds(), NOW.getMilliseconds());
const BASE = NOW.getTime() - OLDEST.getTime();
const ONEMINUSCOLOR = [255-205, 255-170, 255-85];

$(function() {
  // $("body").css("background-color", "#CCC6B8");
  $(".g").each(function(index: number, element: HTMLElement) {
    const span = $(element).find("span.f");
    console.log(index, span.length);
    if (span.length > 0) {
      const dataString = span[0].innerHTML.substring(0, 10);
      if (dataString.match(/\d{4}\/\d{2}\/\d{2}/))
      {
        const date = new Date(dataString);
        const elapsed = NOW.getTime() - date.getTime();
        const density = 1 - Math.max(Math.min(elapsed / BASE, 1), 0);
        // element.style.backgroundColor = `rgba(${205+ONEMINUSCOLOR[0]*density}, ${170+ONEMINUSCOLOR[1]*density}, ${85+ONEMINUSCOLOR[2]*density}, 0.5)`;
        element.style.opacity = (Math.max(density, 0.1)).toString();
        return;
      }
    }
    element.style.backgroundColor = `rgba(51, 221, 255, 0.2)`;
  });
});