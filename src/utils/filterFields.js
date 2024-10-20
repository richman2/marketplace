export default function filterField(fields, requestFields) {
  let allowedFields = {};
  let listOfAllowedFeilds = [];
  if (Array.isArray(requestFields)) {
    for (let f of requestFields) {
      console.log(f);
      for (let i of fields) {
        console.log(i);
        if (i in f) {
          allowedFields[i] = f[i];
        }
      }
      listOfAllowedFeilds.push(allowedFields);
      allowedFields = {};
    }
    console.log("this is ", listOfAllowedFeilds);
    return listOfAllowedFeilds;
  }
  for (let f of fields) {
    if (f in requestFields) {
      allowedFields[f] = requestFields[f];
    }
  }
  return allowedFields;
}
