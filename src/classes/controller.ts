import { Chart } from "./chart";
import { Data } from "./data";
import d3 = require("d3");

export class Controller {
  data: Data;

  charts: Array<Chart> = [];
  currentYear = 2004;
  selectedMetric = "Refugees";

  constructor() {
    this.data = new Data();
    this.data.parseData(() => {
      this.init();
      this.attachListeners();
    });
  }

  init() {
    this.charts.push(new Chart(this.data, this.currentYear - 1, "Refugees"));
    this.charts.push(new Chart(this.data, this.currentYear, "Refugees"));
    this.charts.push(new Chart(this.data, this.currentYear + 1, "Refugees"));
  }

  attachListeners() {
    window.addEventListener("load", () => {
      document.querySelectorAll("button").forEach(e => {
        e.addEventListener("click", (e) => this.onClick(e));
      });
    });
  }

  onClick(e: Event) {
    let src: Element = e.srcElement;
    let action = src.getAttribute("data-action");
    let value = src.getAttribute("data-value");
    switch (action) {
      case "next":
        this.next();
        break;
      case "prev":
        this.prev();
        break;
      case "change-metric":
        this.changeMetric(value);
        break;
    }
  }

  next() {
    if (this.currentYear > 2003) {
      this.charts[0].changeYear(this.currentYear);
      this.charts[1].changeYear(this.currentYear + 1);
      this.charts[2].changeYear(this.currentYear + 2);
    }
  }

  prev() {
    if (this.currentYear < 2013) {
      this.charts[0].changeYear(this.currentYear - 2);
      this.charts[1].changeYear(this.currentYear - 1);
      this.charts[2].changeYear(this.currentYear);
    }
  }

  changeMetric(metric) {
    this.charts.forEach((c) => c.changeMetric(metric));
  }
}