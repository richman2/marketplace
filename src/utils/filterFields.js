export default function filterField(fields, requestFields) {
    let allowedFields = {};
    let listOfAllowedFeilds = [];
  
    if (Array.isArray(requestFields)) {
      for (let f of requestFields) {
        for (let i of fields) {
          if (i in f) {
            allowedFields[i] = f[i];
          }
        }
        listOfAllowedFeilds.push(allowedFields);
        allowedFields = {};
      }
      return listOfAllowedFeilds;
    }
    for (let f of fields) {
      if (f in requestFields) {
        allowedFields[f] = requestFields[f];
      }
    }
    return allowedFields;
  }