export default function (err, result) {
  if (err != null) {
    console.error(err)
    if (result != null) console.log(result)
  }
}
