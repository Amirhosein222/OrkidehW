export function handleMySelectedExps(allExps, myExps) {
  allExps.map(exp => {
    myExps.map(myExp => {
      return exp.id === myExp.id;
    });
  });
}
