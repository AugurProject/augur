export default function (number) {
  let sides = []

  sides = number.toString().split('.')
  sides[0] = sides[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return sides.join('.')
}
