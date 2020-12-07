import $ from 'jquery';

let range: JQuery<HTMLElement>;

const main = function() {
  const baseYear = Number(range.val());
  $("#baseYear").text(baseYear);
  const NOW = new Date();
  const OLDEST = new Date(NOW.getFullYear() - Number(range.val()), NOW.getMonth(), NOW.getDate(), NOW.getHours(), NOW.getMinutes(), NOW.getSeconds(), NOW.getMilliseconds());
  const BASE = NOW.getTime() - OLDEST.getTime();

  $(".g").each(function(index: number, element: HTMLElement) {
    const span = $(element).find("span.f");
    if (span.length > 0) {
      let date: Date|null = null;
      if (span[0].innerHTML.substring(0, 10).match(/\d{4}\/\d{2}\/\d{2}/))
      {
        date = new Date(span[0].innerHTML.substring(0, 10));
      } else if (span[0].innerHTML.substring(0, 4).match(/\d* 日前/))
      {
        const found = span[0].innerHTML.substring(0, 4).match(/(?<days>\d*) 日前/);
        const days = Number(found?.groups?.days || "0");
        date = new Date(NOW.getTime());
        date.setDate(NOW.getDate() - days);
      }

      if (date)
      {
        const elapsed = NOW.getTime() - date.getTime();
        const density = 1 - Math.max(Math.min(elapsed / BASE, 1), 0);
        element.style.opacity = (Math.max(density, 0.1)).toString();
        return;
      }
    }
    element.style.backgroundColor = `rgba(51, 221, 255, 0.2)`;
  });
}

$(function() {
  $("<span>基準年数：<span id='baseYear'>0</span>年</span>").appendTo("#result-stats");
  range = $("<input>").attr({
    type: "range",
    id: "elapsedBaseYear",
    min: "1",
    max: "10",
    value: "5"
  }).appendTo("#result-stats");
  range.on("input", main);

  main();
});