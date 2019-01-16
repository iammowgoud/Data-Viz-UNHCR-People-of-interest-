
import * as d3 from "d3";

export class Data {

  data = {};

  constructor() { }

  parseData(imported: Function) {
    d3.json("../data/agg_yearly.json").then((data: Array<any>) => {
      for (let index = 2000; index <= 2013; index++) {
        this.data[index] = data
          .filter(i => i.year === index);
      }
      console.log("DATA => imported", this.data);
      imported();
    });
  }

  getSorted(year: number, property: string) {
    return this.data[year]
      .sort((a, b) => {
        if (a[property] > b[property])
          return -1;
        if (a[property] < b[property])
          return 1;
        return 0;
      })
      .slice(0, 10);
  }
}