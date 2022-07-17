// Code Provided by -Eman El-fahham-

export default function numberConverter(number) {
  const digit = number.toString().replace('.', ',');
  var id = '٠١٢٣٤٥٦٧٨٩';
  return digit.replace(/[0-9]/g, function (w) {
    return id[w];
  });
}
