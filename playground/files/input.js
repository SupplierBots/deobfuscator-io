function hi() {
  console.log('Hello World!');
  function xd() {
    console.log('siema eniu');
    (() => {
      const trapper = 2137 + 3;
      console.log(trapper);
      console.log('siema byku');
    })();
  }
  xd();
}

console.log('A to jest pierwszy call w Polsce');
hi();

const trapper = {
  swag: 100,
  mordo: 'weź',
  policja: 990 + 7,
  ['jago dzianki']: 'no  no',
};
console.log(trapper);
