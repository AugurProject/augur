export default function(num: number | string): string {
  let sides: Array<string> = [];

  sides = num.toString().split(".");
  sides[0] = sides[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return sides.join(".");
}
