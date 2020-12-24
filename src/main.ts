import $ from 'jquery';

const init = function(mode: number) {
  $("body").css("background-image", `url(${chrome.runtime.getURL("image/noise.png")})`);
}

const update = function(element: HTMLElement, density: number, mode: number) {
  const __density = density > 0 ? Math.min(density+0.3, 1) : 0;
  $(element).css({
    "background-color": `rgba(255,255,255,${__density})`,
    "background-blend-mode": "lighten"
  });
}

const main = function(year: number, mode: number) {
  const baseYear = year;
  $("#baseYear").text(baseYear);
  const NOW = new Date();
  const OLDEST = new Date(NOW.getFullYear() - baseYear, NOW.getMonth(), NOW.getDate(), NOW.getHours(), NOW.getMinutes(), NOW.getSeconds(), NOW.getMilliseconds());
  const BASE = NOW.getTime() - OLDEST.getTime();

  $(".g").each(function(index: number, element: HTMLElement) {
    const span = $(element).find("span.f");
    let density = 0.0;
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

    update(element, density, mode);

    return;
  });
}

$(function() {
  $("<span>基準年数：<span id='baseYear'>0</span>年</span>").appendTo("#result-stats");
  chrome.storage.sync.get({"fsr-year": 5, "fsr-mode": 0}, function(res) {
    const range = $("<input>").attr({
      type: "range",
      id: "elapsedBaseYear",
      min: "1",
      max: "10",
      value: res["fsr-year"].toString()
    }).appendTo("#result-stats");
    range.on("input", () => {
      main(Number(range.val()), Number($("#result-stats").children('input[name="drawMode"]:checked').attr("value")));
      chrome.storage.sync.set({"fsr-year": Number(range.val())});
    });

    for (let i = 0; i < 3; i++) {
      const radio = $("<input>").attr({
        type: "radio",
        name: "drawMode",
        value: i,
        checked: res["fsr-mode"]==i
      }).appendTo("#result-stats");
      let mode: string = "";
      switch(i) {
        case 0: mode = "noise"; break;
        case 1: mode = "grayscale"; break;
        case 2: mode = "oldness"; break;
      }
      $(`<span>${mode}</span>`).appendTo("#result-stats");
      radio.on("change", () => {
        main(Number(range.val()), Number(radio.val()));
        chrome.storage.sync.set({"fsr-mode": Number(radio.val())});
      });
    }

    init(res["fsr-mode"]);

    main(res["fsr-year"], res["fsr-mode"]);
  });
});