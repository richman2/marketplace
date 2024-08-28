export default function handleError(err, req, res, next) {
  console.log(err);
  res.send(err);
}
