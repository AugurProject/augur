export default function addCommasToNumber(num: number | string, removeComma: boolean = false): string {
    let sides: Array<string> = [];
  
    sides = num.toString().split(".");
    sides[0] = removeComma ? sides[0] : sides[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    return sides.join(".");
  }
  