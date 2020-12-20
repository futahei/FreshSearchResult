import $ from 'jquery';

let range: JQuery<HTMLElement>;

const main = function() {
  const rangeVal = range.val();
  const baseYear = Number(rangeVal);
  $("#baseYear").text(baseYear);
  const NOW = new Date();
  const OLDEST = new Date(NOW.getFullYear() - Number(range.val()), NOW.getMonth(), NOW.getDate(), NOW.getHours(), NOW.getMinutes(), NOW.getSeconds(), NOW.getMilliseconds());
  const BASE = NOW.getTime() - OLDEST.getTime();

  $(".g").each(function(index: number, element: HTMLElement) {
    const span = $(element).find("span.f");
    let density = 0.5;
    if (span.length > 0) {
      let date: Date|null = null;
      if (span[0].innerHTML.substring(0, 10).match(/\d{4}\/\d{2}\/\d{2}/)) {
        date = new Date(span[0].innerHTML.substring(0, 10));
      } else if (span[0].innerHTML.substring(0, 4).match(/\d* 日前/)) {
        const found = span[0].innerHTML.substring(0, 4).match(/(?<days>\d*) 日前/);
        const days = Number(found?.groups?.days || "0");
        date = new Date(NOW.getTime());
        date.setDate(NOW.getDate() - days);
      }
      else if (span[0].innerHTML.substring(0, 5).match(/\d* 時間前/)) {
        const found = span[0].innerHTML.substring(0, 5).match(/(?<hours>\d*) 時間前/);
        const hours = Number(found?.groups?.hours || "0");
        date = new Date(NOW.getTime());
        date.setHours(NOW.getHours() - hours);
      }
      density = 1 - (date ? (Math.max(Math.min((NOW.getTime() - date.getTime()) / BASE, 1), 0)) : 0.5);
    }

    $(element).css({
      // "background-image": `url(${chrome.runtime.getURL("image/noise.png")})`,
      "background-color": `rgba(255,255,255,${density})`,
      "background-blend-mode": "lighten"
    });
    return;
  });

  chrome.storage.sync.set({"fsr-year": rangeVal});
}

$(function() {
  $("<span>基準年数：<span id='baseYear'>0</span>年</span>").appendTo("#result-stats");
  const v = chrome.storage.sync.get({"fsr-year": "5"}, function(res) {
    range = $("<input>").attr({
      type: "range",
      id: "elapsedBaseYear",
      min: "1",
      max: "10",
      value: res["fsr-year"]
    }).appendTo("#result-stats");
    range.on("input", main);

    $("body").css("background-image", `url(${chrome.runtime.getURL("image/noise.png")})`);

    main();
  });
});